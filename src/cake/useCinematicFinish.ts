import { useEffect, useRef, useState } from 'react';
import { scaleTimeline, TIMELINES } from '../experience/timelines';
import type { CandlesHandle } from './Candles';

interface UseCinematicFinishOptions {
  enabled: boolean;
  litCount: number;
  totalBlowable: number;
  reducedMotion: boolean;
  candlesRef: React.RefObject<CandlesHandle | null>;
}

/**
 * Auto-extinguishes leftover candles so the scene cannot stall.
 * Remainder finish (≤3 lit) only runs when the cake started with more than
 * 3 blowable candles — otherwise a 1–3 year cake would skip blowing entirely.
 */
export function useCinematicFinish({
  enabled,
  litCount,
  totalBlowable,
  reducedMotion,
  candlesRef,
}: UseCinematicFinishOptions): boolean {
  const [timedOut, setTimedOut] = useState(false);
  const startedRef = useRef(false);
  const reducedMotionRef = useRef(reducedMotion);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  const remainderFinish =
    enabled &&
    totalBlowable > TIMELINES.blowing.cinematicRemainThreshold &&
    litCount > 0 &&
    litCount <= TIMELINES.blowing.cinematicRemainThreshold;

  const autoFinishing = remainderFinish || (enabled && timedOut);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setTimedOut(true);
    }, TIMELINES.blowing.cinematicTimeout);

    return () => window.clearTimeout(timerId);
  }, [enabled]);

  useEffect(() => {
    if (!autoFinishing || startedRef.current) {
      return;
    }

    const remaining = candlesRef.current?.litCount ?? 0;
    if (remaining <= 0) {
      return;
    }

    startedRef.current = true;
    const duration = scaleTimeline(
      TIMELINES.blowing.cinematicDuration,
      reducedMotionRef.current,
    );
    const step = remaining === 1 ? 0 : duration / remaining;
    const timerIds: number[] = [];

    for (let index = 0; index < remaining; index += 1) {
      const timerId = window.setTimeout(() => {
        candlesRef.current?.blowOutNextNCandles(1);
      }, index * step);
      timerIds.push(timerId);
    }

    return () => {
      timerIds.forEach((id) => window.clearTimeout(id));
    };
  }, [autoFinishing, candlesRef]);

  return autoFinishing;
}
