import { useEffect, useState } from 'react';
import { GetLinks, UpdateLink } from '../api/backendApi';
import Alert from './Alert';
import Button from './Button';
import Loading from './Loading';
import ProfileLinkIcon, { PROFILE_LINKS } from './ProfileLinkIcon';
import type { AlertState, ProfileLink, TokenProps } from '../types';

const Links = ({ token }: TokenProps) => {
  const [links, setLinks] = useState<ProfileLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [alert, setAlert] = useState<AlertState>({ show: false, type: '', message: '' });

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const response = await GetLinks(token);
      setLinks(response.data.links || []);
    } catch (error) {
      setAlert({ show: true, type: 'error', message: error.response?.data?.message || 'Could not load profile links.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) fetchLinks(); }, [token]);

  const changeUrl = (id: number, url: string) => setLinks((current) => current.map((link) => link.id === id ? { ...link, url } : link));
  const saveLink = async (link: ProfileLink) => {
    setSaving(link.id);
    try {
      await UpdateLink({ id: link.id, url: link.url, token });
      setAlert({ show: true, type: 'success', message: `${PROFILE_LINKS.find((item) => item.id === link.platform)?.label || 'Link'} saved.` });
    } catch (error) {
      setAlert({ show: true, type: 'error', message: error.response?.data?.message || 'Could not save this link.' });
    } finally {
      setSaving(null);
    }
  };

  return (
    <section>
      <div className="mb-[22px]">
        <p className="mb-1.5 font-mono text-[10px] font-black tracking-[.22em] text-[var(--muted)]">FIND ME AROUND THE WEB</p><h2 className="mb-1.5 text-[26px] font-black text-[var(--paper)]">Profile Links</h2><p className="text-[13px] text-[var(--muted)]">Enter a URL to show it on your public portfolio. Leave it blank to hide that link.</p>
      </div>
      {loading ? <Loading type="inline" title="Loading profile links..." /> : links.length ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {links.map((link) => {
            const platform = PROFILE_LINKS.find((item) => item.id === link.platform);
            if (!platform) return null;
            return (
              <form className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-3 border border-[var(--line)] bg-[var(--surface)] p-3.5" key={link.id} onSubmit={(event) => { event.preventDefault(); saveLink(link); }}>
                <label className="col-span-full mb-3 flex items-center gap-2.5 text-[var(--paper)]" htmlFor={`profile-link-${link.id}`}><span className="grid size-9 place-items-center border-2 border-black bg-[var(--lime)] text-[#11131b] shadow-[3px_3px_0_var(--shadow-color)]"><ProfileLinkIcon name={link.platform} /></span><span>{platform.label}</span></label>
                <input className="mb-0 min-w-0" id={`profile-link-${link.id}`} type="url" maxLength={500} placeholder={platform.placeholder} value={link.url || ''} onChange={(event) => changeUrl(link.id, event.target.value)} />
                <Button primary type="submit" text={saving === link.id ? 'Saving...' : 'Save link'} disabled={saving !== null} />
              </form>
            );
          })}
        </div>
      ) : <div className="grid min-h-[170px] place-content-center justify-items-center border-2 border-dashed border-[var(--line)] p-[22px] text-center"><strong className="text-[var(--paper)]">Links are not initialized</strong><p className="mt-1 text-xs text-[var(--muted)]">Run the profile links database migration first.</p></div>}
      <Alert alert={alert} setAlert={setAlert} />
    </section>
  );
};

export default Links;
