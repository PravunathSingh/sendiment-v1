/**
 * MicrophoneCapture — lifecycle manager for MediaStream + Web Audio graph.
 *
 * Pipeline:
 *   getUserMedia → MediaStreamAudioSourceNode → AnalyserNode → (volume reads)
 *
 * The analyser is NOT connected to AudioContext.destination, so the user does
 * not hear their own mic (and we avoid feedback). Analysis still works because
 * data is pulled via getByteTimeDomainData on the AnalyserNode.
 */

import {
  DEFAULT_ANALYSER_OPTIONS,
  DEFAULT_AUDIO_CONSTRAINTS,
} from './constraints';
import { MediaAudioError } from './errors';
import { readVolumeFromAnalyser } from './volumeAnalyser';
import type {
  MicrophoneCaptureOptions,
  MicrophoneCaptureStatus,
  VolumeLevel,
} from './types';

type VolumeListener = (volume: VolumeLevel) => void;

export function isMediaDevicesSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.mediaDevices?.getUserMedia === 'function'
  );
}

export class MicrophoneCapture {
  private status: MicrophoneCaptureStatus = 'idle';
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private timeDomainBuffer: Uint8Array | null = null;
  private animationFrameId: number | null = null;
  private volumeListener: VolumeListener | null = null;
  private readonly options: MicrophoneCaptureOptions;

  constructor(options?: MicrophoneCaptureOptions) {
    this.options = options ?? {};
  }

  getStatus(): MicrophoneCaptureStatus {
    return this.status;
  }

  /** Current RMS volume. Returns 0 when capture is not active. */
  getVolume(): VolumeLevel {
    if (!this.analyserNode || !this.timeDomainBuffer) {
      return 0;
    }

    return readVolumeFromAnalyser(this.analyserNode, this.timeDomainBuffer);
  }

  /**
   * Request microphone access and start the audio analysis graph.
   * Must be called from a user gesture (button click) on most browsers.
   */
  async start(): Promise<void> {
    if (this.status === 'active' || this.status === 'starting') {
      return;
    }

    if (!isMediaDevicesSupported()) {
      this.status = 'error';
      throw new MediaAudioError('NOT_SUPPORTED');
    }

    this.status = 'starting';

    try {
      const audioConstraints =
        this.options.audioConstraints ?? DEFAULT_AUDIO_CONSTRAINTS;

      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
      });

      if (!this.stream.active) {
        throw new MediaAudioError('STREAM_NOT_ACTIVE');
      }

      this.audioContext = new AudioContext();

      // iOS / Safari: AudioContext starts "suspended" until user interaction.
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      if (this.audioContext.state !== 'running') {
        throw new MediaAudioError('AUDIO_CONTEXT_FAILED');
      }

      this.sourceNode = this.audioContext.createMediaStreamSource(this.stream);

      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize =
        this.options.fftSize ?? DEFAULT_ANALYSER_OPTIONS.fftSize;
      this.analyserNode.smoothingTimeConstant =
        this.options.smoothingTimeConstant ??
        DEFAULT_ANALYSER_OPTIONS.smoothingTimeConstant;

      this.timeDomainBuffer = new Uint8Array(this.analyserNode.fftSize);

      // Wire mic into analyser only — no connection to speakers.
      this.sourceNode.connect(this.analyserNode);

      this.status = 'active';

      if (this.volumeListener) {
        this.startVolumeLoop();
      }
    } catch (error) {
      this.status = 'error';
      await this.cleanupResources();
      throw MediaAudioError.fromUnknown(error);
    }
  }

  /**
   * Stop capture, release the microphone, and tear down the audio graph.
   * Safe to call multiple times.
   */
  stop(): void {
    this.stopVolumeLoop();
    this.volumeListener = null;
    void this.cleanupResources();
    this.status = 'stopped';
  }

  /**
   * Register a callback invoked each animation frame with the current volume.
   * If capture is already active, the loop starts immediately.
   */
  onVolume(listener: VolumeListener): void {
    this.volumeListener = listener;

    if (this.status === 'active') {
      this.startVolumeLoop();
    }
  }

  /** Remove the volume listener and stop the animation loop. */
  offVolume(): void {
    this.volumeListener = null;
    this.stopVolumeLoop();
  }

  private startVolumeLoop(): void {
    if (this.animationFrameId !== null) {
      return;
    }

    const tick = () => {
      if (!this.volumeListener) {
        return;
      }

      this.volumeListener(this.getVolume());
      this.animationFrameId = requestAnimationFrame(tick);
    };

    this.animationFrameId = requestAnimationFrame(tick);
  }

  private stopVolumeLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private async cleanupResources(): Promise<void> {
    this.stopVolumeLoop();

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.analyserNode) {
      this.analyserNode.disconnect();
      this.analyserNode = null;
    }

    if (this.stream) {
      for (const track of this.stream.getTracks()) {
        track.stop();
      }
      this.stream = null;
    }

    if (this.audioContext) {
      try {
        if (this.audioContext.state !== 'closed') {
          await this.audioContext.close();
        }
      } catch {
        // close() can throw if already closed — safe to ignore during cleanup.
      }
      this.audioContext = null;
    }

    this.timeDomainBuffer = null;
  }
}
