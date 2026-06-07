import type { Socket } from 'socket.io-client'

/** Production default: reconnect before Cloud Run request timeout (3600s). */
const DEFAULT_PROACTIVE_RECONNECT_MS = 50 * 60 * 1000

function parseProactiveReconnectMs(): number {
  const raw = import.meta.env.VITE_PROACTIVE_RECONNECT_MS
  if (raw) {
    const parsed = Number(raw)
    if (!Number.isNaN(parsed) && parsed > 0) return parsed
  }
  return DEFAULT_PROACTIVE_RECONNECT_MS
}

/**
 * Reconnect before platform timeout. Override locally via VITE_PROACTIVE_RECONNECT_MS
 * (e.g. 60000 for 1-minute testing).
 */
export const PROACTIVE_RECONNECT_MS = parseProactiveReconnectMs()

const reconnectTimerKey = 'proactiveReconnectTimer'
const lastRefreshKey = 'socketLastRefreshAt'

/** Prevent refresh storms if something else is also trying to reconnect. */
const MIN_REFRESH_INTERVAL_MS = 30_000

/** Suppress heartbeat-driven reconnects while transport is settling. */
const TRANSPORT_SETTLE_MS = 8_000
let transportSettlingUntil = 0

export function markTransportSettling(): void {
  transportSettlingUntil = Date.now() + TRANSPORT_SETTLE_MS
}

export function isTransportSettling(): boolean {
  return Date.now() < transportSettlingUntil
}

export type SocketAuthProvider = () => Record<string, unknown>

type SocketMeta = Socket & {
  [reconnectTimerKey]?: ReturnType<typeof setTimeout>
  [lastRefreshKey]?: number
}

function asMeta(socket: Socket | null): SocketMeta | null {
  return socket as SocketMeta | null
}

export function clearProactiveReconnectTimer(socket: Socket | null): void {
  const meta = asMeta(socket)
  if (!meta) return
  if (meta[reconnectTimerKey]) {
    clearTimeout(meta[reconnectTimerKey])
    meta[reconnectTimerKey] = undefined
  }
}

/** Force a single clean reconnect via transport close (keeps auto-reconnect enabled). */
export function forceTransportReconnect(socket: Socket | null): void {
  if (!socket?.connected) return
  markTransportSettling()
  const engine = socket.io.engine
  if (engine) {
    engine.close()
  }
}

export function refreshSocketConnection(
  socket: Socket | null,
  getAuth?: SocketAuthProvider
): void {
  const meta = asMeta(socket)
  if (!meta?.connected) return

  const now = Date.now()
  const lastRefresh = meta[lastRefreshKey] ?? 0
  if (now - lastRefresh < MIN_REFRESH_INTERVAL_MS) {
    console.warn('⏭️ Skipping proactive refresh — last refresh was too recent')
    return
  }

  meta[lastRefreshKey] = now

  if (getAuth) {
    meta.auth = getAuth()
  }

  console.log('🔄 Proactive reconnect before platform timeout')
  forceTransportReconnect(meta)
}

export function scheduleProactiveReconnect(
  socket: Socket | null,
  getAuth?: SocketAuthProvider
): void {
  const meta = asMeta(socket)
  if (!meta) return
  clearProactiveReconnectTimer(meta)
  if (import.meta.env.VITE_NODE_ENV === 'dev') {
    console.log(
      `⏱️ Proactive reconnect scheduled in ${Math.round(PROACTIVE_RECONNECT_MS / 1000)}s`
    )
  }
  meta[reconnectTimerKey] = setTimeout(() => {
    refreshSocketConnection(meta, getAuth)
  }, PROACTIVE_RECONNECT_MS)
}

/** Safety net when the manager stops retrying but the socket instance still exists. */
export function ensureSocketReconnecting(socket: Socket | null): void {
  if (!socket || socket.connected) return
  socket.active = true
  socket.connect()
}
