import { useCallback, useEffect, useState } from 'react';
import { scaleTimeline, TIMELINES } from '../experience/timelines';

export type CardReplayPhase = 'idle' | 'closing' | 'opening';

export function useCardReplay(reducedMotion: boolean) {
  const [phase, setPhase] = useState<CardReplayPhase>('idle');

  const replay = useCallback(() => {
    setPhase((current) => (current === 'idle' ? 'closing' : current));
  }, []);

  useEffect(() => {
    if (phase === 'idle') {
      return;
    }

    const duration = scaleTimeline(
      phase === 'closing'
        ? TIMELINES.cardReplay.close
        : TIMELINES.cardReplay.open,
      reducedMotion,
    );

    const timer = window.setTimeout(() => {
      setPhase((current) => {
        if (current === 'closing') {
          return 'opening';
        }

        if (current === 'opening') {
          return 'idle';
        }

        return current;
      });
    }, duration);

    return () => window.clearTimeout(timer);
  }, [phase, reducedMotion]);

  return {
    phase,
    isBusy: phase !== 'idle',
    replay,
  };
}
