export { BlowDetector } from './blowDetector';
export {
  DEFAULT_ANALYSER_OPTIONS,
  DEFAULT_AUDIO_CONSTRAINTS,
} from './constraints';
export { MediaAudioError } from './errors';
export type { MediaAudioErrorCode } from './errors';
export {
  isMediaDevicesSupported,
  MicrophoneCapture,
} from './microphoneCapture';
export { useBlowDetector } from './useBlowDetector';
export { useMicrophoneVolume } from './useMicrophoneVolume';
export type {
  BlowDetectorOptions,
  MicrophoneCaptureOptions,
  MicrophoneCaptureStatus,
  MicrophoneVolumeState,
  VolumeLevel,
} from './types';
export {
  computeRmsFromTimeDomainData,
  readVolumeFromAnalyser,
} from './volumeAnalyser';
