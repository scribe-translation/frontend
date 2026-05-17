export type MicrophonePermissionState = 'granted' | 'denied' | 'prompt' | 'unknown';

export function isStreamLive(stream: MediaStream | null): boolean {
  if (!stream) return false;
  const tracks = stream.getAudioTracks();
  return tracks.length > 0 && tracks.some((t) => t.readyState === 'live' && t.enabled);
}

export async function queryMicrophonePermission(): Promise<MicrophonePermissionState> {
  if (!navigator.permissions?.query) {
    return 'unknown';
  }

  try {
    const result = await navigator.permissions.query({
      name: 'microphone' as PermissionName,
    });
    if (result.state === 'granted') return 'granted';
    if (result.state === 'denied') return 'denied';
    if (result.state === 'prompt') return 'prompt';
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

function isSafari(): boolean {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function getMicrophoneErrorMessage(error: unknown): string {
  const name = error instanceof DOMException ? error.name : '';
  const safariHint = isSafari()
    ? ' In Safari: Settings → Websites → Microphone, then allow this site.'
    : ' Check your browser site settings and allow microphone access for this page.';

  switch (name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return `Microphone access was denied.${safariHint}`;
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return 'No microphone was found. Connect a microphone and try again.';
    case 'NotReadableError':
    case 'TrackStartError':
      return 'Your microphone is in use by another app. Close other apps using the mic and try again.';
    case 'OverconstrainedError':
      return 'The selected microphone is not available. Choose another device or refresh the device list.';
    case 'SecurityError':
      return `Microphone access is blocked.${safariHint}`;
    default:
      if (error instanceof Error && error.message) {
        return error.message;
      }
      return `Could not access the microphone.${safariHint}`;
  }
}
