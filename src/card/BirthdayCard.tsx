import { motion } from 'motion/react';
import { cardCoverVariants } from '../animation/variants';
import BirthdayMessage from './BirthdayMessage';
import CardCover from './CardCover';
import CardInside from './CardInside';
import './card.css';

interface BirthdayCardProps {
  isOpen: boolean;
  isOpening: boolean;
  reducedMotion: boolean;
  recipientName: string;
  message: string;
  revealMessage: boolean;
}

const BirthdayCard = ({
  isOpen,
  isOpening,
  reducedMotion,
  recipientName,
  message,
  revealMessage,
}: BirthdayCardProps) => {
  const monogram = recipientName.trim().charAt(0).toUpperCase() || 'S';

  return (
    <div
      className={[
        'birthday-card',
        isOpening ? 'birthday-card--opening' : '',
      ].join(' ')}
    >
      <CardInside hidden={!isOpen}>
        <BirthdayMessage
          recipientName={recipientName}
          message={message}
          visible={revealMessage}
          reducedMotion={reducedMotion}
        />
      </CardInside>

      <motion.div
        className={['card-cover', isOpen ? 'card-cover--open' : ''].join(' ')}
        variants={cardCoverVariants(reducedMotion)}
        initial='closed'
        animate={isOpen ? 'open' : 'closed'}
        aria-hidden={isOpen}
        style={{
          transformOrigin: 'left center',
          transformStyle: 'preserve-3d',
        }}
      >
        <CardCover monogram={monogram} hidden={isOpen} />
      </motion.div>
    </div>
  );
};

export default BirthdayCard;
