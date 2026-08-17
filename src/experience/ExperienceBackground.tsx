import BackgroundParticles from '../decorations/BackgroundParticles';

const ExperienceBackground = () => {
  return (
    <>
      <div
        className='fixed inset-0 bg-linear-to-b from-sendiment-bg-deep via-sendiment-bg-mid to-sendiment-bg-deep'
        style={{ zIndex: 'var(--z-background)' }}
        aria-hidden
      />
      <BackgroundParticles />
    </>
  );
};

export default ExperienceBackground;
