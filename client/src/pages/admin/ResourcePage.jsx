import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, ChevronUp, ChevronDown, Loader2, X,
} from 'lucide-react';
import { api } from '../../lib/api';
import { schemas, blankRecord } from '../../components/admin/schemas';
import { TextInput, TextArea, Select, Toggle, Field } from '../../components/admin/Field';
import ImageUploader from '../../components/admin/ImageUploader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { useToast } from '../../components/admin/Toast';
import { EASE } from '../../lib/motion';

export default function ResourcePage() {
  const { resource } = useParams();
  const schema = schemas[resource];
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [state, setState] = useState('loading'); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState('');
  const [editing, setEditing] = useState(null); // record being edited, or blank for new
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const dragIndex = useRef(null);

  const load = useCallback(async () => {
    if (!schema) return;
    setState('loading');
    try {
      const data = await api.get(`${schema.path}/all`);
      setRows(data);
      setState('ready');
    } catch (err) {
      setErrorMessage(err.message);
      setState('error');
    }
  }, [schema]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (schema) document.title = `${schema.title} — Admin`;
  }, [schema]);

  if (!schema) {
    return <p className="text-[0.95rem] text-clay">No admin screen matches “{resource}”.</p>;
  }

  const save = async (record) => {
    setBusy(true);
    try {
      const payload = { ...record };
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.__v;

      if (record._id) {
        const updated = await api.patch(`${schema.path}/${record._id}`, payload);
        setRows((r) => r.map((x) => (x._id === updated._id ? updated : x)));
        toast.success(`${capitalise(schema.singular)} updated.`);
      } else {
        const created = await api.post(schema.path, payload);
        setRows((r) => [...r, created]);
        toast.success(`${capitalise(schema.singular)} added.`);
      }
      setEditing(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await api.del(`${schema.path}/${deleting._id}`);
      setRows((r) => r.filter((x) => x._id !== deleting._id));
      toast.success(`${capitalise(schema.singular)} deleted.`);
      setDeleting(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const toggleVisible = async (row) => {
    const next = !row.visible;
    setRows((r) => r.map((x) => (x._id === row._id ? { ...x, visible: next } : x)));
    try {
      await api.patch(`${schema.path}/${row._id}`, { visible: next });
      toast.success(next ? 'Now showing on the website.' : 'Hidden from the website.');
    } catch (err) {
      setRows((r) => r.map((x) => (x._id === row._id ? { ...x, visible: !next } : x)));
      toast.error(err.message);
    }
  };

  const persistOrder = async (ordered) => {
    setRows(ordered);
    try {
      await api.patch(`${schema.path}/reorder`, {
        items: ordered.map((row, i) => ({ id: row._id, order: i })),
      });
    } catch (err) {
      toast.error(err.message);
      load();
    }
  };

  const move = (from, to) => {
    if (to < 0 || to >= rows.length || from === to) return;
    const next = [...rows];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    persistOrder(next);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-[52ch]">
          <h1 className="font-display text-[2rem] leading-tight text-ink">{schema.title}</h1>
          <p className="mt-2 text-[0.9rem] leading-relaxed text-clay">{schema.intro}</p>
        </div>

        <button
          type="button"
          onClick={() => setEditing(blankRecord(schema))}
          className="btn-solid shrink-0 !px-5 !py-3 text-[0.7rem]"
        >
          <span className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add {schema.singular}
          </span>
        </button>
      </div>

      <div className="mt-8">
        {state === 'loading' && <ListSkeleton />}

        {state === 'error' && (
          <div className="admin-card p-7">
            <p className="font-display text-[1.3rem] text-ink">This list could not load</p>
            <p className="mt-2 text-[0.9rem] text-clay">{errorMessage}</p>
            <button type="button" onClick={load} className="btn-outline mt-5 !py-3 text-[0.7rem]">
              <span>Try again</span>
            </button>
          </div>
        )}

        {state === 'ready' && rows.length === 0 && (
          <div className="admin-card p-10 text-center">
            <p className="font-display text-[1.4rem] text-ink">{schema.emptyTitle}</p>
            <p className="mx-auto mt-2 max-w-[42ch] text-[0.9rem] leading-relaxed text-clay">
              {schema.emptyBody}
            </p>
            <button
              type="button"
              onClick={() => setEditing(blankRecord(schema))}
              className="btn-solid mt-6 !px-5 !py-3 text-[0.7rem]"
            >
              <span>Add {schema.singular}</span>
            </button>
          </div>
        )}

        {state === 'ready' && rows.length > 0 && (
          <ul className="admin-card divide-y divide-line">
            {rows.map((row, i) => (
              <li
                key={row._id}
                draggable
                onDragStart={() => (dragIndex.current = i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragIndex.current !== null) move(dragIndex.current, i);
                  dragIndex.current = null;
                }}
                className={`flex items-start gap-3 p-4 transition-colors sm:gap-4 sm:p-5 ${
                  row.visible ? '' : 'bg-linen/40'
                }`}
              >
                <span className="mt-1 hidden cursor-grab text-clay/60 active:cursor-grabbing sm:block" aria-hidden="true">
                  <GripVertical className="h-4 w-4" />
                </span>

                <div className="flex shrink-0 flex-col sm:hidden">
                  <button type="button" onClick={() => move(i, i - 1)} aria-label="Move up" className="p-1 text-clay">
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => move(i, i + 1)} aria-label="Move down" className="p-1 text-clay">
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-display text-[1.15rem] leading-snug text-ink">
                    {schema.primary(row) || <span className="text-clay">Untitled</span>}
                  </p>
                  {schema.secondary(row) && (
                    <p className="mt-1 line-clamp-2 text-[0.85rem] leading-snug text-cocoa/75">
                      {schema.secondary(row)}
                    </p>
                  )}
                  {schema.tertiary(row) && (
                    <p className="mt-1.5 text-[0.72rem] uppercase tracking-[0.1em] text-clay">
                      {schema.tertiary(row)}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-0.5">
                  <IconButton
                    label={row.visible ? 'Hide from the website' : 'Show on the website'}
                    onClick={() => toggleVisible(row)}
                  >
                    {row.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-clay" />}
                  </IconButton>
                  <IconButton label="Edit" onClick={() => setEditing(row)}>
                    <Pencil className="h-4 w-4" />
                  </IconButton>
                  <IconButton label="Delete" onClick={() => setDeleting(row)} danger>
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>
        )}

        {state === 'ready' && rows.length > 1 && (
          <p className="mt-3 text-[0.75rem] text-clay">
            Drag an entry to change the order on the public site, or use the arrows on a small screen.
          </p>
        )}
      </div>

      <RecordForm
        schema={schema}
        record={editing}
        busy={busy}
        onClose={() => setEditing(null)}
        onSave={save}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title={`Delete this ${schema.singular}?`}
        message="It will be removed from the website straight away. This cannot be undone."
        onConfirm={remove}
        onCancel={() => setDeleting(null)}
        busy={busy}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function RecordForm({ schema, record, busy, onClose, onSave }) {
  const [draft, setDraft] = useState(record);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setDraft(record);
    setErrors({});
  }, [record]);

  useEffect(() => {
    if (!record) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [record, onClose]);

  const set = (name, value) => setDraft((d) => ({ ...d, [name]: value }));

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    for (const f of schema.fields) {
      if (f.required && !String(draft[f.name] ?? '').trim()) next[f.name] = `${f.label} is required.`;
    }
    setErrors(next);
    if (Object.keys(next).length) return;
    onSave(draft);
  };

  return (
    <AnimatePresence>
      {record && draft && (
        <motion.div
          className="fixed inset-0 z-[75] flex justify-end bg-ink/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${record._id ? 'Edit' : 'Add'} ${schema.singular}`}
            className="flex h-full w-full max-w-xl flex-col bg-ivory"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-display text-[1.45rem] text-ink">
                {record._id ? `Edit ${schema.singular}` : `Add ${schema.singular}`}
              </h2>
              <button type="button" onClick={onClose} aria-label="Close" className="-mr-2 p-2 text-clay hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col" noValidate>
              <div className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto px-6 py-6 sm:grid-cols-2">
                {schema.fields.map((f) => {
                  const span = f.span === 2 ? 'sm:col-span-2' : '';
                  const common = {
                    key: f.name,
                    label: f.label,
                    hint: f.hint,
                    error: errors[f.name],
                    className: span,
                  };

                  if (f.type === 'textarea') {
                    return (
                      <TextArea
                        {...common}
                        rows={f.rows || 4}
                        value={draft[f.name] || ''}
                        placeholder={f.placeholder}
                        onChange={(e) => set(f.name, e.target.value)}
                      />
                    );
                  }
                  if (f.type === 'select') {
                    return (
                      <Select
                        {...common}
                        options={f.options}
                        value={draft[f.name] || ''}
                        onChange={(e) => set(f.name, e.target.value)}
                      />
                    );
                  }
                  if (f.type === 'toggle') {
                    return (
                      <div key={f.name} className={span}>
                        <Toggle
                          label={f.label}
                          hint={f.hint}
                          checked={Boolean(draft[f.name])}
                          onChange={(v) => set(f.name, v)}
                        />
                      </div>
                    );
                  }
                  if (f.type === 'image') {
                    return (
                      <div key={f.name} className={span}>
                        <ImageUploader
                          label={f.label}
                          hint={f.hint}
                          value={draft[f.name] || {}}
                          onChange={(v) => set(f.name, v)}
                          aspect="aspect-square"
                        />
                      </div>
                    );
                  }
                  return (
                    <TextInput
                      {...common}
                      value={draft[f.name] || ''}
                      placeholder={f.placeholder}
                      onChange={(e) => set(f.name, e.target.value)}
                    />
                  );
                })}

                <div className="sm:col-span-2">
                  <Field label="Visibility">
                    <Toggle
                      label="Show this on the website"
                      checked={draft.visible !== false}
                      onChange={(v) => set('visible', v)}
                    />
                  </Field>
                </div>
              </div>

              <div className="flex gap-3 border-t border-line px-6 py-5">
                <button type="submit" disabled={busy} className="btn-solid !py-3 text-[0.7rem] disabled:opacity-70">
                  <span className="inline-flex items-center gap-2">
                    {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                    {busy ? 'Saving' : 'Save changes'}
                  </span>
                </button>
                <button type="button" onClick={onClose} className="btn-outline !py-3 text-[0.7rem]">
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IconButton({ label, onClick, children, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-10 w-10 items-center justify-center rounded-[3px] transition-colors ${
        danger ? 'text-clay hover:bg-red-50 hover:text-red-700' : 'text-cocoa hover:bg-sand'
      }`}
    >
      {children}
    </button>
  );
}

function ListSkeleton() {
  return (
    <ul className="admin-card divide-y divide-line" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <li key={i} className="flex animate-pulse items-start gap-4 p-5">
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-linen" />
            <div className="h-3 w-2/3 rounded bg-linen" />
          </div>
        </li>
      ))}
    </ul>
  );
}

const capitalise = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);
