/** Sentinel device id for tab/window/system audio via getDisplayMedia. */
export const DISPLAY_MEDIA_AUDIO_DEVICE_ID = '__display_media_audio__'

export function isDisplayMediaAudioDevice(
  deviceId: string | null | undefined
): boolean {
  return deviceId === DISPLAY_MEDIA_AUDIO_DEVICE_ID
}

export function isDisplayMediaCaptureSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getDisplayMedia
  )
}

export const DISPLAY_MEDIA_DEVICE_LABEL =
  'Tab / System Audio'

export function getDisplayMediaErrorMessage(error: unknown): string {
  const name = error instanceof DOMException ? error.name : ''

  switch (name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return (
        'Screen or tab audio sharing was cancelled or denied. ' +
        'Choose a tab or window and enable "Share tab audio" (or system audio) when prompted.'
      )
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return (
        'No audio was shared. When prompted, pick the tab or window playing audio ' +
        'and check "Share tab audio" or "Share system audio".'
      )
    case 'NotReadableError':
    case 'TrackStartError':
      return 'Could not capture audio from the selected source. Try another tab or window.'
    case 'AbortError':
      return 'Audio capture was cancelled.'
    default:
      if (error instanceof Error && error.message) {
        return error.message
      }
      return 'Could not capture tab or system audio.'
  }
}

/**
 * Capture audio playing through the device speakers (tab, window, or screen).
 * Video track is kept alive but disabled — stopping it ends audio in most browsers.
 */
export async function acquireDisplayMediaAudioStream(): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    },
  })

  const audioTracks = stream.getAudioTracks()
  if (audioTracks.length === 0) {
    stream.getTracks().forEach((track) => track.stop())
    throw new DOMException(
      'No audio track was shared. Enable "Share tab audio" or "Share system audio" in the picker.',
      'NotFoundError'
    )
  }

  stream.getVideoTracks().forEach((track) => {
    track.enabled = false
  })

  return stream
}
