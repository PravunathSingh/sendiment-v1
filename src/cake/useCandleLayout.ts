export type CandleLayoutTier =
  | 'individual'
  | 'double-row'
  | 'staggered'
  | 'arc'
  | 'decorative';

export interface CandlePosition {
  id: string;
  /** Horizontal position as percentage of container width (0–100). */
  xPercent: number;
  /** Vertical position as percentage of container height (0–100). */
  yPercent: number;
}

export interface CandleLayout {
  tier: CandleLayoutTier;
  blowableCount: number;
  displayAge: number;
  showAgeTopper: boolean;
  positions: CandlePosition[];
}

function singleRowPositions(count: number, yPercent = 50): CandlePosition[] {
  if (count === 0) {
    return [];
  }

  const span = Math.min(80, count * 8 + 10);
  const start = 50 - span / 2;

  return Array.from({ length: count }, (_, index) => {
    const x =
      count === 1 ? 50 : start + (index / (count - 1)) * span;
    return { id: `candle-${index}`, xPercent: x, yPercent };
  });
}

function doubleRowPositions(count: number): CandlePosition[] {
  const topCount = Math.ceil(count / 2);
  const bottomCount = count - topCount;
  const top = singleRowPositions(topCount, 35);
  const bottom = singleRowPositions(bottomCount, 65);

  return [
    ...top,
    ...bottom.map((position, index) => ({
      ...position,
      id: `candle-${topCount + index}`,
    })),
  ];
}

function staggeredPositions(count: number): CandlePosition[] {
  const perRow = Math.ceil(count / 2);
  const top = singleRowPositions(perRow, 38);
  const bottom = singleRowPositions(count - perRow, 62).map(
    (position, index) => ({
      ...position,
      id: `candle-${perRow + index}`,
      xPercent: position.xPercent + 4,
    }),
  );

  return [...top, ...bottom];
}

function arcPositions(count: number): CandlePosition[] {
  return Array.from({ length: count }, (_, index) => {
    const t = count === 1 ? 0.5 : index / (count - 1);
    const xPercent = 15 + t * 70;
    const yPercent = 55 - Math.sin(t * Math.PI) * 18;
    return { id: `candle-${index}`, xPercent, yPercent };
  });
}

function decorativePositions(count: number): CandlePosition[] {
  const offsets = [
    { x: 20, y: 45 },
    { x: 35, y: 55 },
    { x: 50, y: 40 },
    { x: 65, y: 55 },
    { x: 80, y: 45 },
    { x: 42, y: 62 },
    { x: 58, y: 62 },
  ];

  return offsets.slice(0, count).map((offset, index) => ({
    id: `candle-${index}`,
    xPercent: offset.x,
    yPercent: offset.y,
  }));
}

/**
 * Maps recipient age to a tiered candle layout strategy.
 * Ages 13+ use a fixed blowable mini-candle count plus an AgeTopper for display.
 */
export function useCandleLayout(age: number): CandleLayout {
  const displayAge = Math.max(1, Math.floor(age));

  if (displayAge <= 9) {
    return {
      tier: 'individual',
      blowableCount: displayAge,
      displayAge,
      showAgeTopper: false,
      positions: singleRowPositions(displayAge),
    };
  }

  if (displayAge <= 12) {
    return {
      tier: 'double-row',
      blowableCount: displayAge,
      displayAge,
      showAgeTopper: false,
      positions: doubleRowPositions(displayAge),
    };
  }

  if (displayAge <= 20) {
    const blowableCount = 12;
    return {
      tier: 'staggered',
      blowableCount,
      displayAge,
      showAgeTopper: true,
      positions: staggeredPositions(blowableCount),
    };
  }

  if (displayAge <= 30) {
    const blowableCount = 12;
    return {
      tier: 'arc',
      blowableCount,
      displayAge,
      showAgeTopper: true,
      positions: arcPositions(blowableCount),
    };
  }

  const blowableCount = displayAge >= 50 ? 7 : 6;
  return {
    tier: 'decorative',
    blowableCount,
    displayAge,
    showAgeTopper: true,
    positions: decorativePositions(blowableCount),
  };
}
