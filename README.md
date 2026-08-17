# Sendiment V1

A single-page, visual-only birthday surprise — blow out candles, celebrate with confetti, and open a 3D greeting card with a personal message.

V1 is a hard-coded demo that proves the core emotional experience works before any platform features (auth, card editor, sharing, etc.) exist.

## Experience flow

```
Intro → Cake enter → Blowing candles → Celebration → Card reveal → Card open → Message
```

1. **Intro** — recipient taps "Start the Surprise" (mic permission requested on the same gesture)
2. **Cake** — tiered candle layout animates in; user blows or tap-holds to extinguish 3–4 candles per blow
3. **Celebration** — confetti burst, then transition to the card
4. **Card** — closed card flies in, opens on a 3D hinge, balloons float in
5. **Message** — recipient name, "Happy Birthday", and personal message revealed

## Tech stack

| Layer | Choice |
| ----- | ------ |
| Framework | React 19 + Vite 8 + TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Motion (`motion/react`) |
| Confetti | canvas-confetti (lazy-loaded) |
| Card | CSS 3D transforms + Motion |
| Audio | Web Audio API — local blow detection only, nothing recorded |

React Compiler is enabled. No backend, database, or sound effects.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173). Microphone access requires HTTPS or localhost.

```bash
pnpm build    # production build
pnpm preview  # preview production build
pnpm lint     # ESLint
```

## Customizing content

Edit `src/data/birthdayData.ts` — the single source for recipient name, age, and message:

```ts
export const birthdayData = {
  recipientName: 'Friend',
  age: 26,
  message: 'Happy birthday! Wishing you a wonderful day filled with joy and celebration.',
} as const;
```

Age drives the tiered candle layout (e.g. age 26 → 12 blowable mini candles + numeric age topper).

## Project structure

```
src/
├── data/birthdayData.ts       # Hard-coded recipient content
├── experience/                # Stage machine, orchestrator, timelines
├── scenes/                    # (upcoming) Intro, Cake, Celebration, Card scenes
├── cake/                      # Cake, candles, tiered layout
├── card/                      # CSS 3D birthday card
├── interaction/               # Mic + tap-hold blow handling
├── audio/                     # Microphone capture and blow detection
├── effects/                   # Confetti
└── decorations/               # Background particles
```

## Interaction model

| Mode | Trigger | Behavior |
| ---- | ------- | -------- |
| Microphone | Blow detected after calibration | Extinguish 3–4 candles per blow |
| Tap-hold fallback | Mic denied or unsupported | 3–4 candles every 400ms while holding |
| Single tap | Individual candle | Accessibility fallback — one candle |

## Current status

- [x] Project scaffold (React 19, Vite 8, Tailwind 4)
- [x] Microphone blow detection pipeline
- [x] Tiered candle layout and multi-candle blow API
- [x] POC spikes — blow interaction, confetti, CSS 3D card
- [x] Experience foundation — stage reducer, orchestrator, design tokens
- [ ] Full scene components (intro, cake visuals, celebration, card/message polish)
- [ ] Accessibility pass and responsive QA

## Browser support

Chrome, Safari, Firefox, and Edge (last 2 versions). iOS Safari 16+ for microphone blow detection.
