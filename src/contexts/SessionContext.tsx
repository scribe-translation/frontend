import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SessionCodeContextType {
  sessionCode: string | null
  setSessionCode: (code: string) => void
  clearSessionCode: () => void
}

const SessionCodeContext = createContext<SessionCodeContextType | undefined>(undefined)

interface SessionCodeProviderProps {
  children: ReactNode
}

export const SessionCodeProvider: React.FC<SessionCodeProviderProps> = ({ children }) => {
  const [sessionCode, setSessionCodeState] = useState<string | null>(null)

  // Load session code from localStorage on mount (migrate legacy scribeUserCode)
  useEffect(() => {
    let storedSessionCode = localStorage.getItem('scribeSessionCode')
    if (!storedSessionCode) {
      const legacy = localStorage.getItem('scribeUserCode')
      if (legacy && /^[A-Z0-9]{3,8}$/.test(legacy)) {
        storedSessionCode = legacy
        localStorage.setItem('scribeSessionCode', legacy)
        localStorage.removeItem('scribeUserCode')
      }
    }
    if (storedSessionCode) {
      // Validate session code format (3-8 alphanumeric characters)
      if (/^[A-Z0-9]{3,8}$/.test(storedSessionCode)) {
        setSessionCodeState(storedSessionCode)
        console.log('🔗 SessionCodeContext - Loaded session code from localStorage:', storedSessionCode)
      } else {
        console.log('🔗 SessionCodeContext - Invalid session code format, clearing:', storedSessionCode)
        localStorage.removeItem('scribeSessionCode')
        setSessionCodeState(null)
      }
    }
  }, [])

  // Store session code in localStorage when it changes
  useEffect(() => {
    if (sessionCode) {
      localStorage.setItem('scribeSessionCode', sessionCode)
    } else {
      localStorage.removeItem('scribeSessionCode')
    }
  }, [sessionCode])

  const setSessionCode = (code: string): void => {
    // Validate session code format
    if (!/^[A-Z0-9]{3,8}$/.test(code)) {
      console.error('🔗 SessionCodeContext - Invalid session code format:', code)
      return
    }
    console.log('🔗 SessionCodeContext - Setting session code:', code)
    setSessionCodeState(code)
  }

  const clearSessionCode = (): void => {
    console.log('🔗 SessionCodeContext - Clearing session code')
    setSessionCodeState(null)
    localStorage.removeItem('scribeSessionCode')
  }

  const value: SessionCodeContextType = {
    sessionCode,
    setSessionCode,
    clearSessionCode,
  }

  return <SessionCodeContext.Provider value={value}>{children}</SessionCodeContext.Provider>
}

export const useSessionCode = (): SessionCodeContextType => {
  const context = useContext(SessionCodeContext)
  if (context === undefined) {
    throw new Error('useSessionCode must be used within a SessionCodeProvider')
  }
  return context
}

export const SessionProvider = SessionCodeProvider
export const useSession = useSessionCode
export default SessionCodeContext
