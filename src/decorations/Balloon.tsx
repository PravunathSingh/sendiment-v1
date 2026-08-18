import { memo, type CSSProperties } from 'react';
import { motion } from 'motion/react';

export type BalloonColor = 'coral' | 'gold' | 'sky' | 'lavender' | 'mint';

export type BalloonFloat = {
  y: number;
  rotate: number;
  duration: number;
  delay: number;
};

interface BalloonProps {
  color: BalloonColor;
  size: number;
  stringLength: number;
  stringTilt: number;
  reducedMotion: boolean;
  float: BalloonFloat;
}

const Balloon = memo(function Balloon({
  color,
  size,
  stringLength,
  stringTilt,
  reducedMotion,
  float,
}: BalloonProps) {
  return (
    <motion.div
      className='balloon-float'
      animate={
        reducedMotion
          ? { y: 0, rotate: 0 }
          : {
              y: [0, -float.y, 0],
              rotate: [0, float.rotate, -float.rotate * 0.65, 0],
            }
      }
      transition={
        reducedMotion
          ? { duration: 0 }
          : {
              duration: float.duration,
              delay: float.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }
      }
    >
      <div
        className={`balloon balloon--${color}`}
        style={
          {
            '--balloon-size': `${size}px`,
            '--string-length': `${stringLength}px`,
            '--string-tilt': `${stringTilt}deg`,
          } as CSSProperties
        }
      >
        <span className='balloon-string' />
      </div>
    </motion.div>
  );
});

export default Balloon;
