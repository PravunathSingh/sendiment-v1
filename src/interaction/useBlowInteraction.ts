import { useCallback, useEffect, useRef } from 'react';
import type { VolumeLevel } from '../audio/types';
import type { CandlesHandle } from '../cake/Candles';
import { TIMELINES } from '../experience/timelines';

export type InteractionMode = 'microphone' | 'tap-hold';

const STRONG_BLOW_THRESHOLD = 0.22;

export function candlesPerBlow(volume: VolumeLevel): number {
  return volume >= STRONG_BLOW_THRESHOLD ? 4 : 3;
}

interface UseBlowInteractionOptions {
  candlesRef: React.RefObject<CandlesHandle | null>;
  enabled: boolean;
  interactionMode: InteractionMode;
  volume: VolumeLevel;
  onBlow?: (count: number) => void;
  onAllCandlesOut?: () => void;
}

export function useBlowInteraction({
  candlesRef,
  enabled,
  interactionMode,
  volume,
  onBlow,
  onAllCandlesOut,
}: UseBlowInteractionOptions) {
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastBlowRef = useRef(0);
  const onAllCandlesOutRef = useRef(onAllCandlesOut);
  const onBlowRef = useRef(onBlow);

  useEffect(() => {
    onAllCandlesOutRef.current = onAllCandlesOut;
    onBlowRef.current = onBlow;
  }, [onAllCandlesOut, onBlow]);

  const extinguishCandles = useCallback((count: number) => {
    const now = Date.now();
    if (now - lastBlowRef.current < TIMELINES.blowing.tapHoldInterval) {
      return 0;
    }

    lastBlowRef.current = now;
    const blown = candlesRef.current?.blowOutNextNCandles(count) ?? 0;
    if (blown > 0) {
      onBlowRef.current?.(blown);
    }

    if (candlesRef.current?.litCount === 0) {
      onAllCandlesOutRef.current?.();
    }

    return blown;
  }, [candlesRef]);

  const handleMicBlow = useCallback(() => {
    if (!enabled || interactionMode !== 'microphone') {
      return;
    }

    extinguishCandles(candlesPerBlow(volume));
  }, [enabled, extinguishCandles, interactionMode, volume]);

  const stopTapHold = useCallback(() => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  }, []);

  const startTapHold = useCallback(() => {
    if (!enabled) {
      return;
    }

    const blow = () => {
      extinguishCandles(candlesPerBlow(0.3));
    };

    stopTapHold();
    blow();
    holdIntervalRef.current = setInterval(
      blow,
      TIMELINES.blowing.tapHoldInterval,
    );
  }, [enabled, extinguishCandles, stopTapHold]);

  useEffect(() => {
    if (!enabled) {
      stopTapHold();
    }
  }, [enabled, stopTapHold]);

  useEffect(() => {
    return () => stopTapHold();
  }, [stopTapHold]);

  return {
    handleMicBlow,
    startTapHold,
    stopTapHold,
    extinguishSingleCandle: (id: string) => {
      candlesRef.current?.blowOutCandle(id);
      if (candlesRef.current?.litCount === 0) {
        onAllCandlesOutRef.current?.();
      }
    },
  };
}
