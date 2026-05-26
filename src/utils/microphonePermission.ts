export type MicrophonePermissionState = 'granted' | 'denied' | 'prompt' | 'unknown';

export function isStreamLive(stream: MediaStream | null): boolean {
  if (!stream) return false;
  const tracks = stream.getAudioTracks();
  return tracks.length > 0 && tracks.some((t) => t.readyState === 'live' && t.enabled);
}

/** Runtime check that the stream has live mic access (alias for isStreamLive). */
export function hasMicrophoneAccess(stream: MediaStream | null): boolean {
  return isStreamLive(stream);
}

export function isIOSWebKit(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/** For banner UI only — whether we should nudge the user to tap Start Recording. */
export function needsMicrophonePrompt(state: MicrophonePermissionState): boolean {
  if (state === 'prompt') return true;
  if (isIOSWebKit() && state === 'unknown') return true;
  return false;
}

export type StreamEndedCleanup = () => void;

/**
 * Notify when iOS/Safari revokes or ends audio tracks (background, permission change).
 */
export function watchStreamEnded(
  stream: MediaStream,
  onEnded: () => void
): StreamEndedCleanup {
  const tracks = stream.getAudioTracks();
  const handleEnded = () => {
    if (!isStreamLive(stream)) {
      onEnded();
    }
  };

  for (const track of tracks) {
    track.addEventListener('ended', handleEnded);
    track.addEventListener('mute', handleEnded);
  }

  return () => {
    for (const track of tracks) {
      track.removeEventListener('ended', handleEnded);
      track.removeEventListener('mute', handleEnded);
    }
  };
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
  const safariHint = isSafari() || isIOSWebKit()
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
