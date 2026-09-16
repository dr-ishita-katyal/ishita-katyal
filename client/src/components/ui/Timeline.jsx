import { useRef } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { EASE, viewportOnce } from '../../lib/motion';

/**
 * One timeline used by education, experience and specialist training.
 * The spine fills as the reader scrolls, so progress through a career reads as
 * physical progress down the page.
 *
 * items: [{ id, period, title, subtitle, meta, description, muted }]
 */
export default function Timeline({ items = [] }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 78%', 'end 55%'],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });

  if (!items.length) return null;

  return (
    <div ref={ref} className="relative">
      {/* Spine */}
      <div aria-hidden="true" className="absolute bottom-0 left-[7px] top-2 w-px bg-line sm:left-[calc(9rem+7px)] lg:left-[calc(11rem+7px)]">
        {!reduce && (
          <motion.span className="absolute inset-0 origin-top bg-umber" style={{ scaleY }} />
        )}
      </div>

      <ol className="space-y-0">
        {items.map((item, i) => (
          <motion.li
            key={item.id || i}
            className="relative pl-9 sm:pl-[calc(9rem+2.5rem)] lg:pl-[calc(11rem+2.5rem)]"
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.75, ease: EASE, delay: Math.min(i * 0.06, 0.3) }}
          >
            <div className={`border-b border-hairline py-7 sm:py-9 ${i === 0 ? 'border-t' : ''}`}>
              {/* Node */}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-[2.15rem] block h-[15px] w-[15px] rounded-full border sm:left-[9rem] lg:left-[11rem] sm:top-[2.6rem] ${
                  item.muted ? 'border-clay/40 bg-ivory' : 'border-umber bg-ivory'
                }`}
              >
                <span
                  className={`absolute left-1/2 top-1/2 block h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full ${
                    item.muted ? 'bg-clay/40' : 'bg-umber'
                  }`}
                />
              </span>

              {/* Period — sits in the left rail on larger screens. */}
              {item.period && (
                <p className="absolute left-0 top-7 hidden w-[8rem] pr-6 text-right text-[0.7rem] uppercase tracking-[0.12em] text-clay sm:block sm:top-9 lg:w-[10rem]">
                  {item.period}
                </p>
              )}

              {item.eyebrow && <p className="marker mb-2">{item.eyebrow}</p>}

              <h3 className="font-display text-[clamp(1.3rem,2.4vw,1.85rem)] leading-tight text-ink">
                {item.title}
              </h3>

              {item.subtitle && (
                <p className="mt-1.5 text-[0.95rem] leading-snug text-cocoa/85">{item.subtitle}</p>
              )}

              {item.meta && <p className="mt-1 text-[0.85rem] text-clay">{item.meta}</p>}

              {item.period && (
                <p className="mt-2.5 text-[0.7rem] uppercase tracking-[0.12em] text-clay sm:hidden">
                  {item.period}
                </p>
              )}

              {item.description && (
                <p className="mt-3.5 max-w-measure text-[0.92rem] leading-relaxed text-cocoa/75">
                  {item.description}
                </p>
              )}
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
