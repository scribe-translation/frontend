import {
  GoogleSTTLanguageCode,
  getAllSTTLanguages as getAllGoogleSTTLanguages,
  getSTTLanguageInfo as getGoogleSTTLanguageInfo,
  isValidSTTLanguageCode as isValidGoogleSTTLanguageCode,
} from './googleSTTLangs'
import {
  DeepgramSTTLanguageCode,
  DEFAULT_DEEPGRAM_STT_LANGUAGE,
  getAllDeepgramSTTLanguages,
  getDeepgramSTTLanguageInfo,
  isValidDeepgramSTTLanguageCode,
} from './deepgramSTTLangs'

export type STTProvider = 'deepgram' | 'google'

export type STTLanguageCode = string

export interface STTLanguageInfo {
  code: string
  name: string
  nativeName?: string
  flag: string
  region: string
  models?: string[]
}

export const DEFAULT_STT_LANGUAGE_BY_PROVIDER: Record<STTProvider, STTLanguageCode> = {
  deepgram: DEFAULT_DEEPGRAM_STT_LANGUAGE,
  google: GoogleSTTLanguageCode.EN_CA,
}

export function getSTTLanguagesForProvider(provider: STTProvider): STTLanguageInfo[] {
  if (provider === 'google') {
    return getAllGoogleSTTLanguages()
  }
  return getAllDeepgramSTTLanguages()
}

export function getSTTLanguageInfoForProvider(
  provider: STTProvider,
  code: string
): STTLanguageInfo {
  if (provider === 'google') {
    return getGoogleSTTLanguageInfo(code as GoogleSTTLanguageCode)
  }
  return getDeepgramSTTLanguageInfo(code)
}

export function resolveSTTLanguageInfo(code: string): STTLanguageInfo {
  if (isValidDeepgramSTTLanguageCode(code)) {
    return getDeepgramSTTLanguageInfo(code)
  }
  if (isValidGoogleSTTLanguageCode(code)) {
    return getGoogleSTTLanguageInfo(code)
  }
  return {
    code,
    name: code,
    flag: '🏳️',
    region: 'Unknown',
  }
}

export function isValidSTTLanguageForProvider(
  provider: STTProvider,
  code: string
): boolean {
  if (provider === 'google') {
    return isValidGoogleSTTLanguageCode(code)
  }
  return isValidDeepgramSTTLanguageCode(code)
}

export function coerceSTTLanguageForProvider(
  provider: STTProvider,
  code: string | undefined | null
): STTLanguageCode {
  if (code && isValidSTTLanguageForProvider(provider, code)) {
    return code
  }
  return DEFAULT_STT_LANGUAGE_BY_PROVIDER[provider]
}

export { DeepgramSTTLanguageCode, GoogleSTTLanguageCode }
