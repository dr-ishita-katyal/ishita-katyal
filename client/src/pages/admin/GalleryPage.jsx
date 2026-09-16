import { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, Trash2, Eye, EyeOff, RefreshCw, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../../lib/api';
import { cdn } from '../../lib/cloudinary';
import { useToast } from '../../components/admin/Toast';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const CATEGORIES = ['Portraits', 'Academic', 'Conferences', 'Workshops', 'Professional', 'Other'];
const ACCEPT = 'image/jpeg,image/png,image/webp,image/avif';
const MAX_BYTES = 8 * 1024 * 1024;

export default function GalleryPage() {
  const toast = useToast();
  const fileRef = useRef(null);
  const replaceRef = useRef(null);
  const replacingId = useRef(null);

  const [images, setImages] = useState([]);
  const [state, setState] = useState('loading');
  const [cloudReady, setCloudReady] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setState('loading');
    try {
      setImages(await api.get('/gallery/all'));
      setState('ready');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => {
    document.title = 'Gallery — Admin';
    load();
    api.get('/upload/status').then((s) => setCloudReady(s.cloudinary)).catch(() => {});
  }, [load]);

  const validate = (file) => {
    if (!file) return false;
    if (!ACCEPT.split(',').includes(file.type)) {
      toast.error('Choose a JPEG, PNG, WebP or AVIF image.');
      return false;
    }
    if (file.size > MAX_BYTES) {
      toast.error('That image is over 8 MB. Export a smaller version and try again.');
      return false;
    }
    return true;
  };

  const upload = async (files) => {
    const list = Array.from(files || []).filter(validate);
    if (!list.length) return;

    setUploading(true);
    for (const file of list) {
      try {
        const form = new FormData();
        form.append('image', file);
        form.append('category', 'Other');
        form.append('title', file.name.replace(/\.[^.]+$/, ''));
        const created = await api.postForm('/gallery', form);
        setImages((prev) => [...prev, created]);
      } catch (err) {
        toast.error(`${file.name}: ${err.message}`);
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
    toast.success(list.length === 1 ? 'Image uploaded.' : `${list.length} images uploaded.`);
  };

  const replace = async (file) => {
    if (!validate(file) || !replacingId.current) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('image', file);
      const updated = await api.postForm(`/gallery/${replacingId.current}/replace`, form);
      setImages((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
      toast.success('Image replaced.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      replacingId.current = null;
      if (replaceRef.current) replaceRef.current.value = '';
    }
  };

  const patch = async (id, changes) => {
    const before = images;
    setImages((prev) => prev.map((x) => (x._id === id ? { ...x, ...changes } : x)));
    try {
      await api.patch(`/gallery/${id}`, changes);
    } catch (err) {
      setImages(before);
      toast.error(err.message);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await api.del(`/gallery/${deleting._id}`);
      setImages((prev) => prev.filter((x) => x._id !== deleting._id));
      toast.success('Image deleted.');
      setDeleting(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const move = async (index, direction) => {
    const to = index + direction;
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.splice(to, 0, item);
    setImages(next);
    try {
      await api.patch('/gallery/reorder', { items: next.map((img, i) => ({ id: img._id, order: i })) });
    } catch (err) {
      toast.error(err.message);
      load();
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-[52ch]">
          <h1 className="font-display text-[2rem] leading-tight text-ink">Gallery</h1>
          <p className="mt-2 text-[0.9rem] leading-relaxed text-clay">
            Images are stored on Cloudinary and served in the right size and format automatically. The
            gallery stays hidden on the website until you switch it on under Settings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading || !cloudReady}
          className="btn-solid shrink-0 !px-5 !py-3 text-[0.7rem] disabled:opacity-60"
        >
          <span className="inline-flex items-center gap-2">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Uploading' : 'Upload images'}
          </span>
        </button>

        <input ref={fileRef} type="file" accept={ACCEPT} multiple className="sr-only" onChange={(e) => upload(e.target.files)} />
        <input ref={replaceRef} type="file" accept={ACCEPT} className="sr-only" onChange={(e) => replace(e.target.files?.[0])} />
      </div>

      {!cloudReady && (
        <p className="mt-6 border-l-2 border-amber-500 bg-amber-50 px-4 py-3 text-[0.85rem] leading-relaxed text-amber-900">
          Uploads are off because Cloudinary credentials are missing. Add CLOUDINARY_CLOUD_NAME,
          CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to the server .env file and restart the server.
        </p>
      )}

      <div className="mt-8">
        {state === 'loading' && <p className="text-[0.85rem] text-clay">Loading images…</p>}

        {state === 'error' && (
          <div className="admin-card p-7">
            <p className="font-display text-[1.3rem] text-ink">The gallery could not load</p>
            <button type="button" onClick={load} className="btn-outline mt-5 !py-3 text-[0.7rem]">
              <span>Try again</span>
            </button>
          </div>
        )}

        {state === 'ready' && images.length === 0 && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              upload(e.dataTransfer.files);
            }}
            className="admin-card border-dashed p-12 text-center"
          >
            <p className="font-display text-[1.4rem] text-ink">No images yet</p>
            <p className="mx-auto mt-2 max-w-[44ch] text-[0.9rem] leading-relaxed text-clay">
              Drag images here, or use the upload button. Add a title and alt text afterwards so the
              gallery is readable by screen readers.
            </p>
          </div>
        )}

        {state === 'ready' && images.length > 0 && (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img, i) => (
              <li key={img._id} className={`admin-card overflow-hidden ${img.visible ? '' : 'opacity-70'}`}>
                <div className="relative aspect-[4/3] bg-linen">
                  <img
                    src={cdn(img.url, { width: 500, height: 375 })}
                    alt={img.alt || img.title || 'Gallery image'}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-2 top-2 flex gap-1">
                    <Chip label={img.visible ? 'Hide' : 'Show'} onClick={() => patch(img._id, { visible: !img.visible })}>
                      {img.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </Chip>
                    <Chip
                      label="Replace image"
                      onClick={() => {
                        replacingId.current = img._id;
                        replaceRef.current?.click();
                      }}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Chip>
                    <Chip label="Delete image" onClick={() => setDeleting(img)} danger>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Chip>
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  <label className="block">
                    <span className="field-label">Title</span>
                    <input
                      className="field-input"
                      defaultValue={img.title || ''}
                      onBlur={(e) => e.target.value !== (img.title || '') && patch(img._id, { title: e.target.value })}
                    />
                  </label>

                  <label className="block">
                    <span className="field-label">Alt text</span>
                    <input
                      className="field-input"
                      defaultValue={img.alt || ''}
                      placeholder="Describe the image"
                      onBlur={(e) => e.target.value !== (img.alt || '') && patch(img._id, { alt: e.target.value })}
                    />
                  </label>

                  <div className="flex items-end gap-2">
                    <label className="block flex-1">
                      <span className="field-label">Category</span>
                      <select
                        className="field-input"
                        value={img.category || 'Other'}
                        onChange={(e) => patch(img._id, { category: e.target.value })}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>

                    <div className="flex gap-1 pb-0.5">
                      <button type="button" onClick={() => move(i, -1)} aria-label="Move earlier" className="flex h-10 w-9 items-center justify-center rounded-[3px] border border-line text-clay hover:text-ink">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => move(i, 1)} aria-label="Move later" className="flex h-10 w-9 items-center justify-center rounded-[3px] border border-line text-clay hover:text-ink">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this image?"
        message="It will be removed from the gallery and from Cloudinary. This cannot be undone."
        onConfirm={remove}
        onCancel={() => setDeleting(null)}
        busy={busy}
      />
    </div>
  );
}

function Chip({ label, onClick, children, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-8 w-8 items-center justify-center rounded-[3px] bg-ivory/90 backdrop-blur-[2px] transition-colors ${
        danger ? 'text-red-700 hover:bg-red-50' : 'text-cocoa hover:bg-ivory'
      }`}
    >
      {children}
    </button>
  );
}
