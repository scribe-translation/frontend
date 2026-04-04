interface SpeechRecognitionConfig {
  languageCode: string;
  speechStartTimeout: number; // seconds to wait for speech to start
  speechEndTimeout: number; // seconds to wait before finalizing speech
  maxWordsPerBubble: number; // maximum words before forcing finalization
  sampleRateHertz: number;
  encoding: string;
}

interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
  wordCount: number;
  bubbleId: string;
}

interface SpeechRecognitionCallbacks {
  onInterimResult: (result: SpeechRecognitionResult) => void;
  onFinalResult: (result: SpeechRecognitionResult) => void;
  onError: (error: Error) => void;
  onStart: () => void;
  onEnd: () => void;
  onAudioLevel?: (level: number) => void; // New callback for audio level updates
}

class GoogleSpeechService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private stream: MediaStream | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private isRecording = false;
  private isPaused = false;
  private currentBubbleId: string | null = null;
  private previousBubbleId: string | null = null; // Track previous bubble to handle late results
  private currentWordCount = 0;
  private currentTranscript = '';
  private config: SpeechRecognitionConfig;
  private callbacks: SpeechRecognitionCallbacks | null = null;
  private wordCountTimer: NodeJS.Timeout | null = null;
  private socket: any = null; // Socket.IO connection
  private lastSocketId: string | null = null; // Track socket ID to detect reconnections
  private hasReceivedFinalResult = false; // Track if we've received a final result from Google Cloud
  private audioLevelInterval: NodeJS.Timeout | null = null; // For audio level monitoring
  private keepAliveInterval: NodeJS.Timeout | null = null; // Keep-alive for audio stream
  private lastAudioSentTime: number = 0; // Track when last audio was sent
  private messageQueue: Array<{data: any, timestamp: number, retries: number}> = []; // Message queue for failed transmissions
  private maxRetries = 3; // Maximum number of retry attempts
  private queueProcessingInterval: NodeJS.Timeout | null = null; // Interval for processing queued messages
  private silenceDetectionInterval: NodeJS.Timeout | null = null; // For silence-based finalization
  private lastSpeechTime: number = 0; // Track when speech was last detected
  private silenceStartTime: number | null = null; // Track when silence started
  private lastInterimResultTime: number = 0; // Track when we last received an interim result from Google Cloud
  private streamHealthCheckInterval: NodeJS.Timeout | null = null; // For detecting hung streams
  /** Suppress duplicate Google isFinal after client-side silence finalization for the same bubble */
  private lastClientFinalizedBubbleId: string | null = null;

  constructor() {
    this.config = {
      languageCode: 'en-CA',
      speechStartTimeout: 5.0,
      speechEndTimeout: 1.0,
      maxWordsPerBubble: 15,
      sampleRateHertz: 48000,
      encoding: 'WEBM_OPUS'
    };
  }

  /**
   * Initialize the speech recognition service
   */
  async initialize(socket: any): Promise<void> {
    try {
      // Check if socket connection has changed (even if same reference, ID may be different after reconnect)
      const currentSocketId = socket?.id;
      const socketChanged = this.lastSocketId !== currentSocketId;
      
      if (this.socket === socket && !socketChanged) {
        return;
      }
      
      if (socketChanged) {
        // Reset recording state on reconnection so startRecognition can run again
        this.isRecording = false;
        this.isPaused = false;
        this.stopKeepAlive();
        this.stopAudioLevelMonitoring();
        if (this.scriptProcessor) {
          this.scriptProcessor.disconnect();
          this.scriptProcessor = null;
        }
      }
      
      // Clean up existing socket listeners before setting up new ones
      if (this.socket) {
        this.socket.removeAllListeners('transcriptionUpdate');
        this.socket.removeAllListeners('finalResultReceived');
        this.socket.removeAllListeners('streamRestarted');
        this.socket.removeAllListeners('streamRestartPending');
        this.socket.removeAllListeners('streamRestart');
      }
      
      this.socket = socket;
      this.lastSocketId = currentSocketId;
      
      // Listen for transcription updates from backend
      this.socket.on('transcriptionUpdate', (data: any) => {
        // Accept results from current or previous bubble (for late results after stream restart)
        const isCurrentBubble = data.bubbleId === this.currentBubbleId;
        const isPreviousBubble = data.bubbleId === this.previousBubbleId;
        
        // Debug logging for transcription flow
        
        // For FINAL results: accept from current OR previous bubble (catch late finals)
        // For INTERIM results: ONLY accept from current bubble (prevents bouncing during restart)
        if (data.isFinal) {
          if (!isCurrentBubble && !isPreviousBubble) {
            return;
          }

          if (
            this.lastClientFinalizedBubbleId &&
            data.bubbleId === this.lastClientFinalizedBubbleId
          ) {
            this.lastClientFinalizedBubbleId = null;
            return;
          }

          if (this.callbacks?.onFinalResult) {
            this.callbacks.onFinalResult({
              transcript: data.transcript,
              isFinal: data.isFinal,
              confidence: data.confidence,
              wordCount: this.currentWordCount,
              bubbleId: data.bubbleId
            });
            // Clear current transcript since we've received a final result
            if (isCurrentBubble) {
              this.currentTranscript = '';
              this.hasReceivedFinalResult = true;
            }
            // Clear previous bubble ID after receiving its final result
            if (isPreviousBubble) {
              this.previousBubbleId = null;
            }
          }
        } else {
          // INTERIM results: only accept from current bubble to prevent bouncing
          if (!isCurrentBubble) {
            return;
          }
          
          if (this.callbacks?.onInterimResult) {
            // Track the current transcript so we can save it on stream restart
            this.currentTranscript = data.transcript;
            // Update word count for silence detection
            this.currentWordCount = data.transcript.trim().split(/\s+/).filter(w => w.length > 0).length;
            // Reset silence detection when we get new interim results (speech is active)
            this.lastSpeechTime = Date.now();
            this.lastInterimResultTime = Date.now(); // Track when we last got an interim result
            this.silenceStartTime = null;
            
            this.callbacks.onInterimResult({
              transcript: data.transcript,
              isFinal: data.isFinal,
              confidence: data.confidence,
              wordCount: this.currentWordCount,
              bubbleId: data.bubbleId
            });
          }
        }
      });
      
      // Listen for final result notifications
      this.socket.on('finalResultReceived', (data: any) => {
        if (data.bubbleId === this.currentBubbleId) {
          this.hasReceivedFinalResult = true;
        }
      });
      
      // Listen for stream restart notifications
      this.socket.on('streamRestarted', (data: any) => {
        if (data?.newBubbleId != null && data.newBubbleId !== '') {
          this.currentBubbleId = data.newBubbleId;
        }
        this.hasReceivedFinalResult = false;
      });
      
      // Listen for PENDING stream restart - this is sent BEFORE the new stream starts
      // We MUST update bubbleId here so the new stream uses a different ID than the old stream
      this.socket.on('streamRestartPending', (data: any) => {
        if (this.isRecording) {
          this.lastClientFinalizedBubbleId = null;
          // Save current bubble ID as previous to allow late FINAL results to come through
          this.previousBubbleId = this.currentBubbleId;
          // Generate new bubble ID IMMEDIATELY so new stream uses different ID
          this.currentBubbleId = this.generateBubbleId();
          // DON'T clear currentTranscript here - InputApp handles saving the displayed text
          this.hasReceivedFinalResult = false;
        }
      });
      
      // Listen for stream restart requests from backend (for error recovery or language change)
      // Note: InputApp.tsx handles saving displayed interim text on stream restart
      // This handler only manages internal state for the new stream
      this.socket.on('streamRestart', (data: any) => {
        if (this.isRecording) {
          // If restart is due to language change, clear everything immediately
          if (data.reason === 'language_changed') {
            // Clear all state for language change
            this.currentTranscript = '';
            this.lastClientFinalizedBubbleId = null;
            this.previousBubbleId = null; // Don't accept late results from old language
            this.currentBubbleId = this.generateBubbleId();
            this.hasReceivedFinalResult = false;
            // Clear the displayed transcript via callback
            if (this.callbacks?.onInterimResult) {
              this.callbacks.onInterimResult({
                transcript: '',
                isFinal: false,
                confidence: 0,
                wordCount: 0,
                bubbleId: this.currentBubbleId
              });
            }
          } else {
            // For other restart reasons, save current state
            this.lastClientFinalizedBubbleId = null;
            // Save current bubble ID as previous to allow late results to come through
            this.previousBubbleId = this.currentBubbleId;
            // Generate new bubble ID and continue recording
            this.currentBubbleId = this.generateBubbleId();
            this.currentTranscript = ''; // Reset for new bubble
            this.hasReceivedFinalResult = false;
          }
        }
      });
      
      // Handle socket reconnection - process any queued messages
      this.socket.on('connect', () => {
        // Process queued messages immediately after reconnection
        setTimeout(() => {
          this.processMessageQueue();
        }, 100);
      });
      
      // Detect if we're on a mobile/tablet device (helper function)
      const detectMobileDevice = (): boolean => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (!!navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
      };
      
      const isMobileDevice = detectMobileDevice();
      
      // Request microphone access with device-appropriate audio processing
      // Enable echo cancellation and noise suppression for better transcription quality
      // autoGainControl disabled as it can distort speech and reduce transcription quality
      const audioConstraints: MediaTrackConstraints = {
        echoCancellation: true,      // Reduces echo/feedback - important for quality
        noiseSuppression: true,       // Reduces background noise - improves accuracy
        autoGainControl: false        // Disabled - can distort speech and reduce quality
      };
      
      // Some mobile devices may need specific sample rate
      if (isMobileDevice) {
        audioConstraints.sampleRate = { ideal: 48000 };
      }
      
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints
      });
      
      // Set up audio context with device-appropriate sample rate
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      
      // Use 48000 Hz sample rate (required by backend) - some mobile devices default to 44100
      this.audioContext = new AudioContextClass({
        sampleRate: 48000
      });
      
      // If the context was created with a different sample rate, we need to handle it
      if (this.audioContext.sampleRate !== 48000) {
        console.warn(`⚠️ AudioContext sample rate is ${this.audioContext.sampleRate}Hz, expected 48000Hz. This may cause issues on mobile.`);
      }

      this.analyser = this.audioContext.createAnalyser();
      // Use larger FFT size for better frequency analysis on mobile
      this.analyser.fftSize = isMobileDevice ? 512 : 256;
      this.analyser.smoothingTimeConstant = isMobileDevice ? 0.7 : 0.8; // Less smoothing on mobile for faster response
      
      // Create gain node for microphone volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 1.0; // Default: 100% (no adjustment)
      
      // Set up audio chain: microphone -> gain -> analyser
      this.microphone = this.audioContext.createMediaStreamSource(this.stream);
      this.microphone.connect(this.gainNode);
      this.gainNode.connect(this.analyser);

      // Verify all components are set up correctly
      if (!this.stream || !this.audioContext || !this.socket) {
        const missing: string[] = [];
        if (!this.stream) missing.push('stream');
        if (!this.audioContext) missing.push('audioContext');
        if (!this.socket) missing.push('socket');
        throw new Error(`Failed to initialize: missing ${missing.join(', ')}`);
      }


    } catch (error) {
      console.error('❌ Failed to initialize Google Speech Service:', error);
      // Clean up any partially initialized state
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }
      if (this.audioContext) {
        this.audioContext.close().catch(() => {});
        this.audioContext = null;
      }
      this.analyser = null;
      this.microphone = null;
      this.gainNode = null;
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to access microphone: ${errorMessage}. Please ensure microphone permissions are granted.`);
    }
  }

  /**
   * Start speech recognition
   */
  async startRecognition(callbacks: SpeechRecognitionCallbacks): Promise<void> {
    if (this.isRecording) {
      return;
    }


    if (!this.stream || !this.audioContext || !this.socket) {
      throw new Error('Service not initialized. Call initialize() first.');
    }

    this.callbacks = callbacks;
    this.isRecording = true;
    this.isPaused = false;
    this.previousBubbleId = null; // Clear any previous bubble ID when starting fresh
    this.currentBubbleId = this.generateBubbleId();
    this.lastClientFinalizedBubbleId = null;
    this.currentWordCount = 0;
    this.currentTranscript = '';
    this.hasReceivedFinalResult = false;
    this.lastInterimResultTime = Date.now(); // Initialize to current time when starting recognition

    try {
      // Use modern AudioWorklet if available, fallback to ScriptProcessorNode
      // AudioWorklet is more reliable on mobile devices
      const useAudioWorklet = this.audioContext!.audioWorklet !== undefined;
      
      if (useAudioWorklet) {
        // Modern approach: Use AudioWorklet (better for mobile)
        try {
          // Note: AudioWorklet requires a separate worklet file, so we'll use ScriptProcessorNode for now
          // but with better mobile compatibility
          const bufferSize = 4096; // Larger buffer for mobile stability
          this.scriptProcessor = this.audioContext!.createScriptProcessor(bufferSize, 1, 1);
        } catch (workletError) {
          console.warn('⚠️ AudioWorklet not available, using ScriptProcessorNode:', workletError);
          const bufferSize = 4096;
          this.scriptProcessor = this.audioContext!.createScriptProcessor(bufferSize, 1, 1);
        }
      } else {
        // Fallback: ScriptProcessorNode (deprecated but still works)
        const bufferSize = 4096; // Larger buffer for mobile devices
        this.scriptProcessor = this.audioContext!.createScriptProcessor(bufferSize, 1, 1);
      }
      
      // Connect audio chain: microphone -> gain -> script processor
      // The gain node is already connected to analyser, so we need to create a separate connection
      // for the script processor. We'll connect gain -> script processor
      if (this.gainNode) {
        this.gainNode.connect(this.scriptProcessor);
      } else {
        // Fallback if gain node doesn't exist (shouldn't happen, but safety check)
        this.microphone!.connect(this.scriptProcessor);
      }
      // Connect to destination to keep the audio processing active (required on some mobile browsers)
      this.scriptProcessor.connect(this.audioContext!.destination);
      
      // Process raw audio data
      this.scriptProcessor.onaudioprocess = (event) => {
        if (this.isRecording && !this.isPaused) {
          const inputBuffer = event.inputBuffer;
          const inputData = inputBuffer.getChannelData(0); // Get mono channel
          
          // Calculate audio level for silence detection BEFORE processing
          const audioLevel = this.calculateAudioLevel(inputData);
          
          // Update last speech time if audio is detected
          if (audioLevel > 0.02) { // Threshold for speech detection
            this.lastSpeechTime = Date.now();
            this.silenceStartTime = null;
          } else {
            // Track silence start
            if (this.silenceStartTime === null) {
              this.silenceStartTime = Date.now();
            }
          }
          
          // Convert Float32Array to Int16Array (LINEAR16 format)
          const linear16Data = this.convertFloat32ToInt16(inputData);
          
          this.processRawAudioChunk(linear16Data);
        }
      };

      // Start processing
      this.callbacks?.onStart();

      // Start audio level monitoring
      this.startAudioLevelMonitoring();
      
      // Start silence detection for automatic finalization
      this.startSilenceDetection();
      
      // Start stream health check to detect hung streams
      this.startStreamHealthCheck();
      
      // Start keep-alive mechanism to prevent audio timeout
      this.startKeepAlive();
      this.lastAudioSentTime = Date.now();
      this.lastSpeechTime = Date.now();

    } catch (error) {
      console.error('❌ Failed to start speech recognition:', error);
      // Stop streaming on error
      this.socket.emit('stopStreaming');
      this.callbacks?.onError(new Error('Failed to start speech recognition'));
    }
  }

  /**
   * Stop speech recognition
   */
  stopRecognition(): void {
    if (!this.isRecording) {
      return;
    }

    this.isRecording = false;
    this.isPaused = false;
    this.clearTimers();

    // Stop audio level monitoring
    this.stopAudioLevelMonitoring();
    
    // Stop silence detection
    this.stopSilenceDetection();
    
    // Stop stream health check
    this.stopStreamHealthCheck();
    
    // Stop keep-alive mechanism
    this.stopKeepAlive();

    // Disconnect script processor
    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect();
      this.scriptProcessor = null;
    }

    // Notify backend to stop streaming
    this.socket.emit('stopStreaming');

    this.callbacks?.onEnd();
  }

  /**
   * Pause speech recognition
   */
  pauseRecognition(): void {
    if (this.isRecording && !this.isPaused) {
      this.isPaused = true;
      this.clearTimers();
    }
  }

  /**
   * Resume speech recognition
   */
  resumeRecognition(): void {
    if (this.isRecording && this.isPaused) {
      this.isPaused = false;
    }
  }

  /**
   * Set microphone gain (volume adjustment)
   * @param gain Gain value from 0.0 to 1.5 (1.0 = 100%, no adjustment)
   */
  setMicrophoneGain(gain: number): void {
    if (!this.gainNode) {
      console.warn('⚠️ Cannot set microphone gain: gain node not initialized');
      return;
    }
    
    // Clamp gain value to valid range
    const clampedGain = Math.max(0.0, Math.min(1.5, gain));
    this.gainNode.gain.value = clampedGain;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<SpeechRecognitionConfig>): void {
    const languageChanged = newConfig.languageCode && newConfig.languageCode !== this.config.languageCode;
    this.config = { ...this.config, ...newConfig };
    
    // If language changed while recording, clear everything and generate new bubble ID
    if (languageChanged && this.isRecording) {
      this.currentTranscript = '';
      this.lastClientFinalizedBubbleId = null;
      this.previousBubbleId = null; // Don't accept late results from old language
      this.currentBubbleId = this.generateBubbleId();
      this.hasReceivedFinalResult = false;
      // Clear the displayed transcript immediately
      if (this.callbacks?.onInterimResult) {
        this.callbacks.onInterimResult({
          transcript: '',
          isFinal: false,
          confidence: 0,
          wordCount: 0,
          bubbleId: this.currentBubbleId
        });
      }
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): SpeechRecognitionConfig {
    return { ...this.config };
  }

  /**
   * Check if service is ready
   */
  isReady(): boolean {
    return this.stream !== null && this.audioContext !== null && this.socket !== null;
  }

  /**
   * Check if service is initialized with a specific socket
   */
  isInitializedWithSocket(socket: any): boolean {
    return this.socket === socket && this.lastSocketId === socket?.id;
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    
    this.stopRecognition();
    this.clearTimers();
    this.clearMessageQueue();
    this.stopKeepAlive();
    this.stopSilenceDetection();
    this.stopStreamHealthCheck();

    // Notify backend to stop streaming
    if (this.socket) {
      this.socket.emit('stopStreaming');
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.mediaRecorder = null;
    this.analyser = null;
    this.microphone = null;
    this.scriptProcessor = null;
    this.callbacks = null;
    this.socket = null;
    this.hasReceivedFinalResult = false;
    this.lastClientFinalizedBubbleId = null;
  }

  private generateBubbleId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private convertFloat32ToInt16(float32Array: Float32Array): Int16Array {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      // Convert from [-1, 1] range to [-32768, 32767] range
      // Clamp to prevent clipping and ensure clean audio
      const sample = Math.max(-1, Math.min(1, float32Array[i]));
      // Use proper scaling to avoid distortion
      int16Array[i] = Math.round(sample < 0 ? sample * 0x8000 : sample * 0x7FFF);
    }
    return int16Array;
  }

  private processRawAudioChunk(int16Data: Int16Array): void {
    // Send raw LINEAR16 data immediately
    if (int16Data.length > 0) {
      this.lastAudioSentTime = Date.now();
      this.sendRawAudioChunk(int16Data);
    }
  }

  /**
   * Start keep-alive mechanism to prevent audio timeout
   */
  private startKeepAlive(): void {
    // Send keep-alive every 5 seconds if no audio has been sent
    this.keepAliveInterval = setInterval(() => {
      if (!this.isRecording || this.isPaused) {
        return;
      }
      
      const timeSinceLastAudio = Date.now() - this.lastAudioSentTime;
      
      // If no audio sent in 5 seconds, send a silent audio frame
      if (timeSinceLastAudio > 5000) {
        // Create a small silent audio buffer (256 samples of silence)
        const silentAudio = new Int16Array(256);
        this.sendRawAudioChunk(silentAudio);
        this.lastAudioSentTime = Date.now();
      }
    }, 2000); // Check every 2 seconds
  }

  /**
   * Stop keep-alive mechanism
   */
  private stopKeepAlive(): void {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  private sendRawAudioChunk(int16Data: Int16Array): void {
    if (!this.socket) {
      console.error('❌ No socket connection available');
      return;
    }

    // Convert Int16Array to base64
    const buffer = new ArrayBuffer(int16Data.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < int16Data.length; i++) {
      view.setInt16(i * 2, int16Data[i], true); // little-endian
    }
    
    const base64Audio = this.arrayBufferToBase64(buffer);
    
    const messageData = {
      audioData: base64Audio,
      sourceLanguage: this.config.languageCode,
      bubbleId: this.currentBubbleId,
      isFinal: false,
      interimTranscript: this.currentTranscript,
      finalTranscript: '',
      wordCount: this.currentWordCount,
      maxWordsPerBubble: this.config.maxWordsPerBubble,
      audioFormat: 'LINEAR16', // Indicate this is raw LINEAR16 data
      sampleRate: 48000 // Current sample rate from AudioContext
    };
    
    this.sendWithRetry('googleSpeechTranscription', messageData);
  }

  private processAudioChunk(audioBlob: Blob): void {
    
    // Send chunk immediately for real-time streaming
    if (audioBlob.size > 0) {
      this.sendAudioChunkImmediately(audioBlob);
    }
  }

  private sendAudioChunkImmediately(audioBlob: Blob): void {
    if (!this.socket) {
      console.error('❌ No socket connection available');
      return;
    }

    // Convert blob to base64 and send immediately
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const base64Audio = this.arrayBufferToBase64(arrayBuffer);
      
      
      this.socket.emit('googleSpeechTranscription', {
        audioData: base64Audio,
        sourceLanguage: this.config.languageCode,
        bubbleId: this.currentBubbleId,
        isFinal: false,
        interimTranscript: this.currentTranscript,
        finalTranscript: '',
        wordCount: this.currentWordCount,
        maxWordsPerBubble: this.config.maxWordsPerBubble,
        speechEndTimeout: this.config.speechEndTimeout,
      });
    };
    reader.readAsArrayBuffer(audioBlob);
  }



  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private clearTimers(): void {
    if (this.wordCountTimer) {
      clearTimeout(this.wordCountTimer);
      this.wordCountTimer = null;
    }
  }

  /**
   * Calculate audio level from raw audio data (for silence detection)
   */
  private calculateAudioLevel(audioData: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < audioData.length; i++) {
      sum += audioData[i] * audioData[i];
    }
    const rms = Math.sqrt(sum / audioData.length);
    return rms;
  }

  /**
   * Start monitoring audio levels for visual feedback
   * Uses both frequency and time domain data for better mobile compatibility
   */
  private startAudioLevelMonitoring(): void {
    if (!this.analyser || !this.callbacks?.onAudioLevel) {
      return;
    }

    const frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    const timeData = new Uint8Array(this.analyser.fftSize);

    const monitorAudioLevel = () => {
      if (!this.isRecording || !this.analyser) {
        return;
      }

      // Use time domain data for more accurate volume detection on mobile
      this.analyser.getByteTimeDomainData(timeData);
      
      // Calculate RMS from time domain (more accurate for silence detection)
      let sum = 0;
      let peak = 0;
      for (let i = 0; i < timeData.length; i++) {
        const normalized = (timeData[i] - 128) / 128; // Normalize to -1 to 1
        const absValue = Math.abs(normalized);
        sum += normalized * normalized;
        peak = Math.max(peak, absValue); // Track peak for better visual feedback
      }
      const rms = Math.sqrt(sum / timeData.length);
      
      // Use a combination of RMS and peak for responsive visualization
      // RMS gives average level, peak gives instant responsiveness
      const combinedLevel = (rms * 0.7 + peak * 0.3);
      
      // Apply moderate scaling for visual feedback
      // Speech typically ranges from 0.05 to 0.3 RMS
      // Using a power curve for smoother response
      let scaledLevel = Math.pow(Math.min(1, combinedLevel * 6), 0.7);
      
      // Slight boost for very quiet signals
      if (combinedLevel > 0.02) {
        scaledLevel = Math.max(scaledLevel, 0.05); // Minimum visible level for quiet speech
      }
      
      // Apply final normalization
      const normalizedLevel = Math.min(1, scaledLevel * 1.2);
      
      // Call the callback with the audio level
      this.callbacks?.onAudioLevel?.(normalizedLevel);
    };

    // Monitor audio levels every 50ms for smooth updates
    this.audioLevelInterval = setInterval(monitorAudioLevel, 50);
  }
  
  /**
   * Start silence detection for automatic finalization
   * This helps detect when speech has ended, especially on mobile devices
   */
  private startSilenceDetection(): void {
    if (!this.callbacks) {
      return;
    }
    
    const silenceDetection = () => {
      if (!this.isRecording || !this.currentTranscript.trim()) {
        return;
      }
      
      const now = Date.now();
      const timeSinceLastSpeech = now - this.lastSpeechTime;
      const silenceTimeout = this.config.speechEndTimeout * 1000; // Convert to milliseconds
      
      // If we've been silent for longer than the timeout, finalize the current transcript
      // BUT only if we haven't received an interim result recently (Google Cloud might still be processing)
      const timeSinceLastInterim = now - this.lastInterimResultTime;
      const MIN_TIME_SINCE_INTERIM = 2000; // Wait at least 2 seconds after last interim result
      
      if (this.silenceStartTime !== null && timeSinceLastSpeech > silenceTimeout) {
        const silenceDuration = now - this.silenceStartTime;
        
        // Only finalize if:
        // 1. We have a transcript and silence has been detected
        // 2. We haven't received an interim result recently (Google Cloud might still be processing)
        // 3. We haven't already received a final result from Google Cloud
        if (silenceDuration > silenceTimeout && 
            this.currentTranscript.trim() && 
            timeSinceLastInterim > MIN_TIME_SINCE_INTERIM &&
            !this.hasReceivedFinalResult) {
          const finalTranscript = this.currentTranscript.trim();
          const finalBubbleId = this.currentBubbleId || this.generateBubbleId();
          this.lastClientFinalizedBubbleId = finalBubbleId;

          // Send final transcript to backend
          if (this.socket && this.socket.connected) {
            this.socket.emit('googleSpeechTranscription', {
              audioData: '', // No audio data for final-only message
              sourceLanguage: this.config.languageCode,
              bubbleId: finalBubbleId,
              isFinal: true,
              interimTranscript: '',
              finalTranscript: finalTranscript,
              wordCount: this.currentWordCount,
              maxWordsPerBubble: this.config.maxWordsPerBubble,
              audioFormat: 'LINEAR16',
              sampleRate: 48000
            });
          }
          
          // Create a final result from the current transcript
          if (this.callbacks?.onFinalResult) {
            this.callbacks.onFinalResult({
              transcript: finalTranscript,
              isFinal: true,
              confidence: 0.8, // Default confidence for silence-triggered finalization
              wordCount: this.currentWordCount,
              bubbleId: finalBubbleId
            });
          }
          
          // Reset state
          this.currentTranscript = '';
          this.currentBubbleId = this.generateBubbleId();
          this.currentWordCount = 0;
          this.lastSpeechTime = Date.now();
          this.silenceStartTime = null;
          this.hasReceivedFinalResult = false;
        }
      }
    };
    
    // Check for silence every 100ms
    this.silenceDetectionInterval = setInterval(silenceDetection, 100);
  }
  
  /**
   * Stop silence detection
   */
  private stopSilenceDetection(): void {
    if (this.silenceDetectionInterval) {
      clearInterval(this.silenceDetectionInterval);
      this.silenceDetectionInterval = null;
    }
    this.lastSpeechTime = 0;
    this.silenceStartTime = null;
  }

  /**
   * Stop monitoring audio levels
   */
  private stopAudioLevelMonitoring(): void {
    if (this.audioLevelInterval) {
      clearInterval(this.audioLevelInterval);
      this.audioLevelInterval = null;
    }
  }

  /**
   * Start stream health check to detect hung streams
   * If we're actively speaking but not receiving any interim results, the stream may be dead
   */
  private startStreamHealthCheck(): void {
    if (!this.socket) {
      return;
    }
    
    const STREAM_HUNG_TIMEOUT = 15000; // 15 seconds without interim results while speaking = hung
    const CHECK_INTERVAL = 5000; // Check every 5 seconds
    
    const healthCheck = () => {
      if (!this.isRecording) {
        return;
      }
      
      const now = Date.now();
      const timeSinceLastInterim = now - this.lastInterimResultTime;
      const timeSinceLastSpeech = now - this.lastSpeechTime;
      
      // If we've been speaking recently (within 5 seconds) but haven't received
      // any interim results for 15+ seconds, the stream is likely hung
      if (timeSinceLastSpeech < 5000 && timeSinceLastInterim > STREAM_HUNG_TIMEOUT) {
        console.warn(`⚠️ Stream appears hung: ${Math.round(timeSinceLastInterim / 1000)}s since last interim result while speech is active`);
        
        // Request stream restart from backend
        if (this.socket?.connected) {
          console.log('🔄 Requesting stream restart due to hung detection...');
          this.socket.emit('requestStreamRestart', { reason: 'hung_detection' });
        }
        
        // Reset the timer so we don't spam restart requests
        this.lastInterimResultTime = now;
      }
    };
    
    this.streamHealthCheckInterval = setInterval(healthCheck, CHECK_INTERVAL);
  }

  /**
   * Stop stream health check
   */
  private stopStreamHealthCheck(): void {
    if (this.streamHealthCheckInterval) {
      clearInterval(this.streamHealthCheckInterval);
      this.streamHealthCheckInterval = null;
    }
  }

  /**
   * Send message with retry logic
   */
  private sendWithRetry(event: string, data: any): void {
    if (!this.socket) {
      this.queueMessage(event, data);
      return;
    }
    
    if (!this.socket.connected) {
      this.queueMessage(event, data);
      // Try to reconnect the socket
      try {
        this.socket.connect();
      } catch (e) {
        console.log('⚠️ Could not trigger socket reconnection:', e);
      }
      return;
    }

    try {
      this.socket.emit(event, data);
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      this.queueMessage(event, data);
    }
  }

  /**
   * Queue message for retry
   */
  private queueMessage(event: string, data: any): void {
    this.messageQueue.push({
      data: { event, data },
      timestamp: Date.now(),
      retries: 0
    });

    // Start queue processing if not already running
    if (!this.queueProcessingInterval) {
      this.startQueueProcessing();
    }
  }

  /**
   * Start processing queued messages
   */
  private startQueueProcessing(): void {
    this.queueProcessingInterval = setInterval(() => {
      this.processMessageQueue();
    }, 1000); // Process queue every second
  }

  /**
   * Process queued messages
   */
  private processMessageQueue(): void {
    if (!this.socket || !this.socket.connected) {
      return; // Wait for connection
    }

    const now = Date.now();
    const messagesToProcess = this.messageQueue.filter(msg => 
      msg.retries < this.maxRetries && (now - msg.timestamp) > 1000
    );

    messagesToProcess.forEach(msg => {
      try {
        this.socket.emit(msg.data.event, msg.data.data);
        // Remove successfully sent message
        const index = this.messageQueue.indexOf(msg);
        if (index > -1) {
          this.messageQueue.splice(index, 1);
        }
      } catch (error) {
        console.error('❌ Failed to retry message:', error);
        msg.retries++;
      }
    });

    // Remove old messages that exceeded max retries
    this.messageQueue = this.messageQueue.filter(msg => 
      msg.retries < this.maxRetries && (now - msg.timestamp) < 30000 // Keep for 30 seconds max
    );

    // Stop processing if queue is empty
    if (this.messageQueue.length === 0 && this.queueProcessingInterval) {
      clearInterval(this.queueProcessingInterval);
      this.queueProcessingInterval = null;
    }
  }

  /**
   * Clear message queue
   */
  private clearMessageQueue(): void {
    this.messageQueue = [];
    if (this.queueProcessingInterval) {
      clearInterval(this.queueProcessingInterval);
      this.queueProcessingInterval = null;
    }
  }
}

export default new GoogleSpeechService();