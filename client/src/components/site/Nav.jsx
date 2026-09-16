import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE } from '../../lib/motion';

const LINKS = [
  { id: 'about', label: 'About', type: 'anchor' },
  { id: 'services', label: 'Services', type: 'route', to: '/services' },
  { id: 'journey', label: 'Journey', type: 'anchor' },
  { id: 'achievements', label: 'Achievements', type: 'anchor' },
  { id: 'publications', label: 'Publications', type: 'anchor' },
];

export default function Nav({ name = 'Dr. Ishita Katyal', title, appointmentUrl }) {
  const reduce = useReducedMotion();
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlights whichever section currently occupies the middle of the viewport.
  // Only anchor links live on this page; the Services route is matched separately.
  useEffect(() => {
    if (!onHome) return;
    const targets = LINKS.filter((l) => l.type === 'anchor')
      .map((l) => document.getElementById(l.id))
      .filter(Boolean);
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [onHome]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Scrolls to a homepage section. From another route, navigates home first
  // and hands off the target via location state so Home can finish the scroll.
  const go = useCallback(
    (id) => {
      setOpen(false);
      if (!onHome) {
        navigate('/', { state: { scrollTo: id } });
        return;
      }
      const el = document.getElementById(id);
      if (!el) return;
      requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    },
    [onHome, navigate]
  );

  const bookHref = appointmentUrl || (onHome ? '#contact' : undefined);
  const bookOnClick = appointmentUrl
    ? undefined
    : (e) => {
        e.preventDefault();
        go('contact');
      };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-5 focus:py-3 focus:text-xs focus:uppercase focus:tracking-[0.16em] focus:text-ivory"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-700 ease-silk ${
          scrolled || open
            ? 'border-b border-line bg-ivory/92 backdrop-blur-[6px]'
            : 'border-b border-transparent bg-transparent'
        }`}
        style={{ height: 'var(--nav-h)' }}
      >
        <nav className="shell flex h-full items-center justify-between gap-6" aria-label="Primary">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              go('home');
            }}
            className="group flex min-w-0 flex-col leading-none"
          >
            <span className="font-display text-[1.05rem] tracking-[0.02em] text-ink sm:text-[1.2rem]">
              {name}
            </span>
            <span className="mt-0.5 hidden text-[0.6rem] uppercase tracking-[0.2em] text-clay sm:block">
              {title}
            </span>
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {LINKS.map((link) => {
              const isCurrent = link.type === 'route' ? location.pathname.startsWith(link.to) : active === link.id;
              const underline = (
                <span
                  className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-umber transition-transform duration-500 ease-silk ${
                    isCurrent ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              );
              const className =
                'group relative block py-2 text-[0.78rem] font-medium tracking-[0.06em] text-cocoa transition-colors duration-300 hover:text-ink';

              return (
                <li key={link.id}>
                  {link.type === 'route' ? (
                    <Link to={link.to} aria-current={isCurrent ? 'true' : undefined} className={className}>
                      {link.label}
                      {underline}
                    </Link>
                  ) : (
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        go(link.id);
                      }}
                      aria-current={isCurrent ? 'true' : undefined}
                      className={className}
                    >
                      {link.label}
                      {underline}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={bookHref}
              onClick={bookOnClick}
              {...(appointmentUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="btn-solid hidden !px-6 !py-3 text-[0.68rem] sm:inline-flex"
            >
              <span>Book a consultation</span>
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="relative flex h-12 w-12 items-center justify-center lg:hidden"
            >
              <span className="flex h-4 w-6 flex-col justify-between">
                <span
                  className={`block h-px w-full bg-ink transition-transform duration-500 ease-silk ${
                    open ? 'translate-y-[7.5px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`block h-px w-full bg-ink transition-opacity duration-300 ${
                    open ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`block h-px w-full bg-ink transition-transform duration-500 ease-silk ${
                    open ? '-translate-y-[7.5px] -rotate-45' : ''
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 bg-ivory lg:hidden"
            initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="shell flex h-full flex-col justify-between pb-10 pt-[calc(var(--nav-h)+2rem)]">
              <ul className="flex flex-col">
                {LINKS.map((link, i) => {
                  const rowContent = (
                    <>
                      <span className="w-6 font-display text-sm text-umber">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-[2rem] leading-none text-ink">{link.label}</span>
                    </>
                  );
                  const motionProps = {
                    className: 'flex items-baseline gap-4 py-4',
                    initial: reduce ? false : { y: '100%', opacity: 0 },
                    animate: { y: 0, opacity: 1 },
                    transition: { duration: 0.6, ease: EASE, delay: 0.14 + i * 0.06 },
                  };

                  return (
                    <li key={link.id} className="overflow-hidden border-b border-hairline">
                      {link.type === 'route' ? (
                        <motion.div {...motionProps}>
                          <Link to={link.to} onClick={() => setOpen(false)} className="flex items-baseline gap-4">
                            {rowContent}
                          </Link>
                        </motion.div>
                      ) : (
                        <motion.a
                          href={`#${link.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            go(link.id);
                          }}
                          {...motionProps}
                        >
                          {rowContent}
                        </motion.a>
                      )}
                    </li>
                  );
                })}
              </ul>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.42 }}
                className="mt-10"
              >
                <a
                  href={bookHref}
                  onClick={appointmentUrl ? () => setOpen(false) : bookOnClick}
                  {...(appointmentUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="btn-solid w-full"
                >
                  <span>Book a consultation</span>
                </a>
                <p className="mt-6 text-[0.68rem] uppercase tracking-[0.2em] text-clay">{title}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}