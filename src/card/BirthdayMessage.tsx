import { motion } from 'motion/react';
import {
  messageItemVariants,
  messageSparkleVariants,
} from '../animation/variants';
import {
  delayFromMessageStage,
  TIMELINES,
} from '../experience/timelines';

interface BirthdayMessageProps {
  recipientName: string;
  message: string;
  visible: boolean;
  reducedMotion: boolean;
}

const BirthdayMessage = ({
  recipientName,
  message,
  visible,
  reducedMotion,
}: BirthdayMessageProps) => {
  const pose = visible ? 'visible' : 'hidden';
  const sparkleDelay = delayFromMessageStage(TIMELINES.cardOpen.balloonsSettled);
  const nameDelay = delayFromMessageStage(TIMELINES.cardOpen.nameReveal);
  const headingDelay = delayFromMessageStage(TIMELINES.cardOpen.headingReveal);
  const bodyDelay = delayFromMessageStage(TIMELINES.cardOpen.messageReveal);

  return (
    <div className='birthday-message' aria-hidden={!visible}>
      <motion.span
        className='card-message-sparkle'
        aria-hidden
        variants={messageSparkleVariants(reducedMotion, sparkleDelay)}
        initial='hidden'
        animate={pose}
      />
      <motion.p
        className='card-inside-name'
        variants={messageItemVariants(reducedMotion, nameDelay)}
        initial='hidden'
        animate={pose}
      >
        {recipientName}
      </motion.p>
      <motion.h1
        className='card-inside-heading'
        variants={messageItemVariants(reducedMotion, headingDelay)}
        initial='hidden'
        animate={pose}
      >
        Happy Birthday
      </motion.h1>
      <motion.p
        className='card-inside-message'
        variants={messageItemVariants(reducedMotion, bodyDelay)}
        initial='hidden'
        animate={pose}
      >
        {message}
      </motion.p>
    </div>
  );
};

export default BirthdayMessage;
