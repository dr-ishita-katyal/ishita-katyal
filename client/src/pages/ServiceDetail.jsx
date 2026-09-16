import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { applySeo, setRobots, buildStructuredData, injectStructuredData } from '../lib/seo';
import { slugify, findBySlug } from '../lib/slug';
import { cdn, cdnSrcSet } from '../lib/cloudinary';
import { EASE, viewportOnce } from '../lib/motion';
import { Reveal, ImageReveal } from '../components/ui/Reveal';
import Nav from '../components/site/Nav';
import Contact from '../components/site/Contact';
import Footer from '../components/site/Footer';
import ScrollProgress from '../components/ui/ScrollProgress';

const CATEGORY_COPY = {
  Reconstructive: 'Restoring form and function after cancer surgery, trauma and burns.',
  Aesthetic: 'Refining proportion and contour, surgically and non-surgically.',
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const reduce = useReducedMotion();
  const { profile, contact, settings, expertise, education } = useSite();

  const item = findBySlug(expertise, slug);
  const related = expertise
    .filter((e) => e.category === item?.category && slugify(e.title) !== slug)
    .slice(0, 4);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!item) {
      setRobots('noindex, follow');
      return;
    }
    setRobots('index, follow');
    applySeo({
      title: `${item.title} | ${profile?.name || settings?.doctorName}`,
      description:
        item.description || CATEGORY_COPY[item.category] || `${item.title} — an area of Dr. Ishita Katyal's practice.`,
      canonicalUrl: settings?.canonicalUrl
        ? `${settings.canonicalUrl.replace(/\/$/, '')}/services/${slug}`
        : undefined,
      ogImage: item.image?.url || settings?.ogImage?.url || profile?.profileImage?.url,
      favicon: settings?.favicon?.url,
    });
    injectStructuredData(buildStructuredData({ profile, contact, settings, education }));
  }, [item, slug, profile, contact, settings, education]);

  if (!item) {
    return (
      <div className="relative">
        <div aria-hidden="true" className="grain-overlay" />
        <Nav name={profile?.name} title={profile?.title} appointmentUrl={contact?.appointmentUrl} />
        <main id="main" className="shell flex min-h-[70svh] flex-col items-start justify-center pt-[var(--nav-h)]">
          <p className="marker mb-4">Services</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] text-ink">That area could not be found</h1>
          <p className="mt-3 max-w-[42ch] text-[0.95rem] leading-relaxed text-clay">
            It may have been renamed or removed. See the full list of areas of expertise instead.
          </p>
          <Link to="/services" className="btn-solid mt-8">
            <span>View all services</span>
          </Link>
        </main>
        <Footer profile={profile} contact={contact} settings={settings} />
      </div>
    );
  }

  const bookHref = contact?.appointmentUrl || (contact?.email ? `mailto:${contact.email}` : '#contact');

  return (
    <div className="relative">
      <div aria-hidden="true" className="grain-overlay" />
      <ScrollProgress />
      <Nav name={profile?.name} title={profile?.title} appointmentUrl={contact?.appointmentUrl} />

      <main id="main">
        <section className="relative bg-ivory pb-4 pt-[calc(var(--nav-h)+3.5rem)]">
          <div className="shell">
            <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-[0.75rem] text-clay">
              <Link to="/services" className="link-wipe inline-flex items-center gap-1.5 text-clay hover:text-ink">
                <ArrowLeft className="h-3.5 w-3.5" />
                Services
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-cocoa">{item.category}</span>
            </nav>

            <motion.p
              className="marker mb-5"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {item.category}
            </motion.p>

            <h1 className="text-title text-ink">
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1, ease: EASE, delay: 0.1 }}
                >
                  {item.title}
                </motion.span>
              </span>
            </h1>

            {item.description && (
              <Reveal as="p" delay={0.24} className="lede mt-7 max-w-[46ch]">
                {item.description}
              </Reveal>
            )}
          </div>
        </section>

        <section className="relative bg-ivory pb-section pt-10 sm:pt-14">
          <div className="shell">
            <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-12">
              <div className="lg:col-span-7 lg:pt-2">
                <div className="prose-warm">
                  <p>
                    {CATEGORY_COPY[item.category] ||
                      'An area of Dr. Ishita Katyal\u2019s plastic and reconstructive surgery training and practice.'}
                  </p>
                  <p className="text-[0.85rem] text-clay">
                    This reflects a documented area of professional training and interest, not a list of
                    procedures offered at any particular clinic. Treatment plans are determined following
                    consultation and clinical evaluation.
                  </p>
                </div>

                <Reveal delay={0.15} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <a
                    href={bookHref}
                    {...(contact?.appointmentUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="btn-solid"
                  >
                    <span>Book a consultation</span>
                  </a>
                  <Link to="/services" className="btn-outline">
                    <span>All services</span>
                  </Link>
                </Reveal>
              </div>

              <div className="lg:col-span-5">
                {item.image?.url ? (
                  <ImageReveal
                    src={cdn(item.image.url, { width: 800, crop: 'limit' })}
                    srcSet={cdnSrcSet(item.image.url, [480, 700, 800])}
                    sizes="(max-width: 1023px) 92vw, 34vw"
                    alt={item.image.alt || item.title}
                    className="aspect-[4/5] bg-sand"
                  />
                ) : (
                  <div className="flex aspect-[4/5] items-end border border-line bg-sand/60 p-7">
                    <p className="font-display text-[1.5rem] leading-tight text-cocoa/70">{item.title}</p>
                  </div>
                )}
              </div>
            </div>

            {related.length > 0 && (
              <div className="mt-20 border-t border-line pt-12 lg:mt-24">
                <p className="marker mb-6">Related areas</p>
                <ul className="grid grid-cols-1 gap-x-8 gap-y-0 sm:grid-cols-2">
                  {related.map((r, i) => (
                    <motion.li
                      key={r._id || r.title}
                      className="border-b border-hairline"
                      initial={reduce ? false : { opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={viewportOnce}
                      transition={{ duration: 0.55, ease: EASE, delay: Math.min(i * 0.06, 0.3) }}
                    >
                      <Link
                        to={`/services/${slugify(r.title)}`}
                        className="group flex items-center justify-between gap-4 py-4 text-ink transition-[padding] duration-500 ease-silk hover:pl-2"
                      >
                        <span className="font-display text-[1.15rem]">{r.title}</span>
                        <ArrowLeft className="h-4 w-4 rotate-180 text-clay transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <Contact contact={contact} />
      </main>

      <Footer profile={profile} contact={contact} settings={settings} />
    </div>
  );
}