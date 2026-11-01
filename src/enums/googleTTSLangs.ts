// Google Cloud Text-to-Speech supported languages
// Reference: https://cloud.google.com/text-to-speech/docs/voices
// This maps CT (Cloud Translation) language codes to TTS language codes

import { GoogleCTLanguageCode } from './googleCTLangs'

// TTS Language codes supported by Google Cloud Text-to-Speech
export enum GoogleTTSLanguageCode {
  // Arabic
  AR_XA = 'ar-XA',
  
  // Bengali
  BN_IN = 'bn-IN',
  
  // Bulgarian
  BG_BG = 'bg-BG',
  
  // Catalan
  CA_ES = 'ca-ES',
  
  // Chinese
  CMN_CN = 'cmn-CN',      // Mandarin (Simplified)
  CMN_TW = 'cmn-TW',      // Mandarin (Traditional)
  YUE_HK = 'yue-HK',      // Cantonese
  
  // Czech
  CS_CZ = 'cs-CZ',
  
  // Danish
  DA_DK = 'da-DK',
  
  // Dutch
  NL_BE = 'nl-BE',
  NL_NL = 'nl-NL',
  
  // English
  EN_AU = 'en-AU',
  EN_GB = 'en-GB',
  EN_IN = 'en-IN',
  EN_US = 'en-US',
  
  // Estonian
  ET_EE = 'et-EE',
  
  // Filipino
  FIL_PH = 'fil-PH',
  
  // Finnish
  FI_FI = 'fi-FI',
  
  // French
  FR_CA = 'fr-CA',
  FR_FR = 'fr-FR',
  
  // Galician
  GL_ES = 'gl-ES',
  
  // German
  DE_DE = 'de-DE',
  
  // Greek
  EL_GR = 'el-GR',
  
  // Gujarati
  GU_IN = 'gu-IN',
  
  // Hebrew
  HE_IL = 'he-IL',
  
  // Hindi
  HI_IN = 'hi-IN',
  
  // Hungarian
  HU_HU = 'hu-HU',
  
  // Icelandic
  IS_IS = 'is-IS',
  
  // Indonesian
  ID_ID = 'id-ID',
  
  // Italian
  IT_IT = 'it-IT',
  
  // Japanese
  JA_JP = 'ja-JP',
  
  // Kannada
  KN_IN = 'kn-IN',
  
  // Korean
  KO_KR = 'ko-KR',
  
  // Latvian
  LV_LV = 'lv-LV',
  
  // Lithuanian
  LT_LT = 'lt-LT',
  
  // Malay
  MS_MY = 'ms-MY',
  
  // Malayalam
  ML_IN = 'ml-IN',
  
  // Marathi
  MR_IN = 'mr-IN',
  
  // Norwegian
  NB_NO = 'nb-NO',
  
  // Polish
  PL_PL = 'pl-PL',
  
  // Portuguese
  PT_BR = 'pt-BR',
  PT_PT = 'pt-PT',
  
  // Punjabi
  PA_IN = 'pa-IN',
  
  // Romanian
  RO_RO = 'ro-RO',
  
  // Russian
  RU_RU = 'ru-RU',
  
  // Serbian
  SR_RS = 'sr-RS',
  
  // Slovak
  SK_SK = 'sk-SK',
  
  // Spanish
  ES_ES = 'es-ES',
  ES_US = 'es-US',
  
  // Swedish
  SV_SE = 'sv-SE',
  
  // Tamil
  TA_IN = 'ta-IN',
  
  // Telugu
  TE_IN = 'te-IN',
  
  // Thai
  TH_TH = 'th-TH',
  
  // Turkish
  TR_TR = 'tr-TR',
  
  // Ukrainian
  UK_UA = 'uk-UA',
  
  // Vietnamese
  VI_VN = 'vi-VN',
  
  // Afrikaans
  AF_ZA = 'af-ZA',
}

// Map from CT language base codes to TTS language codes
// This mapping converts Cloud Translation language codes to Text-to-Speech codes
const CT_TO_TTS_MAPPING: Record<string, GoogleTTSLanguageCode> = {
  // Arabic variants all map to ar-XA
  'ar': GoogleTTSLanguageCode.AR_XA,
  'ar-SA': GoogleTTSLanguageCode.AR_XA,
  
  // Afrikaans
  'af': GoogleTTSLanguageCode.AF_ZA,
  
  // Bengali
  'bn': GoogleTTSLanguageCode.BN_IN,
  'bn-IN': GoogleTTSLanguageCode.BN_IN,
  
  // Bulgarian
  'bg': GoogleTTSLanguageCode.BG_BG,
  
  // Catalan
  'ca': GoogleTTSLanguageCode.CA_ES,
  
  // Chinese
  'zh': GoogleTTSLanguageCode.CMN_CN,
  'zh-CN': GoogleTTSLanguageCode.CMN_CN,
  'zh-Hans': GoogleTTSLanguageCode.CMN_CN,
  'zh-TW': GoogleTTSLanguageCode.CMN_TW,
  'zh-Hant': GoogleTTSLanguageCode.CMN_TW,
  'zh-HK': GoogleTTSLanguageCode.YUE_HK,
  
  // Czech
  'cs': GoogleTTSLanguageCode.CS_CZ,
  
  // Danish
  'da': GoogleTTSLanguageCode.DA_DK,
  
  // Dutch
  'nl': GoogleTTSLanguageCode.NL_NL,
  'nl-BE': GoogleTTSLanguageCode.NL_BE,
  
  // English
  'en': GoogleTTSLanguageCode.EN_US,
  'en-AU': GoogleTTSLanguageCode.EN_AU,
  'en-CA': GoogleTTSLanguageCode.EN_US,
  'en-GB': GoogleTTSLanguageCode.EN_GB,
  'en-NZ': GoogleTTSLanguageCode.EN_AU,
  'en-PH': GoogleTTSLanguageCode.EN_US,
  'en-US': GoogleTTSLanguageCode.EN_US,
  'en-ZA': GoogleTTSLanguageCode.EN_GB,
  
  // Estonian
  'et': GoogleTTSLanguageCode.ET_EE,
  
  // Filipino
  'fil': GoogleTTSLanguageCode.FIL_PH,
  'tl': GoogleTTSLanguageCode.FIL_PH,
  
  // Finnish
  'fi': GoogleTTSLanguageCode.FI_FI,
  
  // French
  'fr': GoogleTTSLanguageCode.FR_FR,
  'fr-CA': GoogleTTSLanguageCode.FR_CA,
  'fr-CH': GoogleTTSLanguageCode.FR_FR,
  
  // Galician
  'gl': GoogleTTSLanguageCode.GL_ES,
  
  // German
  'de': GoogleTTSLanguageCode.DE_DE,
  
  // Greek
  'el': GoogleTTSLanguageCode.EL_GR,
  
  // Gujarati
  'gu': GoogleTTSLanguageCode.GU_IN,
  
  // Hebrew
  'he': GoogleTTSLanguageCode.HE_IL,
  'iw': GoogleTTSLanguageCode.HE_IL,
  
  // Hindi
  'hi': GoogleTTSLanguageCode.HI_IN,
  
  // Hungarian
  'hu': GoogleTTSLanguageCode.HU_HU,
  
  // Icelandic
  'is': GoogleTTSLanguageCode.IS_IS,
  
  // Indonesian
  'id': GoogleTTSLanguageCode.ID_ID,
  
  // Italian
  'it': GoogleTTSLanguageCode.IT_IT,
  
  // Japanese
  'ja': GoogleTTSLanguageCode.JA_JP,
  
  // Kannada
  'kn': GoogleTTSLanguageCode.KN_IN,
  
  // Korean
  'ko': GoogleTTSLanguageCode.KO_KR,
  
  // Latvian
  'lv': GoogleTTSLanguageCode.LV_LV,
  
  // Lithuanian
  'lt': GoogleTTSLanguageCode.LT_LT,
  
  // Malay
  'ms': GoogleTTSLanguageCode.MS_MY,
  
  // Malayalam
  'ml': GoogleTTSLanguageCode.ML_IN,
  
  // Marathi
  'mr': GoogleTTSLanguageCode.MR_IN,
  
  // Norwegian
  'nb': GoogleTTSLanguageCode.NB_NO,
  'no': GoogleTTSLanguageCode.NB_NO,
  
  // Polish
  'pl': GoogleTTSLanguageCode.PL_PL,
  
  // Portuguese
  'pt': GoogleTTSLanguageCode.PT_PT,
  'pt-BR': GoogleTTSLanguageCode.PT_BR,
  
  // Punjabi
  'pa': GoogleTTSLanguageCode.PA_IN,
  
  // Romanian
  'ro': GoogleTTSLanguageCode.RO_RO,
  
  // Russian
  'ru': GoogleTTSLanguageCode.RU_RU,
  
  // Serbian
  'sr': GoogleTTSLanguageCode.SR_RS,
  
  // Slovak
  'sk': GoogleTTSLanguageCode.SK_SK,
  
  // Spanish
  'es': GoogleTTSLanguageCode.ES_ES,
  'es-US': GoogleTTSLanguageCode.ES_US,
  
  // Swedish
  'sv': GoogleTTSLanguageCode.SV_SE,
  
  // Tamil
  'ta': GoogleTTSLanguageCode.TA_IN,
  
  // Telugu
  'te': GoogleTTSLanguageCode.TE_IN,
  
  // Thai
  'th': GoogleTTSLanguageCode.TH_TH,
  
  // Turkish
  'tr': GoogleTTSLanguageCode.TR_TR,
  
  // Ukrainian
  'uk': GoogleTTSLanguageCode.UK_UA,
  
  // Vietnamese
  'vi': GoogleTTSLanguageCode.VI_VN,
}

/**
 * Check if a Cloud Translation language code has TTS support
 */
export const isTTSSupported = (ctLanguageCode: GoogleCTLanguageCode | string): boolean => {
  const code = String(ctLanguageCode)
  
  // Check direct mapping first
  if (CT_TO_TTS_MAPPING[code]) {
    return true
  }
  
  // Extract base code (e.g., 'en-US' -> 'en')
  const baseCode = code.split('-')[0]
  return !!CT_TO_TTS_MAPPING[baseCode]
}

/**
 * Get the TTS language code for a given CT language code
 * Returns null if TTS is not supported for this language
 */
export const getTTSLanguageCode = (ctLanguageCode: GoogleCTLanguageCode | string): GoogleTTSLanguageCode | null => {
  const code = String(ctLanguageCode)
  
  // Check direct mapping first
  if (CT_TO_TTS_MAPPING[code]) {
    return CT_TO_TTS_MAPPING[code]
  }
  
  // Try base code
  const baseCode = code.split('-')[0]
  return CT_TO_TTS_MAPPING[baseCode] || null
}

/**
 * Get all TTS-supported CT language codes
 */
export const getTTSSupportedCTLanguages = (): GoogleCTLanguageCode[] => {
  return Object.values(GoogleCTLanguageCode).filter(code => isTTSSupported(code))
}

