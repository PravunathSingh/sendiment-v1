import { type ReactNode, type RefObject } from 'react';
import { motion } from 'motion/react';
import {
  cakeContainerVariants,
  cakeLayersVariants,
} from '../animation/variants';
import AgeTopper from './AgeTopper';
import CakeLayers from './CakeLayers';
import Candles, { type CandlesHandle } from './Candles';
import type { CandleLayout } from './useCandleLayout';
import './cake.css';

interface CakeProps {
  layout: CandleLayout;
  candlesRef: RefObject<CandlesHandle | null>;
  ignited: boolean;
  reducedMotion: boolean;
  interactive: boolean;
  celebrating?: boolean;
  onLitCountChange?: (litCount: number) => void;
  children?: ReactNode;
}

const Cake = ({
  layout,
  candlesRef,
  ignited,
  reducedMotion,
  interactive,
  celebrating = false,
  onLitCountChange,
  children,
}: CakeProps) => {
  return (
    <motion.div
      className='cake relative mx-auto'
      variants={cakeContainerVariants(reducedMotion)}
      initial='initial'
      animate={celebrating ? 'celebrate' : 'animate'}
    >
      <motion.div
        className='cake-stage'
        variants={cakeLayersVariants(reducedMotion)}
        initial='initial'
        animate='animate'
      >
        {children}
        <div className='cake-body'>
          <CakeLayers />
          <div className='cake-top'>
            {layout.showAgeTopper && (
              <AgeTopper
                age={layout.displayAge}
                reducedMotion={reducedMotion}
              />
            )}
            <Candles
              key={`${layout.displayAge}-${layout.blowableCount}`}
              ref={candlesRef}
              layout={layout}
              ignited={ignited}
              reducedMotion={reducedMotion}
              interactive={interactive}
              onLitCountChange={onLitCountChange}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Cake;
