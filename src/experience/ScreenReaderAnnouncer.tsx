import { useEffect, useRef } from 'react';
import type { ExperienceStage } from './types';

const STAGE_ANNOUNCEMENTS: Partial<Record<ExperienceStage, string>> = {
  'cake-enter': 'Birthday cake appearing.',
  blowing: 'Blow out the candles on the cake.',
  celebration: 'Celebration time!',
  'card-reveal': 'A birthday card is arriving.',
  'card-opening': 'Opening the card.',
  'card-open': 'Balloons floating in.',
  message: 'Birthday message revealed.',
  complete: 'Birthday surprise complete.',
};

interface ScreenReaderAnnouncerProps {
  stage: ExperienceStage;
  recipientName: string;
}

const ScreenReaderAnnouncer = ({
  stage,
  recipientName,
}: ScreenReaderAnnouncerProps) => {
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const message = STAGE_ANNOUNCEMENTS[stage];
    if (!message || !announcementRef.current) {
      return;
    }

    announcementRef.current.textContent =
      stage === 'message' || stage === 'complete'
        ? `${message} Happy birthday, ${recipientName}.`
        : message;
  }, [stage, recipientName]);

  return (
    <div
      ref={announcementRef}
      className='sr-only'
      role='status'
      aria-live='polite'
      aria-atomic
    />
  );
};

export default ScreenReaderAnnouncer;
