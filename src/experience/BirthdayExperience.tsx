import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  isMediaDevicesSupported,
  useMicrophoneVolume,
} from '../audio';
import BlowInteraction from '../interaction/BlowInteraction';
import type { InteractionMode } from '../interaction/useBlowInteraction';
import BirthdayCard from '../card/BirthdayCard';
import Candles, { type CandlesHandle } from '../cake/Candles';
import { useCandleLayout } from '../cake/useCandleLayout';
import { useConfetti } from '../effects/useConfetti';
import { useExperience } from './useExperience';
import ExperienceBackground from './ExperienceBackground';
import ScreenReaderAnnouncer from './ScreenReaderAnnouncer';
import { scaleTimeline, TIMELINES } from './timelines';
import {
  getStageCluster,
  isCardOpenStage,
  isInteractionLocked,
  type ExperienceAction,
  type ExperienceStage,
} from './types';

const sceneVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

function useStageTimer(
  stage: ExperienceStage,
  targetStage: ExperienceStage,
  delayMs: number,
  action: ExperienceAction,
) {
  const { dispatch } = useExperience();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (stage !== targetStage) {
      return;
    }

    const timer = window.setTimeout(
      () => dispatch(action),
      scaleTimeline(delayMs, Boolean(prefersReducedMotion)),
    );

    return () => window.clearTimeout(timer);
  }, [stage, targetStage, delayMs, action, dispatch, prefersReducedMotion]);
}

const BirthdayExperience = () => {
  const { stage, dispatch, birthdayData } = useExperience();
  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>('microphone');
  const [litCount, setLitCount] = useState<number | null>(null);

  const candlesRef = useRef<CandlesHandle>(null);
  const layout = useCandleLayout(birthdayData.age);
  const { fireBurst, prefersReducedMotion } = useConfetti();
  const reducedMotion = Boolean(prefersReducedMotion);
  const { volume, status, isActive, start, stop } = useMicrophoneVolume();

  const stageCluster = getStageCluster(stage);
  const blowEnabled = stage === 'blowing';

  useStageTimer(
    stage,
    'cake-enter',
    TIMELINES.cakeEnter.complete,
    { type: 'CAKE_ENTER_COMPLETE' },
  );

  useStageTimer(
    stage,
    'celebration',
    TIMELINES.celebration.complete,
    { type: 'CELEBRATION_COMPLETE' },
  );

  useStageTimer(
    stage,
    'card-reveal',
    TIMELINES.cardReveal.settle,
    { type: 'CARD_SETTLED' },
  );

  useStageTimer(
    stage,
    'card-opening',
    TIMELINES.cardOpening.duration,
    { type: 'CARD_OPEN_COMPLETE' },
  );

  useStageTimer(
    stage,
    'card-open',
    TIMELINES.cardOpen.balloonsSettled,
    { type: 'BALLOONS_SETTLED' },
  );

  useStageTimer(
    stage,
    'message',
    TIMELINES.cardOpen.messageComplete,
    { type: 'MESSAGE_REVEAL_COMPLETE' },
  );

  useEffect(() => {
    if (stage !== 'celebration') {
      return;
    }

    const confettiDelay = scaleTimeline(
      TIMELINES.celebration.confettiDelay,
      reducedMotion,
    );

    const timer = window.setTimeout(() => {
      void fireBurst();
    }, confettiDelay);

    return () => window.clearTimeout(timer);
  }, [stage, fireBurst, reducedMotion]);

  const handleStartClick = useCallback(async () => {
    if (!isMediaDevicesSupported()) {
      setInteractionMode('tap-hold');
    } else {
      const micStarted = await start();
      setInteractionMode(micStarted ? 'microphone' : 'tap-hold');
    }

    dispatch({ type: 'START_EXPERIENCE' });
  }, [dispatch, start]);

  const handleAllCandlesOut = useCallback(() => {
    const pause = scaleTimeline(TIMELINES.blowing.allOutPause, reducedMotion);

    window.setTimeout(() => {
      stop();
      dispatch({ type: 'ALL_CANDLES_OUT' });
    }, pause);
  }, [dispatch, stop, reducedMotion]);

  const hintText = useMemo(() => {
    if (stage === 'cake-enter') {
      return 'Get ready…';
    }
    if (interactionMode === 'tap-hold') {
      return 'Tap and hold the cake to blow out candles';
    }
    if (status === 'starting') {
      return 'Starting microphone…';
    }
    return 'Blow out the candles!';
  }, [stage, interactionMode, status]);

  const cardIsOpen = isCardOpenStage(stage);

  return (
    <div className='relative min-h-dvh overflow-hidden text-white'>
      <ExperienceBackground />
      <ScreenReaderAnnouncer
        stage={stage}
        recipientName={birthdayData.recipientName}
      />

      <div
        className='relative min-h-dvh'
        style={{ zIndex: 'var(--z-scene)' }}
      >
        <AnimatePresence mode='wait'>
          {stageCluster === 'intro' && (
            <motion.section
              key='intro'
              className='absolute inset-0 flex flex-col items-center justify-center gap-8 px-6 text-center'
              variants={sceneVariants}
              initial='initial'
              animate='animate'
              exit='exit'
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className='space-y-3'>
                <p className='text-sm uppercase tracking-[0.2em] text-sendiment-amber/70'>
                  Sendiment
                </p>
                <h1 className='text-3xl sm:text-4xl font-semibold leading-tight'>
                  Someone made something special for you…
                </h1>
                <p className='text-white/70 max-w-sm mx-auto text-sm'>
                  We&apos;ll listen for you blowing — nothing is recorded.
                </p>
              </div>

              <motion.button
                type='button'
                onClick={handleStartClick}
                className='rounded-full bg-sendiment-amber px-8 py-4 text-lg font-semibold text-sendiment-amber-dark shadow-sendiment-cta'
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
              >
                Start the Surprise
              </motion.button>
            </motion.section>
          )}

          {stageCluster === 'cake' && (
            <motion.section
              key='cake'
              className='absolute inset-0 flex flex-col items-center justify-center gap-6 px-4'
              variants={sceneVariants}
              initial='initial'
              animate='animate'
              exit='exit'
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden={isInteractionLocked(stage)}
            >
              <motion.div
                className='relative w-full max-w-xs'
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: scaleTimeline(0.45, Boolean(prefersReducedMotion)) / 1000,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className='relative rounded-2xl bg-linear-to-b from-sendiment-cake-icing to-sendiment-cake-base px-4 pt-10 pb-6 shadow-sendiment-card'>
                  {layout.showAgeTopper && (
                    <div className='absolute -top-6 left-1/2 -translate-x-1/2 rounded-lg bg-sendiment-cream px-4 py-1 text-2xl font-bold text-sendiment-amber-dark shadow-md'>
                      {layout.displayAge}
                    </div>
                  )}

                  <div className='relative mx-auto h-24 w-full'>
                    <Candles
                      key={`${layout.displayAge}-${layout.blowableCount}`}
                      ref={candlesRef}
                      layout={layout}
                      onLitCountChange={setLitCount}
                    />
                  </div>

                  <div className='mt-2 h-16 rounded-xl bg-sendiment-cake-tier' />

                  <BlowInteraction
                    candlesRef={candlesRef}
                    enabled={blowEnabled}
                    interactionMode={interactionMode}
                    volume={volume}
                    isMicActive={isActive}
                    onAllCandlesOut={handleAllCandlesOut}
                  />
                </div>
              </motion.div>

              <p className='text-sm text-white/70'>{hintText}</p>
              {stage === 'blowing' && (
                <p className='text-xs text-white/40'>
                  {litCount ?? layout.blowableCount} candles lit ·{' '}
                  {interactionMode === 'microphone' ? 'mic mode' : 'tap-hold mode'}
                </p>
              )}
            </motion.section>
          )}

          {stageCluster === 'celebration' && (
            <motion.section
              key='celebration'
              className='absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center pointer-events-none'
              variants={sceneVariants}
              initial='initial'
              animate='animate'
              exit='exit'
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className='text-4xl'
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 16 }}
              >
                🎉
              </motion.div>
              <p className='text-xl font-semibold text-sendiment-amber'>
                {prefersReducedMotion ? 'Wonderful!' : 'Celebrating!'}
              </p>
            </motion.section>
          )}

          {stageCluster === 'card' && (
            <motion.section
              key='card'
              className='absolute inset-0 flex flex-col items-center justify-center gap-6 px-4'
              variants={sceneVariants}
              initial='initial'
              animate='animate'
              exit='exit'
              transition={{ duration: 0.45 }}
            >
              <BirthdayCard
                isOpen={cardIsOpen}
                onOpenComplete={() => undefined}
              />

              {stage === 'card-reveal' && (
                <p className='text-sm text-white/60'>A card for you…</p>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BirthdayExperience;
