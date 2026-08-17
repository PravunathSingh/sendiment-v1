/**
 * Pure helpers for reading volume from a Web Audio AnalyserNode.
 *
 * We use time-domain RMS (root mean square) rather than frequency data because
 * blow detection cares about sudden amplitude spikes, not spectral content.
 */

import type { VolumeLevel } from './types';

/**
 * Compute normalized RMS volume from raw byte time-domain samples.
 *
 * AnalyserNode.getByteTimeDomainData returns unsigned bytes centered at 128.
 * We normalize each sample to [-1, 1] and compute RMS.
 *
 * Typical ranges:
 * - ~0.01–0.03: quiet room / ambient noise
 * - ~0.05–0.15: normal speech
 * - ~0.15–0.35+: blowing, shouting, close loud sounds
 */
export function computeRmsFromTimeDomainData(data: Uint8Array): VolumeLevel {
  if (data.length === 0) {
    return 0;
  }

  let sumSquares = 0;
  for (let i = 0; i < data.length; i++) {
    const normalized = (data[i] - 128) / 128;
    sumSquares += normalized * normalized;
  }

  return Math.sqrt(sumSquares / data.length);
}

/**
 * Read the current RMS volume from an AnalyserNode.
 * Pass a reused `buffer` in hot paths to avoid per-frame allocations.
 */
export function readVolumeFromAnalyser(
  analyser: AnalyserNode,
  buffer: Uint8Array,
): VolumeLevel {
  analyser.getByteTimeDomainData(buffer as Uint8Array<ArrayBuffer>);
  return computeRmsFromTimeDomainData(buffer);
}
