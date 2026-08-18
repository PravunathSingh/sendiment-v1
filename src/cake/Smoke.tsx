import { motion } from 'motion/react';
import { scaleTimeline } from '../experience/timelines';

interface SmokeProps {
  active: boolean;
  reducedMotion: boolean;
}

const Smoke = ({ active, reducedMotion }: SmokeProps) => {
  if (!active) {
    return null;
  }

  const duration = scaleTimeline(400, reducedMotion) / 1000;
  const delay = scaleTimeline(200, reducedMotion) / 1000;

  return (
    <motion.div
      className='smoke-plume'
      aria-hidden
      initial={{ opacity: 0, y: 0, scale: 0.45 }}
      animate={
        reducedMotion
          ? { opacity: [0, 0.45, 0], y: 0, scale: 1 }
          : { opacity: [0, 0.65, 0], y: -22, scale: 1.35 }
      }
      transition={{ duration, delay, ease: 'easeOut' }}
    />
  );
};

export default Smoke;
