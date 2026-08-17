import type { ReactNode } from 'react';
import { birthdayData } from '../data/birthdayData';
import { ExperienceContext } from './experienceContext';
import { useExperienceStage } from './useExperienceStage';

interface ExperienceProviderProps {
  children: ReactNode;
}

export function ExperienceProvider({ children }: ExperienceProviderProps) {
  const [stage, dispatch] = useExperienceStage();

  return (
    <ExperienceContext
      value={{
        stage,
        dispatch,
        birthdayData,
      }}
    >
      {children}
    </ExperienceContext>
  );
}
