interface LoadingProps { type?: 'fixed' | 'modal' | 'inline'; title?: string }

const Loading = ({ type = 'fixed', title = 'Loading...' }: LoadingProps) => {
  const position = type === 'fixed' ? 'fixed inset-0 z-50 bg-[#10172f] text-[#f6f2e9]' : type === 'modal' ? 'absolute inset-0 bg-[#080a12]/90 text-[#f6f2e9]' : 'text-[var(--paper)]';
  return (
    <div className={`flex flex-col items-center justify-center p-[30px] ${position}`} role="status">
      <span className="size-[38px] animate-spin rounded-full border-4 border-[var(--line)] border-t-[var(--lime)]" />
      {title && <p className="mt-[15px] font-bold">{title}</p>}
    </div>
  );
};

export default Loading;
