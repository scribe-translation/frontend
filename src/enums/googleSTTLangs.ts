// Google Cloud Speech-to-Text V2 supported languages
// Reference: https://docs.cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages
// Backend prefers latest_short where Google supports it, otherwise latest_long or telephony.

export enum GoogleSTTLanguageCode {
  // Afrikaans
  AF_ZA = 'af-ZA',           // Afrikaans (South Africa)

  // Albanian
  SQ_AL = 'sq-AL',           // Albanian (Albania)

  // Amharic
  AM_ET = 'am-ET',           // Amharic (Ethiopia)

  // Arabic variants
  AR_DZ = 'ar-DZ',           // Arabic (Algeria)
  AR_BH = 'ar-BH',           // Arabic (Bahrain)
  AR_EG = 'ar-EG',           // Arabic (Egypt)
  AR_IQ = 'ar-IQ',           // Arabic (Iraq)
  AR_IL = 'ar-IL',           // Arabic (Israel)
  AR_JO = 'ar-JO',           // Arabic (Jordan)
  AR_KW = 'ar-KW',           // Arabic (Kuwait)
  AR_LB = 'ar-LB',           // Arabic (Lebanon)
  AR_MR = 'ar-MR',           // Arabic (Mauritania)
  AR_MA = 'ar-MA',           // Arabic (Morocco)
  AR_OM = 'ar-OM',           // Arabic (Oman)
  AR_PS = 'ar-PS',           // Arabic (Palestine)
  AR_QA = 'ar-QA',           // Arabic (Qatar)
  AR_SA = 'ar-SA',           // Arabic (Saudi Arabia)
  AR_SY = 'ar-SY',           // Arabic (Syria)
  AR_TN = 'ar-TN',           // Arabic (Tunisia)
  AR_AE = 'ar-AE',           // Arabic (United Arab Emirates)
  AR_YE = 'ar-YE',           // Arabic (Yemen)

  // Armenian
  HY_AM = 'hy-AM',           // Armenian (Armenia)

  // Azerbaijani
  AZ_AZ = 'az-AZ',           // Azerbaijani (Azerbaijan)

  // Basque
  EU_ES = 'eu-ES',           // Basque (Spain)

  // Bengali/Bangla
  BN_BD = 'bn-BD',           // Bengali (Bangladesh)
  BN_IN = 'bn-IN',           // Bengali (India)

  // Bosnian
  BS_BA = 'bs-BA',           // Bosnian (Bosnia and Herzegovina)

  // Bulgarian
  BG_BG = 'bg-BG',           // Bulgarian (Bulgaria)

  // Burmese
  MY_MM = 'my-MM',           // Burmese (Myanmar)

  // Catalan
  CA_ES = 'ca-ES',           // Catalan (Spain)

  // Chinese
  ZH_CN = 'zh-CN',           // Chinese, Mandarin (Simplified, China)
  ZH_TW = 'zh-TW',           // Chinese, Mandarin (Traditional, Taiwan)
  ZH_HK = 'zh-HK',           // Chinese (Hong Kong)
  YUE_HANT_HK = 'yue-Hant-HK', // Cantonese (Traditional, Hong Kong)

  // Croatian
  HR_HR = 'hr-HR',           // Croatian (Croatia)

  // Czech
  CS_CZ = 'cs-CZ',           // Czech (Czech Republic)

  // Danish
  DA_DK = 'da-DK',           // Danish (Denmark)

  // Dutch
  NL_BE = 'nl-BE',           // Dutch (Belgium)
  NL_NL = 'nl-NL',           // Dutch (Netherlands)

  // English variants
  EN_AU = 'en-AU',           // English (Australia)
  EN_CA = 'en-CA',           // English (Canada)
  EN_GH = 'en-GH',           // English (Ghana)
  EN_HK = 'en-HK',           // English (Hong Kong)
  EN_IN = 'en-IN',           // English (India)
  EN_IE = 'en-IE',           // English (Ireland)
  EN_KE = 'en-KE',           // English (Kenya)
  EN_NZ = 'en-NZ',           // English (New Zealand)
  EN_NG = 'en-NG',           // English (Nigeria)
  EN_PK = 'en-PK',           // English (Pakistan)
  EN_PH = 'en-PH',           // English (Philippines)
  EN_SG = 'en-SG',           // English (Singapore)
  EN_ZA = 'en-ZA',           // English (South Africa)
  EN_TZ = 'en-TZ',           // English (Tanzania)
  EN_GB = 'en-GB',           // English (United Kingdom)
  EN_US = 'en-US',           // English (United States)

  // Estonian
  ET_EE = 'et-EE',           // Estonian (Estonia)

  // Filipino
  FIL_PH = 'fil-PH',         // Filipino (Philippines)

  // Finnish
  FI_FI = 'fi-FI',           // Finnish (Finland)

  // French variants
  FR_BE = 'fr-BE',           // French (Belgium)
  FR_CA = 'fr-CA',           // French (Canada)
  FR_FR = 'fr-FR',           // French (France)
  FR_CH = 'fr-CH',           // French (Switzerland)

  // Galician
  GL_ES = 'gl-ES',           // Galician (Spain)

  // Georgian
  KA_GE = 'ka-GE',           // Georgian (Georgia)

  // German variants
  DE_AT = 'de-AT',           // German (Austria)
  DE_DE = 'de-DE',           // German (Germany)
  DE_CH = 'de-CH',           // German (Switzerland)

  // Greek
  EL_GR = 'el-GR',           // Greek (Greece)

  // Gujarati
  GU_IN = 'gu-IN',           // Gujarati (India)

  // Hausa
  HA_NG = 'ha-NG',           // Hausa (Nigeria)

  // Hebrew
  HE_IL = 'he-IL',           // Hebrew (Israel)

  // Hindi
  HI_IN = 'hi-IN',           // Hindi (India)

  // Hungarian
  HU_HU = 'hu-HU',           // Hungarian (Hungary)

  // Icelandic
  IS_IS = 'is-IS',           // Icelandic (Iceland)

  // Indonesian
  ID_ID = 'id-ID',           // Indonesian (Indonesia)

  // Irish
  GA_IE = 'ga-IE',           // Irish (Ireland)

  // Italian variants
  IT_IT = 'it-IT',           // Italian (Italy)
  IT_CH = 'it-CH',           // Italian (Switzerland)

  // Japanese
  JA_JP = 'ja-JP',           // Japanese (Japan)

  // Javanese
  JV_ID = 'jv-ID',           // Javanese (Indonesia)

  // Kannada
  KN_IN = 'kn-IN',           // Kannada (India)

  // Kazakh
  KK_KZ = 'kk-KZ',           // Kazakh (Kazakhstan)

  // Khmer
  KM_KH = 'km-KH',           // Khmer (Cambodia)

  // Korean
  KO_KR = 'ko-KR',           // Korean (South Korea)

  // Lao
  LO_LA = 'lo-LA',           // Lao (Laos)

  // Latvian
  LV_LV = 'lv-LV',           // Latvian (Latvia)

  // Lithuanian
  LT_LT = 'lt-LT',           // Lithuanian (Lithuania)

  // Macedonian
  MK_MK = 'mk-MK',           // Macedonian (North Macedonia)

  // Malay
  MS_MY = 'ms-MY',           // Malay (Malaysia)

  // Malayalam
  ML_IN = 'ml-IN',           // Malayalam (India)

  // Maltese
  MT_MT = 'mt-MT',           // Maltese (Malta)

  // Marathi
  MR_IN = 'mr-IN',           // Marathi (India)

  // Mongolian
  MN_MN = 'mn-MN',           // Mongolian (Mongolia)

  // Nepali
  NE_NP = 'ne-NP',           // Nepali (Nepal)

  // Norwegian
  NB_NO = 'nb-NO',           // Norwegian Bokmål (Norway)

  // Pashto
  PS_AF = 'ps-AF',           // Pashto (Afghanistan)

  // Persian
  FA_IR = 'fa-IR',           // Persian (Iran)

  // Polish
  PL_PL = 'pl-PL',           // Polish (Poland)

  // Portuguese variants
  PT_BR = 'pt-BR',           // Portuguese (Brazil)
  PT_PT = 'pt-PT',           // Portuguese (Portugal)

  // Punjabi
  PA_GURU_IN = 'pa-Guru-IN', // Punjabi (Gurmukhi, India)

  // Romanian
  RO_RO = 'ro-RO',           // Romanian (Romania)

  // Russian
  RU_RU = 'ru-RU',           // Russian (Russia)

  // Serbian
  SR_RS = 'sr-RS',           // Serbian (Serbia)

  // Sinhala
  SI_LK = 'si-LK',           // Sinhala (Sri Lanka)

  // Slovak
  SK_SK = 'sk-SK',           // Slovak (Slovakia)

  // Slovenian
  SL_SI = 'sl-SI',           // Slovenian (Slovenia)

  // Somali
  SO_SO = 'so-SO',           // Somali (Somalia)

  // Spanish variants - Only officially supported variants from Google Cloud documentation
  ES_419 = 'es-419',         // Spanish (Latin America) - BCP-47 code for Latin America
  ES_CO = 'es-CO',           // Spanish (Colombia)
  ES_ES = 'es-ES',           // Spanish (Spain)
  ES_MX = 'es-MX',           // Spanish (Mexico)
  ES_US = 'es-US',           // Spanish (United States)

  // Sundanese
  SU_ID = 'su-ID',           // Sundanese (Indonesia)

  // Swahili
  SW_KE = 'sw-KE',           // Swahili (Kenya)
  SW_TZ = 'sw-TZ',           // Swahili (Tanzania)

  // Swedish
  SV_SE = 'sv-SE',           // Swedish (Sweden)

  // Tamil
  TA_IN = 'ta-IN',           // Tamil (India)
  TA_MY = 'ta-MY',           // Tamil (Malaysia)
  TA_SG = 'ta-SG',           // Tamil (Singapore)
  TA_LK = 'ta-LK',           // Tamil (Sri Lanka)

  // Telugu
  TE_IN = 'te-IN',           // Telugu (India)

  // Thai
  TH_TH = 'th-TH',           // Thai (Thailand)

  // Turkish
  TR_TR = 'tr-TR',           // Turkish (Turkey)

  // Ukrainian
  UK_UA = 'uk-UA',           // Ukrainian (Ukraine)

  // Urdu
  UR_IN = 'ur-IN',           // Urdu (India)
  UR_PK = 'ur-PK',           // Urdu (Pakistan)

  // Uzbek
  UZ_UZ = 'uz-UZ',           // Uzbek (Uzbekistan)

  // Vietnamese
  VI_VN = 'vi-VN',           // Vietnamese (Vietnam)

  // Welsh
  CY_GB = 'cy-GB',           // Welsh (United Kingdom)

  // Wolof
  WO_SN = 'wo-SN',           // Wolof (Senegal)

  // Xhosa
  XH_ZA = 'xh-ZA',           // Xhosa (South Africa)

  // Yoruba
  YO_NG = 'yo-NG',           // Yoruba (Nigeria)

  // Zulu
  ZU_ZA = 'zu-ZA',           // Zulu (South Africa)
}

// Metadata for each STT language
export interface STTLanguageMetadata {
  name: string;
  nativeName?: string;
  flag: string;
  region: string;
  models: string[]; // Models that support this language
}

export const GOOGLE_STT_LANGUAGE_METADATA: Record<GoogleSTTLanguageCode, STTLanguageMetadata> = {
  // Afrikaans
  [GoogleSTTLanguageCode.AF_ZA]: { name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦', region: 'South Africa', models: ['chirp_2', 'chirp_3'] },

  // Albanian
  [GoogleSTTLanguageCode.SQ_AL]: { name: 'Albanian', nativeName: 'Shqip', flag: '🇦🇱', region: 'Albania', models: ['chirp_2'] },

  // Amharic
  [GoogleSTTLanguageCode.AM_ET]: { name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', region: 'Ethiopia', models: ['chirp_2', 'chirp_3'] },

  // Arabic variants
  [GoogleSTTLanguageCode.AR_DZ]: { name: 'Arabic (Algeria)', nativeName: 'العربية', flag: '🇩🇿', region: 'Algeria', models: ['chirp_3'] },
  [GoogleSTTLanguageCode.AR_BH]: { name: 'Arabic (Bahrain)', nativeName: 'العربية', flag: '🇧🇭', region: 'Bahrain', models: ['chirp_3'] },
  [GoogleSTTLanguageCode.AR_EG]: { name: 'Arabic (Egypt)', nativeName: 'العربية', flag: '🇪🇬', region: 'Egypt', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.AR_IQ]: { name: 'Arabic (Iraq)', nativeName: 'العربية', flag: '🇮🇶', region: 'Iraq', models: ['chirp_3'] },
  [GoogleSTTLanguageCode.AR_IL]: { name: 'Arabic (Israel)', nativeName: 'العربية', flag: '🇮🇱', region: 'Israel', models: ['chirp_3'] },
  [GoogleSTTLanguageCode.AR_JO]: { name: 'Arabic (Jordan)', nativeName: 'العربية', flag: '🇯🇴', region: 'Jordan', models: ['chirp_3'] },
  [GoogleSTTLanguageCode.AR_KW]: { name: 'Arabic (Kuwait)', nativeName: 'العربية', flag: '🇰🇼', region: 'Kuwait', models: ['chirp_3'] },
  [GoogleSTTLanguageCode.AR_LB]: { name: 'Arabic (Lebanon)', nativeName: 'العربية', flag: '🇱🇧', region: 'Lebanon', models: ['chirp_3'] },
  [GoogleSTTLanguageCode.AR_MR]: { name: 'Arabic (Mauritania)', nativeName: 'العربية', flag: '🇲🇷', region: 'Mauritania', models: ['chirp_3'] },
  [GoogleSTTLanguageCode.AR_MA]: { name: 'Arabic (Morocco)', nativeName: 'العربية', flag: '🇲🇦', region: 'Morocco', models: ['chirp_3'] },
  [GoogleSTTLanguageCode.AR_OM]: { name: 'Arabic (Oman)', nativeName: 'العربية', flag: '🇴🇲', region: 'Oman', models: ['chirp_3'] },
  [GoogleSTTLanguageCode.AR_PS]: { name: 'Arabic (Palestine)', nativeName: 'العربية', flag: '🇵🇸', region: 'Palestine', models: ['chirp_3'] },
  [GoogleSTTLanguageCode.AR_QA]: { name: 'Arabic (Qatar)', nativeName: 'العربية', flag: '🇶🇦', region: 'Qatar', models: ['chirp_3'] },
  [GoogleSTTLanguageCode.AR_SA]: { name: 'Arabic (Saudi Arabia)', nativeName: 'العربية', flag: '🇸🇦', region: 'Saudi Arabia', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.AR_SY]: { name: 'Arabic (Syria)', nativeName: 'العربية', flag: '🇸🇾', region: 'Syria', models: ['chirp_3'] },
  [GoogleSTTLanguageCode.AR_TN]: { name: 'Arabic (Tunisia)', nativeName: 'العربية', flag: '🇹🇳', region: 'Tunisia', models: ['chirp_3'] },
  [GoogleSTTLanguageCode.AR_AE]: { name: 'Arabic (UAE)', nativeName: 'العربية', flag: '🇦🇪', region: 'United Arab Emirates', models: ['chirp_3'] },
  [GoogleSTTLanguageCode.AR_YE]: { name: 'Arabic (Yemen)', nativeName: 'العربية', flag: '🇾🇪', region: 'Yemen', models: ['chirp_3'] },

  // Armenian
  [GoogleSTTLanguageCode.HY_AM]: { name: 'Armenian', nativeName: 'Հայերdelays', flag: '🇦🇲', region: 'Armenia', models: ['chirp_2'] },

  // Azerbaijani
  [GoogleSTTLanguageCode.AZ_AZ]: { name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿', region: 'Azerbaijan', models: ['chirp_2'] },

  // Basque
  [GoogleSTTLanguageCode.EU_ES]: { name: 'Basque', nativeName: 'Euskara', flag: '🏴󠁥󠁳󠁰󠁶󠁿', region: 'Spain', models: ['chirp_2'] },

  // Bengali
  [GoogleSTTLanguageCode.BN_BD]: { name: 'Bengali (Bangladesh)', nativeName: 'বাংলা', flag: '🇧🇩', region: 'Bangladesh', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.BN_IN]: { name: 'Bengali (India)', nativeName: 'বাংলা', flag: '🇮🇳', region: 'India', models: ['chirp_2', 'chirp_3'] },

  // Bosnian
  [GoogleSTTLanguageCode.BS_BA]: { name: 'Bosnian', nativeName: 'Bosanski', flag: '🇧🇦', region: 'Bosnia and Herzegovina', models: ['chirp_2'] },

  // Bulgarian
  [GoogleSTTLanguageCode.BG_BG]: { name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬', region: 'Bulgaria', models: ['chirp_2', 'chirp_3'] },

  // Burmese
  [GoogleSTTLanguageCode.MY_MM]: { name: 'Burmese', nativeName: 'မြန်မာ', flag: '🇲🇲', region: 'Myanmar', models: ['chirp_2'] },

  // Catalan
  [GoogleSTTLanguageCode.CA_ES]: { name: 'Catalan', nativeName: 'Català', flag: '🏴󠁥󠁳󠁣󠁴󠁿', region: 'Spain', models: ['chirp_2', 'chirp_3'] },

  // Chinese
  [GoogleSTTLanguageCode.ZH_CN]: { name: 'Chinese (Simplified)', nativeName: '中文（简体）', flag: '🇨🇳', region: 'China', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.ZH_TW]: { name: 'Chinese (Traditional)', nativeName: '中文（繁體）', flag: '🇹🇼', region: 'Taiwan', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.ZH_HK]: { name: 'Chinese (Hong Kong)', nativeName: '中文（香港）', flag: '🇭🇰', region: 'Hong Kong', models: ['chirp_2'] },
  [GoogleSTTLanguageCode.YUE_HANT_HK]: { name: 'Cantonese', nativeName: '廣東話', flag: '🇭🇰', region: 'Hong Kong', models: ['chirp_2'] },

  // Croatian
  [GoogleSTTLanguageCode.HR_HR]: { name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷', region: 'Croatia', models: ['chirp_2', 'chirp_3'] },

  // Czech
  [GoogleSTTLanguageCode.CS_CZ]: { name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', region: 'Czech Republic', models: ['chirp_2', 'chirp_3'] },

  // Danish
  [GoogleSTTLanguageCode.DA_DK]: { name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', region: 'Denmark', models: ['chirp_2', 'chirp_3'] },

  // Dutch
  [GoogleSTTLanguageCode.NL_BE]: { name: 'Dutch (Belgium)', nativeName: 'Nederlands', flag: '🇧🇪', region: 'Belgium', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.NL_NL]: { name: 'Dutch (Netherlands)', nativeName: 'Nederlands', flag: '🇳🇱', region: 'Netherlands', models: ['chirp_2', 'chirp_3'] },

  // English variants
  [GoogleSTTLanguageCode.EN_AU]: { name: 'English (Australia)', flag: '🇦🇺', region: 'Australia', models: ['chirp_2', 'chirp_3', 'long', 'short'] },
  [GoogleSTTLanguageCode.EN_CA]: { name: 'English (Canada)', flag: '🇨🇦', region: 'Canada', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.EN_GH]: { name: 'English (Ghana)', flag: '🇬🇭', region: 'Ghana', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.EN_HK]: { name: 'English (Hong Kong)', flag: '🇭🇰', region: 'Hong Kong', models: ['chirp_2'] },
  [GoogleSTTLanguageCode.EN_IN]: { name: 'English (India)', flag: '🇮🇳', region: 'India', models: ['chirp_2', 'chirp_3', 'long', 'short'] },
  [GoogleSTTLanguageCode.EN_IE]: { name: 'English (Ireland)', flag: '🇮🇪', region: 'Ireland', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.EN_KE]: { name: 'English (Kenya)', flag: '🇰🇪', region: 'Kenya', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.EN_NZ]: { name: 'English (New Zealand)', flag: '🇳🇿', region: 'New Zealand', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.EN_NG]: { name: 'English (Nigeria)', flag: '🇳🇬', region: 'Nigeria', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.EN_PK]: { name: 'English (Pakistan)', flag: '🇵🇰', region: 'Pakistan', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.EN_PH]: { name: 'English (Philippines)', flag: '🇵🇭', region: 'Philippines', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.EN_SG]: { name: 'English (Singapore)', flag: '🇸🇬', region: 'Singapore', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.EN_ZA]: { name: 'English (South Africa)', flag: '🇿🇦', region: 'South Africa', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.EN_TZ]: { name: 'English (Tanzania)', flag: '🇹🇿', region: 'Tanzania', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.EN_GB]: { name: 'English (UK)', flag: '🇬🇧', region: 'United Kingdom', models: ['chirp_2', 'chirp_3', 'long', 'short'] },
  [GoogleSTTLanguageCode.EN_US]: { name: 'English (US)', flag: '🇺🇸', region: 'United States', models: ['chirp_2', 'chirp_3', 'long', 'short', 'telephony'] },

  // Estonian
  [GoogleSTTLanguageCode.ET_EE]: { name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪', region: 'Estonia', models: ['chirp_2', 'chirp_3'] },

  // Filipino
  [GoogleSTTLanguageCode.FIL_PH]: { name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭', region: 'Philippines', models: ['chirp_2', 'chirp_3'] },

  // Finnish
  [GoogleSTTLanguageCode.FI_FI]: { name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', region: 'Finland', models: ['chirp_2', 'chirp_3'] },

  // French variants
  [GoogleSTTLanguageCode.FR_BE]: { name: 'French (Belgium)', nativeName: 'Français', flag: '🇧🇪', region: 'Belgium', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.FR_CA]: { name: 'French (Canada)', nativeName: 'Français', flag: '🇨🇦', region: 'Canada', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.FR_FR]: { name: 'French (France)', nativeName: 'Français', flag: '🇫🇷', region: 'France', models: ['chirp_2', 'chirp_3', 'long', 'short'] },
  [GoogleSTTLanguageCode.FR_CH]: { name: 'French (Switzerland)', nativeName: 'Français', flag: '🇨🇭', region: 'Switzerland', models: ['chirp_2', 'chirp_3'] },

  // Galician
  [GoogleSTTLanguageCode.GL_ES]: { name: 'Galician', nativeName: 'Galego', flag: '🏴󠁥󠁳󠁧󠁡󠁿', region: 'Spain', models: ['chirp_2'] },

  // Georgian
  [GoogleSTTLanguageCode.KA_GE]: { name: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪', region: 'Georgia', models: ['chirp_2'] },

  // German variants
  [GoogleSTTLanguageCode.DE_AT]: { name: 'German (Austria)', nativeName: 'Deutsch', flag: '🇦🇹', region: 'Austria', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.DE_DE]: { name: 'German (Germany)', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Germany', models: ['chirp_2', 'chirp_3', 'long', 'short'] },
  [GoogleSTTLanguageCode.DE_CH]: { name: 'German (Switzerland)', nativeName: 'Deutsch', flag: '🇨🇭', region: 'Switzerland', models: ['chirp_2', 'chirp_3'] },

  // Greek
  [GoogleSTTLanguageCode.EL_GR]: { name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', region: 'Greece', models: ['chirp_2', 'chirp_3'] },

  // Gujarati
  [GoogleSTTLanguageCode.GU_IN]: { name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', region: 'India', models: ['chirp_2', 'chirp_3'] },

  // Hausa
  [GoogleSTTLanguageCode.HA_NG]: { name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬', region: 'Nigeria', models: ['chirp_2'] },

  // Hebrew
  [GoogleSTTLanguageCode.HE_IL]: { name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', region: 'Israel', models: ['chirp_2', 'chirp_3'] },

  // Hindi
  [GoogleSTTLanguageCode.HI_IN]: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'India', models: ['chirp_2', 'chirp_3', 'long', 'short'] },

  // Hungarian
  [GoogleSTTLanguageCode.HU_HU]: { name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', region: 'Hungary', models: ['chirp_2', 'chirp_3'] },

  // Icelandic
  [GoogleSTTLanguageCode.IS_IS]: { name: 'Icelandic', nativeName: 'Íslenska', flag: '🇮🇸', region: 'Iceland', models: ['chirp_2'] },

  // Indonesian
  [GoogleSTTLanguageCode.ID_ID]: { name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Indonesia', models: ['chirp_2', 'chirp_3'] },

  // Irish
  [GoogleSTTLanguageCode.GA_IE]: { name: 'Irish', nativeName: 'Gaeilge', flag: '🇮🇪', region: 'Ireland', models: ['chirp_2'] },

  // Italian
  [GoogleSTTLanguageCode.IT_IT]: { name: 'Italian (Italy)', nativeName: 'Italiano', flag: '🇮🇹', region: 'Italy', models: ['chirp_2', 'chirp_3', 'long', 'short'] },
  [GoogleSTTLanguageCode.IT_CH]: { name: 'Italian (Switzerland)', nativeName: 'Italiano', flag: '🇨🇭', region: 'Switzerland', models: ['chirp_2', 'chirp_3'] },

  // Japanese
  [GoogleSTTLanguageCode.JA_JP]: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Japan', models: ['chirp_2', 'chirp_3', 'long', 'short'] },

  // Javanese
  [GoogleSTTLanguageCode.JV_ID]: { name: 'Javanese', nativeName: 'Basa Jawa', flag: '🇮🇩', region: 'Indonesia', models: ['chirp_2'] },

  // Kannada
  [GoogleSTTLanguageCode.KN_IN]: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'India', models: ['chirp_2', 'chirp_3'] },

  // Kazakh
  [GoogleSTTLanguageCode.KK_KZ]: { name: 'Kazakh', nativeName: 'Қазақ', flag: '🇰🇿', region: 'Kazakhstan', models: ['chirp_2'] },

  // Khmer
  [GoogleSTTLanguageCode.KM_KH]: { name: 'Khmer', nativeName: 'ខ្មែរ', flag: '🇰🇭', region: 'Cambodia', models: ['chirp_2'] },

  // Korean
  [GoogleSTTLanguageCode.KO_KR]: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷', region: 'South Korea', models: ['chirp_2', 'chirp_3', 'long', 'short'] },

  // Lao
  [GoogleSTTLanguageCode.LO_LA]: { name: 'Lao', nativeName: 'ລາວ', flag: '🇱🇦', region: 'Laos', models: ['chirp_2'] },

  // Latvian
  [GoogleSTTLanguageCode.LV_LV]: { name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻', region: 'Latvia', models: ['chirp_2', 'chirp_3'] },

  // Lithuanian
  [GoogleSTTLanguageCode.LT_LT]: { name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹', region: 'Lithuania', models: ['chirp_2', 'chirp_3'] },

  // Macedonian
  [GoogleSTTLanguageCode.MK_MK]: { name: 'Macedonian', nativeName: 'Македонски', flag: '🇲🇰', region: 'North Macedonia', models: ['chirp_2'] },

  // Malay
  [GoogleSTTLanguageCode.MS_MY]: { name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', region: 'Malaysia', models: ['chirp_2', 'chirp_3'] },

  // Malayalam
  [GoogleSTTLanguageCode.ML_IN]: { name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', region: 'India', models: ['chirp_2', 'chirp_3'] },

  // Maltese
  [GoogleSTTLanguageCode.MT_MT]: { name: 'Maltese', nativeName: 'Malti', flag: '🇲🇹', region: 'Malta', models: ['chirp_2'] },

  // Marathi
  [GoogleSTTLanguageCode.MR_IN]: { name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', region: 'India', models: ['chirp_2', 'chirp_3'] },

  // Mongolian
  [GoogleSTTLanguageCode.MN_MN]: { name: 'Mongolian', nativeName: 'Монгол', flag: '🇲🇳', region: 'Mongolia', models: ['chirp_2'] },

  // Nepali
  [GoogleSTTLanguageCode.NE_NP]: { name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵', region: 'Nepal', models: ['chirp_2'] },

  // Norwegian
  [GoogleSTTLanguageCode.NB_NO]: { name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', region: 'Norway', models: ['chirp_2', 'chirp_3'] },

  // Pashto
  [GoogleSTTLanguageCode.PS_AF]: { name: 'Pashto', nativeName: 'پښتو', flag: '🇦🇫', region: 'Afghanistan', models: ['chirp_2'] },

  // Persian
  [GoogleSTTLanguageCode.FA_IR]: { name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', region: 'Iran', models: ['chirp_2', 'chirp_3'] },

  // Polish
  [GoogleSTTLanguageCode.PL_PL]: { name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', region: 'Poland', models: ['chirp_2', 'chirp_3'] },

  // Portuguese
  [GoogleSTTLanguageCode.PT_BR]: { name: 'Portuguese (Brazil)', nativeName: 'Português', flag: '🇧🇷', region: 'Brazil', models: ['chirp_2', 'chirp_3', 'long', 'short', 'telephony'] },
  [GoogleSTTLanguageCode.PT_PT]: { name: 'Portuguese (Portugal)', nativeName: 'Português', flag: '🇵🇹', region: 'Portugal', models: ['chirp_2', 'chirp_3'] },

  // Punjabi
  [GoogleSTTLanguageCode.PA_GURU_IN]: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', region: 'India', models: ['chirp_2', 'chirp_3'] },

  // Romanian
  [GoogleSTTLanguageCode.RO_RO]: { name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', region: 'Romania', models: ['chirp_2', 'chirp_3'] },

  // Russian
  [GoogleSTTLanguageCode.RU_RU]: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Russia', models: ['chirp_2', 'chirp_3'] },

  // Serbian
  [GoogleSTTLanguageCode.SR_RS]: { name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸', region: 'Serbia', models: ['chirp_2', 'chirp_3'] },

  // Sinhala
  [GoogleSTTLanguageCode.SI_LK]: { name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰', region: 'Sri Lanka', models: ['chirp_2'] },

  // Slovak
  [GoogleSTTLanguageCode.SK_SK]: { name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰', region: 'Slovakia', models: ['chirp_2', 'chirp_3'] },

  // Slovenian
  [GoogleSTTLanguageCode.SL_SI]: { name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮', region: 'Slovenia', models: ['chirp_2', 'chirp_3'] },

  // Somali
  [GoogleSTTLanguageCode.SO_SO]: { name: 'Somali', nativeName: 'Soomaali', flag: '🇸🇴', region: 'Somalia', models: ['chirp_2'] },

  // Spanish variants - Only officially supported variants from Google Cloud documentation
  [GoogleSTTLanguageCode.ES_419]: { name: 'Spanish (Latin America)', nativeName: 'Español', flag: '🌎', region: 'Latin America', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.ES_CO]: { name: 'Spanish (Colombia)', nativeName: 'Español', flag: '🇨🇴', region: 'Colombia', models: ['chirp_2', 'chirp_3', 'telephony'] },
  [GoogleSTTLanguageCode.ES_ES]: { name: 'Spanish (Spain)', nativeName: 'Español', flag: '🇪🇸', region: 'Spain', models: ['chirp_2', 'chirp_3', 'long'] },
  [GoogleSTTLanguageCode.ES_MX]: { name: 'Spanish (Mexico)', nativeName: 'Español', flag: '🇲🇽', region: 'Mexico', models: ['chirp_2', 'chirp_3', 'telephony'] },
  [GoogleSTTLanguageCode.ES_US]: { name: 'Spanish (US)', nativeName: 'Español', flag: '🇺🇸', region: 'United States', models: ['chirp_2', 'chirp_3', 'long', 'short', 'telephony'] },

  // Sundanese
  [GoogleSTTLanguageCode.SU_ID]: { name: 'Sundanese', nativeName: 'Basa Sunda', flag: '🇮🇩', region: 'Indonesia', models: ['chirp_2'] },

  // Swahili
  [GoogleSTTLanguageCode.SW_KE]: { name: 'Swahili (Kenya)', nativeName: 'Kiswahili', flag: '🇰🇪', region: 'Kenya', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.SW_TZ]: { name: 'Swahili (Tanzania)', nativeName: 'Kiswahili', flag: '🇹🇿', region: 'Tanzania', models: ['chirp_2', 'chirp_3'] },

  // Swedish
  [GoogleSTTLanguageCode.SV_SE]: { name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', region: 'Sweden', models: ['chirp_2', 'chirp_3'] },

  // Tamil
  [GoogleSTTLanguageCode.TA_IN]: { name: 'Tamil (India)', nativeName: 'தமிழ்', flag: '🇮🇳', region: 'India', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.TA_MY]: { name: 'Tamil (Malaysia)', nativeName: 'தமிழ்', flag: '🇲🇾', region: 'Malaysia', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.TA_SG]: { name: 'Tamil (Singapore)', nativeName: 'தமிழ்', flag: '🇸🇬', region: 'Singapore', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.TA_LK]: { name: 'Tamil (Sri Lanka)', nativeName: 'தமிழ்', flag: '🇱🇰', region: 'Sri Lanka', models: ['chirp_2', 'chirp_3'] },

  // Telugu
  [GoogleSTTLanguageCode.TE_IN]: { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', region: 'India', models: ['chirp_2', 'chirp_3'] },

  // Thai
  [GoogleSTTLanguageCode.TH_TH]: { name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', region: 'Thailand', models: ['chirp_2', 'chirp_3'] },

  // Turkish
  [GoogleSTTLanguageCode.TR_TR]: { name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', region: 'Turkey', models: ['chirp_2', 'chirp_3'] },

  // Ukrainian
  [GoogleSTTLanguageCode.UK_UA]: { name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', region: 'Ukraine', models: ['chirp_2', 'chirp_3'] },

  // Urdu
  [GoogleSTTLanguageCode.UR_IN]: { name: 'Urdu (India)', nativeName: 'اردو', flag: '🇮🇳', region: 'India', models: ['chirp_2', 'chirp_3'] },
  [GoogleSTTLanguageCode.UR_PK]: { name: 'Urdu (Pakistan)', nativeName: 'اردو', flag: '🇵🇰', region: 'Pakistan', models: ['chirp_2', 'chirp_3'] },

  // Uzbek
  [GoogleSTTLanguageCode.UZ_UZ]: { name: 'Uzbek', nativeName: 'Oʻzbek', flag: '🇺🇿', region: 'Uzbekistan', models: ['chirp_2'] },

  // Vietnamese
  [GoogleSTTLanguageCode.VI_VN]: { name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', region: 'Vietnam', models: ['chirp_2', 'chirp_3'] },

  // Welsh
  [GoogleSTTLanguageCode.CY_GB]: { name: 'Welsh', nativeName: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', region: 'United Kingdom', models: ['chirp_2'] },

  // Wolof
  [GoogleSTTLanguageCode.WO_SN]: { name: 'Wolof', nativeName: 'Wolof', flag: '🇸🇳', region: 'Senegal', models: ['chirp_2'] },

  // Xhosa
  [GoogleSTTLanguageCode.XH_ZA]: { name: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦', region: 'South Africa', models: ['chirp_2'] },

  // Yoruba
  [GoogleSTTLanguageCode.YO_NG]: { name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬', region: 'Nigeria', models: ['chirp', 'chirp_2'] },

  // Zulu
  [GoogleSTTLanguageCode.ZU_ZA]: { name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦', region: 'South Africa', models: ['chirp', 'chirp_2'] },
};

// Helper functions
export const getSTTLanguageName = (code: GoogleSTTLanguageCode): string => {
  return GOOGLE_STT_LANGUAGE_METADATA[code]?.name || 'Unknown';
};

export const getSTTLanguageFlag = (code: GoogleSTTLanguageCode): string => {
  return GOOGLE_STT_LANGUAGE_METADATA[code]?.flag || '🏳️';
};

export const getSTTLanguageInfo = (code: GoogleSTTLanguageCode) => {
  const metadata = GOOGLE_STT_LANGUAGE_METADATA[code];
  return {
    code,
    name: metadata?.name || 'Unknown',
    nativeName: metadata?.nativeName,
    flag: metadata?.flag || '🏳️',
    region: metadata?.region || 'Unknown',
    models: metadata?.models || [],
  };
};

export const getAllSTTLanguages = () => {
  return Object.values(GoogleSTTLanguageCode).map(code => getSTTLanguageInfo(code));
};

// Get languages that support a specific model
export const getLanguagesByModel = (model: string) => {
  return Object.values(GoogleSTTLanguageCode)
    .filter(code => GOOGLE_STT_LANGUAGE_METADATA[code]?.models.includes(model))
    .map(code => getSTTLanguageInfo(code));
};

// Get languages that support the 'long' model (what 'latest_long' maps to)
export const getLongModelLanguages = () => getLanguagesByModel('long');

// Get languages that support chirp_2 (most comprehensive)
export const getChirp2Languages = () => getLanguagesByModel('chirp_2');

// Check if a language code is valid
export const isValidSTTLanguageCode = (code: string): code is GoogleSTTLanguageCode => {
  return Object.values(GoogleSTTLanguageCode).includes(code as GoogleSTTLanguageCode);
};

// Get primary language variant (e.g., for English, return en-US)
export const getPrimaryVariant = (baseCode: string): GoogleSTTLanguageCode | null => {
  const primaryMap: Record<string, GoogleSTTLanguageCode> = {
    'en': GoogleSTTLanguageCode.EN_US,
    'es': GoogleSTTLanguageCode.ES_ES,
    'fr': GoogleSTTLanguageCode.FR_FR,
    'de': GoogleSTTLanguageCode.DE_DE,
    'it': GoogleSTTLanguageCode.IT_IT,
    'pt': GoogleSTTLanguageCode.PT_BR,
    'zh': GoogleSTTLanguageCode.ZH_CN,
    'ar': GoogleSTTLanguageCode.AR_SA,
    'nl': GoogleSTTLanguageCode.NL_NL,
    'ja': GoogleSTTLanguageCode.JA_JP,
    'ko': GoogleSTTLanguageCode.KO_KR,
    'ru': GoogleSTTLanguageCode.RU_RU,
    'tr': GoogleSTTLanguageCode.TR_TR,
    'ta': GoogleSTTLanguageCode.TA_IN,
    'sw': GoogleSTTLanguageCode.SW_KE,
  };
  return primaryMap[baseCode] || null;
};

