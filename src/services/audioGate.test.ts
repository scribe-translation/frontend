import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  HIGHPASS_CUTOFF_HZ,
  NOISE_GATE_HANG_MS,
  NOISE_GATE_MIN_OPEN_RMS,
  NOISE_GATE_STEADY_MS,
  SpeechNoiseGate,
} from './audioGate.ts'

const SAMPLE_RATE = 48000

function rms(samples: Float32Array): number {
  let sum = 0
  for (let i = 0; i < samples.length; i++) {
    sum += samples[i] * samples[i]
  }
  return Math.sqrt(sum / samples.length)
}

function sine(
  freq: number,
  amplitude: number,
  length: number,
  sampleRate = SAMPLE_RATE
): Float32Array {
  const out = new Float32Array(length)
  for (let i = 0; i < length; i++) {
    out[i] = amplitude * Math.sin((2 * Math.PI * freq * i) / sampleRate)
  }
  return out
}

function assertUntouched(actual: Float32Array, expected: Float32Array) {
  assert.equal(actual, expected)
}

function speechLike(length: number, sampleRate = SAMPLE_RATE): Float32Array {
  const out = new Float32Array(length)
  for (let i = 0; i < length; i++) {
    const vowel = 0.06 * Math.sin((2 * Math.PI * 180 * i) / sampleRate)
    const consonant = i % 360 < 12 ? 0.45 : 0
    out[i] = vowel + consonant
  }
  return out
}

describe('SpeechNoiseGate', () => {
  it('does not count a quiet drone as speech, and leaves the audio untouched', () => {
    const gate = new SpeechNoiseGate(SAMPLE_RATE, () => 0)
    const drone = sine(60, 0.003, SAMPLE_RATE)
    assert.ok(rms(drone) < NOISE_GATE_MIN_OPEN_RMS)

    const result = gate.process(drone)

    assert.equal(result.isSpeech, false)
    assertUntouched(result.samples, drone)
  })

  it('passes quiet voice that sits under the old fixed cutoff', () => {
    const gate = new SpeechNoiseGate(SAMPLE_RATE, () => 0)
    const quietVoice = sine(1000, 0.03, 4096)
    assert.ok(rms(quietVoice) < 0.04)
    assert.ok(rms(quietVoice) > NOISE_GATE_MIN_OPEN_RMS)

    const result = gate.process(quietVoice)

    assert.equal(result.isSpeech, true)
    assertUntouched(result.samples, quietVoice)
  })

  it('sends the untouched recording once speech is already open', () => {
    let now = 0
    const gate = new SpeechNoiseGate(SAMPLE_RATE, () => now)
    gate.process(sine(1000, 0.2, 4096))
    now += 85

    const speech = sine(1000, 0.18, 4096)
    const result = gate.process(speech)

    assert.equal(result.isSpeech, true)
    assertUntouched(result.samples, speech)
  })

  it('does not mute steady speech just because the level stays even', () => {
    let now = 0
    const gate = new SpeechNoiseGate(SAMPLE_RATE, () => now)
    const speech = speechLike(4096)

    let stillOpen = true
    for (let i = 0; i < 30; i++) {
      const result = gate.process(speech)
      now += 85
      if (now > NOISE_GATE_STEADY_MS + 400 && !result.isSpeech) {
        stillOpen = false
      }
    }

    assert.equal(stillOpen, true)
  })

  it('passes voice above the gate', () => {
    const gate = new SpeechNoiseGate(SAMPLE_RATE, () => 0)
    const speech = sine(1000, 0.2, SAMPLE_RATE)
    assert.ok(rms(speech) > 0.04)

    const result = gate.process(speech)

    assert.equal(result.isSpeech, true)
    assertUntouched(result.samples, speech)
  })

  it('keeps the gate open through the hang window so word endings pass', () => {
    let now = 1_000
    const gate = new SpeechNoiseGate(SAMPLE_RATE, () => now)
    gate.process(sine(1000, 0.2, 480))

    now += 100
    const tail = sine(200, 0.004, 480)
    assert.ok(rms(tail) < NOISE_GATE_MIN_OPEN_RMS)

    const duringHang = gate.process(tail)

    assert.equal(duringHang.isSpeech, true)
    assertUntouched(duringHang.samples, tail)
  })

  it('stops counting speech after the hang window without changing the audio', () => {
    let now = 1_000
    const gate = new SpeechNoiseGate(SAMPLE_RATE, () => now)
    gate.process(sine(1000, 0.2, 480))

    now += NOISE_GATE_HANG_MS + 1
    const quiet = sine(60, 0.003, 480)
    const afterHang = gate.process(quiet)

    assert.equal(afterHang.isSpeech, false)
    assertUntouched(afterHang.samples, quiet)
  })

  it('learns a steady drone for pauses while still sending the original audio', () => {
    assert.equal(HIGHPASS_CUTOFF_HZ, 100)
    let now = 0
    const gate = new SpeechNoiseGate(SAMPLE_RATE, () => now)
    const drone = sine(180, 0.08, 4096)
    assert.ok(rms(drone) > 0.04)

    for (let i = 0; i < 30; i++) {
      const result = gate.process(drone)
      now += 85
      if (now > NOISE_GATE_STEADY_MS + 400) {
        assert.equal(result.isSpeech, false)
        assertUntouched(result.samples, drone)
      }
    }

    const voiceInput = sine(1000, 0.25, 4096)
    const voice = gate.process(voiceInput)
    assert.equal(voice.isSpeech, true)
    assertUntouched(voice.samples, voiceInput)
  })
})
