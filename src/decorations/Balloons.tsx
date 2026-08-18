import { motion } from 'motion/react';
import {
  balloonEnterVariants,
  balloonsGroupVariants,
} from '../animation/variants';
import Balloon, { type BalloonColor } from './Balloon';
import './balloon.css';

type BalloonLayer = 'back' | 'front';

type BalloonLayout = {
  id: string;
  color: BalloonColor;
  size: number;
  left: string;
  top: string;
  layer: BalloonLayer;
  blur?: number;
  opacity?: number;
  stringLength: number;
  stringTilt: number;
  float: {
    y: number;
    rotate: number;
    duration: number;
    delay: number;
  };
};

const LAYOUT: BalloonLayout[] = [
  {
    id: 'sky-lg',
    color: 'sky',
    size: 108,
    left: '8%',
    top: '18%',
    layer: 'back',
    blur: 1.1,
    opacity: 0.84,
    stringLength: 118,
    stringTilt: -10,
    float: { y: 14, rotate: -2.4, duration: 5.1, delay: 0.12 },
  },
  {
    id: 'coral-top',
    color: 'coral',
    size: 98,
    left: '32%',
    top: '2%',
    layer: 'front',
    stringLength: 108,
    stringTilt: 8,
    float: { y: 10, rotate: 3, duration: 4.2, delay: 0.28 },
  },
  {
    id: 'gold-mid',
    color: 'gold',
    size: 78,
    left: '54%',
    top: '10%',
    layer: 'front',
    stringLength: 88,
    stringTilt: 4,
    float: { y: 8, rotate: 2.2, duration: 3.8, delay: 0.05 },
  },
  {
    id: 'lavender',
    color: 'lavender',
    size: 66,
    left: '16%',
    top: '46%',
    layer: 'back',
    blur: 0.75,
    opacity: 0.8,
    stringLength: 78,
    stringTilt: -6,
    float: { y: 12, rotate: -3, duration: 4.6, delay: 0.4 },
  },
  {
    id: 'mint',
    color: 'mint',
    size: 88,
    left: '40%',
    top: '52%',
    layer: 'front',
    stringLength: 98,
    stringTilt: 11,
    float: { y: 9, rotate: 2.6, duration: 4.4, delay: 0.2 },
  },
  {
    id: 'coral-edge',
    color: 'coral',
    size: 72,
    left: '2%',
    top: '4%',
    layer: 'front',
    stringLength: 84,
    stringTilt: -8,
    float: { y: 11, rotate: 2.8, duration: 4.8, delay: 0.18 },
  },
  {
    id: 'gold-fold',
    color: 'gold',
    size: 70,
    left: '66%',
    top: '34%',
    layer: 'front',
    stringLength: 80,
    stringTilt: 7,
    float: { y: 8, rotate: -2.1, duration: 4.0, delay: 0.34 },
  },
];

interface BalloonsProps {
  visible: boolean;
  reducedMotion: boolean;
}

const Balloons = ({ visible, reducedMotion }: BalloonsProps) => {
  return (
    <motion.div
      className='balloons'
      variants={balloonsGroupVariants(reducedMotion)}
      initial='hidden'
      animate={visible ? 'visible' : 'hidden'}
      aria-hidden
    >
      {LAYOUT.map((balloon) => (
        <motion.div
          key={balloon.id}
          className={`balloon-slot balloon-slot--${balloon.layer}`}
          style={{
            left: balloon.left,
            top: balloon.top,
          }}
          variants={balloonEnterVariants(reducedMotion)}
        >
          <div
            className='balloon-depth'
            style={{
              opacity: balloon.opacity,
              filter: balloon.blur ? `blur(${balloon.blur}px)` : undefined,
            }}
          >
            <Balloon
              color={balloon.color}
              size={balloon.size}
              stringLength={balloon.stringLength}
              stringTilt={balloon.stringTilt}
              reducedMotion={reducedMotion}
              float={balloon.float}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Balloons;
