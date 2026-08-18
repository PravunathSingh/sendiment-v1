import { useEffect, useRef } from 'react';
import type { ExperienceStage } from './types';

function getStageAnnouncement(
  stage: ExperienceStage,
  recipientName: string,
  message: string,
): string {
  switch (stage) {
    case 'intro':
      return `Someone made something special for ${recipientName}. Start the surprise when you are ready.`;
    case 'cake-enter':
      return `Birthday cake appearing for ${recipientName}.`;
    case 'blowing':
      return `Blow out the candles on ${recipientName}'s cake. Blow into the microphone, tap and hold the cake, or select a candle.`;
    case 'celebration':
      return `Celebration time for ${recipientName}!`;
    case 'card-reveal':
      return `A birthday card for ${recipientName} is arriving.`;
    case 'card-opening':
      return `Opening ${recipientName}'s birthday card.`;
    case 'card-open':
      return 'Balloons floating in.';
    case 'message':
      return `Birthday message for ${recipientName}. Happy Birthday. ${message}`;
    case 'complete':
      return `Birthday surprise complete for ${recipientName}. Replay card opening is available.`;
  }
}

interface ScreenReaderAnnouncerProps {
  stage: ExperienceStage;
  recipientName: string;
  message: string;
}

const ScreenReaderAnnouncer = ({
  stage,
  recipientName,
  message,
}: ScreenReaderAnnouncerProps) => {
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = announcementRef.current;
    if (!node) {
      return;
    }

    const next = getStageAnnouncement(stage, recipientName, message);
    node.textContent = '';

    const frame = window.requestAnimationFrame(() => {
      node.textContent = next;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [stage, recipientName, message]);

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
