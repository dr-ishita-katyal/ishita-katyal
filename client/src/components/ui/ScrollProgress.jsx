import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

/** A hairline at the very top of the page tracking read position. */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-umber/70"
      style={{ scaleX }}
    />
  );
}
