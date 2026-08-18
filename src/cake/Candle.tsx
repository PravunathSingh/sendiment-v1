import { memo, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cakeDropInVariants } from '../animation/variants';
import { scaleTimeline, TIMELINES } from '../experience/timelines';
import Flame from './Flame';
import Smoke from './Smoke';
import type { CandlePosition } from './useCandleLayout';

interface CandleProps {
  position: CandlePosition;
  index: number;
  isLit: boolean;
  staggerMs: number;
  ignited: boolean;
  reducedMotion: boolean;
  interactive: boolean;
  onBlowOut: (id: string) => void;
}

const Candle = memo(function Candle({
  position,
  index,
  isLit,
  staggerMs,
  ignited,
  reducedMotion,
  interactive,
  onBlowOut,
}: CandleProps) {
  const [phase, setPhase] = useState<'lit' | 'extinguishing' | 'out'>(
    isLit ? 'lit' : 'out',
  );
  const extinguishing = phase === 'extinguishing';
  const out = phase === 'out';

  useEffect(() => {
    if (isLit) {
      return;
    }

    const extinguishMs = scaleTimeline(
      TIMELINES.blowing.extinguishMs,
      reducedMotion,
    );
    const startTimer = window.setTimeout(
      () => setPhase('extinguishing'),
      staggerMs,
    );
    const endTimer = window.setTimeout(
      () => setPhase('out'),
      staggerMs + extinguishMs,
    );

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(endTimer);
    };
  }, [isLit, staggerMs, reducedMotion]);

  const igniteDelayMs = index * 40;

  const handleActivate = () => {
    if (!interactive || !isLit) {
      return;
    }
    onBlowOut(position.id);
  };

  return (
    <motion.button
      type='button'
      className='candle absolute z-20 -translate-x-1/2 -translate-y-full cursor-pointer border-0 bg-transparent p-1.5 -m-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sendiment-amber disabled:cursor-default'
      style={{
        left: `${position.xPercent}%`,
        top: `${position.yPercent}%`,
      }}
      variants={cakeDropInVariants(reducedMotion, index)}
      initial='initial'
      animate='animate'
      aria-label={`Candle ${index + 1}${isLit ? ', lit' : ', out'}`}
      disabled={!interactive || !isLit}
      onClick={(event) => {
        event.stopPropagation();
        handleActivate();
      }}
      onPointerDown={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleActivate();
        }
      }}
    >
      <span className='relative block'>
        <Flame
          ignited={ignited && phase === 'lit'}
          extinguishing={extinguishing}
          reducedMotion={reducedMotion}
          igniteDelayMs={igniteDelayMs}
        />
        <Smoke active={extinguishing} reducedMotion={reducedMotion} />
        <span
          className={out ? 'candle-wick candle-wick--charred' : 'candle-wick'}
          aria-hidden
        />
        <span
          className={out ? 'candle-body candle-body--out' : 'candle-body'}
          aria-hidden
        >
          <span className='candle-cap' />
        </span>
      </span>
    </motion.button>
  );
});

export default Candle;
