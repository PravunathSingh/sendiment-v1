/**
 * Named animation durations (ms) per stage. Scenes import these instead of magic numbers.
 * Phase 9 timing pass: expo ease for fades, hinge ease + overshoot for the card.
 */
export const TIMELINES = {
  motion: {
    fadeFast: 280,
    fade: 400,
    fadeMedium: 450,
    fadeSlow: 500,
    dropIn: 360,
    balloonIn: 560,
    balloonOut: 320,
    hint: 200,
    hover: 160,
    tap: 120,
    sparkle: 420,
  },
  intro: {
    backgroundFadeIn: 600,
    headlineDelay: 200,
    headlineDuration: 520,
    sublineDelay: 500,
    sublineDuration: 460,
    ctaDelay: 800,
    ctaDuration: 420,
    ctaIdle: 1400,
    fadeOut: 400,
  },
  cakeEnter: {
    containerFadeIn: 0,
    containerDuration: 480,
    layersSlideUp: 300,
    candlesDropIn: 600,
    flamesIgnite: 900,
    complete: 1400,
  },
  blowing: {
    allOutPause: 300,
    tapHoldInterval: 400,
    cinematicRemainThreshold: 3,
    cinematicTimeout: 45_000,
    cinematicDuration: 1200,
    weakBlowHint: 30_000,
    extinguishMs: 560,
    blowStaggerMs: 50,
  },
  celebration: {
    smokePuff: 0,
    confettiDelay: 150,
    flashDelay: 300,
    cakeFadeDelay: 600,
    cakeFadeDuration: 500,
    complete: 1200,
    total: 1800,
  },
  cardReveal: {
    enterDuration: 800,
    settle: 1200,
  },
  cardOpening: {
    duration: 1200,
    overshootAt: 0.72,
  },
  cardOpen: {
    balloonsEnter: 0,
    balloonStagger: 100,
    balloonsSettled: 800,
    nameReveal: 1000,
    headingReveal: 1400,
    messageReveal: 1800,
    messageComplete: 2400,
  },
  cardReplay: {
    close: 900,
    open: 1200,
  },
} as const;

/** Delays for BirthdayMessage, measured from the `message` stage (after balloons settle). */
export function delayFromMessageStage(absoluteFromCardOpenMs: number): number {
  return Math.max(0, absoluteFromCardOpenMs - TIMELINES.cardOpen.balloonsSettled);
}

export const REDUCED_MOTION_FACTOR = 0.4;

export function scaleTimeline(ms: number, reducedMotion: boolean): number {
  return reducedMotion ? Math.round(ms * REDUCED_MOTION_FACTOR) : ms;
}
