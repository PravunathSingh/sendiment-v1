import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import type { CandleLayout, CandlePosition } from './useCandleLayout';

interface CandleState {
  id: string;
  isLit: boolean;
}

interface CandlesProps {
  layout: CandleLayout;
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
  }));
}

const Candles = forwardRef<CandlesHandle, CandlesProps>(
  ({ layout, onLitCountChange }, ref) => {
    const positionMap = useMemo(
      () => new Map(layout.positions.map((position) => [position.id, position])),
      [layout.positions],
    );

    const [candleState, setCandleState] = useState<CandleState[]>(() =>
      createInitialState(layout.positions),
    );

    const blowOutCandle = (id: string) => {
      setCandleState((prev) =>
        prev.map((candle) =>
          candle.id === id && candle.isLit
            ? { ...candle, isLit: false }
            : candle,
        ),
      );
    };

    const blowOutNextNCandles = (count: number): number => {
      let blown = 0;

      setCandleState((prev) => {
        const next = [...prev];
        for (let index = 0; index < next.length && blown < count; index += 1) {
          if (next[index]?.isLit) {
            next[index] = { ...next[index], isLit: false };
            blown += 1;
          }
        }
        return next;
      });

      return blown;
    };

    const blowOutNextLitCandle = (): boolean =>
      blowOutNextNCandles(1) > 0;

    const litCount = candleState.filter((candle) => candle.isLit).length;

    useEffect(() => {
      onLitCountChange?.(litCount);
    }, [litCount, onLitCountChange]);

    useImperativeHandle(ref, () => ({
      blowOutNextLitCandle,
      blowOutNextNCandles,
      blowOutCandle,
      litCount,
    }));

    return (
      <div className='relative w-full h-20'>
        {candleState.map(({ id, isLit }) => {
          const position = positionMap.get(id);
          if (!position) {
            return null;
          }

          return (
            <div
              key={id}
              role='button'
              tabIndex={0}
              onClick={() => blowOutCandle(id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  blowOutCandle(id);
                }
              }}
              className='absolute -translate-x-1/2 -translate-y-full'
              style={{
                left: `${position.xPercent}%`,
                top: `${position.yPercent}%`,
              }}
            >
              <div
                className={`w-2 h-8 rounded-sm border transition-opacity duration-300 ${
                  isLit
                    ? 'bg-[#7B020B] border-[#5a0108] opacity-100'
                    : 'bg-[#9a6a6e] border-[#7a4a4e] opacity-70'
                }`}
              >
                {isLit && (
                  <div
                    className='absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-3 rounded-full bg-orange-400 shadow-[0_0_6px_2px_rgba(255,140,0,0.6)]'
                    aria-hidden
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);

Candles.displayName = 'Candles';

export default Candles;
