/**
 * React hook that fires `onBlow` when volume crosses blow-detection thresholds.
 */

import { useEffect, useRef, useState } from 'react';
import { BlowDetector } from './blowDetector';
import type { BlowDetectorOptions, VolumeLevel } from './types';

export function useBlowDetector(
  volume: VolumeLevel,
  active: boolean,
  onBlow: () => void,
  options?: BlowDetectorOptions,
): { isCalibrated: boolean; ambientBaseline: VolumeLevel } {
  const detectorRef = useRef<BlowDetector | null>(null);
  const onBlowRef = useRef(onBlow);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [ambientBaseline, setAmbientBaseline] = useState<VolumeLevel>(0);

  if (detectorRef.current == null) {
    detectorRef.current = new BlowDetector(options);
  }

  useEffect(() => {
    onBlowRef.current = onBlow;
  }, [onBlow]);

  // Reset detector when monitoring stops (no setState — return values derive from `active`).
  useEffect(() => {
    if (!active) {
      detectorRef.current?.reset();
    }
  }, [active]);

  useEffect(() => {
    if (!active) {
      return;
    }

    const detector = detectorRef.current;
    if (!detector) {
      return;
    }

    // Defer state updates to avoid synchronous setState inside the effect body.
    const frameId = requestAnimationFrame(() => {
      const detected = detector.process(volume);
      setIsCalibrated(detector.isCalibrated);
      setAmbientBaseline(detector.ambientBaseline);

      if (detected) {
        onBlowRef.current();
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [volume, active]);

  return {
    isCalibrated: active ? isCalibrated : false,
    ambientBaseline: active ? ambientBaseline : 0,
  };
}
