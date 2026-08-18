import { motion, useReducedMotion } from 'motion/react';
import { introSceneVariants } from '../../animation/variants';
import type { InteractionMode } from '../../experience/types';
import { HEADLINE_ID } from './IntroCopy';
import IntroCopy from './IntroCopy';
import StartButton from './StartButton';
import './intro.css';

interface IntroSceneProps {
  requestMicrophone: () => Promise<boolean>;
  onInteractionModeChange: (mode: InteractionMode) => void;
}

const IntroScene = ({
  requestMicrophone,
  onInteractionModeChange,
}: IntroSceneProps) => {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);

  return (
    <motion.section
      className='absolute inset-0 flex flex-col items-center justify-center px-6 text-center'
      style={{
        zIndex: 'var(--z-interaction)',
        paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
      }}
      aria-labelledby={HEADLINE_ID}
      variants={introSceneVariants(reducedMotion)}
      initial='initial'
      animate='animate'
      exit='exit'
    >
      <div className='relative flex flex-col items-center gap-10'>
        <IntroCopy />
        <StartButton
          requestMicrophone={requestMicrophone}
          onInteractionModeChange={onInteractionModeChange}
        />
      </div>
    </motion.section>
  );
};

export default IntroScene;
