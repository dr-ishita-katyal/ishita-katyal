import { motion, useReducedMotion } from 'framer-motion';
import { Section, SectionTitle } from '../ui/Section';
import { Reveal, MaskedLines } from '../ui/Reveal';
import { EASE, viewportOnce } from '../../lib/motion';
import { cdn } from '../../lib/cloudinary';

/**
 * Hidden until the doctor adds entries, so the page never shows an empty shelf.
 * Controlled by Settings → sections.workshops and by having at least one entry.
 */
export default function Workshops({ workshops = [] }) {
  const reduce = useReducedMotion();
  if (!workshops.length) return null;

  return (
    <Section id="workshops" index="08" label="Scientific engagement" tone="sand">
      <div className="max-w-measure">
        <SectionTitle id="workshops-heading">
          <MaskedLines lines={['Workshops &', 'scientific engagement']} lineClassName="text-heading" />
        </SectionTitle>
        <Reveal as="p" delay={0.1} className="lede mt-6">
          Meetings and teaching sessions I have organised or taken part in.
        </Reveal>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
        {workshops.map((w, i) => {
          const Wrapper = w.link ? 'a' : 'div';
          const linkProps = w.link ? { href: w.link, target: '_blank', rel: 'noopener noreferrer' } : {};

          return (
            <motion.article
              key={w._id || i}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.75, ease: EASE, delay: Math.min(i * 0.08, 0.32) }}
            >
              <Wrapper {...linkProps} className="group block">
                {w.image?.url && (
                  <div className="mb-5 overflow-hidden bg-linen">
                    <img
                      src={cdn(w.image.url, { width: 700, height: 470 })}
                      alt={w.image.alt || w.title}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[3/2] w-full object-cover transition-transform duration-[1200ms] ease-silk group-hover:scale-[1.04]"
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  {w.date && <span className="marker">{w.date}</span>}
                  {w.role && <span className="text-[0.7rem] text-clay">{w.role}</span>}
                </div>

                <h3 className="mt-2.5 font-display text-[1.4rem] leading-tight text-ink">{w.title}</h3>
                {w.location && <p className="mt-1.5 text-[0.82rem] text-clay">{w.location}</p>}
                {w.description && (
                  <p className="mt-3 text-[0.9rem] leading-relaxed text-cocoa/80">{w.description}</p>
                )}
              </Wrapper>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}