import { motion, useReducedMotion } from 'framer-motion';
import { EASE, viewportOnce } from '../../lib/motion';

/**
 * The four qualifications set as a measured row, divided by hairlines rather
 * than boxed into cards.
 */
export default function Credentials({ profile }) {
  const reduce = useReducedMotion();
  const items = (profile?.credentials || []).filter((c) => c?.abbr);
  if (!items.length) return null;

  return (
    <section id="credentials" className="relative border-y border-line bg-sand" aria-label="Qualifications">
      <div className="shell">
        <div className="grid grid-cols-2 lg:grid-cols-[1fr_repeat(4,minmax(0,1fr))]">
          <div className="col-span-2 flex items-center py-7 lg:col-span-1 lg:border-r lg:border-line lg:py-10 lg:pr-8">
            <p className="marker">{profile?.credentialsNote || 'Qualifications'}</p>
          </div>

          {items.map((item, i) => (
            <motion.div
              key={item.abbr + i}
              className={`flex flex-col justify-center border-t border-line py-7 lg:border-t-0 lg:py-10 lg:pl-8 ${
                i % 2 === 1 ? 'border-l pl-6 lg:pl-8' : 'pr-4'
              } ${i > 0 ? 'lg:border-l lg:border-line' : ''}`}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
            >
              <p className="font-display text-[1.9rem] leading-none text-ink sm:text-[2.4rem]">{item.abbr}</p>
              {item.label && (
                <p className="mt-2 max-w-[22ch] text-[0.72rem] leading-relaxed text-clay">{item.label}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
