import { useBlowDetector } from '../audio';
import type { VolumeLevel } from '../audio/types';
import type { CandlesHandle } from '../cake/Candles';
import {
  type InteractionMode,
  useBlowInteraction,
} from './useBlowInteraction';

interface BlowInteractionProps {
  candlesRef: React.RefObject<CandlesHandle | null>;
  enabled: boolean;
  interactionMode: InteractionMode;
  volume: VolumeLevel;
  isMicActive: boolean;
  onAllCandlesOut?: () => void;
}

const BlowInteraction = ({
  candlesRef,
  enabled,
  interactionMode,
  volume,
  isMicActive,
  onAllCandlesOut,
}: BlowInteractionProps) => {
  const { handleMicBlow, startTapHold, stopTapHold } = useBlowInteraction({
    candlesRef,
    enabled,
    interactionMode,
    volume,
    onAllCandlesOut,
  });

  useBlowDetector(volume, isMicActive && enabled && interactionMode === 'microphone', handleMicBlow);

  if (!enabled) {
    return null;
  }

  if (interactionMode === 'tap-hold') {
    return (
      <div
        className='absolute inset-0 z-10 cursor-pointer touch-none'
        aria-label='Tap and hold to blow out candles'
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          startTapHold();
        }}
        onPointerUp={stopTapHold}
        onPointerCancel={stopTapHold}
        onPointerLeave={stopTapHold}
      />
    );
  }

  return (
    <div
      className='absolute inset-0 z-10 pointer-events-none'
      aria-hidden
    />
  );
};

export default BlowInteraction;
