import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, viewportOnce, EASE } from '../../lib/motion';

/** Scroll-triggered entrance. Renders statically when reduced motion is on. */
export function Reveal({ as = 'div', delay = 0, y = 24, className = '', children, ...rest }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.div;

  if (reduce) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.85, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * Type sliding up from behind a mask. `lines` is an array of strings; each gets
 * its own overflow-hidden row so the movement reads as a printed line settling.
 */
export function MaskedLines({
  lines,
  className = '',
  lineClassName = '',
  delay = 0,
  stagger = 0.07,
  immediate = false,
}) {
  const reduce = useReducedMotion();

  // Scroll-triggered by default (for lines that appear lower on the page).
  // `immediate` plays the reveal on mount instead — use this for anything
  // rendered above the fold, since it's already in the viewport when it
  // mounts and a scroll-into-view observer may never fire for it.
  const trigger = immediate
    ? { animate: { y: '0%' } }
    : { whileInView: { y: '0%' }, viewport: viewportOnce };

  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          {reduce ? (
            <span className={`block ${lineClassName}`}>{line}</span>
          ) : (
            <motion.span
              className={`block ${lineClassName}`}
              initial={{ y: '112%' }}
              {...trigger}
              transition={{ duration: 1, ease: EASE, delay: delay + i * stagger }}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </span>
  );
}

/** Image fading and settling into place as it scrolls into view. */
export function ImageReveal({ src, srcSet, sizes, alt, className = '', imgClassName = '', priority = false, delay = 0 }) {
  const reduce = useReducedMotion();

  const img = (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? "high" : "auto"}
      className={`h-full w-full object-cover ${imgClassName}`}
    />
  );

  if (reduce) return <div className={`overflow-hidden ${className}`}>{img}</div>;

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 1.06 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={viewportOnce}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {img}
    </motion.div>
  );
}