import { motion, useReducedMotion } from 'motion/react';
import {
  introHeadlineVariants,
  introSublineVariants,
} from '../../animation/variants';

const HEADLINE_ID = 'intro-headline';
const DISCLAIMER_ID = 'intro-mic-disclaimer';

const IntroCopy = () => {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);

  return (
    <div className='relative max-w-md space-y-5'>
      <motion.h1
        id={HEADLINE_ID}
        className='font-display text-3xl font-semibold leading-[1.15] text-balance text-sendiment-cream sm:text-4xl md:text-5xl'
        variants={introHeadlineVariants(reducedMotion)}
        initial='initial'
        animate='animate'
      >
        Someone made something special for you…
      </motion.h1>

      <motion.div
        className='flex flex-col items-center gap-4'
        variants={introSublineVariants(reducedMotion)}
        initial='initial'
        animate='animate'
      >
        <div
          className='h-px w-24 bg-linear-to-r from-transparent via-sendiment-gold to-transparent'
          aria-hidden
        />
        <p
          id={DISCLAIMER_ID}
          className='max-w-xs text-pretty text-sm leading-relaxed text-sendiment-cream/80'
        >
          We&apos;ll listen for you blowing — nothing is recorded.
        </p>
      </motion.div>
    </div>
  );
};

export { DISCLAIMER_ID, HEADLINE_ID };
export default IntroCopy;
