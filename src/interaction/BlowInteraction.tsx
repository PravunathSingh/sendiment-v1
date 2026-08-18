import { useEffect, useRef } from 'react';
import { useBlowDetector } from '../audio';
import type { VolumeLevel } from '../audio/types';
import type { CandlesHandle } from '../cake/Candles';
import { TIMELINES } from '../experience/timelines';
import {
  type InteractionMode,
  useBlowInteraction,
} from './useBlowInteraction';

interface BlowInteractionProps {
  candlesRef: React.RefObject<CandlesHandle | null>;
  enabled: boolean;
  micListening: boolean;
  interactionMode: InteractionMode;
  volume: VolumeLevel;
  isMicActive: boolean;
}

const BlowInteraction = ({
  candlesRef,
  enabled,
  micListening,
  interactionMode,
  volume,
  isMicActive,
}: BlowInteractionProps) => {
  const zoneRef = useRef<HTMLDivElement>(null);
  const holdingKeyRef = useRef(false);
  const { handleMicBlow, startTapHold, stopTapHold } = useBlowInteraction({
    candlesRef,
    enabled,
    interactionMode,
    volume,
  });

  useBlowDetector(
    volume,
    isMicActive && micListening && interactionMode === 'microphone',
    handleMicBlow,
    { cooldownMs: TIMELINES.blowing.tapHoldInterval },
  );

  useEffect(() => {
    if (!enabled) {
      holdingKeyRef.current = false;
      return;
    }

    zoneRef.current?.focus();
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  const label =
    interactionMode === 'microphone'
      ? 'Blow into the microphone, or tap and hold the cake to blow out candles'
      : 'Tap and hold the cake to blow out candles';

  return (
    <div
      ref={zoneRef}
      className='cake-blow-zone'
      role='button'
      tabIndex={0}
      aria-label={label}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        startTapHold();
      }}
      onPointerUp={stopTapHold}
      onPointerCancel={stopTapHold}
      onPointerLeave={stopTapHold}
      onKeyDown={(event) => {
        if (event.key !== ' ' && event.key !== 'Enter') {
          return;
        }

        event.preventDefault();
        if (holdingKeyRef.current) {
          return;
        }

        holdingKeyRef.current = true;
        startTapHold();
      }}
      onKeyUp={(event) => {
        if (event.key !== ' ' && event.key !== 'Enter') {
          return;
        }

        holdingKeyRef.current = false;
        stopTapHold();
      }}
      onBlur={stopTapHold}
    />
  );
};

export default BlowInteraction;
