import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Section, SectionTitle } from '../ui/Section';
import { Reveal, MaskedLines } from '../ui/Reveal';
import { EASE } from '../../lib/motion';
import { cdn, cdnSrcSet } from '../../lib/cloudinary';

export default function About({ profile }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);

  const heading = profile?.aboutHeading || 'A surgical practice rooted in precision';
  const headingLines = heading.split(/\s+/).length > 4 ? splitInTwo(heading) : [heading];
  const paragraphs = (profile?.longBio || '').split(/\n{2,}/).filter(Boolean);
  const image = profile?.aboutImage?.url || profile?.profileImage?.url || '/images/dr-ishita-katyal.jpg';

  return (
    <Section id="about" index="01" label="About Dr. Katyal" tone="ivory">
      <div ref={ref} className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12">
        {/* Portrait sits first on desktop, second on mobile so the words lead. */}
        <div className="order-2 lg:order-1 lg:col-span-5">
          <div className="relative lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
            <motion.div
              className="relative overflow-hidden bg-sand"
              initial={reduce ? false : { clipPath: 'inset(0% 0% 100% 0%)' }}
              whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.2, ease: EASE }}
            >
              <motion.img
                src={cdn(image, { width: 900, crop: 'limit' })}
                srcSet={cdnSrcSet(image, [480, 768, 900])}
                sizes="(max-width: 1023px) 92vw, 34vw"
                alt={profile?.aboutImage?.alt || profile?.name || 'Portrait'}
                loading="lazy"
                decoding="async"
                className="block w-full scale-[1.06] object-cover"
                style={reduce ? undefined : { y: imgY }}
              />
            </motion.div>

            <span aria-hidden="true" className="absolute -bottom-3 -right-3 h-24 w-24 border-b border-r border-umber/30" />

            {profile?.quote && (
              <Reveal delay={0.15} className="mt-8 border-l border-umber/40 pl-5">
                <p className="font-display text-[1.35rem] italic leading-[1.35] text-cocoa sm:text-[1.55rem]">
                  “{profile.quote}”
                </p>
              </Reveal>
            )}
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-7 lg:pt-2">
          <SectionTitle id="about-heading">
            <MaskedLines lines={headingLines} lineClassName="text-heading" />
          </SectionTitle>

          <Reveal delay={0.12} className="mt-8 h-px w-16 bg-umber/50" />

          <div className="prose-warm mt-8">
            {paragraphs.map((p, i) => (
              <Reveal key={i} as="p" delay={0.08 + i * 0.06} y={18}>
                {p}
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/** Splits a heading near the middle so both lines carry similar weight. */
function splitInTwo(text) {
  const words = text.split(/\s+/);
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}
