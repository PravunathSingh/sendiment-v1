/** Shared easing curves for Motion timelines and CSS (`--ease-*` in index.css). */
export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;
export const EASE_CARD_HINGE = [0.32, 0.72, 0, 1] as const;

export const TAP_SCALE = 0.95;
export const CTA_ENTER_SCALE = 0.92;

/** Closed-card idle tilt, then hinge overshoot → readable rest (spec §7.5). */
export const CARD_IDLE_TILT_DEG = -12;
export const CARD_OPEN_OVERSHOOT_DEG = -160;
export const CARD_OPEN_REST_DEG = -150;
