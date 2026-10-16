import { useEffect, useState } from 'react';
import { AddTechnicalDomain,DeleteTechnicalDomain,GetTechnicalDomains,UpdateTechnicalDomain,delay, } from '../api/backendApi';
import Alert from './Alert';
import Button from './Button';
import Loading from './Loading';
import Modal from './Modal';
import { DOMAIN_ICON_OPTIONS, DomainIcon } from './DomainIcon';
import type { FormEvent } from 'react';
import type { AlertState, TechnicalDomain, TokenProps } from '../types';

interface DomainForm { title: string; tools: string; icon: string }
const emptyForm: DomainForm = { title: '', tools: '', icon: 'code' };

const TechnicalDomains = ({ token }: TokenProps) => {
  const [domains, setDomains] = useState<TechnicalDomain[]>([]);
  const [form, setForm] = useState<DomainForm>(emptyForm);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState<AlertState>({ show: false, type: '', message: '' });

  const fetchDomains = async () => {
    setIsLoading(true);
    try {
      const [response] = await Promise.all([GetTechnicalDomains(token), delay(180)]);
      setDomains(response.data.technical_domains || []);
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Could not load technical domains.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDomains();
  }, [token]);

  const openAdd = () => {
    setCurrentId(null);
    setForm(emptyForm);
    setIsOpen(true);
  };

  const openEdit = (domain: TechnicalDomain) => {
    setCurrentId(domain.id);
    setForm({ title: domain.title, tools: domain.tools, icon: domain.icon });
    setIsOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...form, token };
      if (currentId) {
        await UpdateTechnicalDomain({ ...payload, id: currentId });
      } else {
        await AddTechnicalDomain(payload);
      }
      setIsOpen(false);
      setAlert({
        show: true,
        type: 'success',
        message: currentId ? 'Domain updated.' : 'Domain added.',
      });
      await fetchDomains();
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Could not save this domain.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this technical domain?')) return;
    try {
      await DeleteTechnicalDomain(id, token);
      setAlert({ show: true, type: 'success', message: 'Domain deleted.' });
      await fetchDomains();
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Could not delete this domain.',
      });
    }
  };

  return (
    <section className="text-[var(--paper)]">
      <div className="mb-[22px] flex items-end justify-between gap-5 max-[760px]:items-start max-[760px]:flex-col">
        <div>
          <p className="mb-1.5 font-mono text-[10px] font-black tracking-[.22em] text-[var(--muted)]">TOOLS IN MY TOOLBOX</p>
          <h2 className="mb-1.5 text-[26px] font-black text-[var(--paper)]">Technical Domains</h2>
          <p className="text-[13px] text-[var(--muted)]">Show up to four areas you can confidently demonstrate.</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 max-[760px]:w-full max-[760px]:justify-between">
          <span className="whitespace-nowrap font-mono text-xs text-[var(--muted)]">{domains.length} / 4 domains</span>
          <Button
            primary
            type="button"
            text="+ Add Domain"
            onClick={openAdd}
            disabled={domains.length >= 4 || isLoading}
          />
        </div>
      </div>

      {isLoading ? (
        <Loading type="inline" title="Loading technical domains..." />
      ) : domains.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {domains.map((domain, index) => (
            <article className={`flex min-h-[190px] flex-col items-start border-2 border-black p-4 text-[#11131b] ${["bg-[#168aad] text-[#fffdf5]", "bg-[#d8ff3e]", "bg-[#c8b6ff]", "bg-[#fffdf5]"][index % 4]}`} key={domain.id}>
              <span className="mb-2.5 inline-flex min-h-[26px] items-center font-mono text-[22px] font-black leading-none"><DomainIcon name={domain.icon} size={24} /></span>
              <h3 className="mb-[7px] text-xl font-extrabold tracking-tight text-current">{domain.title}</h3>
              <p className="text-sm leading-[1.55] text-current opacity-90">{domain.tools}</p>
              <div className="mt-auto flex gap-2 pt-[15px]">
                <button className="inline-flex min-h-[34px] items-center justify-center border-2 border-black bg-[#fffdf5] px-2.5 py-1.5 text-[11px] font-extrabold text-[#11131b] shadow-[4px_4px_0_var(--shadow-color)]" type="button" onClick={() => openEdit(domain)}>Edit</button>
                <button className="inline-flex min-h-[34px] items-center justify-center border-2 border-black bg-[#ff8c63] px-2.5 py-1.5 text-[11px] font-extrabold text-[#11131b] shadow-[4px_4px_0_var(--shadow-color)]" type="button" onClick={() => handleDelete(domain.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid min-h-[170px] place-content-center justify-items-center border-2 border-dashed border-[var(--line)] p-[22px] text-center">
          <span aria-hidden="true">✳</span>
          <strong className="text-[var(--paper)]">No domains added yet</strong>
          <p className="mt-1 text-xs text-[var(--muted)]">Add your first domain. You can include up to four.</p>
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => !isSaving && setIsOpen(false)}
        title={currentId ? 'Edit Technical Domain' : 'Add Technical Domain'}
        isLoading={isSaving}
      >
        <form onSubmit={handleSubmit}>
          <label htmlFor="domain-title">Domain name</label>
          <input
            id="domain-title"
            type="text"
            maxLength={100}
            required
            placeholder="e.g. Software Engineering"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
          />
          <label htmlFor="domain-tools">Technologies or focus areas</label>
          <input
            id="domain-tools"
            type="text"
            maxLength={180}
            required
            placeholder="e.g. React · Next.js · TypeScript"
            value={form.tools}
            onChange={(event) => setForm({ ...form, tools: event.target.value })}
          />
          <span className="mb-2 mt-3.5 block text-[13px] font-extrabold text-[var(--paper)]">Card icon</span>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6" role="radiogroup" aria-label="Choose a card icon">
            {DOMAIN_ICON_OPTIONS.map(({ id, label }) => (
              <button
                key={id}
                className={`flex min-h-[68px] min-w-0 flex-col items-center justify-center gap-1.5 border-2 border-[#080a12] px-[3px] py-[7px] text-[#11131b] transition hover:-translate-y-0.5 hover:bg-[#e7f5f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168aad] ${form.icon === id ? 'bg-[#168aad] text-[#fffdf5]' : 'bg-[#fffdf5]'}`}
                type="button"
                role="radio"
                aria-checked={form.icon === id}
                aria-label={label}
                title={label}
                onClick={() => setForm({ ...form, icon: id })}
              >
                <DomainIcon name={id} size={22} />
                <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[9px] font-bold leading-[1.1]">{label}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2.5 text-xs text-[var(--muted)]">
            <span className="grid size-[34px] place-items-center border-2 border-black bg-[var(--lime)] text-[#11131b]"><DomainIcon name={form.icon} size={22} /></span>
            <span>Preview: <strong className="text-[var(--paper)]">{DOMAIN_ICON_OPTIONS.find(({ id }) => id === form.icon)?.label}</strong></span>
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">Keep it specific to work or projects you can show.</p>
          <div className="mt-[18px] flex justify-end">
            <Button primary type="submit" text={currentId ? 'Save Changes' : 'Add Domain'} disabled={isSaving} />
          </div>
        </form>
      </Modal>
      <Alert alert={alert} setAlert={setAlert} />
    </section>
  );
};

export default TechnicalDomains;

