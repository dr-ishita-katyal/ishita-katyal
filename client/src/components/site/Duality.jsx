import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Section, SectionTitle } from '../ui/Section';
import { Reveal, MaskedLines } from '../ui/Reveal';
import { EASE, viewportOnce } from '../../lib/motion';

const COPY = {
  Reconstructive: 'Restoring form and function after cancer surgery, trauma and burns.',
  Aesthetic: 'Refining proportion and contour, surgically and non-surgically.',
};

export default function Duality({ expertise = [] }) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(null);

  const byCategory = (category) =>
    expertise.filter((item) => item.category === category && item.featured).map((item) => item.title);

  const panels = [
    { key: 'Reconstructive', items: byCategory('Reconstructive') },
    { key: 'Aesthetic', items: byCategory('Aesthetic') },
  ].filter((p) => p.items.length);

  if (!panels.length) return null;

  return (
    <Section id="practice" index="02" label="Two dimensions" tone="cream">
      <div className="max-w-measure">
        <SectionTitle id="practice-heading">
          <MaskedLines lines={['Two dimensions of', 'the same discipline']} lineClassName="text-heading" />
        </SectionTitle>
        <Reveal as="p" delay={0.1} className="lede mt-6">
          Reconstructive and aesthetic surgery draw on one body of technique. These are the areas her
          training and practice have centred on.
        </Reveal>
      </div>

      <div
        className="mt-14 grid grid-cols-1 border-t border-line lg:mt-20 lg:grid-cols-2"
        onMouseLeave={() => setHovered(null)}
      >
        {panels.map((panel, i) => (
          <motion.div
            key={panel.key}
            onMouseEnter={() => setHovered(panel.key)}
            className={`relative px-0 py-10 transition-colors duration-700 ease-silk lg:px-10 lg:py-14 ${
              i === 1 ? 'border-t border-line lg:border-l lg:border-t-0' : ''
            } ${hovered === panel.key ? 'bg-sand/70' : 'bg-transparent'}`}
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, ease: EASE, delay: i * 0.12 }}
          >
            {/* Hairline that grows across the panel top on hover. */}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-0 h-px w-full origin-left bg-umber transition-transform duration-[900ms] ease-silk lg:left-10 lg:w-[calc(100%-5rem)] ${
                hovered === panel.key ? 'scale-x-100' : 'scale-x-0'
              }`}
            />

            <p className="marker">{String(i + 1).padStart(2, '0')}</p>

            <h3 className="mt-4 font-display text-[clamp(2.1rem,5vw,3.4rem)] leading-[0.95] text-ink">
              {panel.key}
            </h3>

            <p className="mt-4 max-w-[34ch] text-[0.95rem] leading-relaxed text-cocoa/80">
              {COPY[panel.key]}
            </p>

            <ul className="mt-8 space-y-0">
              {panel.items.map((title, idx) => (
                <li key={title + idx} className="border-b border-hairline py-3 first:border-t">
                  <span className="flex items-baseline gap-3">
                    <span
                      aria-hidden="true"
                      className={`mt-1 block h-1 w-1 shrink-0 rounded-full transition-colors duration-500 ${
                        hovered === panel.key ? 'bg-umber' : 'bg-clay/40'
                      }`}
                    />
                    <span className="text-[0.98rem] text-cocoa">{title}</span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <Reveal as="p" delay={0.1} className="mt-8 max-w-measure text-[0.8rem] leading-relaxed text-clay">
        These reflect documented areas of professional training and interest, not a list of procedures
        offered at any particular clinic.
      </Reveal>
    </Section>
  );
}
