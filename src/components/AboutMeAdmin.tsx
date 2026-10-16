import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { CirclePlus, Trash2 } from 'lucide-react';
import { GetAboutMe, UpdateAboutMe } from '../api/backendApi';
import Alert from './Alert';
import Button from './Button';
import Loading from './Loading';
import { ABOUT_ICON_MAP, ABOUT_ICON_OPTIONS, DEFAULT_ABOUT_ICONS } from './AboutIcons';
import type { AboutItem, AboutListField, AboutMeForm, AlertState, TokenProps } from '../types';

const defaults: AboutMeForm = { description: '', interests: [], favorite_languages: [], beyond_code: [] };
const listDefinitions = [
  { field: 'interests', label: 'Interests', helper: 'What topics and fields are you curious about?' },
  { field: 'favorite_languages', label: 'Favorite programming languages', helper: 'Choose an icon for each language.' },
  { field: 'beyond_code', label: 'Beyond the code', helper: 'Hobbies and things you enjoy outside programming.' },
] satisfies { field: AboutListField; label: string; helper: string }[];
const fieldClass = 'w-full border-2 border-black bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--paper)] shadow-[3px_3px_0_var(--shadow-color)] outline-none focus-visible:outline-2 focus-visible:outline-[#168aad]';

const normalizeItems = (items: unknown, field: AboutListField): AboutItem[] => {
  if (!Array.isArray(items)) return [];
  const icons = DEFAULT_ABOUT_ICONS[field] || ['Sparkles'];
  return items.map((item: unknown, index: number) => {
    if (typeof item === 'string') return { text: item, icon: icons[index % icons.length] };
    if (!item || typeof item !== 'object') return null;
    const value = item as { text?: unknown; icon?: unknown };
    const icon = String(value.icon || '');
    return {
      text: String(value.text || ''),
      icon: ABOUT_ICON_MAP[icon] ? icon : icons[index % icons.length],
    };
  }).filter((item): item is AboutItem => Boolean(item?.text));
};

interface AboutListEditorProps {
  field: AboutListField;
  label: string;
  helper: string;
  items: AboutItem[];
  openPicker: string | null;
  setOpenPicker: (value: string | null) => void;
  onChange: (field: AboutListField, index: number, key: 'text' | 'icon', value: string) => void;
  onAdd: (field: AboutListField) => void;
  onRemove: (field: AboutListField, index: number) => void;
}

const AboutListEditor = ({ field, label, helper, items, openPicker, setOpenPicker, onChange, onAdd, onRemove }: AboutListEditorProps) => (
  <section className="border-2 border-black bg-[var(--surface)] p-4 shadow-[4px_4px_0_var(--shadow-color)] sm:p-5">
    <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="m-0 text-base font-black text-[var(--paper)]">{label}</h3>
        <p className="mb-0 mt-1 text-xs text-[var(--muted)]">{helper}</p>
      </div>
      <span className="border border-[var(--line)] px-2 py-1 font-mono text-[10px] text-[var(--muted)]">{items.length} / 20</span>
    </header>

    <div className="grid gap-3">
      {items.map((item, index) => {
        const pickerId = `${field}-${index}`;
        const selected = ABOUT_ICON_MAP[item.icon] || ABOUT_ICON_MAP.Sparkles;
        const SelectedIcon = selected.Icon;
        return (
          <div className="border border-[var(--line)] p-3" key={`${field}-${index}`}>
            <div className="flex items-center gap-2.5">
              <label className="sr-only" htmlFor={`${pickerId}-text`}>{label} item {index + 1}</label>
              <input
                className={fieldClass}
                id={`${pickerId}-text`}
                maxLength={100}
                placeholder={`Add ${label.toLowerCase()} item`}
                value={item.text}
                onChange={(event) => onChange(field, index, 'text', event.target.value)}
              />
              <button
                className="grid size-11 shrink-0 place-items-center border-2 border-black bg-[var(--lime)] text-[#11131b] shadow-[3px_3px_0_var(--shadow-color)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_var(--shadow-color)]"
                type="button"
                title={`Selected icon: ${selected.label}. Choose another icon.`}
                aria-label={`Choose icon for ${item.text || label + ' item ' + (index + 1)}`}
                aria-expanded={openPicker === pickerId}
                onClick={() => setOpenPicker(openPicker === pickerId ? null : pickerId)}
              >
                <SelectedIcon className={`size-5 ${selected.color}`} aria-hidden="true" />
              </button>
              <button
                className="grid size-11 shrink-0 place-items-center border-2 border-black bg-[#ffb2d9] text-[#11131b] shadow-[3px_3px_0_var(--shadow-color)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_var(--shadow-color)]"
                type="button"
                aria-label={`Remove ${item.text || label + ' item ' + (index + 1)}`}
                onClick={() => onRemove(field, index)}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>

            {openPicker === pickerId && (
              <div className="mt-3 border-t border-[var(--line)] pt-3">
                <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[.12em] text-[var(--muted)]">Choose an icon · currently {selected.label}</p>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
                  {ABOUT_ICON_OPTIONS.map(({ name, label: iconLabel, Icon, color }) => (
                    <button
                      className={`flex min-h-[58px] flex-col items-center justify-center gap-1 border-2 px-1 py-2 text-[9px] font-semibold transition ${item.icon === name ? 'border-black bg-[var(--lime)] text-[#11131b] shadow-[2px_2px_0_var(--shadow-color)]' : 'border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:border-black hover:text-[var(--paper)]'}`}
                      key={name}
                      type="button"
                      title={iconLabel}
                      aria-label={iconLabel}
                      aria-pressed={item.icon === name}
                      onClick={() => { onChange(field, index, 'icon', name); setOpenPicker(null); }}
                    >
                      <Icon className={`size-5 ${color}`} aria-hidden="true" />
                      <span className="max-w-full truncate">{iconLabel}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>

    <button
      className="mt-3 inline-flex items-center gap-2 border-2 border-black bg-[var(--surface)] px-3 py-2 text-xs font-extrabold text-[var(--paper)] shadow-[3px_3px_0_var(--shadow-color)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--lime)] hover:text-[#11131b] hover:shadow-[1px_1px_0_var(--shadow-color)] disabled:cursor-not-allowed disabled:opacity-50"
      type="button"
      onClick={() => onAdd(field)}
      disabled={items.length >= 20}
    >
      <CirclePlus className="size-4" aria-hidden="true" /> Add item
    </button>
  </section>
);

const AboutMeAdmin = ({ token }: TokenProps) => {
  const [form, setForm] = useState<AboutMeForm>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openPicker, setOpenPicker] = useState<string | null>(null);
  const [alert, setAlert] = useState<AlertState>({ show: false, type: '', message: '' });

  useEffect(() => {
    let active = true;
    GetAboutMe(token)
      .then(({ data }) => {
        if (!active || !data.about_me) return;
        const about = { ...defaults, ...data.about_me } as AboutMeForm;
        setForm({
          ...about,
          interests: normalizeItems(about.interests, 'interests'),
          favorite_languages: normalizeItems(about.favorite_languages, 'favorite_languages'),
          beyond_code: normalizeItems(about.beyond_code, 'beyond_code'),
        });
      })
      .catch((error) => setAlert({ show: true, type: 'error', message: error.response?.data?.message || 'Could not load About Me content.' }))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);

  const updateItem = (field: AboutListField, index: number, key: 'text' | 'icon', value: string) => setForm((current) => ({
    ...current,
    [field]: current[field].map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
  }));

  const addItem = (field: AboutListField) => setForm((current) => {
    if (current[field].length >= 20) return current;
    const icons = DEFAULT_ABOUT_ICONS[field];
    return { ...current, [field]: [...current[field], { text: '', icon: icons[current[field].length % icons.length] }] };
  });

  const removeItem = (field: AboutListField, index: number) => setForm((current) => ({
    ...current,
    [field]: current[field].filter((_, itemIndex) => itemIndex !== index),
  }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const cleanItems = (items: AboutItem[]) => items.map((item) => ({ ...item, text: item.text.trim() })).filter((item) => item.text);
      const cleanForm: AboutMeForm = {
        ...form,
        interests: cleanItems(form.interests),
        favorite_languages: cleanItems(form.favorite_languages),
        beyond_code: cleanItems(form.beyond_code),
      };
      await UpdateAboutMe({ ...cleanForm, token });
      setForm(cleanForm);
      setAlert({ show: true, type: 'success', message: 'About Me content saved.' });
    } catch (error) {
      setAlert({ show: true, type: 'error', message: error.response?.data?.message || 'Could not save About Me content.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading type="inline" title="Loading About Me content..." />;

  const textAreaClass = 'mb-4 mt-1.5 min-h-36 w-full resize-y border-2 border-black bg-[var(--surface)] px-3 py-3 text-[var(--paper)] shadow-[3px_3px_0_var(--shadow-color)] outline-none focus-visible:outline-2 focus-visible:outline-[#168aad]';
  return (
    <section>
      <header className="mb-6">
        <p className="mb-1.5 font-mono text-[10px] font-black tracking-[.22em] text-[var(--muted)]">PUBLIC PROFILE</p>
        <h2 className="mb-1.5 text-[26px] font-black text-[var(--paper)]">About Me</h2>
        <p className="text-[13px] text-[var(--muted)]">Write one short item per row, choose its icon, then preview it on the public profile.</p>
      </header>
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1.5 block text-[13px] font-extrabold text-[var(--paper)]" htmlFor="about-description">Biography</label>
          <textarea className={textAreaClass} id="about-description" maxLength={1500} required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <p className="-mt-2 text-right font-mono text-[10px] text-[var(--muted)]">{form.description.length} / 1500</p>
        </div>

        <div className="grid gap-4">
          {listDefinitions.map((definition) => (
            <AboutListEditor
              key={definition.field}
              {...definition}
              items={form[definition.field]}
              openPicker={openPicker}
              setOpenPicker={setOpenPicker}
              onChange={updateItem}
              onAdd={addItem}
              onRemove={removeItem}
            />
          ))}
        </div>

        <div className="flex justify-end"><Button primary type="submit" text={saving ? 'Saving...' : 'Save About Me'} disabled={saving} /></div>
      </form>
      <Alert alert={alert} setAlert={setAlert} />
    </section>
  );
};

export default AboutMeAdmin;
