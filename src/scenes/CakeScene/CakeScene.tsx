import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { MicrophoneCaptureStatus, VolumeLevel } from '../../audio';
import { cakeSceneVariants } from '../../animation/variants';
import Cake from '../../cake/Cake';
import type { CandlesHandle } from '../../cake/Candles';
import { useCandleLayout } from '../../cake/useCandleLayout';
import { useCinematicFinish } from '../../cake/useCinematicFinish';
import { scaleTimeline, TIMELINES } from '../../experience/timelines';
import type { InteractionMode } from '../../experience/types';
import { isInteractionLocked } from '../../experience/types';
import { useExperience } from '../../experience/useExperience';
import BlowInteraction from '../../interaction/BlowInteraction';
import BlowHint from './BlowHint';

interface CakeSceneProps {
  volume: VolumeLevel;
  isMicActive: boolean;
  micStatus: MicrophoneCaptureStatus;
  interactionMode: InteractionMode;
  stopMicrophone: () => void;
}

const CakeScene = ({
  volume,
  isMicActive,
  micStatus,
  interactionMode,
  stopMicrophone,
}: CakeSceneProps) => {
  const { stage, dispatch, birthdayData } = useExperience();
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const layout = useCandleLayout(birthdayData.age);
  const candlesRef = useRef<CandlesHandle>(null);
  const completedRef = useRef(false);
  const [litCount, setLitCount] = useState(layout.blowableCount);
  const [completed, setCompleted] = useState(false);
  const [enterIgnited, setEnterIgnited] = useState(false);
  const [weakBlowHint, setWeakBlowHint] = useState(false);

  const blowing = stage === 'blowing';
  const ignited = enterIgnited || blowing;
  const showHoldHint =
    interactionMode === 'tap-hold' ||
    weakBlowHint ||
    micStatus === 'error';
  const autoFinishing = useCinematicFinish({
    enabled: blowing && !completed,
    litCount,
    totalBlowable: layout.blowableCount,
    reducedMotion,
    candlesRef,
  });

  useEffect(() => {
    if (stage !== 'cake-enter') {
      return;
    }

    const igniteTimer = window.setTimeout(
      () => setEnterIgnited(true),
      scaleTimeline(TIMELINES.cakeEnter.flamesIgnite, reducedMotion),
    );
    const completeTimer = window.setTimeout(
      () => dispatch({ type: 'CAKE_ENTER_COMPLETE' }),
      scaleTimeline(TIMELINES.cakeEnter.complete, reducedMotion),
    );

    return () => {
      window.clearTimeout(igniteTimer);
      window.clearTimeout(completeTimer);
    };
  }, [stage, dispatch, reducedMotion]);

  useEffect(() => {
    if (!blowing || interactionMode === 'tap-hold') {
      return;
    }

    const timer = window.setTimeout(
      () => setWeakBlowHint(true),
      TIMELINES.blowing.weakBlowHint,
    );
    return () => window.clearTimeout(timer);
  }, [blowing, interactionMode]);

  const handleAllCandlesOut = useCallback(() => {
    if (completedRef.current) {
      return;
    }

    completedRef.current = true;
    setCompleted(true);
    stopMicrophone();

    window.setTimeout(
      () => {
        dispatch({ type: 'ALL_CANDLES_OUT' });
      },
      scaleTimeline(TIMELINES.blowing.allOutPause, reducedMotion),
    );
  }, [dispatch, stopMicrophone, reducedMotion]);

  useEffect(() => {
    if (!blowing || litCount > 0 || completedRef.current) {
      return;
    }

    const timer = window.setTimeout(() => {
      handleAllCandlesOut();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [blowing, litCount, handleAllCandlesOut]);

  const hintText = useMemo(() => {
    if (autoFinishing) {
      return 'Almost there…';
    }
    if (stage === 'cake-enter') {
      return 'Get ready…';
    }
    if (showHoldHint) {
      return 'Tap and hold to blow';
    }
    if (micStatus === 'starting') {
      return 'Starting microphone…';
    }
    return 'Blow out the candles';
  }, [autoFinishing, stage, showHoldHint, micStatus]);

  const blowEnabled = blowing && !autoFinishing && !completed;

  return (
    <motion.section
      className={[
        'absolute inset-0 flex flex-col items-center justify-center gap-8 px-4 sm:gap-10',
        stage === 'celebration' ? 'pointer-events-none' : '',
      ].join(' ')}
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
      }}
      variants={cakeSceneVariants(reducedMotion)}
      initial='initial'
      animate='animate'
      exit='exit'
      tabIndex={-1}
      inert={isInteractionLocked(stage) || undefined}
      aria-label={`Birthday cake with ${layout.blowableCount} candles for age ${layout.displayAge}`}
      aria-hidden={isInteractionLocked(stage)}
    >
      <Cake
        layout={layout}
        candlesRef={candlesRef}
        ignited={ignited}
        reducedMotion={reducedMotion}
        interactive={blowEnabled}
        celebrating={stage === 'celebration'}
        onLitCountChange={setLitCount}
      >
        <BlowInteraction
          candlesRef={candlesRef}
          enabled={blowEnabled}
          micListening={
            isMicActive &&
            interactionMode === 'microphone' &&
            (stage === 'cake-enter' || blowing)
          }
          interactionMode={interactionMode}
          volume={volume}
          isMicActive={isMicActive}
        />
      </Cake>

      <motion.div
        animate={{ opacity: stage === 'celebration' ? 0 : 1 }}
        transition={{
          duration: scaleTimeline(TIMELINES.motion.hint, reducedMotion) / 1000,
        }}
        aria-hidden={stage === 'celebration'}
      >
        <BlowHint text={hintText} />
      </motion.div>
    </motion.section>
  );
};

export default CakeScene;
