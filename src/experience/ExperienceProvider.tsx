import { useMemo, type ReactNode } from 'react';
import { useQueryStates } from 'nuqs';
import { birthdaySearchParams } from '../data/birthdaySearchParams';
import { ExperienceContext } from './experienceContext';
import { useExperienceStage } from './useExperienceStage';

interface ExperienceProviderProps {
  children: ReactNode;
}

export function ExperienceProvider({ children }: ExperienceProviderProps) {
  const [stage, dispatch] = useExperienceStage();
  const [{ name, age, message }] = useQueryStates(birthdaySearchParams);
  const birthdayData = useMemo(
    () => ({
      recipientName: name,
      age,
      message,
    }),
    [name, age, message],
  );

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
