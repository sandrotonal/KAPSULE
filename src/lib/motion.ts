import { Variants } from 'framer-motion';

/**
 * Premium Shared Motion Definitions for Kapsule
 * Adheres to 07-motionconstitution.md:
 * - Explanatory, not decorative
 * - Under 500ms duration
 * - Spring and smooth eases, no bouncy overshoots unless tactile
 */

export const springGentle = {
  type: 'spring',
  stiffness: 320,
  damping: 32,
};

export const easeOutExpo = [0.16, 1, 0.3, 1];

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.2, ease: easeOutExpo }
  },
  exit: { 
    opacity: 0, 
    y: -4, 
    scale: 0.995,
    transition: { duration: 0.14, ease: easeOutExpo }
  }
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.025,
      delayChildren: 0.01,
    }
  }
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2, ease: easeOutExpo }
  }
};
