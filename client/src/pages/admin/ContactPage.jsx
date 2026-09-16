import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import { TextInput, TextArea } from '../../components/admin/Field';
import FormShell from '../../components/admin/FormShell';
import { useToast } from '../../components/admin/Toast';

export default function ContactPage() {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [state, setState] = useState('loading');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = 'Contact — Admin';
    api
      .get('/contact')
      .then((d) => {
        setData(d);
        setState('ready');
      })
      .catch(() => setState('error'));
  }, []);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const setLink = (i, key, value) =>
    setData((d) => {
      const otherLinks = [...(d.otherLinks || [])];
      otherLinks[i] = { ...otherLinks[i], [key]: value };
      return { ...d, otherLinks };
    });

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      setData(await api.put('/contact', data));
      toast.success('Contact details saved.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (state === 'loading') return <p className="text-[0.85rem] text-clay">Loading contact details…</p>;
  if (state === 'error') return <p className="text-[0.9rem] text-red-700">Contact details could not load.</p>;

  return (
    <FormShell
      title="Contact"
      intro="Only the details you fill in appear on the website. Anything left blank is hidden rather than shown as a placeholder."
      onSubmit={save}
      busy={busy}
    >
      <Group title="Section copy">
        <TextInput label="Heading" value={data.heading || ''} onChange={(e) => set('heading', e.target.value)} className="sm:col-span-2" />
        <TextArea label="Intro" rows={2} value={data.intro || ''} onChange={(e) => set('intro', e.target.value)} className="sm:col-span-2" />
      </Group>

      <Group title="How to reach you">
        <TextInput label="Phone" value={data.phone || ''} onChange={(e) => set('phone', e.target.value)} placeholder="+91 …" />
        <TextInput label="Email" type="email" value={data.email || ''} onChange={(e) => set('email', e.target.value)} />
        <TextInput label="WhatsApp" value={data.whatsapp || ''} onChange={(e) => set('whatsapp', e.target.value)} hint="Number with country code; becomes a wa.me link." />
        <TextInput label="Appointment link" value={data.appointmentUrl || ''} onChange={(e) => set('appointmentUrl', e.target.value)} hint="If set, every Book a consultation button opens this." />
      </Group>

      <Group title="Clinic">
        <TextInput label="Clinic name" value={data.clinicName || ''} onChange={(e) => set('clinicName', e.target.value)} className="sm:col-span-2" />
        <TextArea label="Address" rows={3} value={data.clinicAddress || ''} onChange={(e) => set('clinicAddress', e.target.value)} className="sm:col-span-2" />
        <TextInput label="Consulting hours" value={data.consultingHours || ''} onChange={(e) => set('consultingHours', e.target.value)} className="sm:col-span-2" />
        <TextInput label="Google Maps link" value={data.mapsLink || ''} onChange={(e) => set('mapsLink', e.target.value)} className="sm:col-span-2" />
      </Group>

      <Group title="Social">
        <TextInput label="Instagram" value={data.instagram || ''} onChange={(e) => set('instagram', e.target.value)} placeholder="https://instagram.com/…" />
        <TextInput label="LinkedIn" value={data.linkedin || ''} onChange={(e) => set('linkedin', e.target.value)} placeholder="https://linkedin.com/in/…" />

        <div className="sm:col-span-2">
          <p className="mb-3 text-[0.8rem] text-clay">Other links</p>
          <div className="space-y-3">
            {(data.otherLinks || []).map((l, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-[3px] border border-line bg-cream p-3 sm:flex-row sm:items-end">
                <TextInput label="Label" value={l.label || ''} onChange={(e) => setLink(i, 'label', e.target.value)} className="sm:w-48" />
                <TextInput label="URL" value={l.url || ''} onChange={(e) => setLink(i, 'url', e.target.value)} className="flex-1" />
                <button
                  type="button"
                  aria-label="Remove link"
                  onClick={() => set('otherLinks', data.otherLinks.filter((_, idx) => idx !== i))}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] text-clay hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => set('otherLinks', [...(data.otherLinks || []), { label: '', url: '' }])}
            className="mt-3 inline-flex items-center gap-2 border border-line bg-cream px-3.5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-ink hover:border-ink"
          >
            <Plus className="h-3.5 w-3.5" />
            Add link
          </button>
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