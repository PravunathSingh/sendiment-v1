export type QaSurface =
  | 'Desktop Chrome'
  | 'Desktop Safari'
  | 'Desktop Firefox'
  | 'iOS Safari'
  | 'Android Chrome';

export interface QaCase {
  id: string;
  title: string;
  check: string;
}

export const QA_SURFACES: QaSurface[] = [
  'Desktop Chrome',
  'Desktop Safari',
  'Desktop Firefox',
  'iOS Safari',
  'Android Chrome',
];

export const QA_CASES: QaCase[] = [
  {
    id: 'mic-granted',
    title: 'Mic granted',
    check: 'CTA requests mic; blows extinguish 3–4 candles with a 400ms cooldown.',
  },
  {
    id: 'mic-denied',
    title: 'Mic denied',
    check: 'Hint becomes “Tap and hold to blow” with no red error styling.',
  },
  {
    id: 'mic-unsupported',
    title: 'Mic unsupported',
    check: 'Tap-hold is available from the start of the blowing stage.',
  },
  {
    id: 'tap-hold',
    title: 'Tap-hold',
    check: 'Holding the cake zone blows 3–4 candles every 400ms.',
  },
  {
    id: 'single-candle',
    title: 'Single-candle tap',
    check: 'A lit candle can be tapped or focused + Enter/Space to extinguish it.',
  },
  {
    id: 'cinematic',
    title: 'Cinematic finish',
    check: '≤3 remaining candles auto-finish; 45s timeout if more remain.',
  },
  {
    id: 'reduced-motion',
    title: 'Reduced motion',
    check: 'No confetti or 3D hinge; opacity fades; flow still completes.',
  },
  {
    id: 'keyboard',
    title: 'Keyboard',
    check: 'Start CTA, blow zone, candles, and replay are reachable with visible focus.',
  },
  {
    id: 'short-viewport',
    title: 'Short viewport',
    check: 'Cake and card stay on-screen at ~375×667 and landscape phones; no page scroll.',
  },
  {
    id: 'refresh',
    title: 'Refresh',
    check: 'Reload returns to intro. No sound plays at any stage.',
  },
  {
    id: 'card-replay',
    title: 'Card replay',
    check: 'After the message, “Replay card opening” closes and reopens the card.',
  },
  {
    id: 'card-open-perf',
    title: 'Card open smoothness',
    check: 'Profile card open: transform-only hinge, no visible jank on mid-range phones.',
  },
];
