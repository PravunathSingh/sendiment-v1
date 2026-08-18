import { motion } from 'motion/react';
import { EASE_OUT_EXPO } from '../animation/config';
import { scaleTimeline } from '../experience/timelines';

interface FlameProps {
  ignited: boolean;
  extinguishing: boolean;
  reducedMotion: boolean;
  igniteDelayMs: number;
}

const Flame = ({
  ignited,
  extinguishing,
  reducedMotion,
  igniteDelayMs,
}: FlameProps) => {
  const stretchMs = scaleTimeline(120, reducedMotion);
  const fadeMs = scaleTimeline(80, reducedMotion);
  const igniteMs = scaleTimeline(280, reducedMotion);

  if (extinguishing) {
    return (
      <motion.div
        className='flame'
        aria-hidden
        initial={{ opacity: 1, scaleY: 1, skewX: 0 }}
        animate={
          reducedMotion
            ? { opacity: 0, scaleY: 1, skewX: 0 }
            : { opacity: 0, scaleY: 1.45, skewX: 12 }
        }
        transition={{
          duration: (stretchMs + fadeMs) / 1000,
          ease: EASE_OUT_EXPO,
        }}
      />
    );
  }

  return (
    <motion.div
      className={ignited ? 'flame flame--lit' : 'flame'}
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: ignited ? 1 : 0 }}
      transition={{
        delay: ignited ? igniteDelayMs / 1000 : 0,
        duration: igniteMs / 1000,
        ease: EASE_OUT_EXPO,
      }}
    />
  );
};

export default Flame;
