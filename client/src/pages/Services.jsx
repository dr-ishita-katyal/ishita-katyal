import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useSite } from '../context/SiteContext';
import { applySeo, setRobots, buildStructuredData, injectStructuredData } from '../lib/seo';
import { slugify } from '../lib/slug';
import { cdn } from '../lib/cloudinary';
import { EASE, viewportOnce } from '../lib/motion';
import { Reveal, MaskedLines } from '../components/ui/Reveal';
import Nav from '../components/site/Nav';
import Contact from '../components/site/Contact';
import Footer from '../components/site/Footer';
import ScrollProgress from '../components/ui/ScrollProgress';

export default function Services() {
  const reduce = useReducedMotion();
  const { profile, contact, settings, expertise, education } = useSite();
  const [active, setActive] = useState(null);

  const featured = expertise.filter((e) => e.featured);
  const activeItem = featured.find((f) => f._id === active);

  useEffect(() => {
    setRobots('index, follow');
    applySeo({
      title: `Services | ${settings?.siteTitle || profile?.name}`,
      description:
        'Areas of plastic, reconstructive and aesthetic surgery that Dr. Ishita Katyal has trained and practised in.',
      canonicalUrl: settings?.canonicalUrl ? `${settings.canonicalUrl.replace(/\/$/, '')}/services` : undefined,
      ogImage: settings?.ogImage?.url || profile?.profileImage?.url,
      favicon: settings?.favicon?.url,
    });
    injectStructuredData(buildStructuredData({ profile, contact, settings, education }));
    window.scrollTo(0, 0);
  }, [profile, contact, settings, education]);

  return (
    <div className="relative">
      <div aria-hidden="true" className="grain-overlay" />
      <ScrollProgress />
      <Nav name={profile?.name} title={profile?.title} appointmentUrl={contact?.appointmentUrl} />

      <main id="main">
        {/* ---- Page header ---- */}
        <section className="relative bg-ivory pb-4 pt-[calc(var(--nav-h)+3.5rem)]">
          <div className="shell">
            <p className="marker mb-6">Services</p>
            <h1 className="text-title text-ink">
              <MaskedLines lines={['Areas of', 'expertise']} lineClassName="text-title" />
            </h1>
            <Reveal as="p" delay={0.12} className="lede mt-7 max-w-[46ch]">
              The areas of plastic, reconstructive and aesthetic surgery her specialist training and
              practice have concentrated on. Select an area to read more.
            </Reveal>
          </div>
        </section>

        {/* ---- Numbered index + preview ---- */}
        <section className="relative bg-ivory py-section" aria-label="Areas of expertise">
          <div className="shell">
            <div className="grid grid-cols-1 gap-x-12 lg:grid-cols-12">
              <div className="hidden lg:col-span-5 lg:block">
                <div className="relative sticky top-[calc(var(--nav-h)+3rem)] aspect-[4/5] w-full max-w-[19rem]">
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
                          {activeItem?.title || 'Select an area'}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="lg:col-span-7">
                <ol className="border-t border-line" onMouseLeave={() => setActive(null)}>
                  {featured.map((item, i) => (
                    <motion.li
                      key={item._id || item.title}
                      className="group relative border-b border-line"
                      onMouseEnter={() => setActive(item._id)}
                      initial={reduce ? false : { opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={viewportOnce}
                      transition={{ duration: 0.65, ease: EASE, delay: Math.min(i * 0.05, 0.3) }}
                    >
                      <Link
                        to={`/services/${slugify(item.title)}`}
                        onFocus={() => setActive(item._id)}
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
                      </Link>

                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-umber transition-transform duration-[900ms] ease-silk group-hover:scale-x-100 group-focus-within:scale-x-100"
                      />
                    </motion.li>
                  ))}
                </ol>

                <Reveal as="p" delay={0.1} className="mt-10 max-w-measure text-[0.8rem] leading-relaxed text-clay">
                  {/* These reflect documented areas of professional training and interest, not a list of
                  procedures offered at any particular clinic. */}
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <Contact contact={contact} />
      </main>

      <Footer profile={profile} contact={contact} settings={settings} />
    </div>
  );
}