import { Loader2 } from 'lucide-react';

/** Shared wrapper for the three singleton forms: heading, body, sticky save bar. */
export default function FormShell({ title, intro, onSubmit, busy, children, saveLabel = 'Save changes' }) {
  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl pb-24" noValidate>
      <div className="max-w-[56ch]">
        <h1 className="font-display text-[2rem] leading-tight text-ink">{title}</h1>
        {intro && <p className="mt-2 text-[0.9rem] leading-relaxed text-clay">{intro}</p>}
      </div>

      <div className="mt-9 space-y-8">{children}</div>

      <div className="sticky bottom-0 -mx-5 mt-10 border-t border-line bg-ivory/95 px-5 py-4 backdrop-blur-[6px] sm:-mx-8 sm:px-8">
        <button type="submit" disabled={busy} className="btn-solid !py-3 text-[0.7rem] disabled:opacity-70">
          <span className="inline-flex items-center gap-2">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {busy ? 'Saving' : saveLabel}
          </span>
        </button>
      </div>
    </form>
  );
}
