import { AnimatePresence, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useMicrophoneVolume } from '../audio';
import type { InteractionMode } from '../interaction/useBlowInteraction';
import CakeScene from '../scenes/CakeScene/CakeScene';
import CardScene from '../scenes/CardScene/CardScene';
import CelebrationScene from '../scenes/CelebrationScene/CelebrationScene';
import IntroScene from '../scenes/IntroScene/IntroScene';
import StageDevOverlay from '../qa/StageDevOverlay';
import { useDevMode } from '../qa/useDevMode';
import { useExperience } from './useExperience';
import ExperienceBackground from './ExperienceBackground';
import ScreenReaderAnnouncer from './ScreenReaderAnnouncer';
import { scaleTimeline, TIMELINES, delayFromMessageStage } from './timelines';
import {
  getStageCluster,
  type ExperienceAction,
  type ExperienceStage,
} from './types';

type TimedActionType = Exclude<
  ExperienceAction['type'],
  'DEV_JUMP_TO_STAGE'
>;

function useStageTimer(
  stage: ExperienceStage,
  targetStage: ExperienceStage,
  delayMs: number,
  actionType: TimedActionType,
) {
  const { dispatch } = useExperience();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (stage !== targetStage) {
      return;
    }

    const timer = window.setTimeout(
      () => dispatch({ type: actionType }),
      scaleTimeline(delayMs, Boolean(prefersReducedMotion)),
    );

    return () => window.clearTimeout(timer);
  }, [stage, targetStage, delayMs, actionType, dispatch, prefersReducedMotion]);
}

const BirthdayExperience = () => {
  const { stage, birthdayData } = useExperience();
  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>('microphone');
  const isDevMode = useDevMode();

  const { volume, status, isActive, start, stop } = useMicrophoneVolume();

  const stageCluster = getStageCluster(stage);
  const showCake =
    stageCluster === 'cake' || stageCluster === 'celebration';
  const resolvedMode: InteractionMode =
    status === 'error' ? 'tap-hold' : interactionMode;

  useStageTimer(
    stage,
    'card-open',
    TIMELINES.cardOpen.balloonsSettled,
    'BALLOONS_SETTLED',
  );

  useStageTimer(
    stage,
    'message',
    delayFromMessageStage(TIMELINES.cardOpen.messageComplete),
    'MESSAGE_REVEAL_COMPLETE',
  );

  useEffect(() => {
    if (stage !== 'intro' || !isActive) {
      return;
    }

    stop();
  }, [stage, isActive, stop]);

  return (
    <div
      className='relative min-h-dvh overflow-hidden text-white'
      style={{
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      <ExperienceBackground />
      <ScreenReaderAnnouncer
        stage={stage}
        recipientName={birthdayData.recipientName}
        message={birthdayData.message}
      />

      <div
        className='relative min-h-dvh'
        style={{ zIndex: 'var(--z-scene)' }}
      >
        <AnimatePresence mode='wait'>
          {stageCluster === 'intro' && (
            <IntroScene
              key='intro'
              requestMicrophone={start}
              onInteractionModeChange={setInteractionMode}
            />
          )}

          {showCake && (
            <CakeScene
              key='cake'
              volume={volume}
              isMicActive={isActive}
              micStatus={status}
              interactionMode={resolvedMode}
              stopMicrophone={stop}
            />
          )}

          {stageCluster === 'card' && <CardScene key='card' />}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {stage === 'celebration' && <CelebrationScene key='celebration' />}
      </AnimatePresence>

      {isDevMode && <StageDevOverlay />}
    </div>
  );
};

export default BirthdayExperience;
