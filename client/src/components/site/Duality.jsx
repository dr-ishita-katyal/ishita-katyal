import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Section, SectionTitle } from '../ui/Section';
import { Reveal, MaskedLines } from '../ui/Reveal';
import { EASE, viewportOnce } from '../../lib/motion';
import { slugify } from '../../lib/slug';

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
          Reconstructive and aesthetic surgery draw on one body of technique. These are the areas my
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
                <li key={title + idx} className="border-b border-hairline first:border-t">
                  <Link
                    to={`/services/${slugify(title)}`}
                    className="group/item flex items-baseline justify-between gap-3 py-3 transition-[padding] duration-500 ease-silk hover:pl-2"
                  >
                    <span className="flex items-baseline gap-3">
                      <span
                        aria-hidden="true"
                        className={`mt-1 block h-1 w-1 shrink-0 rounded-full transition-colors duration-500 ${
                          hovered === panel.key ? 'bg-umber' : 'bg-clay/40'
                        }`}
                      />
                      <span className="text-[0.98rem] text-cocoa transition-colors duration-300 group-hover/item:text-ink">
                        {title}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0 text-clay opacity-0 transition-all duration-300 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 group-hover/item:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="mt-14 flex justify-center">
        <Link
          to="/services"
          className="group/cta inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-umber px-7 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-umber transition-colors duration-500 ease-silk hover:bg-umber hover:text-ivory focus-visible:bg-umber focus-visible:text-ivory"
        >
          View all services
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-500 ease-silk group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
          />
        </Link>
      </div>
    </Section>
  );
}