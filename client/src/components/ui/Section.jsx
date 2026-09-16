import { motion, useReducedMotion } from 'framer-motion';
import { EASE, viewportOnce } from '../../lib/motion';

/**
 * Every major section shares one structure: a numbered marker in the left
 * margin joined to a hairline that draws itself downward. The numbering is
 * honest here — the page is a sequence, read top to bottom.
 */
export function Section({ id, index, label, children, className = '', tone = 'ivory' }) {
  const bg = tone === 'sand' ? 'bg-sand' : tone === 'cream' ? 'bg-cream' : 'bg-ivory';

  return (
    <section id={id} className={`relative ${bg} ${className}`} aria-labelledby={id ? `${id}-heading` : undefined}>
      <div className="shell">
        <div className="grid grid-cols-1 gap-y-3 py-section lg:grid-cols-[7rem_1fr] lg:gap-x-12">
          {(index || label) && <SectionMarker index={index} label={label} />}
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </section>
  );
}

function SectionMarker({ index, label }) {
  const reduce = useReducedMotion();

  return (
    <div className="flex items-center gap-3 lg:sticky lg:top-[calc(var(--nav-h)+2.5rem)] lg:block lg:self-start">
      <span className="font-display text-[1.6rem] leading-none text-gilt">{index}</span>

      <span className="relative mx-1 hidden h-16 w-px overflow-hidden lg:my-4 lg:block">
        {reduce ? (
          <span className="absolute inset-0 bg-line" />
        ) : (
          <motion.span
            className="absolute inset-0 origin-top bg-line"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 1, ease: EASE }}
          />
        )}
      </span>

      <span className="marker lg:block">{label}</span>
      <span className="h-px flex-1 bg-line lg:hidden" />
    </div>
  );
}

/** The serif section title, revealed line by line. */
export function SectionTitle({ id, children, className = '' }) {
  return (
    <h2 id={id} className={`text-heading text-ink ${className}`}>
      {children}
    </h2>
  );
}
