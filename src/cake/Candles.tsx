import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TIMELINES } from '../experience/timelines';
import Candle from './Candle';
import type { CandleLayout, CandlePosition } from './useCandleLayout';

interface CandleState {
  id: string;
  isLit: boolean;
  staggerMs: number;
}

interface CandlesProps {
  layout: CandleLayout;
  ignited: boolean;
  reducedMotion: boolean;
  interactive: boolean;
  onLitCountChange?: (litCount: number) => void;
}

export interface CandlesHandle {
  /** Extinguish the next lit candle. Returns false when all candles are out. */
  blowOutNextLitCandle: () => boolean;
  /** Extinguish up to `count` lit candles in layout order. Returns how many were blown. */
  blowOutNextNCandles: (count: number) => number;
  /** Extinguish a single candle by id (accessibility fallback). */
  blowOutCandle: (id: string) => void;
  /** Count of candles still lit. */
  litCount: number;
}

function createInitialState(positions: CandlePosition[]): CandleState[] {
  return positions.map((position) => ({
    id: position.id,
    isLit: true,
    staggerMs: 0,
  }));
}

function countLit(state: CandleState[]): number {
  return state.reduce((total, candle) => total + (candle.isLit ? 1 : 0), 0);
}

const Candles = forwardRef<CandlesHandle, CandlesProps>(
  (
    { layout, ignited, reducedMotion, interactive, onLitCountChange },
    ref,
  ) => {
    const positionMap = useMemo(
      () =>
        new Map(layout.positions.map((position) => [position.id, position])),
      [layout.positions],
    );

    const [candleState, setCandleState] = useState<CandleState[]>(() =>
      createInitialState(layout.positions),
    );
    const candleStateRef = useRef(candleState);

    const commitState = (next: CandleState[]) => {
      candleStateRef.current = next;
      setCandleState(next);
      onLitCountChange?.(countLit(next));
    };

    const blowOutCandle = (id: string) => {
      const next = candleStateRef.current.map((candle) =>
        candle.id === id && candle.isLit
          ? { ...candle, isLit: false, staggerMs: 0 }
          : candle,
      );
      commitState(next);
    };

    const blowOutNextNCandles = (count: number): number => {
      let blown = 0;
      const next = candleStateRef.current.map((candle) => {
        if (candle.isLit && blown < count) {
          const staggerMs = blown * TIMELINES.blowing.blowStaggerMs;
          blown += 1;
          return { ...candle, isLit: false, staggerMs };
        }
        return candle;
      });
      commitState(next);
      return blown;
    };

    const blowOutNextLitCandle = (): boolean => blowOutNextNCandles(1) > 0;

    useImperativeHandle(ref, () => ({
      blowOutNextLitCandle,
      blowOutNextNCandles,
      blowOutCandle,
      get litCount() {
        return countLit(candleStateRef.current);
      },
    }));

    return (
      <div className='pointer-events-none absolute inset-0'>
        {candleState.map(({ id, isLit, staggerMs }, index) => {
          const position = positionMap.get(id);
          if (!position) {
            return null;
          }

          return (
            <Candle
              key={id}
              position={position}
              index={index}
              isLit={isLit}
              staggerMs={staggerMs}
              ignited={ignited}
              reducedMotion={reducedMotion}
              interactive={interactive}
              onBlowOut={blowOutCandle}
            />
          );
        })}
      </div>
    );
  },
);

Candles.displayName = 'Candles';

export default Candles;
