import React, { useState, useEffect, useRef, useCallback } from 'react'
import InputLanguageSelector from '../InputLanguageSelector'
import DeviceSelector from './DeviceSelector'
import RecordingPreferences from './RecordingPreferences'
import Typography from '../UI/Typography'
import { getSTTLanguageInfo, GoogleSTTLanguageCode } from '../../enums/googleSTTLangs'
import { getCTLanguageInfo, isValidCTLanguageCode } from '../../enums/googleCTLangs'
import { Paper, Chip, Button, Box, IconButton, useMediaQuery, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Tooltip, Snackbar, Alert, Slider, FormControlLabel, Checkbox, FormGroup, Divider, Collapse } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import DownloadIcon from '@mui/icons-material/Download'
import LogoutIcon from '@mui/icons-material/Logout'
import QrCodeIcon from '@mui/icons-material/QrCode'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DescriptionIcon from '@mui/icons-material/Description';
import FacebookIcon from '@mui/icons-material/Facebook';
import SaveIcon from '@mui/icons-material/Save';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client'
import styled, { keyframes } from 'styled-components'
import { CONFIG } from '../../config/urls'
import { useAuth } from '../../contexts/AuthContext'
import { useSessionCode } from '../../contexts/SessionContext'
// ProfileModal removed in favor of full page /profile
import googleSpeechService from '../../services/googleSpeechService'
import { setCookie, getCookie } from '../../utils/cookieUtils'
import { createHybridFlagElement } from '../../utils/flagEmojiUtils.tsx'
import { useWakeLock } from '../../utils/useWakeLock'
import { isRTLLanguage } from '../../utils/rtlUtils'
import {
  getMicrophoneErrorMessage,
  isStreamLive,
  needsMicrophonePrompt,
  queryMicrophonePermission,
} from '../../utils/microphonePermission'
import { isSessionCodeAuthError } from '../../utils/sessionCodeUtils'
import {
  clearProactiveReconnectTimer,
  clearProactiveRefresh,
  forceTransportReconnect,
  isProactiveRefreshInProgress,
  isTransportSettling,
  markTransportSettling,
  scheduleProactiveReconnect,
} from '../../utils/socketReconnect'

interface MessageBubble {
  id: string
  text: string
  timestamp: Date
  isComplete: boolean
}

const MainContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: ${props => props.isMobile ? 'column' : 'row'};
  height: ${props => props.isMobile ? 'calc(100svh - 2rem)' : '100vh'};
  width: ${props => props.isMobile ? 'calc(100vw - 2rem)' : '100vw'};
  padding: ${props => props.isMobile ? '0.5rem' : '0'};
  margin: 0;
  gap: ${props => props.isMobile ? '0.5rem' : '8px'};
  box-sizing: border-box;
`

const MobileHeader = styled(Paper)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  margin: 0;
  border-radius: 1rem !important;
  min-height: 1rem;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 100%;
`

const MobileHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const MobileHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const LeftPanel = styled(Paper)`
  width: 320px;
  min-width: 320px;
  max-width: 320px;
  border-radius: 2rem !important;
  margin: 1rem;
  margin-right: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: calc(100% - 2rem);
  overflow-y: auto;
  overflow-x: hidden;
`

const RightPanel = styled(Paper) <{ isMobile: boolean }>`
  ${props => props.isMobile ? `
    flex: 1;
    width: 100%;
    height: 100%;
    border-radius: 1rem !important;
  ` : `
    flex: 1;
    min-width: 250px;
    height: calc(100% - 2rem);
    border-radius: 2rem !important;
    margin: 1rem;
    margin-left: 0.5rem;
  `}
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
`

const ConnectionDisplay = styled.div<{ isMobile: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  margin-left: 0.2I think rem;
`

const QRCodeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
`

const QRCodeContainer = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

const bubbleEnter = keyframes`
  from {
    opacity: 0;
    transform: scale(0.94) translateY(4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`

const MessageBubble = styled(Paper) <{ isRTL?: boolean }>`
  padding: 1rem 1.25rem;
  border-radius: 1.5rem!important;
  border-bottom-right-radius: 0.5rem!important;
  width: fit-content;
  max-width: 85%;
  align-self: flex-end;
  margin-bottom: 0.5rem;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  animation: ${bubbleEnter} 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  background-color: #ECF0F1 !important; /* Very light gray for high contrast */
  color: #2C3E50 !important; /* Dark blue-gray for readability */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;

  & .MuiTypography-root {
    color: inherit;
    font-size: 1.15rem; /* Larger font size for better visibility */
    font-weight: 500;
    line-height: 1.4;
  }
  
  & .MuiTypography-caption {
    opacity: 0.7;
    color: inherit;
    font-size: 0.85rem;
    margin-top: 0.25rem;
    display: block;
  }
`

const BubblesContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  padding: 1rem 0;
  gap: 0.5rem;
  box-sizing: border-box;
`

const RightPanelContent = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${props => props.isMobile ? '1rem' : '1rem'};
  box-sizing: border-box;
  overflow: hidden;
`

function InputApp() {
  // Initialize source language from cookie or default
  const [sourceLanguage, setSourceLanguage] = useState<GoogleSTTLanguageCode>('en-CA')
  const [settingsExpanded, setSettingsExpanded] = useState(true)
  const [connectionCount, setConnectionCount] = useState<{ total: number, byLanguage: Record<string, number> }>({ total: 0, byLanguage: {} })

  // Handle source language change and save to cookie
  const handleSourceLanguageChange = (language: GoogleSTTLanguageCode) => {
    // If language changed while recording, clear current transcript to prevent mixing
    if (sourceLanguage !== language && isTranslating) {
      setCurrentTranscription('')
    }
    setSourceLanguage(language)
    setCookie('scribe-source-language', language, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
      sameSite: 'lax'
    })
  }

  // Handle microphone gain change
  const handleMicrophoneGainChange = (event: Event, newValue: number | number[]) => {
    const gain = Array.isArray(newValue) ? newValue[0] : newValue
    setMicrophoneGain(gain)
    // Apply gain immediately (works in real-time during ongoing stream)
    googleSpeechService.setMicrophoneGain(gain)
    // Save to cookie
    setCookie('scribe-microphone-gain', gain.toString(), {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
      sameSite: 'lax'
    })
  }
  const [isTranslating, setIsTranslating] = useState(false)
  const [shouldBeListening, setShouldBeListening] = useState(false)
  const [audioLevel, setAudioLevel] = useState<number>(0) // Audio level from 0 to 1
  const [transcriptionBubbles, setTranscriptionBubbles] = useState<MessageBubble[]>([])
  const [currentTranscription, setCurrentTranscription] = useState('')

  // Microphone gain control (0.0 to 1.5, default 1.0 = 100%)
  const getInitialMicrophoneGain = (): number => {
    const savedGain = getCookie('scribe-microphone-gain')
    if (savedGain) {
      const gain = parseFloat(savedGain)
      if (!isNaN(gain) && gain >= 0 && gain <= 1.5) {
        return gain
      }
    }
    return 1.0 // Default: 100% (no adjustment)
  }
  const [microphoneGain, setMicrophoneGain] = useState<number>(getInitialMicrophoneGain())

  // Calculate button color based on audio level
  const getButtonColor = () => {
    if (!isTranslating) {
      return undefined // Use default Material-UI primary color (#9BB5D1)
    }

    // Set a threshold - only start changing color above this level
    const audioThreshold = 0.20 // Only react to audio levels above 15%
    const adjustedLevel = Math.max(0, audioLevel - audioThreshold)

    // Normalize the adjusted level to 0-1 range
    const normalizedLevel = Math.min(1, adjustedLevel / (1 - audioThreshold))

    // Apply sensitivity to the normalized level
    const intensity = Math.min(normalizedLevel * 2, 1) // Reduced from 3 to 2 for smoother transition

    // Start with your brand's primary color (#9BB5D1) and scale towards a neutral warm tone
    const brandRed = 155   // #9BB5D1 red component
    const brandGreen = 181 // #9BB5D1 green component  
    const brandBlue = 209  // #9BB5D1 blue component

    // End with a neutral warm color (muted orange/brown)
    const endRed = 180    // Neutral warm red
    const endGreen = 120  // Neutral warm green
    const endBlue = 80    // Neutral warm blue

    // Scale from brand color to neutral warm color based on intensity
    const red = Math.floor(brandRed + ((endRed - brandRed) * intensity))
    const green = Math.floor(brandGreen + ((endGreen - brandGreen) * intensity))
    const blue = Math.floor(brandBlue + ((endBlue - brandBlue) * intensity))

    return `rgb(${red}, ${green}, ${blue})`
  }
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [isSocketConnecting, setIsSocketConnecting] = useState(false)
  const [isSocketConnected, setIsSocketConnected] = useState(false)
  
  const navigate = useNavigate()
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  
  // Recording preferences state (per-session, initialized from localStorage)
  const [recordingPrefs, setRecordingPrefs] = useState(() => {
    const saved = localStorage.getItem('scribe_recording_prefs')
    return saved ? JSON.parse(saved) : {
      storeText: true,
      generateSummary: true,
      generateFacebookPost: true
    }
  })

  // Persist preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('scribe_recording_prefs', JSON.stringify(recordingPrefs))
    // Also notify backend if socket is connected
    if (isSocketConnected && socketRef.current) {
      socketRef.current.emit('updateRecordingPrefs', recordingPrefs)
    }
  }, [recordingPrefs, isSocketConnected])
  const [connectionInfo, setConnectionInfo] = useState<{ sessionCode: string, connectionUrl: string, qrCodeUrl: string, shareText: string } | null>(null)
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const [speechConfig, setSpeechConfig] = useState({
    speechEndTimeout: 1, // Balanced timeout for natural speech patterns
    maxWordsPerBubble: 15,
    speechStartTimeout: 5.0
  })
  const [isServiceReady, setIsServiceReady] = useState(false)
  const [micPermissionDenied, setMicPermissionDenied] = useState(false)
  const [micNeedsPrompt, setMicNeedsPrompt] = useState(false)
  const [micAccessResetKey, setMicAccessResetKey] = useState(0)
  const [reconnectNotice, setReconnectNotice] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'unstable' | 'disconnected'>('good')
  const socketRef = React.useRef<Socket | null>(null)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const qrCodeRef = useRef<HTMLDivElement>(null)
  const currentTranscriptionRef = React.useRef<string>('') // Ref to track current transcription for stream restart handler
  const sourceLanguageRef = React.useRef<string>('en-CA') // Ref to track source language for stream restart handler

  // Connection health monitoring refs
  const lastPongTimeRef = React.useRef<number>(Date.now())
  const missedPongCountRef = React.useRef<number>(0)
  const awaitingPongRef = React.useRef<boolean>(false)
  const awaitingFirstPongRef = React.useRef<boolean>(false)
  const visibilityHiddenTimeRef = React.useRef<number | null>(null)
  const wasStreamingBeforeDisconnectRef = React.useRef<boolean>(false) // Track streaming state for auto-resume
  const shouldBeListeningRef = React.useRef<boolean>(false)
  const isRecoveringSocketRef = React.useRef<boolean>(false)
  const lastRecoveryAtRef = React.useRef<number>(0)
  const hasConnectedOnceRef = React.useRef<boolean>(false)
  const startRecognitionInternalRef = React.useRef<(() => Promise<void>) | null>(null)
  const resumeRecognitionInternalRef = React.useRef<(() => Promise<void>) | null>(null)
  const tokensRef = React.useRef<ReturnType<typeof useAuth>['tokens']>(null)
  const sessionCodeRef = React.useRef<string | null>(null)
  const connectedSessionCodeRef = React.useRef<string | null>(null)
  const isTranslatingRef = React.useRef<boolean>(false) // Ref to track isTranslating for socket handlers
  const { user, tokens, logout, updateTokens, getConnectionInfo } = useAuth()
  const { sessionCode, setSessionCode, clearSessionCode } = useSessionCode()
  const theme = useTheme()
  const isMobile = useMediaQuery('(max-width: 850px)')

  // Prevent screen from dimming while using the app
  useWakeLock(true)

  tokensRef.current = tokens
  sessionCodeRef.current = sessionCode

  // Keep refs in sync with state for use in socket handlers (avoid stale closures)
  useEffect(() => {
    currentTranscriptionRef.current = currentTranscription
  }, [currentTranscription])

  useEffect(() => {
    sourceLanguageRef.current = sourceLanguage
  }, [sourceLanguage])

  useEffect(() => {
    isTranslatingRef.current = isTranslating
  }, [isTranslating])

  useEffect(() => {
    shouldBeListeningRef.current = shouldBeListening
  }, [shouldBeListening])

  useEffect(() => {
    if (tokens && user && user.sessionCode) {
      // Always sync the sessionCode from AuthContext to SessionCodeContext
      if (sessionCode !== user.sessionCode) {
        setSessionCode(user.sessionCode)
      }
    }
  }, [tokens, user, sessionCode, setSessionCode])

  useEffect(() => {
    if (tokens && sessionCode) {
      const fetchConnectionInfo = async () => {
        try {
          const info = await getConnectionInfo()
          setConnectionInfo(info)
        } catch (error) {
          console.error('Failed to fetch connection info:', error)
        }
      }
      fetchConnectionInfo()
    }
  }, [tokens, sessionCode, getConnectionInfo])

  useEffect(() => {
    if (!tokens?.accessToken || !sessionCode) {
      setIsSocketConnecting(false)
      setIsSocketConnected(false)
      return
    }

    if (
      socketRef.current &&
      connectedSessionCodeRef.current === sessionCode
    ) {
      socketRef.current.auth = {
        token: tokens.accessToken,
        sessionCode,
      }
      return
    }

    setIsSocketConnecting(true)
    setIsSocketConnected(false)
    connectedSessionCodeRef.current = sessionCode

    if (socketRef.current) {
      // Remove all event listeners before disconnecting
      socketRef.current.removeAllListeners()
      if ((socketRef.current as any).connectionCountInterval) {
        clearInterval((socketRef.current as any).connectionCountInterval)
      }
      if ((socketRef.current as any).heartbeatInterval) {
        clearInterval((socketRef.current as any).heartbeatInterval)
      }
      clearProactiveReconnectTimer(socketRef.current)
      socketRef.current.disconnect()
      socketRef.current = null
    }

    const getSocketAuth = () => ({
      token: tokensRef.current?.accessToken,
      sessionCode: sessionCodeRef.current,
    })

    const setupSocketMonitoring = () => {
      if ((socketRef.current as any)?.connectionCountInterval) {
        clearInterval((socketRef.current as any).connectionCountInterval)
      }
      if ((socketRef.current as any)?.heartbeatInterval) {
        clearInterval((socketRef.current as any).heartbeatInterval)
      }

      const intervalId = setInterval(() => {
        if (socketRef.current?.connected) {
          socketRef.current.emit('getConnectionCount')
        } else {
          clearInterval(intervalId)
        }
      }, 5000)
      ;(socketRef.current as any).connectionCountInterval = intervalId

      const heartbeatInterval = setInterval(() => {
        if (socketRef.current?.connected) {
          if (awaitingPongRef.current && !awaitingFirstPongRef.current) {
            missedPongCountRef.current++
            console.warn(`⚠️ Missed pong #${missedPongCountRef.current}`)

            if (missedPongCountRef.current >= 2) {
              setConnectionQuality('unstable')
            }

            if (
              missedPongCountRef.current >= 3 &&
              !isRecoveringSocketRef.current &&
              !isTransportSettling()
            ) {
              console.error('❌ Connection appears dead (3 missed pongs), forcing reconnection...')
              setConnectionQuality('disconnected')
              forceTransportReconnect(socketRef.current)
              return
            }
          }

          awaitingPongRef.current = true
          socketRef.current.emit('ping')
        } else {
          clearInterval(heartbeatInterval)
        }
      }, 5000)
      ;(socketRef.current as any).heartbeatInterval = heartbeatInterval
    }

    const RECOVERY_DEBOUNCE_MS = 3000

    const recoverSocketSession = async () => {
      if (!wasStreamingBeforeDisconnectRef.current || isRecoveringSocketRef.current) {
        return
      }

      const now = Date.now()
      if (now - lastRecoveryAtRef.current < RECOVERY_DEBOUNCE_MS) {
        return
      }
      lastRecoveryAtRef.current = now

      isRecoveringSocketRef.current = true
      wasStreamingBeforeDisconnectRef.current = false

      console.log('🔄 Recovering speaker session after reconnect')
      try {
        if (googleSpeechService.hasActiveAudioCapture()) {
          await googleSpeechService.reattachSocket(socketRef.current)
          googleSpeechService.reemitInterimToUI()
          setIsServiceReady(googleSpeechService.isSocketReady())
          setReconnectNotice(null)
        } else {
          await googleSpeechService.initialize(socketRef.current)
          setIsServiceReady(googleSpeechService.isSocketReady())

          if (resumeRecognitionInternalRef.current) {
            await resumeRecognitionInternalRef.current()
            setShouldBeListening(true)
            setReconnectNotice(null)
          } else {
            throw new Error('Recognition not ready')
          }
        }
      } catch (resumeError) {
        console.error('❌ Failed to auto-resume after reconnect:', resumeError)
        setShouldBeListening(false)
        googleSpeechService.stopRecognition()
        setIsTranslating(false)
        setAudioLevel(0)
        setReconnectNotice(
          'Connection restored — tap Start Recording to continue.'
        )
      } finally {
        isRecoveringSocketRef.current = false
        markTransportSettling()
      }
    }

    socketRef.current = io(CONFIG.BACKEND_URL, {
      auth: getSocketAuth(),
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000
    })

    socketRef.current.on('connect', async () => {
      setIsSocketConnecting(false)
      setIsSocketConnected(true)
      setConnectionQuality('good')
      socketRef.current?.emit('getConnectionCount')

      lastPongTimeRef.current = Date.now()
      missedPongCountRef.current = 0
      awaitingPongRef.current = false

      const isReconnect = hasConnectedOnceRef.current
      const isProactive = isProactiveRefreshInProgress()

      if (isReconnect) {
        markTransportSettling()
        awaitingFirstPongRef.current = true

        if (isProactive && googleSpeechService.hasActiveAudioCapture()) {
          await googleSpeechService.reattachSocket(socketRef.current)
          googleSpeechService.reemitInterimToUI()
          setIsServiceReady(googleSpeechService.isSocketReady())
          clearProactiveRefresh()
        } else if (!isProactive) {
          await recoverSocketSession()
        } else {
          clearProactiveRefresh()
        }
      }
      hasConnectedOnceRef.current = true

      setTimeout(() => {
        if (!socketRef.current?.connected) return
        setupSocketMonitoring()
        scheduleProactiveReconnect(socketRef.current, getSocketAuth)
      }, isReconnect ? 1500 : 0)
    })

    socketRef.current.on('connectionCount', (data: {
      sessionCode?: string
      total: number
      byLanguage: Record<string, number>
    }) => {
      const currentSessionCode = sessionCodeRef.current
      if (data.sessionCode && currentSessionCode && data.sessionCode !== currentSessionCode) {
        return
      }
      setConnectionCount({ total: data.total, byLanguage: data.byLanguage })
    })

    socketRef.current.on('disconnect', (reason) => {
      console.log(
        `🔌 InputApp disconnected: ${reason}, shouldBeListening: ${shouldBeListeningRef.current}`
      )

      if (!isRecoveringSocketRef.current && !isProactiveRefreshInProgress()) {
        wasStreamingBeforeDisconnectRef.current = shouldBeListeningRef.current
      }

      setIsSocketConnecting(false)
      setIsSocketConnected(false)
      setConnectionQuality('disconnected')

      // Clear intervals
      if ((socketRef.current as any)?.connectionCountInterval) {
        clearInterval((socketRef.current as any).connectionCountInterval)
      }
      if ((socketRef.current as any)?.heartbeatInterval) {
        clearInterval((socketRef.current as any).heartbeatInterval)
      }
      clearProactiveReconnectTimer(socketRef.current)
    })

    socketRef.current.on('connect_error', (error: Error) => {
      console.error('❌ Socket connection error:', error)
      setIsSocketConnecting(false)
      setIsSocketConnected(false)
      const message = error?.message || ''
      if (isSessionCodeAuthError(message)) {
        setErrorMessage(
          'Your session code could not be verified. Open Profile → Session Code to confirm or regenerate it, then refresh this page.'
        )
      }
    })

    socketRef.current.on('reconnect', (attemptNumber) => {
      console.log(`🔄 InputApp reconnected after ${attemptNumber} attempts`)
    })

    socketRef.current.on('reconnect_error', (error) => {
      console.error('❌ Reconnection error:', error)
      setIsSocketConnecting(false)
      setIsSocketConnected(false)
    })

    socketRef.current.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed after all attempts')
      setIsSocketConnecting(false)
      setIsSocketConnected(false)
    })

    socketRef.current.on('error', (error) => {
      console.error('❌ Socket error:', error)
    })

    socketRef.current.on('tokenExpired', (data) => {
      if (tokens.refreshToken) {
        socketRef.current?.emit('refreshToken', {
          refreshToken: tokens.refreshToken
        })
      }
    })

    socketRef.current.on('tokenRefreshed', (data) => {
      if (socketRef.current) {
        socketRef.current.auth = {
          token: data.accessToken,
          sessionCode: sessionCodeRef.current,
        }
      }
      if (updateTokens) {
        updateTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        })
      }
    })

    socketRef.current.on('tokenRefreshError', (data) => {
      console.error('❌ Token refresh failed:', data)
      if (logout) {
        logout()
      }
    })

    socketRef.current.on('pong', () => {
      // Track successful pong - connection is healthy
      lastPongTimeRef.current = Date.now()
      awaitingPongRef.current = false
      awaitingFirstPongRef.current = false

      // Clear visibility verification timeout if pending
      if ((socketRef.current as any)?.visibilityVerifyTimeout) {
        clearTimeout((socketRef.current as any).visibilityVerifyTimeout)
          ; (socketRef.current as any).visibilityVerifyTimeout = null
      }

      // Reset missed count and quality on successful pong
      if (missedPongCountRef.current > 0) {
        console.log('✅ Connection recovered, pong received')
        missedPongCountRef.current = 0
        setConnectionQuality('good')
      }
    })

    // Only commit interim to a final bubble on language change — not on reconnect/recovery restarts
    socketRef.current.on('streamRestart', (data: { reason: string }) => {
      if (data.reason !== 'language_changed') {
        return
      }

      const displayedText = currentTranscriptionRef.current
      if (displayedText && displayedText.trim()) {
        // Save the displayed text as a final bubble
        const uniqueId = `stream-restart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const newBubble: MessageBubble = {
          id: uniqueId,
          text: displayedText,
          timestamp: new Date(),
          isComplete: false
        }
        setTranscriptionBubbles(prev => [...prev, newBubble])

        // Send to backend for translation using ref to get current value
        if (socketRef.current?.connected) {
          socketRef.current.emit('speechTranscription', {
            transcription: displayedText,
            sourceLanguage: sourceLanguageRef.current,
            bubbleId: uniqueId
          })
        }

        // Clear the interim display
        setCurrentTranscription('')

        // Mark as complete after delay
        setTimeout(() => {
          setTranscriptionBubbles(prev =>
            prev.map(bubble =>
              bubble.id === uniqueId ? { ...bubble, isComplete: true } : bubble
            )
          )
        }, 250)
      }
    })

    return () => {
      hasConnectedOnceRef.current = false
      if (socketRef.current) {
        if ((socketRef.current as any).connectionCountInterval) {
          clearInterval((socketRef.current as any).connectionCountInterval)
        }
        if ((socketRef.current as any).heartbeatInterval) {
          clearInterval((socketRef.current as any).heartbeatInterval)
        }
        clearProactiveReconnectTimer(socketRef.current)
        socketRef.current.disconnect()
        socketRef.current = null
      }
      setIsSocketConnecting(false)
      setIsSocketConnected(false)
    }
  }, [tokens?.accessToken, sessionCode])

  // Visibility change handler - verify connection when app returns from background
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // App going to background - record time
        visibilityHiddenTimeRef.current = Date.now()
      } else if (document.visibilityState === 'visible') {
        // App returning to foreground
        const hiddenDuration = visibilityHiddenTimeRef.current
          ? Date.now() - visibilityHiddenTimeRef.current
          : 0
        visibilityHiddenTimeRef.current = null

        console.log(`👁️ App foregrounded after ${Math.round(hiddenDuration / 1000)}s`)

        if (
          isTranslatingRef.current &&
          !isStreamLive(googleSpeechService.getStream())
        ) {
          setShouldBeListening(false)
          googleSpeechService.stopRecognition()
          googleSpeechService.releaseMicrophone()
          setMicAccessResetKey((k) => k + 1)
          setIsTranslating(false)
          setAudioLevel(0)
          setErrorMessage(
            'Microphone was interrupted. Tap Start Recording to enable it again.'
          )
        }

        if (socketRef.current) {
          // Send immediate ping to verify connection
          awaitingPongRef.current = true
          socketRef.current.emit('ping')

          // If no pong received within 3 seconds, force reconnect
          const verifyTimeout = setTimeout(() => {
            if (
              awaitingPongRef.current &&
              socketRef.current &&
              !isRecoveringSocketRef.current &&
              !isTransportSettling()
            ) {
              console.error('❌ No pong after foregrounding, forcing reconnection...')
              setConnectionQuality('disconnected')
              forceTransportReconnect(socketRef.current)
            }
          }, 3000)

            // Store timeout so it can be cleared if pong arrives
            ; (socketRef.current as any).visibilityVerifyTimeout = verifyTimeout
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      // Clear any pending verification timeout
      if (socketRef.current && (socketRef.current as any).visibilityVerifyTimeout) {
        clearTimeout((socketRef.current as any).visibilityVerifyTimeout)
      }
    }
  }, [])

  useEffect(() => {
    queryMicrophonePermission().then((state) => {
      setMicPermissionDenied(state === 'denied')
      setMicNeedsPrompt(
        needsMicrophonePrompt(state) && !googleSpeechService.isMicrophoneReady()
      )
    })
  }, [])

  const handleMicrophoneLost = useCallback(() => {
    setShouldBeListening(false)
    setIsTranslating(false)
    setAudioLevel(0)
    setMicAccessResetKey((k) => k + 1)
    setMicNeedsPrompt(true)
    setErrorMessage(
      'Microphone was interrupted. Tap Start Recording to enable it again.'
    )
  }, [])

  // Wire speech service to socket when connected (no microphone access here)
  useEffect(() => {
    if (isSocketConnected && socketRef.current) {
      googleSpeechService.initialize(socketRef.current)
        .then(() => {
          setIsServiceReady(googleSpeechService.isSocketReady())
        })
        .catch(error => {
          console.error('❌ Failed to initialize Google Speech Service:', error)
          setIsServiceReady(false)
        })
    } else {
      setIsServiceReady(false)
    }
  }, [isSocketConnected])

  useEffect(() => {
    if (googleSpeechService.isMicrophoneReady()) {
      googleSpeechService.setMicrophoneGain(microphoneGain)
    }
  }, [microphoneGain])

  // Cleanup Google Speech Service on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (socketRef.current) {
        socketRef.current.removeAllListeners()
        if ((socketRef.current as any).connectionCountInterval) {
          clearInterval((socketRef.current as any).connectionCountInterval)
        }
        socketRef.current.disconnect()
      }
      googleSpeechService.cleanup()
    }
  }, [])

  const speechRecognitionCallbacks = React.useMemo(
    () => ({
      onStart: () => {
        setIsTranslating(true)
        setErrorMessage(null)
      },
      onEnd: () => {
        setIsTranslating(false)
        setAudioLevel(0)
      },
      onInterimResult: (result: { transcript: string }) => {
        if (!result.transcript.trim() && currentTranscriptionRef.current.trim()) {
          return
        }
        setCurrentTranscription(result.transcript)
      },
      onFinalResult: (result: {
        transcript: string
        bubbleId: string
      }) => {
        if (!result.transcript || !result.transcript.trim()) {
          setCurrentTranscription('')
          return
        }

        const uniqueId = `${result.bubbleId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const newBubble: MessageBubble = {
          id: uniqueId,
          text: result.transcript,
          timestamp: new Date(),
          isComplete: false
        }

        setTranscriptionBubbles(prev => [...prev, newBubble])
        setCurrentTranscription('')

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
          setTranscriptionBubbles((prev) =>
            prev.map((bubble) =>
              bubble.id === uniqueId
                ? { ...bubble, isComplete: true }
                : bubble
            )
          )
        }, 250)
      },
      onError: (error: Error) => {
        console.error('❌ Google Speech recognition error:', error)
        setIsTranslating(false)
      },
      onAudioLevel: (level: number) => {
        setAudioLevel(level)
      }
    }),
    []
  )

  // Google Cloud Speech-to-Text recognition
  const startGoogleSpeechRecognitionInternal = useCallback(async () => {
    googleSpeechService.updateConfig({
      languageCode: sourceLanguage,
      speechStartTimeout: speechConfig.speechStartTimeout,
      maxWordsPerBubble: speechConfig.maxWordsPerBubble
    })

    await googleSpeechService.startRecognition(speechRecognitionCallbacks)
  }, [sourceLanguage, speechConfig, speechRecognitionCallbacks])

  const resumeGoogleSpeechRecognitionInternal = useCallback(async () => {
    googleSpeechService.updateConfig({
      languageCode: sourceLanguage,
      speechStartTimeout: speechConfig.speechStartTimeout,
      maxWordsPerBubble: speechConfig.maxWordsPerBubble
    })

    await googleSpeechService.resumeRecognitionAfterReconnect(speechRecognitionCallbacks)
  }, [sourceLanguage, speechConfig, speechRecognitionCallbacks])

  startRecognitionInternalRef.current = startGoogleSpeechRecognitionInternal
  resumeRecognitionInternalRef.current = resumeGoogleSpeechRecognitionInternal

  // Google Cloud Speech-to-Text handlers
  const startGoogleSpeechRecognition = useCallback(async () => {
    try {
      if (!isSocketConnected || !socketRef.current) {
        setErrorMessage('Connecting to server...')
        return
      }

      setReconnectNotice(null)

      // Acquire mic first while still inside the user-gesture handler (required on iOS).
      await googleSpeechService.ensureMicrophone({
        deviceId: selectedDeviceId ?? undefined,
        onMicrophoneLost: handleMicrophoneLost,
      })
      googleSpeechService.setMicrophoneGain(microphoneGain)
      setMicPermissionDenied(false)
      setMicNeedsPrompt(false)
      setErrorMessage(null)

      if (!googleSpeechService.isSocketReady()) {
        await googleSpeechService.initialize(socketRef.current)
        setIsServiceReady(googleSpeechService.isSocketReady())
      }

      await startGoogleSpeechRecognitionInternal()
      setShouldBeListening(true)
    } catch (error: unknown) {
      console.error('❌ Failed to start Google Speech recognition:', error)
      const message =
        error instanceof Error
          ? error.message
          : getMicrophoneErrorMessage(error)
      setErrorMessage(message)
      setShouldBeListening(false)
      setIsTranslating(false)
      googleSpeechService.releaseMicrophone()
      setMicAccessResetKey((k) => k + 1)

      const permission = await queryMicrophonePermission()
      if (permission === 'denied') {
        setMicPermissionDenied(true)
      } else if (needsMicrophonePrompt(permission)) {
        setMicNeedsPrompt(true)
      }
    }
  }, [
    isSocketConnected,
    selectedDeviceId,
    microphoneGain,
    handleMicrophoneLost,
    startGoogleSpeechRecognitionInternal,
  ])

  const handleStartRecording = useCallback(async () => {
    setConfirmDialogOpen(false)
    setReconnectNotice(null)
    await startGoogleSpeechRecognition()
  }, [startGoogleSpeechRecognition])

  const stopGoogleSpeechRecognition = useCallback(() => {
    // If there's current interim transcription, submit it as final
    if (currentTranscription.trim()) {
      const uniqueId = `interim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newBubble: MessageBubble = {
        id: uniqueId,
        text: currentTranscription,
        timestamp: new Date(),
        isComplete: false
      }

      setTranscriptionBubbles(prev => [...prev, newBubble])

      // Send to backend for translation and distribution to listeners
      if (socketRef.current && isSocketConnected) {
        socketRef.current.emit('speechTranscription', {
          transcription: currentTranscription,
          sourceLanguage: sourceLanguage,
          bubbleId: uniqueId
        })
      }

      // Mark as complete after a short delay
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setTranscriptionBubbles((prev) =>
          prev.map((bubble) =>
            bubble.id === uniqueId
              ? { ...bubble, isComplete: true }
              : bubble
          )
        )
      }, 250)
    }

    // Reset current transcription
    setCurrentTranscription('')

    googleSpeechService.stopRecognition()
    setIsTranslating(false)
  }, [currentTranscription, socketRef, isSocketConnected, sourceLanguage])

  // Stop recording when user toggles off (start runs from handleStartRecording on gesture)
  useEffect(() => {
    if (!shouldBeListening) {
      stopGoogleSpeechRecognition()
    }
  }, [shouldBeListening, stopGoogleSpeechRecognition])


  const downloadQRCode = () => {
    if (connectionInfo?.qrCodeUrl) {
      const link = document.createElement('a')
      link.href = connectionInfo.qrCodeUrl
      link.download = 'scribe-translation-qr.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <MainContainer isMobile={isMobile}>
      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
          {/* Top Row: Profile, Language, QR Code */}
          <Box sx={{ display: 'flex', gap: '8px', width: '100%' }}>
            <Box 
              onClick={() => navigate('/profile')}
              sx={{ flex: 1, minWidth: 0, backgroundColor: '#435A73', borderRadius: '14px', height: '48px', display: 'flex', alignItems: 'center', padding: '0 8px', gap: '6px', cursor: 'pointer', '&:hover': { backgroundColor: '#3A5068' } }}
            >
              <Box sx={{ width: 18, height: 18, borderRadius: '6px', backgroundColor: '#9FB6CC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AccountBoxIcon sx={{ fontSize: 16, color: '#435A73' }} />
              </Box>
              <Typography noWrap sx={{ color: '#D7E4F2', fontSize: '11px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</Typography>
              <Box sx={{ backgroundColor: '#3A5068', borderRadius: '999px', padding: '2px 6px', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, marginLeft: 'auto' }}>
                {isSocketConnecting ? <CircularProgress size={10} color="inherit" /> : <PeopleIcon sx={{ color: '#AFC6DD', fontSize: 12 }} />}
                <Typography sx={{ color: '#AFC6DD', fontSize: '10px', fontWeight: 'bold' }}>
                  {connectionCount.total - 1 < 0 ? '0' : connectionCount.total - 1}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <InputLanguageSelector
                label="Source Language"
                selectedLanguage={sourceLanguage}
                onLanguageChange={handleSourceLanguageChange}
                compact
              />
            </Box>
            
            <IconButton 
              onClick={() => setQrModalOpen(true)} 
              sx={{ backgroundColor: '#435A73', borderRadius: '14px', height: '48px', width: '48px', flexShrink: 0, '&:hover': { backgroundColor: '#3A5068' } }}
            >
              <QrCodeIcon sx={{ color: '#D7E4F2' }} />
            </IconButton>
          </Box>

          {/* Second Row: Settings Toggle & Play/Stop */}
          <Box sx={{ display: 'flex', gap: '8px', width: '100%' }}>
            <Box 
              onClick={() => setSettingsExpanded(!settingsExpanded)} 
              sx={{ flex: 1, height: '48px', backgroundColor: '#4E647C', borderRadius: '14px', display: 'flex', alignItems: 'center', padding: '0 14px', cursor: 'pointer', justifyContent: 'space-between' }}
            >
              <Typography sx={{ color: '#E2EDF8', fontSize: 14, fontWeight: 600 }}>Recording Settings</Typography>
              <ExpandMoreIcon sx={{ color: '#E2EDF8', transform: settingsExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
            </Box>
            <Button
              disabled={!isServiceReady}
              onClick={() => {
                if (isTranslating) setShouldBeListening(false)
                else {
                  setReconnectNotice(null)
                  setConfirmDialogOpen(true)
                }
              }}
              sx={{ 
                minWidth: '64px', width: '64px', height: '48px', 
                backgroundColor: isTranslating ? '#F44336' : '#AFC6DD', 
                borderRadius: '14px', color: '#2E455E', 
                '&:hover': { backgroundColor: isTranslating ? '#D32F2F' : '#9FB6CC' } 
              }}
            >
              {isTranslating ? <StopIcon /> : <PlayArrowIcon />}
            </Button>
          </Box>

          {micPermissionDenied && (
            <Alert severity="warning" sx={{ borderRadius: '1rem' }}>
              Microphone access is blocked for this site. In Safari: Settings → Websites →
              Microphone, allow this page, then tap Start Recording again.
            </Alert>
          )}
          {micNeedsPrompt && !micPermissionDenied && (
            <Alert severity="info" sx={{ borderRadius: '1rem' }}>
              Tap Start Recording to allow microphone access for this session.
            </Alert>
          )}
          {reconnectNotice && (
            <Alert
              severity="info"
              sx={{ borderRadius: '1rem' }}
              onClose={() => setReconnectNotice(null)}
            >
              {reconnectNotice}
            </Alert>
          )}

          <Collapse in={settingsExpanded}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mt: '4px' }}>
              <RecordingPreferences 
                recordingPrefs={recordingPrefs} 
                setRecordingPrefs={setRecordingPrefs} 
              />
              <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '1rem', padding: '1rem' }}>
                <DeviceSelector
                  selectedDeviceId={selectedDeviceId}
                  onDeviceChange={setSelectedDeviceId}
                  disabled={isTranslating}
                  micAccessResetKey={micAccessResetKey}
                />
                <Box sx={{ marginTop: '1rem' }}>
                  <Tooltip title="Lower values reduce background noise, breathing, and static. Adjust in real-time during recording.">
                    <Box sx={{ position: 'relative', width: '100%' }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 0,
                          bottom: '8px',
                          height: 4,
                          width: `${audioLevel * 100}%`,
                          backgroundColor: isTranslating ? 'primary.main' : 'rgba(155, 181, 209, 0.3)',
                          borderRadius: '2px',
                          transition: 'width 0.1s ease-out, background-color 0.2s',
                          zIndex: 0,
                        }}
                      />
                      <Slider
                        value={microphoneGain}
                        onChange={handleMicrophoneGainChange}
                        min={0.0}
                        max={1.5}
                        step={0.05}
                        disabled={!isServiceReady}
                        sx={{
                          position: 'relative',
                          zIndex: 1,
                          color: 'primary.main',
                          '& .MuiSlider-thumb': { width: 16, height: 16 },
                          '& .MuiSlider-track': { height: 4 },
                          '& .MuiSlider-rail': { height: 4, opacity: 0.3 },
                        }}
                        marks={[{ value: 0.5, label: '50%' }, { value: 1.0, label: '100%' }]}
                      />
                    </Box>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </Box>
      ) : (
        <LeftPanel elevation={3}>
          <Box sx={{ height: '7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="/scribe-logo-name-transparent.png"
              alt="Scribe"
              style={{ height: '100%', width: 'auto' }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Tooltip title="View Profile" arrow placement="bottom">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  borderRadius: '0.5rem',
                  '&:hover': {
                    backgroundColor: 'rgba(210, 180, 140, 0.1)',
                    transform: 'scale(1.02)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
                onClick={() => navigate('/profile')}
              >
                <AccountBoxIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography variant="bodyText" sx={{
                  color: 'text.secondary',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {user?.name}
                </Typography>
              </Box>
            </Tooltip>
            <IconButton
              onClick={logout}
              color="primary"
              sx={{
                borderRadius: '50%',
                padding: '0.5rem',
                '&:hover': {
                  backgroundColor: 'rgba(210, 180, 140, 0.1)'
                }
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
          <ConnectionDisplay isMobile={isMobile}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <PeopleIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                {isSocketConnecting ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '10rem' }}>
                    <CircularProgress size={20} />
                    <Typography variant="bodyText" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                      Connecting...
                    </Typography>
                  </Box>
                ) : (
                  <Chip
                    label={`${connectionCount.total - 1} connection${connectionCount.total - 1 === 1 ? '' : 's'}`}
                    color={isSocketConnected ? "primary" : "error"}
                    variant="outlined"
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      width: '10rem'
                    }}
                  />
                )}
              </div>
              {Object.keys(connectionCount.byLanguage).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginLeft: '3rem' }}>
                  {Object.entries(connectionCount.byLanguage).sort(([langA, countA], [langB, countB]) => countB - countA).map(([lang, count]) => {
                    // Try CT language first (for listeners), fallback to STT (for speakers)
                    let languageName = 'Unknown'
                    if (isValidCTLanguageCode(lang)) {
                      languageName = getCTLanguageInfo(lang).name
                    } else {
                      const sttInfo = getSTTLanguageInfo(lang as GoogleSTTLanguageCode)
                      languageName = sttInfo.name !== 'Unknown' ? sttInfo.name : lang
                    }

                    return (
                      <Tooltip
                        key={lang}
                        title={languageName}
                      >
                        <Chip
                          key={lang}
                          color="primary"
                          label={
                            <span>
                              {createHybridFlagElement(lang, 16)} {count}
                            </span>
                          }
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </Tooltip>
                    )
                  })}
                </div>
              )}
            </div>
          </ConnectionDisplay>
          <InputLanguageSelector
            label="Source Language"
            selectedLanguage={sourceLanguage}
             onLanguageChange={handleSourceLanguageChange}
          />

          <RecordingPreferences 
            recordingPrefs={recordingPrefs} 
            setRecordingPrefs={setRecordingPrefs} 
          />
          <Box sx={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '1rem' }}>
            <DeviceSelector
              selectedDeviceId={selectedDeviceId}
              onDeviceChange={setSelectedDeviceId}
              disabled={isTranslating}
              micAccessResetKey={micAccessResetKey}
            />
            <Box>
              <Tooltip title="Lower values reduce background noise, breathing, and static. Adjust in real-time during recording.">
                <Box sx={{ position: 'relative', width: '100%', marginTop: '1rem' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      height: 4,
                      width: `${audioLevel * 100}%`,
                      backgroundColor: isTranslating ? 'primary.main' : 'rgba(155, 181, 209, 0.3)',
                      borderRadius: '2px',
                      transition: 'width 0.1s ease-out, background-color 0.2s',
                      zIndex: 0,
                    }}
                  />
                  <Slider
                    value={microphoneGain}
                    onChange={handleMicrophoneGainChange}
                    min={0.0}
                    max={1.5}
                    step={0.05}
                    disabled={!isServiceReady}
                    sx={{
                      position: 'relative',
                      zIndex: 1,
                      color: 'primary.main',
                      '& .MuiSlider-thumb': {
                        width: 16,
                        height: 16,
                      },
                      '& .MuiSlider-track': {
                        height: 4,
                      },
                      '& .MuiSlider-rail': {
                        height: 4,
                        opacity: 0.3,
                      },
                    }}
                    marks={[
                      { value: 0.5, label: '50%' },
                      { value: 1.0, label: '100%' },
                    ]}
                  />
                </Box>
              </Tooltip>
            </Box>
          </Box>
          {micPermissionDenied && (
            <Alert severity="warning" sx={{ borderRadius: '1rem', marginTop: '1rem' }}>
              Microphone access is blocked for this site. In Safari: Settings → Websites →
              Microphone, allow this page, then tap Start Recording again.
            </Alert>
          )}
          {micNeedsPrompt && !micPermissionDenied && (
            <Alert severity="info" sx={{ borderRadius: '1rem', marginTop: '1rem' }}>
              Tap Start Recording to allow microphone access for this session.
            </Alert>
          )}
          {reconnectNotice && (
            <Alert
              severity="info"
              sx={{ borderRadius: '1rem', marginTop: '1rem' }}
              onClose={() => setReconnectNotice(null)}
            >
              {reconnectNotice}
            </Alert>
          )}
          <Button
            variant="contained"
            color="primary"
            disabled={!isServiceReady}
            sx={{
              borderRadius: '2rem',
              marginTop: '2rem'
            }}
            onClick={() => {
              if (isTranslating) {
                setShouldBeListening(false)
              } else {
                setReconnectNotice(null)
                setConfirmDialogOpen(true)
              }
            }}
          >
            {!isServiceReady ? 'Connecting...' : isTranslating ? 'Translating...' : 'Translate'}
          </Button>
          <QRCodeSection>
            <Typography variant="subsectionHeader" sx={{ textAlign: 'center' }}>
              Audience Access
            </Typography>
            <Typography variant="captionText" sx={{ textAlign: 'center' }}>
              Share this QR code with your audience
            </Typography>
            <QRCodeContainer ref={qrCodeRef}>
              {connectionInfo ? (
                <img
                  src={connectionInfo.qrCodeUrl}
                  alt="QR Code"
                  style={{ width: 120, height: 120 }}
                />
              ) : (
                <Box sx={{
                  width: 120,
                  height: 120,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px'
                }}>
                  <Typography variant="captionText">Generating...</Typography>
                </Box>
              )}
            </QRCodeContainer>
            <Typography variant="captionText" sx={{ textAlign: 'center', fontSize: '0.75rem' }}>
              {connectionInfo ? (
                <a href={connectionInfo.connectionUrl} target="_blank" rel="noopener noreferrer">
                  {connectionInfo.connectionUrl}
                </a>
              ) : (
                'Generating connection link...'
              )}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={downloadQRCode}
              sx={{ marginTop: '0.5rem' }}
            >
              Download QR Code
            </Button>
          </QRCodeSection>
        </LeftPanel>
      )}

      <RightPanel elevation={3} isMobile={isMobile}>
        <RightPanelContent isMobile={isMobile}>


          <BubblesContainer>
            {currentTranscription && (
              <MessageBubble
                elevation={1}
                isRTL={isRTLLanguage(sourceLanguage)}
                sx={{ opacity: 0.7 }}
              >
                <Typography variant="bodyText">{currentTranscription}</Typography>
                <Typography variant="captionText">Listening...</Typography>
              </MessageBubble>
            )}
            {[...transcriptionBubbles].reverse().map((bubble) => (
              <MessageBubble
                key={bubble.id}
                elevation={3}
                isRTL={isRTLLanguage(sourceLanguage)}
              >
                <Typography variant="bodyText">{bubble.text}</Typography>
              </MessageBubble>
            ))}
          </BubblesContainer>
        </RightPanelContent>
      </RightPanel>

      {/* QR Code Modal */}
      <Dialog
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '2rem',
            padding: '1rem'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', paddingBottom: '0.5rem' }}>
          <Typography variant="sectionHeader">
            Audience Access
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', paddingTop: '0.5rem' }}>
          <Typography variant="bodyText" sx={{ marginBottom: '1.5rem', color: 'text.secondary' }}>
            Share this QR code with your audience
          </Typography>

          <Box ref={qrCodeRef} sx={{ marginBottom: '1.5rem' }}>
            {connectionInfo ? (
              <img
                src={connectionInfo.qrCodeUrl}
                alt="QR Code"
                style={{ width: 200, height: 200 }}
              />
            ) : (
              <Box sx={{
                width: 200,
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px'
              }}>
                <Typography variant="bodyText">Generating...</Typography>
              </Box>
            )}
          </Box>

          <Typography variant="captionText" sx={{
            textAlign: 'center',
            fontSize: '0.8rem',
            wordBreak: 'break-all',
            marginBottom: '1rem',
            display: 'block'
          }}>
            {connectionInfo ? (
              <a href={connectionInfo.connectionUrl} target="_blank" rel="noopener noreferrer">
                {connectionInfo.connectionUrl}
              </a>
            ) : (
              'Generating connection link...'
            )}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', paddingTop: '0.5rem' }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={downloadQRCode}
            sx={{ marginRight: '1rem' }}
          >
            Download QR Code
          </Button>
          <Button
            variant="contained"
            onClick={() => setQrModalOpen(false)}
            sx={{ borderRadius: '2rem' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Session Dialog */}
      <Dialog 
        open={confirmDialogOpen} 
        onClose={() => setConfirmDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: '1.5rem', padding: '1rem', backgroundColor: 'background.paper' }
        }}
      >
        <DialogTitle>
          <Typography variant="sectionHeader" sx={{ marginBottom: 0 }}>Confirm Recording</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="bodyText" sx={{ marginBottom: '1.5rem' }}>
            You are about to start a new recording session. Please confirm your preferences:
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <SaveIcon color={recordingPrefs.storeText ? "primary" : "disabled"} />
              <Box>
                <Typography variant="bodyText" sx={{ fontWeight: 'bold' }}>Store Session</Typography>
                <Typography variant="captionText">
                  {recordingPrefs.storeText ? "Text will be saved to your history." : "Nothing will be saved."}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: recordingPrefs.storeText ? 1 : 0.5 }}>
              <DescriptionIcon color={recordingPrefs.generateSummary && recordingPrefs.storeText ? "primary" : "disabled"} />
              <Box>
                <Typography variant="bodyText" sx={{ fontWeight: 'bold' }}>AI Summary</Typography>
                <Typography variant="captionText">
                  {recordingPrefs.generateSummary && recordingPrefs.storeText ? "An AI summary will be generated." : "No summary will be created."}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: recordingPrefs.storeText ? 1 : 0.5 }}>
              <FacebookIcon color={recordingPrefs.generateFacebookPost && recordingPrefs.storeText ? "primary" : "disabled"} />
              <Box>
                <Typography variant="bodyText" sx={{ fontWeight: 'bold' }}>Facebook Post</Typography>
                <Typography variant="captionText">
                  {recordingPrefs.generateFacebookPost && recordingPrefs.storeText ? "A Facebook post draft will be generated." : "No post draft will be created."}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Alert severity="info" sx={{ marginTop: '2rem', borderRadius: '1rem' }}>
            You can see and change these settings anytime in the left sidebar.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ padding: '1rem 1.5rem' }}>
          <Button onClick={() => setConfirmDialogOpen(false)} color="inherit" sx={{ borderRadius: '1rem' }}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              void handleStartRecording()
            }} 
            variant="contained" 
            sx={{ borderRadius: '1rem', px: 3 }}
          >
            Start Recording
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={5000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: { xs: 90, sm: 24 } }}
      >
        <Alert
          severity="warning"
          variant="filled"
          sx={{ borderRadius: '1rem' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Connection quality warning */}
      <Snackbar
        open={connectionQuality === 'unstable'}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: { xs: 70, sm: 24 } }}
      >
        <Alert
          severity="warning"
          variant="filled"
          sx={{ borderRadius: '1rem' }}
        >
          Connection unstable - attempting to recover...
        </Alert>
      </Snackbar>
    </MainContainer>
  )
}

export default InputApp

