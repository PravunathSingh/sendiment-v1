/**
 * Named animation durations (ms) per stage. Scenes import these instead of magic numbers.
 * Target values from spec §11; tune in Phase 9 polish.
 */
export const TIMELINES = {
  intro: {
    backgroundFadeIn: 600,
    headlineDelay: 200,
    sublineDelay: 500,
    ctaDelay: 800,
    ctaIdle: 1400,
    fadeOut: 400,
  },
  cakeEnter: {
    containerFadeIn: 0,
    layersSlideUp: 300,
    candlesDropIn: 600,
    flamesIgnite: 900,
    complete: 1400,
  },
  blowing: {
    allOutPause: 300,
  },
  celebration: {
    smokePuff: 0,
    confettiDelay: 150,
    flashDelay: 300,
    cakeFadeDelay: 600,
    complete: 1200,
    total: 1800,
  },
  cardReveal: {
    enterDuration: 800,
    settle: 1200,
  },
  cardOpening: {
    duration: 1200,
  },
  cardOpen: {
    balloonsEnter: 0,
    balloonsSettled: 800,
    nameReveal: 1000,
    headingReveal: 1400,
    messageReveal: 1800,
    messageComplete: 2400,
  },
} as const;

export const REDUCED_MOTION_FACTOR = 0.4;

export function scaleTimeline(ms: number, reducedMotion: boolean): number {
  return reducedMotion ? Math.round(ms * REDUCED_MOTION_FACTOR) : ms;
}
