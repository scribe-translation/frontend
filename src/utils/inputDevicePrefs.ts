export type SavedInputDevice = {
  deviceId: string
  label: string
}

const STORAGE_KEY = 'scribe-input-device'

export function loadSavedInputDevice(): SavedInputDevice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<SavedInputDevice>
    if (
      typeof parsed.deviceId === 'string' &&
      parsed.deviceId.length > 0 &&
      typeof parsed.label === 'string' &&
      parsed.label.length > 0
    ) {
      return { deviceId: parsed.deviceId, label: parsed.label }
    }
  } catch {
    // ignore corrupt storage
  }
  return null
}

export function saveInputDevice(deviceId: string, label: string): void {
  const payload: SavedInputDevice = { deviceId, label }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function findMatchingDevice(
  devices: { deviceId: string; label: string }[],
  saved: SavedInputDevice | null
): { deviceId: string; label: string } | null {
  if (!saved || devices.length === 0) {
    return null
  }

  const byId = devices.find((device) => device.deviceId === saved.deviceId)
  if (byId) {
    return byId
  }

  const byLabel = devices.find((device) => device.label === saved.label)
  if (byLabel) {
    return byLabel
  }

  return null
}
