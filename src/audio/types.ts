/**
 * Shared types for microphone capture and volume analysis.
 */

import type { MediaAudioError } from './errors';

/** Lifecycle state of a MicrophoneCapture instance. */
export type MicrophoneCaptureStatus = 'idle' | 'starting' | 'active' | 'stopped' | 'error';

/** Normalized volume reading (0 = silence, ~0.3+ = very loud). */
export type VolumeLevel = number;

/** Options passed when starting microphone capture. */
export interface MicrophoneCaptureOptions {
  /**
   * Constraints forwarded to `navigator.mediaDevices.getUserMedia`.
   * Defaults are tuned for voice/blow detection (echo cancellation, etc.).
   */
  audioConstraints?: MediaTrackConstraints;

  /**
   * FFT size for the AnalyserNode. Must be a power of 2 between 32 and 32768.
   * Higher values give finer time-domain resolution but cost more CPU.
   */
  fftSize?: number;

  /**
   * Smoothing for the AnalyserNode (0–1). Higher = smoother, slower response.
   */
  smoothingTimeConstant?: number;
}

/** Options for blow (loud burst) detection from a volume stream. */
export interface BlowDetectorOptions {
  /** Minimum RMS volume treated as a blow (0–1). Tune per device if needed. */
  threshold?: number;

  /** Volume must exceed `baseline * baselineMultiplier` after calibration. */
  baselineMultiplier?: number;

  /** Minimum milliseconds between consecutive blow events. */
  cooldownMs?: number;

  /**
   * Number of volume samples collected at startup to estimate ambient noise.
   * Blow detection stays inactive until calibration completes.
   */
  calibrationSampleCount?: number;
}

/** Result returned by the useMicrophoneVolume hook. */
export interface MicrophoneVolumeState {
  volume: VolumeLevel;
  status: MicrophoneCaptureStatus;
  error: MediaAudioError | null;
  isActive: boolean;
  start: () => Promise<boolean>;
  stop: () => void;
}
