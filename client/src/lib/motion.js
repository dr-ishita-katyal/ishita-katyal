/**
 * Shared motion vocabulary. Everything is opacity / transform / clip-path so
 * animation stays on the compositor and never triggers layout.
 */
export const EASE = [0.22, 1, 0.36, 1];

export const viewportOnce = { once: true, amount: 0.25, margin: '0px 0px -12% 0px' };

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

export const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

/** Parent that staggers its children in sequence. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** A line of type sliding up from behind a mask. */
export const maskLine = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 1, ease: EASE } },
};

/** Image wiping open from the bottom edge. */
export const clipReveal = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08 },
  show: {
    clipPath: 'inset(0% 0% 0% 0%)',
    scale: 1,
    transition: { duration: 1.3, ease: EASE },
  },
};

/** A hairline drawing itself downward. */
export const drawDown = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 1.1, ease: EASE } },
};
