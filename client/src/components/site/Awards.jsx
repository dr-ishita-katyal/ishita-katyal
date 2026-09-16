import { motion, useReducedMotion } from 'framer-motion';
import { Section, SectionTitle } from '../ui/Section';
import { Reveal, MaskedLines } from '../ui/Reveal';
import { EASE, viewportOnce } from '../../lib/motion';

/** Each award is a plain block: year in the rail, citation in the column. */
export default function Awards({ awards = [] }) {
  const reduce = useReducedMotion();
  if (!awards.length) return null;

  return (
    <Section id="achievements" index="06" label="Credits & awards" tone="sand">
      <div className="max-w-measure">
        <SectionTitle id="achievements-heading">
          <MaskedLines lines={['Credits', '& awards']} lineClassName="text-heading" />
        </SectionTitle>
      </div>

      <div className="mt-14 border-t border-line lg:mt-20">
        {awards.map((award, i) => (
          <motion.article
            key={award._id || i}
            className="group grid grid-cols-1 gap-x-10 gap-y-3 border-b border-line py-8 sm:grid-cols-[6rem_1fr] sm:py-10"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.75, ease: EASE, delay: Math.min(i * 0.07, 0.3) }}
          >
            <div className="flex items-start gap-3 sm:block">
              <span className="font-display text-[1.6rem] leading-none text-gilt">
                {String(i + 1).padStart(2, '0')}
              </span>
              {award.year && (
                <span className="text-[0.72rem] uppercase tracking-[0.14em] text-clay sm:mt-3 sm:block">
                  {award.year}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="font-display text-[clamp(1.4rem,2.6vw,2.05rem)] leading-tight text-ink">
                {award.title}
              </h3>

              {award.subtitle && (
                <p className="mt-2 max-w-measure text-[1rem] italic leading-snug text-cocoa/85">
                  {award.subtitle}
                </p>
              )}

              {award.event && (
                <p className="mt-3 max-w-measure text-[0.88rem] leading-relaxed text-clay">{award.event}</p>
              )}

              {award.description && (
                <p className="mt-3 max-w-measure text-[0.92rem] leading-relaxed text-cocoa/75">
                  {award.description}
                </p>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}