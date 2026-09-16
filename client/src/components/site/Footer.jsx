import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { EASE } from '../../lib/motion';

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'journey', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'achievements', label: 'Awards' },
  { id: 'publications', label: 'Publications' },
  { id: 'contact', label: 'Contact' },
];

export default function Footer({ profile, contact, settings }) {
  const [panel, setPanel] = useState(null); // 'privacy' | null
  const year = new Date().getFullYear();

  const socials = [
    contact?.instagram && { label: 'Instagram', href: contact.instagram },
    contact?.linkedin && { label: 'LinkedIn', href: contact.linkedin },
    ...((contact?.otherLinks || []).filter((l) => l?.url).map((l) => ({ label: l.label || 'Link', href: l.url }))),
  ].filter(Boolean);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <footer className="relative bg-cocoa text-ivory">
      <div className="shell">
        <div className="grid grid-cols-1 gap-x-12 gap-y-12 pb-12 pt-section lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-display text-[clamp(1.8rem,3.6vw,2.6rem)] leading-tight">
              {settings?.doctorName || profile?.name}
            </p>
            <p className="mt-3 max-w-[32ch] text-[0.85rem] leading-relaxed text-ivory/65">
              {settings?.footerText || profile?.title}
            </p>
          </div>

          <nav className="lg:col-span-4" aria-label="Footer">
            <p className="text-[0.62rem] uppercase tracking-[0.22em] text-ivory/45">Sections</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.id);
                    }}
                    className="link-wipe text-[0.88rem] text-ivory/80 hover:text-ivory"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="text-[0.62rem] uppercase tracking-[0.22em] text-ivory/45">Get in touch</p>
            <ul className="mt-5 space-y-3">
              {contact?.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className="link-wipe text-[0.88rem] text-ivory/80 hover:text-ivory">
                    {contact.email}
                  </a>
                </li>
              )}
              {contact?.phone && (
                <li>
                  <a
                    href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
                    className="link-wipe text-[0.88rem] text-ivory/80 hover:text-ivory"
                  >
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact?.clinicAddress && (
                <li className="max-w-[26ch] text-[0.85rem] leading-relaxed text-ivory/65">
                  {contact.clinicAddress}
                </li>
              )}
              {!contact?.email && !contact?.phone && !contact?.clinicAddress && (
                <li className="max-w-[26ch] text-[0.85rem] leading-relaxed text-ivory/55">
                  Contact details will be listed here shortly.
                </li>
              )}
            </ul>

            {socials.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-wipe text-[0.8rem] text-ivory/70 hover:text-ivory"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {settings?.medicalDisclaimer && (
          <p className="max-w-[80ch] border-t border-ivory/12 pt-8 text-[0.76rem] leading-relaxed text-ivory/50">
            {settings.medicalDisclaimer}
          </p>
        )}

        <div className="flex flex-col gap-4 border-t border-ivory/12 py-7 text-[0.72rem] text-ivory/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings?.doctorName || profile?.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {settings?.privacyPolicy && (
              <button type="button" onClick={() => setPanel('privacy')} className="link-wipe hover:text-ivory/80">
                Privacy policy
              </button>
            )}
            <a href="/admin/login" className="link-wipe hover:text-ivory/80">
              Admin
            </a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {panel === 'privacy' && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/80 p-0 sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setPanel(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Privacy policy"
          >
            <motion.div
              className="max-h-[80vh] w-full max-w-2xl overflow-y-auto bg-ivory p-8 text-ink sm:p-10"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-6">
                <h2 className="font-display text-[1.8rem] leading-tight">Privacy policy</h2>
                <button
                  type="button"
                  onClick={() => setPanel(null)}
                  aria-label="Close"
                  className="-mr-2 -mt-2 flex h-11 w-11 items-center justify-center text-clay hover:text-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="prose-warm mt-6">
                {settings.privacyPolicy.split(/\n{2,}/).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
