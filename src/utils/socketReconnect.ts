import type { Socket } from 'socket.io-client'

/**
 * Reconnect before Cloud Run request timeout (600s default).
 * Use 8 minutes to stay safely under the platform cutoff even if deploy config lags.
 */
export const PROACTIVE_RECONNECT_MS = 8 * 60 * 1000

const reconnectTimerKey = 'proactiveReconnectTimer'
const refreshingKey = 'socketRefreshInProgress'
const lastRefreshKey = 'socketLastRefreshAt'

/** Prevent refresh storms if something else is also trying to reconnect. */
const MIN_REFRESH_INTERVAL_MS = 30_000

export type SocketAuthProvider = () => Record<string, unknown>

type SocketMeta = Socket & {
  [reconnectTimerKey]?: ReturnType<typeof setTimeout>
  [refreshingKey]?: boolean
  [lastRefreshKey]?: number
}

function asMeta(socket: Socket | null): SocketMeta | null {
  return socket as SocketMeta | null
}

export type SocketAuthProvider = () => Record<string, unknown>

export function clearProactiveReconnectTimer(socket: Socket | null): void {
  const meta = asMeta(socket)
  if (!meta) return
  if (meta[reconnectTimerKey]) {
    clearTimeout(meta[reconnectTimerKey])
    meta[reconnectTimerKey] = undefined
  }
}

export function refreshSocketConnection(
  socket: Socket | null,
  getAuth?: SocketAuthProvider
): void {
  if (!socket?.connected) return

  if (getAuth) {
    socket.auth = getAuth()
  }

  console.log('🔄 Proactive reconnect before platform timeout')
  socket.disconnect()
  socket.connect()
}

export function scheduleProactiveReconnect(
  socket: Socket | null,
  getAuth?: SocketAuthProvider
): void {
  if (!socket) return
  clearProactiveReconnectTimer(socket)
  const timer = setTimeout(() => {
    refreshSocketConnection(socket, getAuth)
  }, PROACTIVE_RECONNECT_MS)
}

/** Force a single clean reconnect via transport close (keeps auto-reconnect enabled). */
export function forceTransportReconnect(socket: Socket | null): void {
  if (!socket?.connected) return
  const engine = socket.io.engine
  if (engine) {
    engine.close()
  }
}
