import { motion } from 'motion/react';
import { cakeDropInVariants } from '../animation/variants';

interface AgeTopperProps {
  age: number;
  reducedMotion: boolean;
}

const AgeTopper = ({ age, reducedMotion }: AgeTopperProps) => {
  return (
    <motion.div
      className='age-topper absolute left-1/2 top-[72%] z-20 -translate-x-1/2 -translate-y-1/2'
      variants={cakeDropInVariants(reducedMotion, 0)}
      initial='initial'
      animate='animate'
      aria-hidden
    >
      <span className='age-topper__num'>{age}</span>
    </motion.div>
  );
};

export default AgeTopper;
