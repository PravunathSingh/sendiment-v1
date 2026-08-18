import { motion } from 'motion/react';
import { TAP_SCALE } from '../animation/config';
import { cardReplayVariants } from '../animation/variants';
import {
  delayFromMessageStage,
  TIMELINES,
} from '../experience/timelines';

interface CardReplayControlProps {
  visible: boolean;
  disabled: boolean;
  reducedMotion: boolean;
  onReplay: () => void;
}

const CardReplayControl = ({
  visible,
  disabled,
  reducedMotion,
  onReplay,
}: CardReplayControlProps) => {
  const enterDelay = delayFromMessageStage(TIMELINES.cardOpen.messageReveal);

  return (
    <div className='card-replay-slot'>
      <div className='sr-only' role='status' aria-live='polite' aria-atomic>
        {disabled ? 'Replaying card opening.' : ''}
      </div>
      <motion.button
        type='button'
        className='card-replay'
        aria-label='Replay card opening'
        aria-hidden={!visible}
        aria-busy={disabled}
        tabIndex={visible ? 0 : -1}
        disabled={disabled}
        onClick={onReplay}
        variants={cardReplayVariants(reducedMotion, enterDelay)}
        initial='hidden'
        animate={visible ? 'visible' : 'hidden'}
        whileHover={
          reducedMotion || disabled
            ? undefined
            : { scale: 1.03, transition: { duration: TIMELINES.motion.hover / 1000 } }
        }
        whileTap={
          reducedMotion || disabled
            ? undefined
            : { scale: TAP_SCALE, transition: { duration: TIMELINES.motion.tap / 1000 } }
        }
      >
        <span className='card-replay-icon' aria-hidden>
          <svg viewBox='0 0 24 24' width='16' height='16' fill='none'>
            <path
              d='M4.5 12a7.5 7.5 0 1 1 1.7 4.8'
              stroke='currentColor'
              strokeWidth='1.8'
              strokeLinecap='round'
            />
            <path
              d='M4.5 16.5v-4H8'
              stroke='currentColor'
              strokeWidth='1.8'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </span>
        Replay card opening
      </motion.button>
    </div>
  );
};

export default CardReplayControl;
