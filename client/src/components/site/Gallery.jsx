import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { Section, SectionTitle } from '../ui/Section';
import { MaskedLines } from '../ui/Reveal';
import { EASE, viewportOnce } from '../../lib/motion';
import { cdn } from '../../lib/cloudinary';

/** Optional gallery, off until images are uploaded and the section is switched on. */
export default function Gallery({ gallery = [] }) {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(gallery.map((g) => g.category).filter(Boolean)))],
    [gallery]
  );
  const shown = filter === 'All' ? gallery : gallery.filter((g) => g.category === filter);

  // Escape closes the lightbox, and the page behind it stops scrolling.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => e.key === 'Escape' && setLightbox(null);
    window.addEventListener('keydown', onKey);
    document.body.classList.add('menu-open');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('menu-open');
    };
  }, [lightbox]);

  if (!gallery.length) return null;

  return (
    <Section id="gallery" index="09" label="Gallery" tone="ivory">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionTitle id="gallery-heading">
          <MaskedLines lines={['Gallery']} lineClassName="text-heading" />
        </SectionTitle>

        {categories.length > 2 && (
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  type="button"
                  onClick={() => setFilter(cat)}
                  aria-pressed={filter === cat}
                  className={`relative py-1 text-[0.75rem] tracking-[0.06em] transition-colors duration-300 ${
                    filter === cat ? 'text-ink' : 'text-clay hover:text-cocoa'
                  }`}
                >
                  {cat}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-umber transition-transform duration-500 ease-silk ${
                      filter === cat ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {shown.map((img, i) => (
          <motion.button
            key={img._id || i}
            type="button"
            onClick={() => setLightbox(img)}
            className="group relative block overflow-hidden bg-linen"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.65, ease: EASE, delay: Math.min(i * 0.05, 0.3) }}
          >
            <img
              src={cdn(img.url, { width: 640, height: 800 })}
              alt={img.alt || img.title || 'Gallery image'}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-silk group-hover:scale-[1.05]"
            />
            {img.title && (
              <span className="absolute inset-x-0 bottom-0 translate-y-full bg-ink/80 px-4 py-3 text-left text-[0.78rem] text-ivory transition-transform duration-500 ease-silk group-hover:translate-y-0">
                {img.title}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/92 p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.title || 'Image'}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Close image"
              className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center text-ivory"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.img
              src={cdn(lightbox.url, { width: 1600, crop: 'limit' })}
              alt={lightbox.alt || lightbox.title || 'Gallery image'}
              className="max-h-[85vh] max-w-full object-contain"
              initial={reduce ? false : { scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}