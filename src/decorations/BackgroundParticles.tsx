const PARTICLE_COUNT = 18;

const particles = Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
  id: index,
  left: `${(index * 17 + 11) % 100}%`,
  top: `${(index * 23 + 7) % 100}%`,
  size: 2 + (index % 3),
  delay: (index % 5) * 0.8,
  duration: 5 + (index % 4),
  amber: index % 3 === 0,
}));

const BackgroundParticles = () => {
  return (
    <div
      className='pointer-events-none absolute inset-0 overflow-hidden'
      aria-hidden
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={[
            'absolute rounded-full motion-safe:animate-pulse',
            particle.amber ? 'bg-sendiment-amber/20' : 'bg-sendiment-cream/10',
          ].join(' ')}
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
