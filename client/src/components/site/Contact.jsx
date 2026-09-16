import { motion, useReducedMotion } from 'framer-motion';
import { Phone, Mail, MessageCircle, MapPin, Clock, Instagram, Linkedin } from 'lucide-react';
import { Reveal, MaskedLines } from '../ui/Reveal';
import { EASE, viewportOnce } from '../../lib/motion';

/** Strips spaces and dashes so tel: and wa.me links are well formed. */
const digits = (s = '') => s.replace(/[^\d+]/g, '');

export default function Contact({ contact }) {
  const reduce = useReducedMotion();
  if (!contact) return null;

  const rows = [
    contact.phone && { icon: Phone, label: 'Telephone', value: contact.phone, href: `tel:${digits(contact.phone)}` },
    contact.email && { icon: Mail, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    contact.whatsapp && {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: contact.whatsapp,
      href: `https://wa.me/${digits(contact.whatsapp).replace(/^\+/, '')}`,
      external: true,
    },
    (contact.clinicName || contact.clinicAddress) && {
      icon: MapPin,
      label: 'Clinic',
      value: [contact.clinicName, contact.clinicAddress].filter(Boolean).join(' · '),
      href: contact.mapsLink || undefined,
      external: Boolean(contact.mapsLink),
    },
    contact.consultingHours && { icon: Clock, label: 'Consulting hours', value: contact.consultingHours },
  ].filter(Boolean);

  const socials = [
    contact.instagram && { icon: Instagram, label: 'Instagram', href: contact.instagram },
    contact.linkedin && { icon: Linkedin, label: 'LinkedIn', href: contact.linkedin },
    ...(contact.otherLinks || []).filter((l) => l?.url).map((l) => ({ label: l.label || 'Link', href: l.url })),
  ].filter(Boolean);

  const heading = contact.heading || "Let's begin the conversation";

  return (
    <section id="contact" className="relative border-t border-line bg-cream" aria-labelledby="contact-heading">
      <div className="shell">
        <div className="grid grid-cols-1 gap-x-16 gap-y-14 py-section lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="marker mb-7">Consultation</p>

            <h2 id="contact-heading" className="text-title text-ink">
              <MaskedLines lines={splitHeading(heading)} lineClassName="text-title" />
            </h2>

            <Reveal as="p" delay={0.12} className="lede mt-7">
              {contact.intro || 'For consultation and appointment enquiries, please get in touch.'}
            </Reveal>

            <Reveal delay={0.2} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              {contact.appointmentUrl ? (
                <a href={contact.appointmentUrl} target="_blank" rel="noopener noreferrer" className="btn-solid">
                  <span>Book a consultation</span>
                </a>
              ) : contact.email ? (
                <a href={`mailto:${contact.email}`} className="btn-solid">
                  <span>Book a consultation</span>
                </a>
              ) : null}

              {contact.phone && (
                <a href={`tel:${digits(contact.phone)}`} className="btn-outline">
                  <span>Call the practice</span>
                </a>
              )}
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:pt-4">
            {rows.length > 0 ? (
              <dl className="border-t border-line">
                {rows.map((row, i) => {
                  const Icon = row.icon;
                  const body = (
                    <>
                      <dt className="flex items-center gap-2.5 text-[0.68rem] uppercase tracking-[0.18em] text-clay">
                        {Icon && <Icon aria-hidden="true" className="h-3.5 w-3.5" />}
                        {row.label}
                      </dt>
                      <dd className="mt-2 font-display text-[1.25rem] leading-snug text-ink sm:text-[1.45rem]">
                        {row.value}
                      </dd>
                    </>
                  );

                  return (
                    <motion.div
                      key={row.label}
                      className="border-b border-line py-6"
                      initial={reduce ? false : { opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={viewportOnce}
                      transition={{ duration: 0.65, ease: EASE, delay: i * 0.07 }}
                    >
                      {row.href ? (
                        <a
                          href={row.href}
                          {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className="group block transition-[padding] duration-500 ease-silk hover:pl-2"
                        >
                          {body}
                        </a>
                      ) : (
                        body
                      )}
                    </motion.div>
                  );
                })}
              </dl>
            ) : (
              <Reveal className="border border-line bg-ivory p-7">
                <p className="font-display text-[1.3rem] leading-snug text-ink">
                  Contact details are being finalised.
                </p>
                <p className="mt-3 max-w-[40ch] text-[0.9rem] leading-relaxed text-clay">
                  Phone, email, WhatsApp and clinic information appear here as soon as they are added
                  in the admin panel, under Contact.
                </p>
              </Reveal>
            )}

            {socials.length > 0 && (
              <Reveal delay={0.15} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-wipe inline-flex items-center gap-2 text-[0.8rem] text-cocoa"
                    >
                      {Icon && <Icon aria-hidden="true" className="h-4 w-4" />}
                      {s.label}
                    </a>
                  );
                })}
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Breaks the CTA heading into two lines at a natural pause. */
function splitHeading(text) {
  const words = text.split(/\s+/);
  if (words.length < 4) return [text];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}
