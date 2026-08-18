import { motion, useReducedMotion } from 'motion/react';
import { EASE_OUT_EXPO } from '../animation/config';
import { scaleTimeline, TIMELINES } from './timelines';
import './atmosphere.css';

const ExperienceBackground = () => {
  const prefersReducedMotion = useReducedMotion();
  const fadeSeconds =
    scaleTimeline(
      TIMELINES.intro.backgroundFadeIn,
      Boolean(prefersReducedMotion),
    ) / 1000;

  return (
    <motion.div
      className='atmosphere fixed inset-0'
      style={{ zIndex: 'var(--z-background)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: fadeSeconds, ease: EASE_OUT_EXPO }}
      aria-hidden
    >
      <div className='atmosphere-wash' />
      <div className='atmosphere-pool' />
      <div className='atmosphere-vignette' />
      <div className='atmosphere-grain' />
    </motion.div>
  );
};

export default ExperienceBackground;
