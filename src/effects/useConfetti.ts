import { useReducedMotion } from 'motion/react';
import { useCallback, useRef } from 'react';
import type confetti from 'canvas-confetti';

/**
 * Lazy-loads canvas-confetti on demand and respects reduced-motion preferences.
 */
export function useConfetti() {
  const prefersReducedMotion = useReducedMotion();
  const confettiRef = useRef<typeof confetti | null>(null);
  const loadingRef = useRef<Promise<void> | null>(null);

  const loadConfetti = useCallback(async () => {
    if (confettiRef.current) {
      return confettiRef.current;
    }

    if (!loadingRef.current) {
      loadingRef.current = import('canvas-confetti').then((module) => {
        confettiRef.current = module.default ?? (module as unknown as typeof confetti);
      });
    }

    await loadingRef.current;
    return confettiRef.current!;
  }, []);

  const fireBurst = useCallback(
    async (options?: { particleCount?: number }) => {
      if (prefersReducedMotion) {
        return false;
      }

      const fire = await loadConfetti();
      const isMobile = window.matchMedia('(max-width: 640px)').matches;
      const particleCount =
        options?.particleCount ?? (isMobile ? 80 : 150);

      fire({
        particleCount: Math.round(particleCount * 0.6),
        spread: 70,
        origin: { x: 0.5, y: 0.55 },
        disableForReducedMotion: true,
      });

      fire({
        particleCount: Math.round(particleCount * 0.4),
        spread: 50,
        origin: { x: 0.5, y: 0.25 },
        disableForReducedMotion: true,
      });

      return true;
    },
    [loadConfetti, prefersReducedMotion],
  );

  return {
    fireBurst,
    prefersReducedMotion,
  };
}
