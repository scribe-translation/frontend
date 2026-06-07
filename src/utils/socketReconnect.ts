import type { Socket } from 'socket.io-client'

/**
 * Reconnect before Cloud Run request timeout (600s default).
 * Use 8 minutes to stay safely under the platform cutoff even if deploy config lags.
 */
export const PROACTIVE_RECONNECT_MS = 8 * 60 * 1000

const reconnectTimerKey = 'proactiveReconnectTimer'

export type SocketAuthProvider = () => Record<string, unknown>

export function clearProactiveReconnectTimer(socket: Socket | null): void {
  if (!socket) return
  const timer = (socket as { [reconnectTimerKey]?: ReturnType<typeof setTimeout> })[reconnectTimerKey]
  if (timer) {
    clearTimeout(timer)
    ;(socket as { [reconnectTimerKey]?: ReturnType<typeof setTimeout> })[reconnectTimerKey] = undefined
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
  ;(socket as { [reconnectTimerKey]?: ReturnType<typeof setTimeout> })[reconnectTimerKey] = timer
}
