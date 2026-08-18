import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { celebrationSceneVariants } from '../../animation/variants';
import GlowPulse from '../../effects/GlowPulse';
import { useConfetti } from '../../effects/useConfetti';
import { scaleTimeline, TIMELINES } from '../../experience/timelines';
import { useExperience } from '../../experience/useExperience';
import Sparkles from './Sparkles';
import './celebration.css';

const SMOKE_PUFFS = [
  { x: -18, delay: '0ms' },
  { x: 0, delay: '40ms' },
  { x: 16, delay: '80ms' },
] as const;

const CelebrationScene = () => {
  const { dispatch } = useExperience();
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { fireBurst } = useConfetti(canvasRef);
  const [flash, setFlash] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    const confettiTimer = window.setTimeout(() => {
      void fireBurst();
    }, scaleTimeline(TIMELINES.celebration.confettiDelay, reducedMotion));

    const flashTimer = window.setTimeout(() => {
      setFlash(true);
      if (!reducedMotion) {
        setShowSparkles(true);
      }
    }, scaleTimeline(TIMELINES.celebration.flashDelay, reducedMotion));

    const completeTimer = window.setTimeout(() => {
      dispatch({ type: 'CELEBRATION_COMPLETE' });
    }, scaleTimeline(TIMELINES.celebration.complete, reducedMotion));

    return () => {
      window.clearTimeout(confettiTimer);
      window.clearTimeout(flashTimer);
      window.clearTimeout(completeTimer);
    };
  }, [dispatch, fireBurst, reducedMotion]);

  return (
    <motion.section
      className='pointer-events-none fixed inset-0'
      style={{ zIndex: 'var(--z-confetti)' }}
      aria-hidden
      variants={celebrationSceneVariants(reducedMotion)}
      initial='initial'
      animate='animate'
      exit='exit'
    >
      <canvas
        ref={canvasRef}
        className='pointer-events-none absolute inset-0 size-full'
      />

      {!reducedMotion &&
        SMOKE_PUFFS.map((puff) => (
          <span
            key={puff.x}
            className='celebration-smoke'
            style={{
              marginLeft: puff.x,
              animationDelay: puff.delay,
            }}
          />
        ))}

      <GlowPulse active={flash} reducedMotion={reducedMotion} />
      {showSparkles && <Sparkles />}
    </motion.section>
  );
};

export default CelebrationScene;
