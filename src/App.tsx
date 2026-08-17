import { MotionConfig } from 'motion/react';
import BirthdayExperience from './experience/BirthdayExperience';
import { ExperienceProvider } from './experience/ExperienceProvider';

const App = () => {
  return (
    <MotionConfig reducedMotion='user'>
      <ExperienceProvider>
        <BirthdayExperience />
      </ExperienceProvider>
    </MotionConfig>
  );
};

export default App;
