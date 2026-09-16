import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel, busy }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[85] flex items-center justify-center bg-ink/60 p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            className="w-full max-w-md rounded-[4px] border border-line bg-cream p-7"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-[1.5rem] leading-tight text-ink">{title}</h2>
            <p className="mt-3 text-[0.92rem] leading-relaxed text-cocoa/80">{message}</p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onCancel} className="btn-outline !py-3 text-[0.72rem]">
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={busy}
                className="btn !bg-red-700 !py-3 text-[0.72rem] text-white transition-colors hover:!bg-red-800 disabled:opacity-60"
              >
                <span>{busy ? 'Working…' : confirmLabel}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
