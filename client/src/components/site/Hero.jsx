import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { EASE } from '../../lib/motion';
import { cdn, cdnSrcSet } from '../../lib/cloudinary';

/** "Dr. Ishita Katyal" → { honorific: 'Dr.', lines: ['Ishita', 'Katyal'] } */
function splitName(raw = '') {
  const match = raw.match(/^(dr\.?|prof\.?)\s+/i);
  const honorific = match ? match[1] : '';
  const rest = (match ? raw.slice(match[0].length) : raw).trim();
  const words = rest.split(/\s+/).filter(Boolean);
  const lines = words.length > 1 ? [words.slice(0, -1).join(' '), words[words.length - 1]] : [rest];
  return { honorific, lines };
}

/** Breaks the professional title at the ampersand so it sets as two balanced lines. */
function splitTitle(raw = '') {
  const idx = raw.indexOf('&');
  if (idx < 0) return [raw];
  return [raw.slice(0, idx).trim().replace(/,$/, ''), raw.slice(idx).trim()];
}

export default function Hero({ profile, appointmentUrl }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const portraitY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const frameY = useTransform(scrollYProgress, [0, 1], ['0%', '-6%']);

  const { honorific, lines } = splitName(profile?.heroHeading || profile?.name);
  const titleLines = splitTitle(profile?.title || '');
  const credentials = (profile?.credentials || []).filter((c) => c?.abbr);

  const portrait = profile?.profileImage?.url || '/images/dr-ishita-katyal.jpg';
  const portraitAlt = profile?.profileImage?.alt || `Portrait of ${profile?.name || 'the surgeon'}`;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // One orchestrated page-load sequence; everything below the fold waits for scroll.
  const seq = (delay) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay } };

  const maskLine = (delay) =>
    reduce
      ? {}
      : { initial: { y: '112%' }, animate: { y: '0%' }, transition: { duration: 1.05, ease: EASE, delay } };

  return (
    <section id="home" ref={ref} className="relative overflow-hidden bg-ivory" aria-label="Introduction">
      {/* Warm wash anchoring the portrait side of the composition. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] bg-gradient-to-l from-sand via-sand/55 to-transparent lg:block"
      />

      <div className="shell relative">
        <div className="grid grid-cols-1 items-center gap-x-10 gap-y-12 pb-16 pt-[calc(var(--nav-h)+3rem)] lg:min-h-[100svh] lg:grid-cols-12 lg:gap-y-0 lg:pb-24 lg:pt-[calc(var(--nav-h)+2rem)]">
          {/* ---- Type column ---- */}
          <div className="relative lg:col-span-6 lg:pr-10">
            <motion.p className="marker mb-6 lg:mb-8" {...seq(0.15)}>
              {profile?.heroEyebrow || 'Plastic · Reconstructive · Aesthetic Surgery'}
            </motion.p>

            <h1 className="text-ink">
              {honorific && (
                <span className="mb-1 block overflow-hidden">
                  <motion.span
                    className="block font-display text-[1.15rem] italic tracking-wide text-clay sm:text-[1.35rem]"
                    {...maskLine(0.22)}
                  >
                    {honorific}
                  </motion.span>
                </span>
              )}
              {lines.map((line, i) => (
                <span key={line + i} className="block overflow-hidden">
                  <motion.span className="block text-display" {...maskLine(0.3 + i * 0.09)}>
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.div className="mt-7 flex items-start gap-4 lg:mt-9" {...seq(0.58)}>
              <span aria-hidden="true" className="mt-3 h-px w-10 shrink-0 bg-umber/60 sm:w-14" />
              <p className="font-display text-[1.25rem] leading-[1.3] text-cocoa sm:text-[1.5rem]">
                {titleLines.map((l, i) => (
                  <span key={i} className="block">
                    {l}
                  </span>
                ))}
              </p>
            </motion.div>

            <motion.p className="lede mt-7 max-w-[46ch]" {...seq(0.68)}>
              {profile?.heroSubtitle}
            </motion.p>

            <motion.div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4" {...seq(0.78)}>
              <a
                href={appointmentUrl || '#contact'}
                onClick={
                  appointmentUrl
                    ? undefined
                    : (e) => {
                        e.preventDefault();
                        scrollTo('contact');
                      }
                }
                {...(appointmentUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="btn-solid"
              >
                <span>Book a consultation</span>
              </a>

              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('about');
                }}
                className="btn-outline"
              >
                <span>Explore her journey</span>
              </a>
            </motion.div>
          </div>

          {/* ---- Portrait column ---- */}
          <div className="relative lg:col-span-6">
            <motion.div className="relative mx-auto max-w-[30rem] lg:max-w-none" style={reduce ? undefined : { y: frameY }}>
              {/* Offset frame: a thin rule stepped away from the portrait. */}
              <motion.span
                aria-hidden="true"
                className="absolute -right-3 -top-4 bottom-6 left-8 border border-umber/25 sm:-right-5 sm:-top-6 sm:left-12"
                initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
              />

              <motion.div
                className="relative overflow-hidden bg-cream"
                initial={reduce ? false : { clipPath: 'inset(0% 0% 100% 0%)' }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                transition={{ duration: 1.4, ease: EASE, delay: 0.32 }}
              >
                <motion.div style={reduce ? undefined : { y: portraitY }} className="relative">
                  <img
                    src={cdn(portrait, { width: 1000, crop: 'limit' })}
                    srcSet={cdnSrcSet(portrait, [480, 768, 1000, 1400])}
                    sizes="(max-width: 1023px) 92vw, 46vw"
                    alt={portraitAlt}
                    width="928"
                    height="936"
                    fetchPriority="high"
                    decoding="async"
                    className="block w-full object-cover"
                  />
                </motion.div>

                {/* Very faint warm veil so the cutout sits into the page rather than on it. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sand/45 via-transparent to-transparent"
                />
              </motion.div>

              {/* Vertical spine label — the precision motif, set as running type. */}
              <motion.span
                aria-hidden="true"
                className="absolute -left-2 top-10 hidden text-[0.6rem] uppercase tracking-[0.34em] text-clay lg:block"
                style={{ writingMode: 'vertical-rl' }}
                initial={reduce ? false : { opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 0.9 }}
              >
                Plastic • Reconstructive • Aesthetic Surgery
              </motion.span>

              {/* Credential badge overlapping the portrait's lower edge. */}
              {credentials.length > 0 && (
                <motion.div
                  className="absolute -bottom-6 left-0 border border-line bg-cream/95 px-5 py-3 backdrop-blur-[2px] sm:-left-6 sm:px-6 sm:py-4"
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 1 }}
                >
                  <p className="font-display text-[1.05rem] leading-none text-ink sm:text-[1.2rem]">
                    {credentials.map((c) => c.abbr).join('  ·  ')}
                  </p>
                  <p className="mt-2 text-[0.58rem] uppercase tracking-[0.2em] text-clay">
                    {profile?.credentialsNote || 'Plastic & Reconstructive Surgery'}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* ---- Scroll cue ---- */}
        <motion.button
          type="button"
          onClick={() => scrollTo('credentials')}
          className="group absolute bottom-6 left-gutter hidden items-center gap-3 text-[0.62rem] uppercase tracking-[0.22em] text-clay transition-colors hover:text-ink lg:flex"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.25 }}
        >
          <span className="relative block h-9 w-px overflow-hidden bg-line">
            {!reduce && (
              <motion.span
                className="absolute inset-x-0 top-0 h-3 bg-umber"
                animate={{ y: [-12, 36] }}
                transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.5 }}
              />
            )}
          </span>
          Scroll
        </motion.button>
      </div>
    </section>
  );
}
