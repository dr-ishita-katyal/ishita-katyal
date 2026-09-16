import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { TextInput, TextArea, Toggle } from '../../components/admin/Field';
import ImageUploader from '../../components/admin/ImageUploader';
import FormShell from '../../components/admin/FormShell';
import { useToast } from '../../components/admin/Toast';

const SECTIONS = [
  { key: 'specialistTraining', label: 'Specialist training', hint: 'The fellowship and training timeline.' },
  { key: 'awards', label: 'Credits & awards', hint: '' },
  { key: 'publications', label: 'Publications', hint: '' },
  { key: 'workshops', label: 'Workshops', hint: 'Stays hidden until you add entries.' },
  { key: 'gallery', label: 'Gallery', hint: 'Stays hidden until you upload images.' },
];

export default function SettingsPage() {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [state, setState] = useState('loading');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = 'Settings — Admin';
    api
      .get('/settings')
      .then((d) => {
        setData(d);
        setState('ready');
      })
      .catch(() => setState('error'));
  }, []);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const setSection = (k, v) => setData((d) => ({ ...d, sections: { ...(d.sections || {}), [k]: v } }));

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      setData(await api.put('/settings', data));
      toast.success('Settings saved.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (state === 'loading') return <p className="text-[0.85rem] text-clay">Loading settings…</p>;
  if (state === 'error') return <p className="text-[0.9rem] text-red-700">Settings could not load.</p>;

  return (
    <FormShell
      title="Settings"
      intro="How the site describes itself to search engines, and which sections are published."
      onSubmit={save}
      busy={busy}
    >
      <Group title="Search & sharing">
        <TextInput label="Site title" value={data.siteTitle || ''} onChange={(e) => set('siteTitle', e.target.value)} className="sm:col-span-2" hint="Shown in the browser tab and in search results." />
        <TextArea
          label="Meta description"
          rows={3}
          value={data.metaDescription || ''}
          onChange={(e) => set('metaDescription', e.target.value)}
          className="sm:col-span-2"
          hint={`${(data.metaDescription || '').length} characters. Around 150–160 reads best in search results.`}
        />
        <TextInput label="Canonical URL" value={data.canonicalUrl || ''} onChange={(e) => set('canonicalUrl', e.target.value)} className="sm:col-span-2" placeholder="https://www.example.com" />
        <div className="sm:col-span-1">
          <ImageUploader label="Share image" value={data.ogImage} onChange={(v) => set('ogImage', v)} aspect="aspect-video" hint="Used when the site is shared on social media. 1200×630 works well." />
        </div>
        <div className="sm:col-span-1">
          <ImageUploader label="Favicon" value={data.favicon} onChange={(v) => set('favicon', v)} aspect="aspect-square" hint="A square image, ideally 512×512." />
        </div>
      </Group>

      <Group title="Names & footer">
        <TextInput label="Doctor name" value={data.doctorName || ''} onChange={(e) => set('doctorName', e.target.value)} />
        <TextInput label="Footer line" value={data.footerText || ''} onChange={(e) => set('footerText', e.target.value)} />
      </Group>

      <Group title="Legal">
        <TextArea label="Medical disclaimer" rows={5} value={data.medicalDisclaimer || ''} onChange={(e) => set('medicalDisclaimer', e.target.value)} className="sm:col-span-2" />
        <TextArea label="Privacy policy" rows={7} value={data.privacyPolicy || ''} onChange={(e) => set('privacyPolicy', e.target.value)} className="sm:col-span-2" hint="Leave a blank line between paragraphs. Shown in the footer dialog." />
      </Group>

      <section className="border-t border-line pt-7">
        <h2 className="mb-2 font-display text-[1.35rem] text-ink">Published sections</h2>
        <p className="mb-5 max-w-[52ch] text-[0.85rem] leading-relaxed text-clay">
          Switch a section off to remove it from the public page without deleting its content.
        </p>
        <div className="space-y-4">
          {SECTIONS.map((s) => (
            <Toggle
              key={s.key}
              label={s.label}
              hint={s.hint}
              checked={Boolean(data.sections?.[s.key])}
              onChange={(v) => setSection(s.key, v)}
            />
          ))}
        </div>
      </section>
    </FormShell>
  );
}

function Group({ title, children }) {
  return (
    <section className="border-t border-line pt-7 first:border-t-0 first:pt-0">
      <h2 className="mb-5 font-display text-[1.35rem] text-ink">{title}</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}
