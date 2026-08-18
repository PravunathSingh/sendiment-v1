import type { ReactNode } from 'react';

interface CardInsideProps {
  hidden: boolean;
  children: ReactNode;
}

const CardInside = ({ hidden, children }: CardInsideProps) => {
  return (
    <div className='card-inside' aria-hidden={hidden}>
      <span className='card-frame' aria-hidden />
      {children}
    </div>
  );
};

export default CardInside;
