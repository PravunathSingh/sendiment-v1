/**
 * Typed errors for MediaStream and Web Audio API failures.
 *
 * getUserMedia throws DOMException with stable `name` values — we map those
 * to MediaAudioErrorCode so UI layers can show actionable messages.
 */

export type MediaAudioErrorCode =
  | 'NOT_SUPPORTED'
  | 'PERMISSION_DENIED'
  | 'DEVICE_NOT_FOUND'
  | 'DEVICE_NOT_READABLE'
  | 'SECURITY_ERROR'
  | 'AUDIO_CONTEXT_FAILED'
  | 'STREAM_NOT_ACTIVE'
  | 'UNKNOWN';

const DOM_EXCEPTION_MAP: Record<string, MediaAudioErrorCode> = {
  NotAllowedError: 'PERMISSION_DENIED',
  NotFoundError: 'DEVICE_NOT_FOUND',
  NotReadableError: 'DEVICE_NOT_READABLE',
  SecurityError: 'SECURITY_ERROR',
};

const USER_MESSAGES: Record<MediaAudioErrorCode, string> = {
  NOT_SUPPORTED:
    'Microphone access is not supported in this browser or environment.',
  PERMISSION_DENIED:
    'Microphone permission was denied. Allow access in your browser settings and try again.',
  DEVICE_NOT_FOUND:
    'No microphone was found. Connect a microphone and try again.',
  DEVICE_NOT_READABLE:
    'The microphone is in use by another application or could not be opened.',
  SECURITY_ERROR:
    'Microphone access blocked by a security policy. Use HTTPS or localhost.',
  AUDIO_CONTEXT_FAILED:
    'The audio engine failed to start. Try again after interacting with the page.',
  STREAM_NOT_ACTIVE:
    'The microphone stream ended unexpectedly.',
  UNKNOWN: 'An unexpected error occurred while accessing the microphone.',
};

export class MediaAudioError extends Error {
  readonly code: MediaAudioErrorCode;
  readonly cause?: unknown;

  constructor(code: MediaAudioErrorCode, message?: string, cause?: unknown) {
    super(message ?? USER_MESSAGES[code]);
    this.name = 'MediaAudioError';
    this.code = code;
    this.cause = cause;
  }

  /** Map a DOMException from getUserMedia to a MediaAudioError. */
  static fromDOMException(error: DOMException): MediaAudioError {
    const code = DOM_EXCEPTION_MAP[error.name] ?? 'UNKNOWN';
    return new MediaAudioError(code, USER_MESSAGES[code], error);
  }

  /** Map any thrown value to a MediaAudioError. */
  static fromUnknown(error: unknown): MediaAudioError {
    if (error instanceof MediaAudioError) {
      return error;
    }

    if (error instanceof DOMException) {
      return MediaAudioError.fromDOMException(error);
    }

    if (error instanceof Error) {
      return new MediaAudioError('UNKNOWN', error.message, error);
    }

    return new MediaAudioError('UNKNOWN', USER_MESSAGES.UNKNOWN, error);
  }
}
