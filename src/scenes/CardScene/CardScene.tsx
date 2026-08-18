import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cardRigVariants } from '../../animation/variants';
import BirthdayCard from '../../card/BirthdayCard';
import CardReplayControl from '../../card/CardReplayControl';
import { useCardReplay } from '../../card/useCardReplay';
import Balloons from '../../decorations/Balloons';
import { scaleTimeline, TIMELINES } from '../../experience/timelines';
import {
  isCardOpenStage,
  isInteractionLocked,
  isMessageStage,
} from '../../experience/types';
import { useExperience } from '../../experience/useExperience';

const CardScene = () => {
  const { stage, dispatch, birthdayData } = useExperience();
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const [entered, setEntered] = useState(false);
  const { phase: replayPhase, isBusy: isReplaying, replay } = useCardReplay(
    reducedMotion,
  );

  const isOpen = isCardOpenStage(stage);
  const isOpening = stage === 'card-opening' || replayPhase !== 'idle';
  const showBalloons =
    (stage === 'card-open' || isMessageStage(stage)) && !isReplaying;
  const revealMessage = isMessageStage(stage);
  const idleFloat = !reducedMotion && stage === 'card-reveal' && entered;
  const rigPose = isOpen ? 'open' : 'revealed';
  const cardOpen = isReplaying ? replayPhase === 'opening' : isOpen;

  useEffect(() => {
    if (stage !== 'card-reveal') {
      return;
    }

    const enterTimer = window.setTimeout(
      () => setEntered(true),
      scaleTimeline(TIMELINES.cardReveal.enterDuration, reducedMotion),
    );
    const settleTimer = window.setTimeout(
      () => dispatch({ type: 'CARD_SETTLED' }),
      scaleTimeline(TIMELINES.cardReveal.settle, reducedMotion),
    );

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(settleTimer);
    };
  }, [stage, dispatch, reducedMotion]);

  useEffect(() => {
    if (stage !== 'card-opening') {
      return;
    }

    const timer = window.setTimeout(
      () => dispatch({ type: 'CARD_OPEN_COMPLETE' }),
      scaleTimeline(TIMELINES.cardOpening.duration, reducedMotion),
    );

    return () => window.clearTimeout(timer);
  }, [stage, dispatch, reducedMotion]);

  return (
    <motion.section
      className='absolute inset-0 flex flex-col items-center justify-center px-4 pb-16'
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(4.5rem, env(safe-area-inset-bottom))',
      }}
      aria-label='Birthday card'
      aria-hidden={isInteractionLocked(stage)}
      tabIndex={-1}
      inert={isInteractionLocked(stage) || undefined}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: {
          duration: scaleTimeline(TIMELINES.motion.fadeMedium, reducedMotion) / 1000,
        },
      }}
    >
      <div className='card-stage'>
        <Balloons visible={showBalloons} reducedMotion={reducedMotion} />
        <div className='card-ground-shadow' aria-hidden />
        <div className='card-scene'>
          <motion.div
            className='card-rig'
            variants={cardRigVariants(reducedMotion)}
            initial='hidden'
            animate={rigPose}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className={idleFloat ? 'card-float' : 'card-float-slot'}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <BirthdayCard
                isOpen={cardOpen}
                isOpening={isOpening}
                reducedMotion={reducedMotion}
                recipientName={birthdayData.recipientName}
                message={birthdayData.message}
                revealMessage={revealMessage}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <CardReplayControl
        visible={revealMessage}
        disabled={isReplaying}
        reducedMotion={reducedMotion}
        onReplay={replay}
      />
    </motion.section>
  );
};

export default CardScene;
