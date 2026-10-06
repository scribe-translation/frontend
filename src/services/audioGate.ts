export const HIGHPASS_CUTOFF_HZ = 100

export const NOISE_GATE_MIN_OPEN_RMS = 0.005

export const NOISE_GATE_OPEN_RATIO = 2

export const NOISE_GATE_STEADY_MS = 1200

/** A pure hum sits near √2. Speech peaks rise above this, so a flat voice is not treated as drone. */
export const NOISE_GATE_DRONE_CREST = 2.2

/** Kept open long enough that consonants and word endings stay in the recording. */
export const NOISE_GATE_HANG_MS = 500

export interface GatedAudio {
  samples: Float32Array
  isSpeech: boolean
}

export class SpeechNoiseGate {
  private prevInput = 0
  private prevOutput = 0
  private hangUntil = 0
  private noiseFloor = 0.004
  private previousLevel: number | null = null
  private steadyMs = 0
  private readonly alpha: number

  constructor(
    private readonly sampleRate: number,
    private readonly now: () => number = Date.now
  ) {
    const dt = 1 / sampleRate
    const rc = 1 / (2 * Math.PI * HIGHPASS_CUTOFF_HZ)
    this.alpha = rc / (rc + dt)
  }

  reset(): void {
    this.prevInput = 0
    this.prevOutput = 0
    this.hangUntil = 0
    this.noiseFloor = 0.004
    this.previousLevel = null
    this.steadyMs = 0
  }

  process(input: Float32Array): GatedAudio {
    if (input.length === 0) {
      return { samples: input, isSpeech: false }
    }

    let sum = 0
    let peak = 0
    let prevInput = this.prevInput
    let prevOutput = this.prevOutput
    const alpha = this.alpha

    for (let i = 0; i < input.length; i++) {
      const x = input[i]
      const y = alpha * (prevOutput + x - prevInput)
      sum += y * y
      peak = Math.max(peak, Math.abs(y))
      prevInput = x
      prevOutput = y
    }

    this.prevInput = prevInput
    this.prevOutput = prevOutput

    const level = Math.sqrt(sum / input.length)
    const crest = peak / Math.max(level, 1e-8)
    const droneLike = crest < NOISE_GATE_DRONE_CREST
    const durationMs = (input.length / this.sampleRate) * 1000
    const now = this.now()

    if (this.previousLevel !== null && droneLike) {
      const ratio = level / Math.max(this.previousLevel, 1e-8)
      if (ratio > 0.88 && ratio < 1.14) {
        this.steadyMs += durationMs
      } else {
        this.steadyMs = 0
      }
    } else {
      this.steadyMs = 0
    }
    this.previousLevel = level

    const openAt = Math.max(
      NOISE_GATE_MIN_OPEN_RMS,
      this.noiseFloor * NOISE_GATE_OPEN_RATIO
    )

    if (level >= openAt) {
      this.hangUntil = now + NOISE_GATE_HANG_MS
    }

    if (droneLike && this.steadyMs >= NOISE_GATE_STEADY_MS) {
      this.noiseFloor = level
      this.hangUntil = 0
    }

    const isSpeech = now < this.hangUntil
    if (!isSpeech && level < this.noiseFloor) {
      this.noiseFloor = level
    }

    return { samples: input, isSpeech }
  }
}
