/**
 * Detects short loud bursts (blows) from a stream of RMS volume readings.
 *
 * Uses ambient-noise calibration so different microphones and rooms behave
 * more consistently than a single fixed threshold alone.
 */

import type { BlowDetectorOptions, VolumeLevel } from './types';

const DEFAULT_OPTIONS: Required<BlowDetectorOptions> = {
  threshold: 0.12,
  baselineMultiplier: 2.5,
  cooldownMs: 400,
  calibrationSampleCount: 60,
};

export class BlowDetector {
  private readonly options: Required<BlowDetectorOptions>;
  private lastBlowTime = 0;
  private baseline = 0.02;
  private calibrationSamples: VolumeLevel[] = [];
  private calibrated = false;

  constructor(options?: BlowDetectorOptions) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /** Whether calibration has finished and blow detection is active. */
  get isCalibrated(): boolean {
    return this.calibrated;
  }

  /** Estimated ambient noise level after calibration. */
  get ambientBaseline(): VolumeLevel {
    return this.baseline;
  }

  /**
   * Process one volume sample. Returns true when a blow is detected.
   * During calibration, returns false while collecting baseline samples.
   */
  process(volume: VolumeLevel): boolean {
    if (!this.calibrated) {
      this.calibrationSamples.push(volume);

      if (this.calibrationSamples.length >= this.options.calibrationSampleCount) {
        const sum = this.calibrationSamples.reduce((acc, v) => acc + v, 0);
        this.baseline = Math.max(sum / this.calibrationSamples.length, 0.01);
        this.calibrated = true;
      }

      return false;
    }

    const dynamicThreshold = Math.max(
      this.options.threshold,
      this.baseline * this.options.baselineMultiplier,
    );

    const now = Date.now();
    if (
      volume > dynamicThreshold &&
      now - this.lastBlowTime >= this.options.cooldownMs
    ) {
      this.lastBlowTime = now;
      return true;
    }

    return false;
  }

  /** Reset calibration and cooldown — call when restarting capture. */
  reset(): void {
    this.lastBlowTime = 0;
    this.baseline = 0.02;
    this.calibrationSamples = [];
    this.calibrated = false;
  }
}
