import { useState } from 'react';
import { EXPERIENCE_STAGES, type ExperienceStage } from '../experience/types';
import { useExperience } from '../experience/useExperience';
import { QA_CASES, QA_SURFACES } from './manualMatrix';

const STAGE_LABELS: Record<ExperienceStage, string> = {
  intro: 'Intro',
  'cake-enter': 'Cake enter',
  blowing: 'Blowing',
  celebration: 'Celebration',
  'card-reveal': 'Card reveal',
  'card-opening': 'Card opening',
  'card-open': 'Card open',
  message: 'Message',
  complete: 'Complete',
};

const StageDevOverlay = () => {
  const { stage, dispatch } = useExperience();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  return (
    <div
      className='fixed right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(0.75rem,env(safe-area-inset-bottom))] font-body text-xs text-sendiment-cream'
      style={{ zIndex: 'var(--z-dev)' }}
    >
      <button
        type='button'
        className='min-h-11 rounded-full border border-sendiment-gold/50 bg-sendiment-bg-deep/90 px-3 font-medium tracking-wide backdrop-blur-md'
        aria-expanded={open}
        aria-controls='qa-panel'
        onClick={() => setOpen((current) => !current)}
      >
        QA {open ? 'close' : 'open'}
      </button>

      {open && (
        <div
          id='qa-panel'
          className='absolute right-0 bottom-14 w-[min(22rem,calc(100vw-1.5rem))] max-h-[min(70dvh,32rem)] overflow-auto rounded-xl border border-sendiment-gold/35 bg-sendiment-bg-deep/94 p-3 shadow-sendiment-card backdrop-blur-md'
        >
          <p className='mb-2 text-[0.7rem] uppercase tracking-[0.14em] text-sendiment-gold'>
            Stage jumper
          </p>
          <p className='mb-2 text-sendiment-cream/70'>
            Now: <span className='text-sendiment-cream'>{STAGE_LABELS[stage]}</span>
          </p>
          <div className='mb-3 flex flex-wrap gap-1.5'>
            {EXPERIENCE_STAGES.map((nextStage) => (
              <button
                key={nextStage}
                type='button'
                className={[
                  'min-h-8 rounded-full border px-2.5',
                  nextStage === stage
                    ? 'border-sendiment-amber bg-sendiment-amber/20 text-sendiment-cream'
                    : 'border-sendiment-gold/30 bg-transparent text-sendiment-cream/85',
                ].join(' ')}
                onClick={() =>
                  dispatch({ type: 'DEV_JUMP_TO_STAGE', stage: nextStage })
                }
              >
                {STAGE_LABELS[nextStage]}
              </button>
            ))}
          </div>

          <p className='mb-1 text-[0.7rem] uppercase tracking-[0.14em] text-sendiment-gold'>
            Surfaces
          </p>
          <p className='mb-3 text-sendiment-cream/70'>{QA_SURFACES.join(' · ')}</p>

          <p className='mb-2 text-[0.7rem] uppercase tracking-[0.14em] text-sendiment-gold'>
            Manual matrix
          </p>
          <ul className='space-y-2'>
            {QA_CASES.map((item) => (
              <li key={item.id}>
                <label className='flex cursor-pointer gap-2'>
                  <input
                    type='checkbox'
                    className='mt-0.5 size-4 shrink-0 accent-sendiment-amber'
                    checked={Boolean(checked[item.id])}
                    onChange={() =>
                      setChecked((current) => ({
                        ...current,
                        [item.id]: !current[item.id],
                      }))
                    }
                  />
                  <span>
                    <span className='font-medium text-sendiment-cream'>
                      {item.title}.
                    </span>{' '}
                    <span className='text-sendiment-cream/75'>{item.check}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StageDevOverlay;
