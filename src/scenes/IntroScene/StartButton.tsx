import { motion, useReducedMotion } from 'motion/react';
import { useCallback, useRef, useState, type CSSProperties } from 'react';
import { TAP_SCALE } from '../../animation/config';
import { introCtaVariants } from '../../animation/variants';
import { isMediaDevicesSupported } from '../../audio';
import { scaleTimeline, TIMELINES } from '../../experience/timelines';
import type { InteractionMode } from '../../experience/types';
import { useExperience } from '../../experience/useExperience';
import { DISCLAIMER_ID } from './IntroCopy';

interface StartButtonProps {
  requestMicrophone: () => Promise<boolean>;
  onInteractionModeChange: (mode: InteractionMode) => void;
}

const StartButton = ({
  requestMicrophone,
  onInteractionModeChange,
}: StartButtonProps) => {
  const { dispatch } = useExperience();
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const pendingRef = useRef(false);
  const [pending, setPending] = useState(false);
  const [burst, setBurst] = useState(false);
  const idleDelayMs = scaleTimeline(TIMELINES.intro.ctaIdle, reducedMotion);

  const handleClick = useCallback(async () => {
    if (pendingRef.current) {
      return;
    }

    pendingRef.current = true;
    setPending(true);
    setBurst(true);

    const started = isMediaDevicesSupported()
      ? await requestMicrophone()
      : false;

    onInteractionModeChange(started ? 'microphone' : 'tap-hold');
    dispatch({ type: 'START_EXPERIENCE' });
  }, [dispatch, onInteractionModeChange, requestMicrophone]);

  return (
    <motion.button
      type='button'
      onClick={handleClick}
      aria-describedby={DISCLAIMER_ID}
      aria-busy={pending}
      disabled={pending}
      className={[
        'intro-cta intro-cta--idle relative min-h-11 min-w-11 rounded-full bg-sendiment-amber px-8 py-4',
        'text-lg font-semibold text-sendiment-amber-dark',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sendiment-cream',
        'disabled:cursor-wait disabled:opacity-100',
        burst ? 'intro-cta--burst' : '',
      ].join(' ')}
      style={
        {
          '--intro-cta-idle-delay': `${idleDelayMs}ms`,
        } as CSSProperties
      }
      variants={introCtaVariants(reducedMotion)}
      initial='initial'
      animate='animate'
      whileHover={
        reducedMotion
          ? undefined
          : { scale: 1.03, transition: { duration: TIMELINES.motion.hover / 1000 } }
      }
      whileTap={
        reducedMotion
          ? undefined
          : { scale: TAP_SCALE, transition: { duration: TIMELINES.motion.tap / 1000 } }
      }
    >
      Start the Surprise
    </motion.button>
  );
};

export default StartButton;
