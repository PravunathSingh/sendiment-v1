# Web Audio API & MediaStream API — Guide

This document explains how microphone capture and volume measurement work in this project, and the key constraints to keep in mind when working with browser audio APIs.

## Architecture overview

```
User clicks "Start"
       │
       ▼
navigator.mediaDevices.getUserMedia({ audio: true })
       │  returns MediaStream (live mic track)
       ▼
AudioContext.createMediaStreamSource(stream)
       │  MediaStreamAudioSourceNode
       ▼
AnalyserNode  ──► getByteTimeDomainData() each frame
       │
       ▼
RMS calculation → normalized volume (0–1)
       │
       ▼
BlowDetector → blow out candle
```

### Module map

| File | Responsibility |
|------|----------------|
| `microphoneCapture.ts` | Stream + AudioContext lifecycle |
| `volumeAnalyser.ts` | Pure RMS math from AnalyserNode data |
| `blowDetector.ts` | Threshold + calibration + cooldown logic |
| `useMicrophoneVolume.ts` | React hook for capture + volume state |
| `useBlowDetector.ts` | React hook wiring volume → blow events |
| `errors.ts` | Typed errors mapped from DOMException |

---

## MediaStream API (`getUserMedia`)

### What it does

`navigator.mediaDevices.getUserMedia()` requests access to user media devices and returns a `MediaStream` — a bundle of `MediaStreamTrack` objects (audio and/or video).

```ts
const stream = await navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
});
```

### Key points

1. **Secure context required** — Works on `https://` and `http://localhost`. Plain `http://` on other hosts will fail with `SecurityError`.

2. **User gesture** — Browsers expect mic access to be triggered by user interaction (button click). Starting capture on page load often fails or is blocked.

3. **Permission prompt** — The browser shows a permission dialog. If denied, `getUserMedia` throws `NotAllowedError` → map to `PERMISSION_DENIED`.

4. **Constraints are hints** — Options like `echoCancellation` are not guaranteed. Use `track.getSettings()` after capture to see what the browser actually applied.

5. **Always stop tracks** — Failing to call `track.stop()` leaves the mic indicator on and holds the device:
   ```ts
   stream.getTracks().forEach((track) => track.stop());
   ```

6. **One stream per use** — Re-request or replace the stream if the track ends (`track.onended`). Don't assume a stream lives forever.

7. **Feature detection** — Check before calling:
   ```ts
   typeof navigator.mediaDevices?.getUserMedia === 'function'
   ```

### Common DOMException names

| `error.name` | Meaning |
|--------------|---------|
| `NotAllowedError` | User denied permission |
| `NotFoundError` | No microphone found |
| `NotReadableError` | Device in use or hardware error |
| `SecurityError` | Non-secure origin or policy block |

---

## Web Audio API

### What it does

The Web Audio API builds an **audio processing graph**: source nodes → processing nodes → destination.

For analysis-only capture we use:

```ts
const audioContext = new AudioContext();
const source = audioContext.createMediaStreamSource(stream);
const analyser = audioContext.createAnalyser();

source.connect(analyser);
// Do NOT connect analyser → audioContext.destination unless you want playback
```

### Key points

1. **AudioContext state** — Contexts start as `running` or `suspended` (especially iOS Safari). Resume after user gesture:
   ```ts
   if (audioContext.state === 'suspended') {
     await audioContext.resume();
   }
   ```

2. **Close when done** — `audioContext.close()` releases resources. Check `state !== 'closed'` before closing.

3. **Disconnect nodes** — Call `node.disconnect()` before dropping references to avoid leaks in long-lived apps.

4. **AnalyserNode without playback** — You do **not** need to connect to `destination` to read analyser data. `getByteTimeDomainData` works on a connected subgraph that never reaches the speakers.

5. **fftSize** — Must be a power of 2 (32–32768). `getByteTimeDomainData` returns `fftSize` bytes. Larger = more stable RMS, more CPU.

6. **smoothingTimeConstant** — 0–1. Higher values smooth readings over time (less jitter, slower response). We use ~0.5 for blow detection.

7. **No autoplay policy for capture** — Autoplay rules mainly affect *playback*. Mic capture still needs user gesture for *permission*, not autoplay.

8. **Sample rate** — `audioContext.sampleRate` is typically 44100 or 48000. Don't assume a fixed rate across devices.

### Reading volume

**Time domain** (`getByteTimeDomainData`) — amplitude over time. Best for loudness / blow detection.

**Frequency domain** (`getByteFrequencyData`) — energy per frequency bin. Best for visualizers or pitch detection, not ideal for blow volume.

We compute RMS from time-domain samples:

```ts
// bytes are 0–255, center at 128
const normalized = (sample - 128) / 128; // -1 to 1
const rms = Math.sqrt(sum(normalized²) / count);
```

Typical RMS ranges:
- `0.01–0.03` — quiet room
- `0.05–0.15` — speech
- `0.15+` — blow / shout

---

## Blow detection strategy

A fixed threshold alone fails across devices. Our `BlowDetector`:

1. **Calibrates** — Collects ~60 frames of ambient volume when monitoring starts.
2. **Dynamic threshold** — `max(fixedThreshold, baseline × multiplier)`.
3. **Cooldown** — Prevents one blow from triggering multiple candle blows.

Tune in `BlowDetectorOptions` if detection is too sensitive or too weak on a specific device.

---

## React integration patterns

### Start / stop from a button

```tsx
const { volume, error, isActive, start, stop } = useMicrophoneVolume();

const handleToggle = async () => {
  if (isActive) stop();
  else await start();
};
```

### Cleanup on unmount

`useMicrophoneVolume` stops capture when the component unmounts. If you use `MicrophoneCapture` directly, call `stop()` in a `useEffect` cleanup.

### Stable callbacks for blow handler

`useBlowDetector` stores `onBlow` in a ref so you don't need to memoize it, but avoid creating heavy work inside the callback on every render.

---

## Testing checklist

- [ ] Grant mic permission — volume bar moves when speaking
- [ ] Deny permission — error message shown, no crash
- [ ] Stop button — browser mic indicator turns off
- [ ] Navigate away / unmount — mic released
- [ ] iOS Safari — start only after tap; context resumes
- [ ] Blow detection — calibrates briefly, then blows extinguish candles
- [ ] Cooldown — one blow doesn't extinguish multiple candles

---

## Further reading

- [MDN: MediaDevices.getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [MDN: Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [MDN: AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode)
