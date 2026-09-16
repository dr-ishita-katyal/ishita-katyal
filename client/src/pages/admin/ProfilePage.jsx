import { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import { TextInput, TextArea } from '../../components/admin/Field';
import ImageUploader from '../../components/admin/ImageUploader';
import { useToast } from '../../components/admin/Toast';
import FormShell from '../../components/admin/FormShell';

export default function ProfilePage() {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [state, setState] = useState('loading');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = 'Profile — Admin';
    api
      .get('/profile')
      .then((d) => {
        setData(d);
        setState('ready');
      })
      .catch(() => setState('error'));
  }, []);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const setCredential = (i, key, value) =>
    setData((d) => {
      const credentials = [...(d.credentials || [])];
      credentials[i] = { ...credentials[i], [key]: value };
      return { ...d, credentials };
    });

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const saved = await api.put('/profile', data);
      setData(saved);
      toast.success('Profile saved.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (state === 'loading') return <p className="text-[0.85rem] text-clay">Loading the profile…</p>;
  if (state === 'error') return <p className="text-[0.9rem] text-red-700">The profile could not load.</p>;

  return (
    <FormShell
      title="Profile"
      intro="The name, hero copy and biography that open the website."
      onSubmit={save}
      busy={busy}
    >
      <Group title="Identity">
        <TextInput label="Name" value={data.name || ''} onChange={(e) => set('name', e.target.value)} className="sm:col-span-1" />
        <TextInput label="Professional title" value={data.title || ''} onChange={(e) => set('title', e.target.value)} className="sm:col-span-1" />
      </Group>

      <Group title="Hero">
        <TextInput
          label="Eyebrow line"
          value={data.heroEyebrow || ''}
          onChange={(e) => set('heroEyebrow', e.target.value)}
          className="sm:col-span-2"
          hint="The small line above the name."
        />
        <TextInput label="Hero heading" value={data.heroHeading || ''} onChange={(e) => set('heroHeading', e.target.value)} className="sm:col-span-2" />
        <TextArea
          label="Hero subtitle"
          rows={3}
          value={data.heroSubtitle || ''}
          onChange={(e) => set('heroSubtitle', e.target.value)}
          className="sm:col-span-2"
        />
      </Group>

      <Group title="About">
        <TextInput label="About heading" value={data.aboutHeading || ''} onChange={(e) => set('aboutHeading', e.target.value)} className="sm:col-span-2" />
        <TextArea label="Short bio" rows={3} value={data.shortBio || ''} onChange={(e) => set('shortBio', e.target.value)} className="sm:col-span-2" hint="Used for search results and link previews." />
        <TextArea
          label="Biography"
          rows={10}
          value={data.longBio || ''}
          onChange={(e) => set('longBio', e.target.value)}
          className="sm:col-span-2"
          hint="Leave a blank line between paragraphs."
        />
        <TextArea label="Pull quote" rows={2} value={data.quote || ''} onChange={(e) => set('quote', e.target.value)} className="sm:col-span-2" />
      </Group>

      <Group title="Qualifications">
        <div className="sm:col-span-2">
          <p className="mb-3 text-[0.8rem] text-clay">
            Shown as the credential strip beneath the hero and inside the portrait badge.
          </p>
          <div className="space-y-3">
            {(data.credentials || []).map((c, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-[3px] border border-line bg-cream p-3 sm:flex-row sm:items-end">
                <TextInput
                  label="Abbreviation"
                  value={c.abbr || ''}
                  onChange={(e) => setCredential(i, 'abbr', e.target.value)}
                  className="sm:w-40"
                />
                <TextInput
                  label="Description"
                  value={c.label || ''}
                  onChange={(e) => setCredential(i, 'label', e.target.value)}
                  className="flex-1"
                />
                <button
                  type="button"
                  aria-label="Remove qualification"
                  onClick={() => set('credentials', data.credentials.filter((_, idx) => idx !== i))}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] text-clay hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => set('credentials', [...(data.credentials || []), { abbr: '', label: '' }])}
            className="mt-3 inline-flex items-center gap-2 border border-line bg-cream px-3.5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-ink hover:border-ink"
          >
            <Plus className="h-3.5 w-3.5" />
            Add qualification
          </button>
        </div>

        <TextInput
          label="Supporting label"
          value={data.credentialsNote || ''}
          onChange={(e) => set('credentialsNote', e.target.value)}
          className="sm:col-span-2"
        />
      </Group>

      <Group title="Images">
        <div className="sm:col-span-1">
          <ImageUploader label="Hero portrait" value={data.profileImage} onChange={(v) => set('profileImage', v)} />
        </div>
        <div className="sm:col-span-1">
          <ImageUploader label="About image" value={data.aboutImage} onChange={(v) => set('aboutImage', v)} />
        </div>
      </Group>
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
