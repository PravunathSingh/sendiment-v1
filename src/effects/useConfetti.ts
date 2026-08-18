import { useCallback, useEffect, useRef, type RefObject } from 'react';
import { useReducedMotion } from 'motion/react';
import type confetti from 'canvas-confetti';
import { fireCelebrationBurst } from '../celebration/confetti';

/**
 * Lazy-loads canvas-confetti onto a scene canvas and skips bursts when
 * the user prefers reduced motion.
 */
export function useConfetti(
  canvasRef: RefObject<HTMLCanvasElement | null>,
) {
  const prefersReducedMotion = useReducedMotion();
  const instanceRef = useRef<confetti.CreateTypes | null>(null);

  const fireBurst = useCallback(async () => {
    if (prefersReducedMotion || !canvasRef.current) {
      return false;
    }

    instanceRef.current = await fireCelebrationBurst(canvasRef.current);
    return true;
  }, [canvasRef, prefersReducedMotion]);

  useEffect(() => {
    return () => {
      instanceRef.current?.reset();
      instanceRef.current = null;
    };
  }, []);

  return {
    fireBurst,
    prefersReducedMotion: Boolean(prefersReducedMotion),
  };
}
