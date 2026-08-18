import { useReducer } from 'react';
import type { ExperienceAction, ExperienceStage } from './types';

const INITIAL_STAGE: ExperienceStage = 'intro';

const TRANSITIONS: Record<
  ExperienceStage,
  Partial<Record<ExperienceAction['type'], ExperienceStage>>
> = {
  intro: { START_EXPERIENCE: 'cake-enter' },
  'cake-enter': { CAKE_ENTER_COMPLETE: 'blowing' },
  blowing: { ALL_CANDLES_OUT: 'celebration' },
  celebration: { CELEBRATION_COMPLETE: 'card-reveal' },
  'card-reveal': { CARD_SETTLED: 'card-opening' },
  'card-opening': { CARD_OPEN_COMPLETE: 'card-open' },
  'card-open': { BALLOONS_SETTLED: 'message' },
  message: { MESSAGE_REVEAL_COMPLETE: 'complete' },
  complete: {},
};

function experienceReducer(
  stage: ExperienceStage,
  action: ExperienceAction,
): ExperienceStage {
  if (action.type === 'DEV_JUMP_TO_STAGE') {
    return action.stage;
  }

  const nextStage = TRANSITIONS[stage][action.type];
  return nextStage ?? stage;
}

export function useExperienceStage() {
  return useReducer(experienceReducer, INITIAL_STAGE);
}
