import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Section, SectionTitle } from '../ui/Section';
import { Reveal, MaskedLines } from '../ui/Reveal';
import { EASE, viewportOnce } from '../../lib/motion';

export default function Publications({ publications = [] }) {
  const reduce = useReducedMotion();
  if (!publications.length) return null;

  return (
    <Section id="publications" index="07" label="Publications" tone="ivory">
      <div className="max-w-measure">
        <SectionTitle id="publications-heading">
          <MaskedLines lines={['Published', 'work']} lineClassName="text-heading" />
        </SectionTitle>
        <Reveal as="p" delay={0.1} className="lede mt-6">
          Peer-reviewed contributions in plastic and reconstructive surgery.
        </Reveal>
      </div>

      <div className="mt-14 border-t border-line lg:mt-20">
        {publications.map((pub, i) => {
          const Wrapper = pub.externalLink ? 'a' : 'div';
          const linkProps = pub.externalLink
            ? { href: pub.externalLink, target: '_blank', rel: 'noopener noreferrer' }
            : {};

          return (
            <motion.article
              key={pub._id || i}
              className="border-b border-line"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.75, ease: EASE, delay: Math.min(i * 0.07, 0.3) }}
            >
              <Wrapper
                {...linkProps}
                className={`group block py-8 transition-[padding] duration-500 ease-silk sm:py-10 ${
                  pub.externalLink ? 'hover:pl-3 focus-visible:pl-3' : ''
                }`}
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  {pub.year && (
                    <span className="font-display text-[1.15rem] text-umber">{pub.year}</span>
                  )}
                  {pub.publicationType && (
                    <span className="text-[0.62rem] uppercase tracking-[0.18em] text-clay">
                      {pub.publicationType}
                    </span>
                  )}
                </div>

                <h3 className="mt-3 flex items-start gap-3 font-display text-[clamp(1.25rem,2.3vw,1.8rem)] leading-tight text-ink">
                  <span className="min-w-0">{pub.title}</span>
                  {pub.externalLink && (
                    <ArrowUpRight
                      aria-hidden="true"
                      className="mt-1 h-5 w-5 shrink-0 text-clay transition-transform duration-500 ease-silk group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-umber"
                    />
                  )}
                </h3>

                {pub.authors && (
                  <p className="mt-3 max-w-measure text-[0.88rem] leading-relaxed text-cocoa/80">
                    {pub.authors}
                  </p>
                )}

                {pub.journal && (
                  <p className="mt-1.5 max-w-measure text-[0.88rem] italic text-clay">{pub.journal}</p>
                )}

                {pub.description && (
                  <p className="mt-3 max-w-measure text-[0.85rem] leading-relaxed text-clay">
                    {pub.description}
                  </p>
                )}
              </Wrapper>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}