import type confetti from 'canvas-confetti';

export const CONFETTI_COLORS = [
  '#fbbf24',
  '#fef3c7',
  '#f87171',
  '#d4a054',
  '#c4b5fd',
  '#7dd3fc',
  '#6ee7b7',
] as const;

const MOBILE_PARTICLE_COUNT = 80;
const DESKTOP_PARTICLE_COUNT = 150;

let confettiModule: typeof confetti | null = null;
let loadPromise: Promise<typeof confetti> | null = null;

export function getCelebrationParticleCount(): number {
  if (typeof window === 'undefined') {
    return DESKTOP_PARTICLE_COUNT;
  }

  return window.matchMedia('(max-width: 640px)').matches
    ? MOBILE_PARTICLE_COUNT
    : DESKTOP_PARTICLE_COUNT;
}

export async function loadConfetti(): Promise<typeof confetti> {
  if (confettiModule) {
    return confettiModule;
  }

  if (!loadPromise) {
    loadPromise = import('canvas-confetti').then((mod) => {
      confettiModule = mod.default ?? (mod as unknown as typeof confetti);
      return confettiModule;
    });
  }

  return loadPromise;
}

export async function fireCelebrationBurst(
  canvas: HTMLCanvasElement,
): Promise<confetti.CreateTypes> {
  const confettiLib = await loadConfetti();
  const fire = confettiLib.create(canvas, {
    resize: true,
    useWorker: true,
    disableForReducedMotion: true,
  });

  const particleCount = getCelebrationParticleCount();
  const shared = {
    colors: [...CONFETTI_COLORS],
    disableForReducedMotion: true as const,
    ticks: 200,
  };

  fire({
    ...shared,
    particleCount: Math.round(particleCount * 0.6),
    spread: 70,
    origin: { x: 0.5, y: 0.55 },
    startVelocity: 42,
  });

  fire({
    ...shared,
    particleCount: Math.round(particleCount * 0.4),
    spread: 110,
    origin: { x: 0.5, y: 0.25 },
    startVelocity: 55,
    scalar: 0.9,
  });

  return fire;
}
