import { createContext } from 'react';
import type { BirthdayData } from '../data/birthdayData';
import type { ExperienceAction, ExperienceStage } from './types';

export type { BirthdayData };

export interface ExperienceContextValue {
  stage: ExperienceStage;
  dispatch: React.Dispatch<ExperienceAction>;
  birthdayData: BirthdayData;
}

export const ExperienceContext = createContext<ExperienceContextValue | null>(
  null,
);
