import { createContext } from 'react';
import { birthdayData } from '../data/birthdayData';
import type { ExperienceAction, ExperienceStage } from './types';

export type BirthdayData = typeof birthdayData;

export interface ExperienceContextValue {
  stage: ExperienceStage;
  dispatch: React.Dispatch<ExperienceAction>;
  birthdayData: BirthdayData;
}

export const ExperienceContext = createContext<ExperienceContextValue | null>(
  null,
);
