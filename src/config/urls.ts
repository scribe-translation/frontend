const resolveDevHost = (): string | null => {
  if (typeof window === 'undefined') {
    return null
  }
  const { hostname, port, protocol } = window.location
  if (hostname === 'localhost' || hostname === '127.0.0.1' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`
  }
  if (hostname.endsWith('.localhost')) {
    return `${protocol}//localhost${port ? `:${port}` : ''}`
  }
  return null
}

const getConfig = () => {
  const isDevelopment = import.meta.env.VITE_NODE_ENV === 'dev'
  const isStaging = import.meta.env.VITE_NODE_ENV === 'staging'
  const browserHostname = typeof window !== 'undefined' ? window.location.hostname : ''

  if (isDevelopment) {
    const devHost = resolveDevHost()
    const backendHost =
      devHost && /^\d+\.\d+\.\d+\.\d+$/.test(browserHostname)
        ? devHost.replace(/:\d+$/, ':3001')
        : import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

    return {
      TRANSLATION_URL: devHost || import.meta.env.VITE_TRANSLATION_URL || 'http://listener.localhost:5173',
      INPUT_URL: devHost ? `${devHost}/speaker` : import.meta.env.VITE_INPUT_URL || 'http://speaker.localhost:5173',
      BACKEND_URL: backendHost
    }
  }

  if (isStaging) {
    return {
      TRANSLATION_URL: import.meta.env.VITE_TRANSLATION_URL || 'https://listener-staging.scribe-ai.ca',
      INPUT_URL: import.meta.env.VITE_INPUT_URL || 'https://speaker-staging.scribe-ai.ca',
      BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'https://api-staging.scribe-ai.ca'
    }
  }

  return {
    TRANSLATION_URL: import.meta.env.VITE_TRANSLATION_URL || 'https://listener.scribe-ai.ca',
    INPUT_URL: import.meta.env.VITE_INPUT_URL || 'https://speaker.scribe-ai.ca',
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'https://api.scribe-ai.ca'
  }
}

export const CONFIG = getConfig()

export const getListenerJoinUrl = (sessionCode: string): string => {
  if (import.meta.env.VITE_NODE_ENV === 'dev') {
    const devHost = resolveDevHost()
    if (devHost) {
      return `${devHost}/?code=${encodeURIComponent(sessionCode)}`
    }
  }
  return `${CONFIG.TRANSLATION_URL}?code=${encodeURIComponent(sessionCode)}`
}
