import { motion } from 'motion/react';
import { EASE_OUT_EXPO } from '../animation/config';
import { TIMELINES } from '../experience/timelines';

interface GlowPulseProps {
  active: boolean;
  reducedMotion: boolean;
}

const GlowPulse = ({ active, reducedMotion }: GlowPulseProps) => {
  return (
    <motion.div
      className='pointer-events-none absolute inset-0'
      style={{
        background:
          'radial-gradient(ellipse at 50% 46%, rgb(254 243 199) 0%, rgb(251 191 36 / 0.42) 32%, transparent 70%)',
      }}
      aria-hidden
      initial={{ opacity: 0 }}
      animate={active ? { opacity: [0, 0.15, 0] } : { opacity: 0 }}
      transition={{
        duration: (reducedMotion
          ? TIMELINES.motion.fadeFast
          : TIMELINES.celebration.flashDelay * 2) / 1000,
        times: [0, 0.35, 1],
        ease: EASE_OUT_EXPO,
      }}
    />
  );
};

export default GlowPulse;
