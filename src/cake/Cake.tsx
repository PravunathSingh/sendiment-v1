import { useRef, useState } from 'react';
import {
  useMicrophoneVolume,
} from '../audio';
import BlowInteraction from '../interaction/BlowInteraction';
import type { InteractionMode } from '../interaction/useBlowInteraction';
import Candles, { type CandlesHandle } from './Candles';
import { useCandleLayout } from './useCandleLayout';

interface CakeProps {
  age?: number;
  interactionMode?: InteractionMode;
  micActive?: boolean;
  volume?: number;
}

const Cake = ({
  age = 26,
  interactionMode = 'microphone',
  micActive = false,
  volume = 0,
}: CakeProps) => {
  const candlesRef = useRef<CandlesHandle>(null);
  const [litCount, setLitCount] = useState<number | null>(null);
  const layout = useCandleLayout(age);

  return (
    <div className='max-w-xs w-full'>
      <div className='relative rounded-2xl bg-linear-to-b from-[#f8c8dc] to-[#e8a0b8] px-4 pt-10 pb-6 shadow-xl'>
        {layout.showAgeTopper && (
          <div className='absolute -top-6 left-1/2 -translate-x-1/2 rounded-lg bg-amber-100 px-4 py-1 text-2xl font-bold text-amber-900 shadow-md'>
            {layout.displayAge}
          </div>
        )}

        <div className='relative mx-auto h-24 w-full'>
          <Candles
            key={`${layout.displayAge}-${layout.blowableCount}`}
            ref={candlesRef}
            layout={layout}
            onLitCountChange={setLitCount}
          />
        </div>

        <div className='mt-2 h-16 rounded-xl bg-[#c97b9a]' />

        <BlowInteraction
          candlesRef={candlesRef}
          enabled
          interactionMode={interactionMode}
          volume={volume}
          isMicActive={micActive}
        />
      </div>

      <p className='mt-4 text-center text-sm text-white/60'>
        {litCount ?? layout.blowableCount} candles lit
      </p>
    </div>
  );
};

/** Standalone dev cake with built-in mic controls. */
export const DevCake = () => {
  const { volume, status, isActive, start, stop } = useMicrophoneVolume();

  return (
    <div className='flex flex-col items-center gap-4'>
      <Cake
        age={26}
        interactionMode='microphone'
        micActive={isActive}
        volume={volume}
      />
      <button
        type='button'
        onClick={() => (isActive ? stop() : void start())}
        disabled={status === 'starting'}
        className='rounded-lg bg-red-200 px-6 py-3 text-red-900 disabled:opacity-60'
      >
        {isActive ? 'Stop mic' : 'Start mic'}
      </button>
    </div>
  );
};

export default Cake;
