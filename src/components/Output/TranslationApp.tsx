import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import Typography from '../UI/Typography'
import { Paper, Chip, Button, Box, useMediaQuery, useTheme, CircularProgress, TextField, IconButton, Tooltip, Snackbar, Alert } from '@mui/material'
import OutputLanguageSelector from '../OutputLanguageSelector'
import { GoogleCTLanguageCode, getCTLanguageInfo, isValidCTLanguageCode } from '../../enums/googleCTLangs'
import { isTTSSupported } from '../../enums/googleTTSLangs'
import { io, Socket } from 'socket.io-client'
import styled, { keyframes } from 'styled-components'
import { CONFIG } from '../../config/urls'
import { useSessionCode } from '../../contexts/SessionContext'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import { setCookie, getCookie } from '../../utils/cookieUtils'
import { createHybridFlagElement } from '../../utils/flagEmojiUtils.tsx'
import { useWakeLock } from '../../utils/useWakeLock'
import TypingIndicator from '../UI/TypingIndicator'
import { isRTLLanguage } from '../../utils/rtlUtils'
import {
  getSessionCodeErrorMessage,
  isSessionCodeAuthError,
  isValidSessionCodeFormat,
  normalizeSessionCode,
} from '../../utils/sessionCodeUtils'
import {
  clearProactiveReconnectTimer,
  forceTransportReconnect,
  scheduleProactiveReconnect,
} from '../../utils/socketReconnect'

const LandingPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`

const LandingCard = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 3rem;
  border-radius: 2rem;
  max-width: 95%;
  width: 30rem;
  max-height: 90%;
  height: 40rem;
  gap: 2.5rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-radius: 2rem!important;
`

const LanguageSelectionSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
`

const StartButton = styled(Button)`
  padding: 1rem 3rem;
  border-radius: 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: none;
  min-width: 200px;
`

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
  min-height: 3rem;
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
  max-width: 30%;
  min-width: 20%;
  border-radius: 2rem !important;
  margin: 1rem;
  margin-right: 0.5rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  height: calc(100% - 2rem);
`

const RightPanel = styled(Paper) <{ isMobile: boolean }>`
  ${props => props.isMobile ? `
    flex: 1;
    width: 100%;
    height: 100%;
    border-radius: 1rem !important;
  ` : `
    flex: 1 1 70%;
    max-width: 80%;
    min-width: 70%;
    height: calc(100% - 2rem);
    border-radius: 2rem !important;
    margin: 1rem;
    margin-left: 0.5rem;
  `}
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  min-height: 0;
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

const TypingIndicatorSlot = styled.div<{ $active: boolean }>`
  overflow: hidden;
  max-height: ${props => (props.$active ? '80vh' : '0')};
  opacity: ${props => (props.$active ? 1 : 0)};
  transition: max-height 0.35s cubic-bezier(0.22, 1, 0.36, 1),
              opacity 0.3s ease;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
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
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  min-height: 0;
  padding: 1rem 0;
  box-sizing: border-box;
  
  /* Hide any stray text nodes */
  font-size: 0;
  
  & > * {
    font-size: initial;
  }
`

const BubblesList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: auto;
  gap: 0.5rem;
  width: 100%;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #b0b0b0;
  text-align: center;
  padding: 2rem;
`

const HeaderSection = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: ${props => props.isMobile ? '1rem' : '4rem'};
  margin-bottom: 2rem;
`

const ConnectionStatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`

const RightPanelContent = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: ${props => props.isMobile ? '1rem' : '1rem'};
  box-sizing: border-box;
  overflow: hidden;
`

const SCROLL_THRESHOLD = 48

const BackButton = styled(Button)`
  border-radius: 2rem;
  text-transform: none;
`

interface TranslationBubble {
  id: string
  originalText: string
  translatedText: string
  sourceLanguage: string // Can be STT or CT language code
  targetLanguage: GoogleCTLanguageCode
  timestamp: Date
  isComplete: boolean
  hasBeenRead?: boolean // Track if this bubble has been read aloud
  messageId?: string // For guaranteed delivery acknowledgment tracking
}

function TranslationApp() {
  // Initialize target language from cookie or default
  const getInitialTargetLanguage = (): GoogleCTLanguageCode => {
    const savedLanguage = getCookie('scribe-target-language')
    if (savedLanguage && isValidCTLanguageCode(savedLanguage)) {
      return savedLanguage as GoogleCTLanguageCode
    }
    return GoogleCTLanguageCode.FR
  }

  const [targetLanguage, setTargetLanguage] = useState<GoogleCTLanguageCode>(getInitialTargetLanguage())
  const [sourceLanguage, setSourceLanguage] = useState<string | undefined>(undefined) // Track source language from speaker
  const [translationBubbles, setTranslationBubbles] = useState<TranslationBubble[]>([])
  const [isSpeakerTyping, setIsSpeakerTyping] = useState(false) // Track if speaker is typing (interim transcription)
  const [interimText, setInterimText] = useState<string | null>(null)

  // Text-to-Speech state
  const [ttsEnabled, setTtsEnabled] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const speechQueueRef = useRef<string[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isProcessingRef = useRef(false)
  const ttsEnabledRef = useRef(false) // Ref to track ttsEnabled for callbacks
  const targetLanguageRef = useRef(targetLanguage) // Ref for target language
  const queueSpeechRef = useRef<((text: string) => void) | null>(null) // Ref for queueSpeech function
  const showLanguageSelectionRef = useRef(true) // Ref to track if user has joined (for socket handlers)
  const processedTranslationsRef = useRef<Set<string>>(new Set()) // Track processed translations for deduplication
  const processedMessageIdsRef = useRef<Set<string>>(new Set()) // Track processed messageIds for idempotent display
  const bubblesContainerRef = useRef<HTMLDivElement>(null)
  const bubblesListRef = useRef<HTMLDivElement>(null)
  const shouldAutoScrollRef = useRef(true)

  const scrollToBottom = useCallback(() => {
    const el = bubblesContainerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [])

  const handleBubblesScroll = useCallback(() => {
    const el = bubblesContainerRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    shouldAutoScrollRef.current = distanceFromBottom <= SCROLL_THRESHOLD
  }, [])

  useLayoutEffect(() => {
    if (shouldAutoScrollRef.current) {
      scrollToBottom()
    }
  }, [translationBubbles, interimText, isSpeakerTyping, scrollToBottom])

  useEffect(() => {
    const listEl = bubblesListRef.current
    if (!listEl) return

    const observer = new ResizeObserver(() => {
      if (shouldAutoScrollRef.current) {
        scrollToBottom()
      }
    })
    observer.observe(listEl)
    return () => observer.disconnect()
  }, [scrollToBottom, translationBubbles.length, isSpeakerTyping])

  // Handle target language change and save to cookie
  const handleTargetLanguageChange = (language: GoogleCTLanguageCode) => {
    setTargetLanguage(language)
    setCookie('scribe-target-language', language, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
      sameSite: 'lax'
    })
    // Disable TTS if the new language doesn't support it
    if (!isTTSSupported(language)) {
      setTtsEnabled(false)
    }
  }

  // Check if TTS is available for the current target language
  const ttsAvailable = isTTSSupported(targetLanguage)

  // Sync refs with state
  useEffect(() => {
    ttsEnabledRef.current = ttsEnabled
  }, [ttsEnabled])

  useEffect(() => {
    targetLanguageRef.current = targetLanguage
  }, [targetLanguage])

  // Ref for processQueue to avoid stale closure issues
  const processQueueRef = useRef<() => void>(() => { })

  // Initialize audio element for TTS playback
  useEffect(() => {
    audioRef.current = new Audio()

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  // Function to speak text using Google Cloud TTS via backend API
  const speakText = useCallback(async (text: string, languageCode: string) => {
    if (!audioRef.current) {
      return
    }

    setIsSpeaking(true)

    try {
      const response = await fetch(`${CONFIG.BACKEND_URL}/api/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          languageCode
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `TTS request failed: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      audioRef.current.onended = () => {
        URL.revokeObjectURL(audioUrl)
        setIsSpeaking(false)
        isProcessingRef.current = false
        setTimeout(() => processQueueRef.current(), 100)
      }

      audioRef.current.onerror = () => {
        URL.revokeObjectURL(audioUrl)
        console.error('🔊 TTS: Audio playback error')
        setIsSpeaking(false)
        isProcessingRef.current = false
        setTimeout(() => processQueueRef.current(), 100)
      }

      audioRef.current.src = audioUrl
      audioRef.current.play().catch(err => {
        console.error('🔊 TTS: Playback error:', err)
        URL.revokeObjectURL(audioUrl)
        setIsSpeaking(false)
        isProcessingRef.current = false
        setTimeout(() => processQueueRef.current(), 100)
      })
    } catch (error) {
      console.error('🔊 TTS: Error:', error)
      setIsSpeaking(false)
      isProcessingRef.current = false
      setTimeout(() => processQueueRef.current(), 100)
    }
  }, [])

  // Process speech queue - uses refs to avoid stale closures
  const processQueue = useCallback(() => {
    if (!ttsEnabledRef.current) return
    if (isProcessingRef.current) return

    const nextItem = speechQueueRef.current.shift()
    if (nextItem) {
      isProcessingRef.current = true
      const currentTargetLang = targetLanguageRef.current
      speakText(nextItem, currentTargetLang)
    }
  }, [speakText])

  useEffect(() => {
    processQueueRef.current = processQueue
  }, [processQueue])

  // Add text to speech queue
  const queueSpeech = useCallback((text: string) => {
    if (!ttsEnabledRef.current) {
      return
    }

    speechQueueRef.current.push(text)

    // If not currently processing, start processing queue
    if (!isProcessingRef.current) {
      processQueue()
    }
  }, [processQueue])

  // Keep queueSpeechRef updated with latest queueSpeech function
  useEffect(() => {
    queueSpeechRef.current = queueSpeech
  }, [queueSpeech])

  // Toggle TTS on/off
  const toggleTts = useCallback(() => {
    if (!ttsAvailable) return

    setTtsEnabled(prev => {
      const newValue = !prev
      if (!newValue) {
        // Stop any ongoing speech when disabling
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.src = ''
        }
        speechQueueRef.current = []
        isProcessingRef.current = false
        setIsSpeaking(false)
      }
      return newValue
    })
  }, [ttsAvailable])

  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showLanguageSelection, setShowLanguageSelection] = useState(true)
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'unstable' | 'disconnected'>('good')

  // Connection health monitoring refs
  const lastPongTimeRef = useRef<number>(Date.now())
  const missedPongCountRef = useRef<number>(0)
  const awaitingPongRef = useRef<boolean>(false)
  const visibilityHiddenTimeRef = useRef<number | null>(null)
  const hasConnectedOnceRef = useRef(false)
  const sessionCodeRef = useRef(sessionCode)

  sessionCodeRef.current = sessionCode

  // Keep ref in sync with state for socket handlers
  useEffect(() => {
    showLanguageSelectionRef.current = showLanguageSelection
  }, [showLanguageSelection])
  const [sessionCodeInput, setSessionCodeInput] = useState('')
  const [isValidatingSessionCode, setIsValidatingSessionCode] = useState(false)
  const [sessionCodeValidationError, setSessionCodeValidationError] = useState('')
  const [attemptedSessionCode, setAttemptedSessionCode] = useState('')
  const [sessionCodeValidated, setSessionCodeValidated] = useState(false)

  const socketRef = useRef<Socket | null>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { sessionCode, setSessionCode, clearSessionCode } = useSessionCode()

  // Prevent screen from dimming while using the app
  // Only enable when user has joined a session (not on landing pages)
  useWakeLock(
    !showLanguageSelection &&
      sessionCodeValidated &&
      !!sessionCode &&
      !sessionCodeValidationError
  )

  const resetSessionJoinState = useCallback(() => {
    setSessionCodeValidated(false)
    clearSessionCode()
    setSessionCodeInput('')
    setSessionCodeValidationError('')
    setAttemptedSessionCode('')
    setShowLanguageSelection(true)
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
    setIsConnecting(false)
    setIsConnected(false)
  }, [clearSessionCode])

  const handleSessionCodeAuthFailure = useCallback(
    (message: string, attemptedCode?: string) => {
      const code = attemptedCode ? normalizeSessionCode(attemptedCode) : ''
      setSessionCodeValidated(false)
      clearSessionCode()
      setShowLanguageSelection(true)
      if (code) {
        setAttemptedSessionCode(code)
        setSessionCodeInput(code)
      }
      setSessionCodeValidationError(getSessionCodeErrorMessage(message))
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      setIsConnecting(false)
      setIsConnected(false)
    },
    [clearSessionCode]
  )

  // Function to validate session code
  const validateSessionCode = async (rawCode: string): Promise<boolean> => {
    const sessionCodeToValidate = normalizeSessionCode(rawCode)

    if (!sessionCodeToValidate || !isValidSessionCodeFormat(sessionCodeToValidate)) {
      setSessionCodeValidationError('Session code must be 3-8 characters (letters and numbers)')
      setSessionCodeValidated(false)
      clearSessionCode()
      return false
    }

    setIsValidatingSessionCode(true)
    setSessionCodeValidationError('')
    setAttemptedSessionCode(sessionCodeToValidate)

    try {
      const response = await fetch(
        `${CONFIG.BACKEND_URL}/auth/user-by-session-code?code=${encodeURIComponent(sessionCodeToValidate)}`
      )
      const data = await response.json()

      if (response.ok && data.user) {
        setSessionCode(sessionCodeToValidate)
        setSessionCodeInput(sessionCodeToValidate)
        setSessionCodeValidated(true)
        return true
      }

      handleSessionCodeAuthFailure(
        data.error || 'Session code not found',
        sessionCodeToValidate
      )
      return false
    } catch (error) {
      console.error('Session code validation error:', error)
      setSessionCodeValidationError('Could not verify the session code. Check your connection and try again.')
      setSessionCodeValidated(false)
      clearSessionCode()
      return false
    } finally {
      setIsValidatingSessionCode(false)
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const codeFromUrl = urlParams.get('code')

    if (codeFromUrl) {
      const normalized = normalizeSessionCode(codeFromUrl)
      setSessionCodeInput(normalized)
      void validateSessionCode(normalized)
    } else {
      resetSessionJoinState()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, [])

  useEffect(() => {
    console.log('🔗 TranslationApp - Connecting with sessionCode:', sessionCode, 'targetLanguage:', targetLanguage)

    if (!sessionCodeValidated || !targetLanguage || !sessionCode) {
      console.log('🔗 TranslationApp - Not connecting: missing sessionCode or targetLanguage')
      setIsConnecting(false)
      setIsConnected(false)
      return
    }

    setIsConnecting(true)
    setIsConnected(false)

    const getSocketAuth = () => ({
      sessionCode: sessionCodeRef.current,
    })

    const restoreListenerSession = (source: 'connect' | 'reconnect') => {
      const currentTargetLanguage = targetLanguageRef.current
      const isOnLandingPage = showLanguageSelectionRef.current
      if (!currentTargetLanguage || isOnLandingPage) {
        return
      }

      console.log(`🔗 Re-establishing target language after ${source}: ${currentTargetLanguage}`)
      socketRef.current?.emit('setTargetLanguage', { targetLanguage: currentTargetLanguage })

      if (source === 'reconnect' || hasConnectedOnceRef.current) {
        console.log('📬 Requesting missed messages after reconnect')
        socketRef.current?.emit('requestMissedMessages')
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

    socketRef.current.on('connect', () => {
      setIsConnecting(false)
      setIsConnected(true)
      setConnectionQuality('good')

      // Reset connection health tracking
      lastPongTimeRef.current = Date.now()
      missedPongCountRef.current = 0
      awaitingPongRef.current = false

      restoreListenerSession(hasConnectedOnceRef.current ? 'reconnect' : 'connect')
      hasConnectedOnceRef.current = true

      const heartbeatInterval = setInterval(() => {
        if (socketRef.current?.connected) {
          if (awaitingPongRef.current) {
            missedPongCountRef.current++
            console.warn(`⚠️ Missed pong #${missedPongCountRef.current}`)

            if (missedPongCountRef.current >= 2) {
              setConnectionQuality('unstable')
            }

            if (missedPongCountRef.current >= 3) {
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

    socketRef.current = io(CONFIG.BACKEND_URL, {
      auth: getSocketAuth(),
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000
    })

    socketRef.current.on('connect', () => {
      setIsConnecting(false)
      setIsConnected(true)
      setConnectionQuality('good')

      scheduleProactiveReconnect(socketRef.current, getSocketAuth)
    })

    socketRef.current.on('disconnect', (reason) => {
      console.log(`🔌 TranslationApp disconnected: ${reason}`)
      setIsConnecting(false)
      setIsConnected(false)

      // Clear heartbeat interval
      if ((socketRef.current as any)?.heartbeatInterval) {
        clearInterval((socketRef.current as any).heartbeatInterval)
      }
      clearProactiveReconnectTimer(socketRef.current)
    })

    socketRef.current.on('connect_error', (error: Error) => {
      console.error('🔗 TranslationApp - Connection error:', error)
      setIsConnecting(false)
      setIsConnected(false)
      const message = error?.message || ''
      if (isSessionCodeAuthError(message)) {
        handleSessionCodeAuthFailure(message, sessionCode ?? undefined)
      }
    })

    socketRef.current.on('speakerTyping', (data: { 
      isTyping: boolean
      interimText?: string
      translatedInterimText?: string
      sourceLanguage?: string 
    }) => {
      setIsSpeakerTyping(data.isTyping)
      if (data.isTyping) {
        setInterimText(data.translatedInterimText || null)
      } else if (!data.isTyping) {
        setInterimText(null)
      }
    })

    socketRef.current.on('translationComplete', (data) => {
      setInterimText(null)
      setIsSpeakerTyping(false)

      // Immediately acknowledge receipt if messageId is present (guaranteed delivery system)
      if (data.messageId && socketRef.current?.connected) {
        socketRef.current.emit('translationAck', { messageId: data.messageId })
        console.log(`✅ Acknowledged message: ${data.messageId}`)
      }

      // Track source language from the speaker
      if (data.sourceLanguage) {
        setSourceLanguage(data.sourceLanguage)
      }

      const bubbleId = data.bubbleId || Date.now().toString()
      const translatedText = data.translatedText || 'Translation failed'
      const originalText = data.originalText || 'Unknown'
      const messageId = data.messageId

      // Idempotent display: Check if we've already displayed this messageId
      if (messageId && processedMessageIdsRef.current.has(messageId)) {
        console.log(`⚠️ [Idempotent] Skipping already displayed messageId: ${messageId}`)
        return
      }

      // Create a unique key combining bubbleId AND text for true duplicate detection
      // Only skip if we've seen this EXACT combination before
      const dedupeKey = `${bubbleId}:${originalText.trim()}`

      if (processedTranslationsRef.current.has(dedupeKey)) {
        console.log('⚠️ Skipping true duplicate:', dedupeKey.substring(0, 60))
        return
      }

      // Mark messageId as processed for idempotent display
      if (messageId) {
        processedMessageIdsRef.current.add(messageId)
        // Limit size to prevent memory bloat
        if (processedMessageIdsRef.current.size > 500) {
          const iterator = processedMessageIdsRef.current.values()
          processedMessageIdsRef.current.delete(iterator.next().value)
        }
      }

      // Mark as processed
      processedTranslationsRef.current.add(dedupeKey)

      // Limit the size to prevent memory bloat (keep last 200 entries)
      if (processedTranslationsRef.current.size > 200) {
        const iterator = processedTranslationsRef.current.values()
        processedTranslationsRef.current.delete(iterator.next().value)
      }

      const newBubble: TranslationBubble = {
        id: `${bubbleId}-${Date.now()}`, // Make ID unique to prevent React key issues
        originalText: originalText,
        translatedText: translatedText,
        sourceLanguage: data.sourceLanguage || 'unknown',
        targetLanguage: (data.targetLanguage && isValidCTLanguageCode(data.targetLanguage))
          ? data.targetLanguage as GoogleCTLanguageCode
          : targetLanguage,
        timestamp: new Date(),
        isComplete: true,
        hasBeenRead: false,
        messageId: messageId // Store for recovery tracking
      }

      setTranslationBubbles(prev => [...prev, newBubble])

      // Queue TTS for new translation
      if (data.translatedText && queueSpeechRef.current) {
        queueSpeechRef.current(data.translatedText)
      }
    })

    socketRef.current.on('translationError', (data) => {
      const newBubble: TranslationBubble = {
        id: data.bubbleId || Date.now().toString(),
        originalText: 'Unknown',
        translatedText: 'Translation failed',
        sourceLanguage: data.sourceLanguage || 'unknown',
        targetLanguage: targetLanguage,
        timestamp: new Date(),
        isComplete: true
      }

      setTranslationBubbles(prev => [...prev, newBubble])
    })

    // Listen for source language updates from the speaker
    socketRef.current.on('sourceLanguageUpdate', (data: { sourceLanguage: string }) => {
      if (data.sourceLanguage) {
        setSourceLanguage(data.sourceLanguage)
      }
    })


    socketRef.current.on('reconnect', (attemptNumber) => {
      console.log(`🔄 TranslationApp reconnected after ${attemptNumber} attempts`)
      setIsConnecting(false)
      setIsConnected(true)

      restoreListenerSession('reconnect')
      scheduleProactiveReconnect(socketRef.current, getSocketAuth)
    })

    socketRef.current.on('reconnect_error', (error) => {
      console.error('❌ TranslationApp reconnection error:', error)
      setIsConnecting(false)
      setIsConnected(false)
    })

    socketRef.current.on('reconnect_failed', () => {
      console.error('❌ TranslationApp reconnection failed after all attempts')
      setIsConnecting(false)
      setIsConnected(false)
    })

    socketRef.current.on('pong', () => {
      // Track successful pong - connection is healthy
      lastPongTimeRef.current = Date.now()
      awaitingPongRef.current = false

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

    return () => {
      hasConnectedOnceRef.current = false
      if (socketRef.current) {
        if ((socketRef.current as any).heartbeatInterval) {
          clearInterval((socketRef.current as any).heartbeatInterval)
        }
        clearProactiveReconnectTimer(socketRef.current)
        socketRef.current.disconnect()
      }
      setIsConnecting(false)
      setIsConnected(false)
    }
  }, [targetLanguage, sessionCode, sessionCodeValidated, handleSessionCodeAuthFailure])

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

        // If socket exists, verify connection immediately
        if (socketRef.current) {
          // Send immediate ping to verify connection
          awaitingPongRef.current = true
          socketRef.current.emit('ping')

          // If no pong received within 3 seconds, force reconnect
          const verifyTimeout = setTimeout(() => {
            if (awaitingPongRef.current && socketRef.current) {
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
    if (socketRef.current && isConnected && targetLanguage && !showLanguageSelection) {
      socketRef.current.emit('setTargetLanguage', { targetLanguage })
    }
  }, [targetLanguage, isConnected, showLanguageSelection])


  const handleBackToLanguageSelection = () => {
    setShowLanguageSelection(true)
    // Reset to saved language or default
    setTargetLanguage(getInitialTargetLanguage())
    setTranslationBubbles([])
    // Clear deduplication set
    processedTranslationsRef.current.clear()
    // Clear target language on server (removes this client from listener list)
    // but keep socket connected so user can rejoin easily
    if (socketRef.current?.connected) {
      socketRef.current.emit('clearTargetLanguage')
    }
  }

  if (!sessionCodeValidated || sessionCodeValidationError) {
    return (
      <LandingPageContainer>
        <LandingCard elevation={3} sx={{ gap: '1rem', padding: '1rem' }}>
          <Box sx={{ height: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1.5rem', marginBottom: '1rem' }}>
            <img
              src="/scribe-logo-name-transparent.png"
              alt="Scribe"
              style={{ height: '100%', width: 'auto' }}
            />
          </Box>

          <Typography variant="sectionHeader" sx={{ fontSize: '1.25rem', textAlign: 'center' }}>
            Join Translation Session
          </Typography>

          <Typography variant="bodyText" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            {attemptedSessionCode
              ? `We couldn't find an active session for "${attemptedSessionCode}".`
              : 'Enter the session code from your speaker to join their live translation session.'}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '300px' }}>
            <TextField
              label="Session Code"
              value={sessionCodeInput}
              onChange={(e) => {
                setSessionCodeInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))
                setSessionCodeValidationError('')
                setAttemptedSessionCode('')
              }}
              placeholder="ABC123"
              variant="outlined"
              fullWidth
              error={!!sessionCodeValidationError}
              helperText={sessionCodeValidationError || 'Enter the 3-8 character session code'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '1rem',
                  fontSize: '1.1rem',
                  textAlign: 'center',
                  letterSpacing: '0.1em',
                  fontFamily: 'monospace'
                }
              }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={() => validateSessionCode(sessionCodeInput)}
              disabled={!sessionCodeInput || sessionCodeInput.length < 3 || sessionCodeInput.length > 8 || isValidatingSessionCode}
              sx={{
                borderRadius: '1rem',
                padding: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              {isValidatingSessionCode ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CircularProgress size={20} />
                  Validating...
                </Box>
              ) : (
                'Join Session'
              )}
            </Button>
          </Box>

          <Typography variant="bodyText" sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.9rem' }}>
            Or scan the QR code from the speaker's device to join automatically.
          </Typography>
        </LandingCard>
      </LandingPageContainer>
    )
  }

  if (showLanguageSelection) {
    return (
      <LandingPageContainer>
        <LandingCard elevation={3} sx={{ gap: '1rem', padding: '1rem' }}>
          <Box sx={{ height: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1.5rem', marginBottom: '1rem' }}>
            <img
              src="/scribe-logo-name-transparent.png"
              alt="Scribe"
              style={{ height: '100%', width: 'auto' }}
            />
          </Box>

          <Typography variant="sectionHeader" sx={{ fontSize: '1.25rem', textAlign: 'center' }}>
            Real-time Translation
          </Typography>

          <Typography variant="bodyText" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            Choose your preferred language to receive live translations from the speaker
          </Typography>

          <LanguageSelectionSection>
            <Typography variant="subsectionHeader" sx={{ textAlign: 'center', marginTop: '1rem' }}>
              Select Target Language
            </Typography>

            <OutputLanguageSelector
              label="Language"
              selectedLanguage={targetLanguage || GoogleCTLanguageCode.EN_US}
              onLanguageChange={handleTargetLanguageChange}
              sourceLanguage={sourceLanguage}
            />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', maxWidth: '300px' }}>
              <Typography variant="bodyText" sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.9rem' }}>
                Session Code: <strong>{sessionCode}</strong>
              </Typography>

              <Button
                variant="outlined"
                color="secondary"
                onClick={resetSessionJoinState}
                sx={{
                  borderRadius: '1rem',
                  padding: '0.5rem',
                  fontSize: '0.9rem'
                }}
              >
                Change Session Code
              </Button>
            </Box>

            <StartButton
              variant="contained"
              color="primary"
              onClick={() => {
                if (targetLanguage) {
                  // Set the target language on the server when user starts listening
                  socketRef.current?.emit('setTargetLanguage', { targetLanguage })
                  setShowLanguageSelection(false)
                }
              }}
              disabled={!targetLanguage}
              sx={{
                borderRadius: '1rem',
                padding: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                marginTop: '1rem',
                '&:disabled': {
                  opacity: 0.5,
                },
              }}
            >
              Start Listening
            </StartButton>
          </LanguageSelectionSection>
        </LandingCard>
      </LandingPageContainer>
    )
  }

  return (
    <MainContainer isMobile={isMobile}>
      {isMobile ? (
        <MobileHeader elevation={3}>
          <MobileHeaderLeft>
            <BackButton
              variant="outlined"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToLanguageSelection}
              size="small"
              sx={{
                borderRadius: '1rem',
                minWidth: 'auto',
                padding: '0.4rem',
                marginBottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
            </BackButton>
            <Typography variant="subsectionHeader" sx={{ fontSize: '1rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {(() => {
                const name = getCTLanguageInfo(targetLanguage).name;
                const words = name.split(' ');
                return words.length > 1 ? `${words[0]}...` : words[0];
              })()} {createHybridFlagElement(targetLanguage, 20)}
            </Typography>
          </MobileHeaderLeft>

          <MobileHeaderRight>
            {ttsAvailable && (
              <Tooltip title={ttsEnabled ? 'Disable read aloud' : 'Enable read aloud'} arrow>
                <IconButton
                  onClick={toggleTts}
                  color={ttsEnabled ? 'primary' : 'default'}
                  size="small"
                  sx={{
                    backgroundColor: ttsEnabled ? 'rgba(155, 181, 209, 0.15)' : 'transparent',
                    animation: isSpeaking ? 'pulse 1.5s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { opacity: 1 },
                      '50%': { opacity: 0.6 },
                      '100%': { opacity: 1 }
                    }
                  }}
                >
                  {ttsEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
                </IconButton>
              </Tooltip>
            )}
            {isConnecting ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CircularProgress size={16} />
                <Typography variant="captionText" sx={{ fontSize: '0.75rem' }}>
                  Connecting...
                </Typography>
              </Box>
            ) : (
              <Chip
                label={isConnected ? 'Connected' : 'Disconnected'}
                color={isConnected ? 'success' : 'error'}
                variant="outlined"
                size="small"
              />
            )}
          </MobileHeaderRight>
        </MobileHeader>
      ) : (
        // Desktop Left Panel
        <LeftPanel elevation={3}>
          <BackButton
            variant="outlined"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToLanguageSelection}
            sx={{
              borderRadius: '2rem',
              marginBottom: '1rem',
              alignSelf: 'flex-start'
            }}
          >
            Change Language
          </BackButton>

          <HeaderSection isMobile={isMobile}>
            <Box sx={{ height: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src="/scribe-logo-name-transparent.png"
                alt="Scribe"
                style={{ height: '100%', width: 'auto' }}
              />
            </Box>
            <Typography variant="subsectionHeader" sx={{ textAlign: 'center' }}>
              Translating to {getCTLanguageInfo(targetLanguage).name} {createHybridFlagElement(targetLanguage, 20)}
            </Typography>
          </HeaderSection>

          <ConnectionStatusContainer>
            {isConnecting ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CircularProgress size={20} />
                <Typography variant="bodyText" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  Connecting...
                </Typography>
              </Box>
            ) : (
              <Chip
                label={isConnected ? 'Connected' : 'Disconnected'}
                color={isConnected ? 'success' : 'error'}
                variant="outlined"
              />
            )}
          </ConnectionStatusContainer>

          {/* Text-to-Speech Toggle Button */}
          {ttsAvailable && (
            <Box sx={{ marginBottom: '1rem' }}>
              <Button
                variant={ttsEnabled ? 'contained' : 'outlined'}
                color="primary"
                onClick={toggleTts}
                startIcon={ttsEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
                fullWidth
                sx={{
                  borderRadius: '2rem',
                  padding: '0.75rem 1.5rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  animation: isSpeaking ? 'pulse 1.5s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.7 },
                    '100%': { opacity: 1 }
                  }
                }}
              >
                {ttsEnabled ? (isSpeaking ? 'Reading...' : 'Read Aloud On') : 'Read Aloud Off'}
              </Button>
              <Typography
                variant="captionText"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  marginTop: '0.5rem',
                  color: 'text.secondary',
                  fontSize: '0.75rem'
                }}
              >
                {ttsEnabled
                  ? 'Translations will be read aloud as they arrive'
                  : 'Enable to hear translations spoken'}
              </Typography>
            </Box>
          )}
        </LeftPanel>
      )}

      <RightPanel elevation={3} isMobile={isMobile}>
        <RightPanelContent isMobile={isMobile}>
          <BubblesContainer ref={bubblesContainerRef} onScroll={handleBubblesScroll}>
            {translationBubbles.length === 0 && !isSpeakerTyping ? (
              <EmptyState>
                <Typography variant="sectionHeader" sx={{ marginBottom: '0.5rem' }}>
                  Waiting for translation...
                </Typography>
                <Typography variant="bodyText" sx={{ color: 'text.secondary' }}>
                  Translations will appear here when the speaker starts talking
                </Typography>
              </EmptyState>
            ) : (
              <BubblesList ref={bubblesListRef}>
                {translationBubbles.map((bubble) => (
                  <MessageBubble
                    key={bubble.id}
                    elevation={3}
                    isRTL={isRTLLanguage(bubble.targetLanguage)}
                  >
                    <Typography variant="bodyText">
                      {bubble.translatedText}
                    </Typography>
                  </MessageBubble>
                ))}
                <TypingIndicatorSlot $active={isSpeakerTyping}>
                  <MessageBubble
                    elevation={1}
                    isRTL={isRTLLanguage(targetLanguage)}
                    sx={{ opacity: 0.7, animation: 'none' }}
                  >
                    {interimText ? (
                      <Typography variant="bodyText" sx={{ fontStyle: 'italic' }}>
                        {interimText}
                      </Typography>
                    ) : (
                      <TypingIndicator visible={true} />
                    )}
                  </MessageBubble>
                </TypingIndicatorSlot>
              </BubblesList>
            )}
          </BubblesContainer>
        </RightPanelContent>
      </RightPanel>

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

export default TranslationApp
