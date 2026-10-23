import { Fragment, type ReactNode } from 'react';

const safeLink = (url: string) => /^(https?:|mailto:)/i.test(url.trim()) ? url.trim() : null;

function renderInline(source: string, keyPrefix = 'inline'): ReactNode[] {
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|~~[^~]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]]+\]\([^)]+\)|<https?:\/\/[^>\s]+>|https?:\/\/[^\s<]+)/g;
  const parts = source.split(pattern).filter(Boolean);

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith('`')) return <code key={key}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**') || part.startsWith('__')) return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('~~')) return <del key={key}>{part.slice(2, -2)}</del>;
    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = safeLink(link[2]);
      return href
        ? <a key={key} href={href} target="_blank" rel="noreferrer">{link[1]}</a>
        : <Fragment key={key}>{part}</Fragment>;
    }
    if (part.startsWith('<https://') || part.startsWith('<http://') || /^https?:\/\//i.test(part)) {
      const rawUrl = part.startsWith('<') ? part.slice(1, -1) : part;
      const punctuation = rawUrl.match(/[.,!?;:]+$/)?.[0] ?? '';
      const url = rawUrl.slice(0, rawUrl.length - punctuation.length);
      const href = safeLink(url);
      return href
        ? <Fragment key={key}><a href={href} target="_blank" rel="noopener noreferrer">{url}</a>{punctuation}</Fragment>
        : <Fragment key={key}>{part}</Fragment>;
    }
    return <Fragment key={key}>{part}</Fragment>;
  });
}

const splitCells = (line: string): string[] => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
const isTableDivider = (line: string) => {
  const cells = splitCells(line);
  return cells.length > 1 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
};
const isPipeRow = (line = '') => line.includes('|') && (line.trim().startsWith('|') || line.trim().endsWith('|'));
const isTableStart = (lines: string[], index: number) => Boolean(
  lines[index + 1] && (
    (lines[index]?.includes('|') && isTableDivider(lines[index + 1])) ||
    (isPipeRow(lines[index]) && isPipeRow(lines[index + 1]))
  ),
);

export default function MarkdownMessage({ content }: { content: string }) {
  const lines = content.replace(/<br\s*\/?\s*>/gi, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index += 1; continue; }

    const fence = line.match(/^\s*```\s*([\w+-]*)/);
    if (fence) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !/^\s*```/.test(lines[index])) code.push(lines[index++]);
      if (index < lines.length) index += 1;
      blocks.push(<pre className="my-3 overflow-x-auto border-2 border-black bg-[#10172f] p-[13px] text-[#fffdf5] shadow-[4px_4px_0_var(--shadow-color)]" key={`code-${index}`}><code className={`font-mono text-xs leading-relaxed ${fence[1] ? `language-${fence[1]}` : ''}`}>{code.join('\n')}</code></pre>);
      continue;
    }

    const heading = line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      const Tag = `h${heading[1].length}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      blocks.push(<Tag className="mb-2 mt-[18px] font-black leading-tight text-[#11131b] first:mt-0" key={`heading-${index}`}>{renderInline(heading[2], `heading-${index}`)}</Tag>);
      index += 1;
      continue;
    }

    if (/^\s*(---+|___+|\*\*\*+)\s*$/.test(line)) {
      blocks.push(<hr className="my-3.5 border-0 border-t-2 border-[#11131b]" key={`hr-${index}`} />);
      index += 1;
      continue;
    }

    if (/^\s*>/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^\s*>/.test(lines[index])) quote.push(lines[index++].replace(/^\s*>\s?/, ''));
      blocks.push(<blockquote className="my-3 border-l-[5px] border-[#168aad] bg-[#e5f4f6] px-3 py-2 text-[#303542]" key={`quote-${index}`}>{renderInline(quote.join(' '), `quote-${index}`)}</blockquote>);
      continue;
    }

    if (isTableStart(lines, index)) {
      const hasHeader = isTableDivider(lines[index + 1]);
      const headers = hasHeader ? splitCells(line) : null;
      index += hasHeader ? 2 : 0;
      const rows: string[][] = [];
      while (
        index < lines.length &&
        lines[index].trim() &&
        (hasHeader ? lines[index].includes('|') : isPipeRow(lines[index])) &&
        !isTableDivider(lines[index])
      ) rows.push(splitCells(lines[index++]));
      const columns = headers || rows[0] || [];
      blocks.push(
        <div className="my-3 max-w-full overflow-x-auto" key={`table-${index}`}>
          <table className="w-full border-collapse font-sans text-xs text-[#303542]"><thead>{headers && <tr>{headers.map((cell, cellIndex) => <th className="min-w-[90px] border border-[#11131b] bg-[var(--lime)] px-[9px] py-[7px] text-left font-black text-[#11131b]" key={cellIndex}>{renderInline(cell)}</th>)}</tr>}</thead>
            <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{columns.map((_, cellIndex) => <td className="min-w-[90px] border border-[#11131b] bg-[#fffdf5] px-[9px] py-[7px] text-left" key={cellIndex}>{renderInline(row[cellIndex] || '')}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      continue;
    }

    const listMatch = line.match(/^\s*(?:([-+*])|(\d+)\.)\s+(.+)$/);
    if (listMatch) {
      const ordered = Boolean(listMatch[2]);
      const Tag = ordered ? 'ol' : 'ul';
      const items: ReactNode[] = [];
      while (index < lines.length) {
        const match = lines[index].match(/^\s*(?:([-+*])|(\d+)\.)\s+(.+)$/);
        if (!match || Boolean(match[2]) !== ordered) break;
        const task = match[3].match(/^\[([ xX])\]\s+(.*)$/);
        items.push(<li className="my-1 pl-0.5 marker:text-[#168aad]" key={items.length}>{task && <input className="mr-[7px] size-3.5 accent-[#168aad] align-[-2px]" type="checkbox" checked={task[1].toLowerCase() === 'x'} readOnly aria-label="Task status" />}{renderInline(task ? task[2] : match[3], `list-${index}`)}</li>);
        index += 1;
      }
      blocks.push(<Tag className={`my-[9px] pl-[23px] text-[#303542] ${ordered ? 'list-decimal' : 'list-disc'}`} key={`list-${index}`}>{items}</Tag>);
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !isTableStart(lines, index) &&
      !/^\s*(?:```|#{1,6}\s|>|([-+*]|\d+\.)\s|---+\s*$)/.test(lines[index])
    ) paragraph.push(lines[index++].trim());
    blocks.push(<p className="my-2 leading-[1.7] text-[#303542]" key={`paragraph-${index}`}>{renderInline(paragraph.join(' '), `paragraph-${index}`)}</p>);
  }

  return <div className="min-w-0 [overflow-wrap:anywhere] border-2 border-black bg-[#fffdf5] px-4 py-3 font-mono text-[13px] leading-[1.7] text-[#11131b] shadow-[5px_5px_0_var(--shadow-color)] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_a]:text-[#087a9a] [&_a]:underline [&_a]:underline-offset-[3px] [&_a:hover]:text-[#07536a] [&_code:not(pre_code)]:border [&_code:not(pre_code)]:border-[#11131b] [&_code:not(pre_code)]:bg-[#e5f4f6] [&_code:not(pre_code)]:px-[5px] [&_code:not(pre_code)]:py-px [&_code:not(pre_code)]:text-[.9em] [&_code:not(pre_code)]:text-[#07536a] [&_h1]:text-[21px] [&_h2]:text-lg [&_h3]:text-[15px] [&_h4]:text-sm [&_h5]:text-[13px] [&_h6]:text-xs [&_strong]:font-black [&_strong]:text-[#11131b] [&_em]:text-[#303542]">{blocks}</div>;
}
