import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Section, SectionTitle } from '../ui/Section';
import { Reveal, MaskedLines } from '../ui/Reveal';
import { EASE, viewportOnce } from '../../lib/motion';
import { cdn } from '../../lib/cloudinary';

/**
 * The nine CV areas set as a numbered index. Hovering a row lifts it, draws its
 * rule across, and — where the CMS holds an image for that area — previews it
 * alongside the cursor.
 */
export default function Expertise({ expertise = [] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(null);

  const featured = expertise.filter((e) => e.featured);
  const others = expertise.filter((e) => !e.featured);
  if (!featured.length && !others.length) return null;

  const activeItem = featured.find((f) => f._id === active);

  return (
    <Section id="expertise" index="03" label="Areas of expertise" tone="ivory">
      <div className="grid grid-cols-1 gap-x-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionTitle id="expertise-heading">
            <MaskedLines lines={['Areas of', 'expertise']} lineClassName="text-heading" />
          </SectionTitle>
          <Reveal as="p" delay={0.1} className="lede mt-6 max-w-[38ch]">
            The areas of plastic and reconstructive surgery my specialist training has concentrated on.
          </Reveal>

          {/* Image preview well — only appears when an area carries an image. */}
          <div className="relative mt-10 hidden aspect-[4/5] w-full max-w-[19rem] lg:block">
            <span aria-hidden="true" className="absolute inset-0 border border-line" />
            <AnimatePresence mode="wait">
              {activeItem?.image?.url ? (
                <motion.img
                  key={activeItem._id}
                  src={cdn(activeItem.image.url, { width: 700, height: 875 })}
                  alt={activeItem.image.alt || activeItem.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={reduce ? false : { opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
                  animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                />
              ) : (
                <motion.div
                  key="placeholder"
                  className="absolute inset-0 flex items-end bg-sand/60 p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="font-display text-[1.4rem] leading-tight text-cocoa/70">
                    {activeItem?.title || 'Nine areas of focus'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-12 lg:col-span-7 lg:mt-0">
          <ol className="border-t border-line" onMouseLeave={() => setActive(null)}>
            {featured.map((item, i) => (
              <motion.li
                key={item._id || item.title}
                className="group relative border-b border-line"
                onMouseEnter={() => setActive(item._id)}
                onFocus={() => setActive(item._id)}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.65, ease: EASE, delay: Math.min(i * 0.05, 0.3) }}
              >
                <div
                  tabIndex={0}
                  className="relative flex items-baseline gap-5 py-5 outline-none transition-[padding,color] duration-500 ease-silk group-hover:pl-3 focus-visible:pl-3 sm:py-6"
                >
                  <span className="w-8 shrink-0 font-display text-[0.95rem] text-umber">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[clamp(1.35rem,2.6vw,2rem)] leading-tight text-ink">
                      {item.title}
                    </span>
                    {item.description && (
                      <span className="mt-1 block text-[0.8rem] text-clay">{item.description}</span>
                    )}
                  </span>

                  <span className="hidden shrink-0 text-[0.62rem] uppercase tracking-[0.18em] text-clay sm:block">
                    {item.category}
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-umber transition-transform duration-[900ms] ease-silk group-hover:scale-x-100 group-focus-within:scale-x-100"
                />
              </motion.li>
            ))}
          </ol>

          {others.length > 0 && (
            <Reveal delay={0.1} className="mt-14">
              <h3 className="font-display text-[1.35rem] text-ink">Documented areas of interest</h3>
              <p className="mt-2 max-w-[48ch] text-[0.85rem] leading-relaxed text-clay">
                Further interests listed on my professional profile.
              </p>

              <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2">
                {others.map((item, i) => (
                  <motion.li
                    key={item._id || item.title}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.5, ease: EASE, delay: Math.min(i * 0.03, 0.35) }}
                  >
                    <span className="inline-block border border-line px-3.5 py-2 text-[0.8rem] text-cocoa/85 transition-colors duration-500 hover:border-umber/50 hover:bg-sand/60">
                      {item.title}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  );
}