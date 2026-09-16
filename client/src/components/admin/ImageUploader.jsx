import { useRef, useState } from 'react';
import { Upload, Trash2, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { cdn } from '../../lib/cloudinary';
import { useToast } from './Toast';

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPT = 'image/jpeg,image/png,image/webp,image/avif';

/**
 * Uploads through the server, which holds the Cloudinary secret. The browser
 * never sees an API key.
 *
 * value: { url, publicId, alt }
 */
export default function ImageUploader({ label, hint, value, onChange, aspect = 'aspect-[4/5]' }) {
  const inputRef = useRef(null);
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    if (!ACCEPT.split(',').includes(file.type)) {
      toast.error('Choose a JPEG, PNG, WebP or AVIF image.');
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('That image is over 8 MB. Export a smaller version and try again.');
      return;
    }

    setBusy(true);
    try {
      const form = new FormData();
      form.append('image', file);
      const asset = await api.postForm('/upload/image', form);
      onChange({ ...(value || {}), url: asset.url, publicId: asset.publicId });
      toast.success('Image uploaded.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = () => {
    onChange({ url: '', publicId: '', alt: value?.alt || '' });
  };

  return (
    <div>
      <span className="field-label">{label}</span>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`relative flex gap-4 rounded-[3px] border border-dashed p-3 transition-colors ${
          dragging ? 'border-umber bg-sand/60' : 'border-line bg-cream'
        }`}
      >
        <div className={`${aspect} w-24 shrink-0 overflow-hidden rounded-[2px] bg-linen`}>
          {value?.url ? (
            <img
              src={cdn(value.url, { width: 300 })}
              alt={value.alt || 'Selected image'}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[0.65rem] text-clay">
              No image
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
          <p className="text-[0.75rem] leading-snug text-clay">
            {hint || 'Drag an image here, or choose a file. JPEG, PNG, WebP or AVIF, up to 8 MB.'}
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-2 border border-line bg-ivory px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:border-ink disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              {busy ? 'Uploading' : value?.url ? 'Replace' : 'Upload'}
            </button>

            {value?.url && (
              <button
                type="button"
                onClick={remove}
                className="inline-flex items-center gap-2 border border-line bg-ivory px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-red-700 transition-colors hover:border-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      </div>

      <label className="mt-2 block">
        <span className="field-label">Alt text</span>
        <input
          className="field-input"
          value={value?.alt || ''}
          onChange={(e) => onChange({ ...(value || {}), alt: e.target.value })}
          placeholder="Describe the image for screen readers"
        />
      </label>
    </div>
  );
}
