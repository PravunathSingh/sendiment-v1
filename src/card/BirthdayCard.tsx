import { motion, useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import { birthdayData } from '../data/birthdayData';
import './card.css';

interface BirthdayCardProps {
  isOpen?: boolean;
  onOpenComplete?: () => void;
}

const BirthdayCard = ({ isOpen = false, onOpenComplete }: BirthdayCardProps) => {
  const prefersReducedMotion = useReducedMotion();
  const hasReportedOpenRef = useRef(false);

  const closedRotation = prefersReducedMotion ? 0 : -12;
  const openRotation = prefersReducedMotion ? 0 : -155;
  const targetRotation = isOpen ? openRotation : closedRotation;

  return (
    <div className='card-scene flex items-center justify-center'>
      <motion.div
        className='card'
        initial={{ rotateY: closedRotation, opacity: 0, y: 40 }}
        animate={{
          rotateY: targetRotation,
          opacity: isOpen || !prefersReducedMotion ? 1 : 0,
          y: 0,
        }}
        transition={{
          rotateY: { type: 'spring', stiffness: 80, damping: 18, duration: 1.2 },
          opacity: { duration: 0.5 },
          y: { type: 'spring', stiffness: 120, damping: 20 },
        }}
        onAnimationComplete={() => {
          if (isOpen && !hasReportedOpenRef.current) {
            hasReportedOpenRef.current = true;
            onOpenComplete?.();
          }
        }}
        style={{
          transformOrigin: 'left center',
        }}
      >
        <div className='card-face card-cover' aria-hidden={isOpen}>
          <span className='card-cover-label'>For You</span>
        </div>

        <div
          className='card-face card-inside'
          aria-hidden={!isOpen}
          style={prefersReducedMotion && !isOpen ? { opacity: 0 } : undefined}
        >
          <p className='card-inside-name'>{birthdayData.recipientName}</p>
          <p className='card-inside-heading'>Happy Birthday</p>
          <p className='card-inside-message'>{birthdayData.message}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default BirthdayCard;
