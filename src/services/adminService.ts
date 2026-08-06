import { CONFIG } from '../config/urls'

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalUsageMinutes: number
  liveConnectionCount: number
  streamingCount: number
  activeSessionGroups: number
}

export interface AdminUser {
  id: string
  name: string
  email: string
  isActive: boolean
  sessionCode?: string | null
  totpEnabled?: boolean
  totalUsageMinutes: number
  totalSessions: number
  lastActiveAt?: string | null
  createdAt?: string | null
}

export interface LiveConnection {
  socketId: string
  userId: string | null
  userEmail: string | null
  sessionCode: string | null
  isStreaming: boolean
  sourceLanguage: string | null
  targetLanguage: string | null
  connectedAt: number | null
  durationMs: number
  streamDurationMs: number
}

export interface LiveConnectionGroup {
  sessionCode: string
  speakerEmail: string | null
  isStreaming: boolean
  listenerCount: number
  connectionCount: number
  languages: string[]
}

export interface AdminSession {
  id: string
  userId: string
  fullText: string
  summary?: string | null
  sourceLanguage: string
  characterCount: number
  isActive: boolean
  createdAt: string
}

export interface AppSettings {
  interimTranslationEnabled: boolean
  updatedAt?: string | null
}

async function adminFetch<T>(
  path: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${CONFIG.BACKEND_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`)
  }
  return data as T
}

export function formatUsageMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}

export function formatDurationMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export const adminService = {
  getStats: (token: string) =>
    adminFetch<AdminStats>('/admin/stats', token),

  getUsers: (token: string) =>
    adminFetch<{ users: AdminUser[] }>('/admin/users', token),

  patchUser: (
    token: string,
    userId: string,
    body: { isActive?: boolean; clearSessionCode?: boolean; confirm?: boolean }
  ) =>
    adminFetch<{ user: AdminUser; message: string }>(`/admin/users/${userId}`, token, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  getLiveConnections: (token: string) =>
    adminFetch<{
      connections: LiveConnection[]
      groups: LiveConnectionGroup[]
      totalConnections: number
      streamingCount: number
    }>('/admin/live-connections', token),

  getSessions: (
    token: string,
    params: { email?: string; userId?: string; limit?: number; startDate?: string; endDate?: string }
  ) => {
    const qs = new URLSearchParams()
    if (params.email) qs.set('email', params.email)
    if (params.userId) qs.set('userId', params.userId)
    if (params.limit) qs.set('limit', String(params.limit))
    if (params.startDate) qs.set('startDate', params.startDate)
    if (params.endDate) qs.set('endDate', params.endDate)
    return adminFetch<{ userId: string; sessions: AdminSession[] }>(
      `/admin/sessions?${qs.toString()}`,
      token
    )
  },

  getSettings: (token: string) =>
    adminFetch<{ settings: AppSettings }>('/admin/settings', token),

  patchSettings: (token: string, interimTranslationEnabled: boolean) =>
    adminFetch<{ settings: AppSettings; message: string }>('/admin/settings', token, {
      method: 'PATCH',
      body: JSON.stringify({ interimTranslationEnabled }),
    }),
}
