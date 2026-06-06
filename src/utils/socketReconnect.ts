import type { Socket } from 'socket.io-client'

export const PROACTIVE_RECONNECT_MS = 59 * 60 * 1000

const reconnectTimerKey = 'proactiveReconnectTimer'

export function clearProactiveReconnectTimer(socket: Socket | null): void {
  if (!socket) return
  const timer = (socket as { [reconnectTimerKey]?: ReturnType<typeof setTimeout> })[reconnectTimerKey]
  if (timer) {
    clearTimeout(timer)
    ;(socket as { [reconnectTimerKey]?: ReturnType<typeof setTimeout> })[reconnectTimerKey] = undefined
  }
}

export function scheduleProactiveReconnect(socket: Socket | null): void {
  if (!socket) return
  clearProactiveReconnectTimer(socket)
  const timer = setTimeout(() => {
    if (socket.connected) {
      console.log('🔄 Proactive reconnect before platform timeout')
      socket.disconnect()
      socket.connect()
    }
  }, PROACTIVE_RECONNECT_MS)
  ;(socket as { [reconnectTimerKey]?: ReturnType<typeof setTimeout> })[reconnectTimerKey] = timer
}
