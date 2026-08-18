const SPARKLES = [
  { x: 50, y: 32, s: 12, d: 0 },
  { x: 62, y: 36, s: 8, d: 0.04 },
  { x: 71, y: 46, s: 10, d: 0.08 },
  { x: 64, y: 58, s: 7, d: 0.12 },
  { x: 50, y: 65, s: 11, d: 0.05 },
  { x: 36, y: 58, s: 8, d: 0.1 },
  { x: 29, y: 46, s: 10, d: 0.02 },
  { x: 38, y: 36, s: 7, d: 0.14 },
  { x: 55, y: 42, s: 6, d: 0.18 },
  { x: 45, y: 50, s: 9, d: 0.07 },
  { x: 58, y: 52, s: 6, d: 0.16 },
  { x: 42, y: 40, s: 5, d: 0.2 },
  { x: 48, y: 28, s: 7, d: 0.11 },
  { x: 67, y: 40, s: 5, d: 0.15 },
] as const;

const Sparkles = () => {
  return (
    <div className='pointer-events-none absolute inset-0' aria-hidden>
      {SPARKLES.map((sparkle, index) => (
        <span
          key={index}
          className='celebration-sparkle'
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.s,
            height: sparkle.s,
            animationDelay: `${sparkle.d}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Sparkles;
