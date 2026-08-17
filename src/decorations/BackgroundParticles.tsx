const PARTICLE_COUNT = 18;

const particles = Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
  id: index,
  left: `${(index * 17 + 11) % 100}%`,
  top: `${(index * 23 + 7) % 100}%`,
  size: 2 + (index % 3),
  delay: (index % 5) * 0.8,
  duration: 4 + (index % 4),
}));

const BackgroundParticles = () => {
  return (
    <div
      className='pointer-events-none absolute inset-0 overflow-hidden'
      style={{ zIndex: 'var(--z-background)' }}
      aria-hidden
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className='absolute rounded-full bg-white/5 motion-safe:animate-pulse'
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundParticles;
