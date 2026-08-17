/**
 * React hook wrapping MicrophoneCapture for volume monitoring.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { MediaAudioError } from './errors';
import { MicrophoneCapture } from './microphoneCapture';
import type {
  MicrophoneCaptureOptions,
  MicrophoneCaptureStatus,
  MicrophoneVolumeState,
  VolumeLevel,
} from './types';

export function useMicrophoneVolume(
  options?: MicrophoneCaptureOptions,
): MicrophoneVolumeState {
  const captureRef = useRef<MicrophoneCapture | null>(null);
  const [volume, setVolume] = useState<VolumeLevel>(0);
  const [status, setStatus] = useState<MicrophoneCaptureStatus>('idle');
  const [error, setError] = useState<MediaAudioError | null>(null);

  // Lazily create capture instance; options from first render are used.
  if (captureRef.current == null) {
    captureRef.current = new MicrophoneCapture(options);
  }

  const start = useCallback(async (): Promise<boolean> => {
    const capture = captureRef.current;
    if (!capture) {
      return false;
    }

    setError(null);
    setStatus('starting');

    try {
      capture.onVolume(setVolume);
      await capture.start();
      setStatus('active');
      return true;
    } catch (caught) {
      const mediaError = MediaAudioError.fromUnknown(caught);
      setError(mediaError);
      setStatus('error');
      setVolume(0);
      capture.offVolume();
      return false;
    }
  }, []);

  const stop = useCallback(() => {
    const capture = captureRef.current;
    if (!capture) {
      return;
    }

    capture.stop();
    setVolume(0);
    setStatus('stopped');
  }, []);

  // Release mic if the component unmounts while capture is active.
  useEffect(() => {
    const capture = captureRef.current;
    return () => {
      capture?.stop();
    };
  }, []);

  return {
    volume,
    status,
    error,
    isActive: status === 'active',
    start,
    stop,
  };
}
