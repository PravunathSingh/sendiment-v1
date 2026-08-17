/**
 * Default audio constraints for blow / voice detection.
 *
 * echoCancellation, noiseSuppression, and autoGainControl are browser hints —
 * support varies by platform. They generally improve consistency across devices.
 */
export const DEFAULT_AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

/** Sensible defaults for AnalyserNode when measuring microphone RMS volume. */
export const DEFAULT_ANALYSER_OPTIONS = {
  fftSize: 2048,
  smoothingTimeConstant: 0.5,
} as const;
