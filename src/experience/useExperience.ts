import { useContext } from 'react';
import {
  ExperienceContext,
  type ExperienceContextValue,
} from './experienceContext';

export function useExperience(): ExperienceContextValue {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error('useExperience must be used within an ExperienceProvider');
  }
  return context;
}
