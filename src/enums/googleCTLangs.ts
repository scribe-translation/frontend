// Google Cloud Translation supported languages
// Reference: https://docs.cloud.google.com/translate/docs/languages
// Translation LLM supports translation from any language to any language in this list

export enum GoogleCTLanguageCode {
  // Afrikaans
  AF = 'af',                    // Afrikaans

  // Albanian
  SQ = 'sq',                    // Albanian

  // Amharic (Experimental)
  AM = 'am',                    // Amharic

  // Arabic
  AR = 'ar',                    // Arabic
  AR_SA = 'ar-SA',             // Arabic (Saudi Arabia)

  // Armenian (Experimental)
  HY = 'hy',                    // Armenian

  // Azerbaijani
  AZ = 'az',                    // Azerbaijani

  // Basque (Experimental)
  EU = 'eu',                    // Basque

  // Belarusian
  BE = 'be',                    // Belarusian

  // Bengali
  BN = 'bn',                    // Bengali
  BN_IN = 'bn-IN',             // Bengali (India)

  // Bosnian
  BS = 'bs',                    // Bosnian
  BS_CYRL = 'bs-Cyrl',         // Bosnian (Cyrillic)

  // Bulgarian
  BG = 'bg',                    // Bulgarian

  // Burmese
  MY = 'my',                    // Burmese

  // Catalan
  CA = 'ca',                    // Catalan

  // Chinese
  ZH = 'zh',                    // Chinese
  ZH_CN = 'zh-CN',             // Chinese (China)
  ZH_HK = 'zh-HK',             // Chinese (Hong Kong)
  ZH_HANS = 'zh-Hans',         // Chinese (Simplified)
  ZH_TW = 'zh-TW',             // Chinese (Taiwan)
  ZH_HANT = 'zh-Hant',         // Chinese (Traditional)

  // Croatian
  HR = 'hr',                    // Croatian

  // Czech
  CS = 'cs',                    // Czech

  // Danish
  DA = 'da',                    // Danish

  // Dutch
  NL = 'nl',                    // Dutch
  NL_BE = 'nl-BE',             // Dutch (Belgium)

  // English
  EN = 'en',                    // English
  EN_AU = 'en-AU',             // English (Australia)
  EN_CA = 'en-CA',             // English (Canada)
  EN_NZ = 'en-NZ',             // English (New Zealand)
  EN_PH = 'en-PH',             // English (Philippines)
  EN_ZA = 'en-ZA',             // English (South Africa)
  EN_GB = 'en-GB',             // English (United Kingdom)
  EN_US = 'en-US',             // English (United States)

  // Estonian
  ET = 'et',                    // Estonian

  // Filipino. Cloud Translation code is Tagalog (`tl`). `fil` is formal written Filipino.
  FIL = 'tl',                   // Filipino

  // Finnish
  FI = 'fi',                    // Finnish

  // French
  FR = 'fr',                    // French
  FR_CA = 'fr-CA',             // French (Canada)
  FR_CH = 'fr-CH',             // French (Switzerland)

  // Frisian
  FY = 'fy',                    // Frisian

  // Galician
  GL = 'gl',                    // Galician

  // Georgian
  KA = 'ka',                    // Georgian

  // German
  DE = 'de',                    // German

  // Greek
  EL = 'el',                    // Greek

  // Guarani
  GN = 'gn',                    // Guarani

  // Gujarati
  GU = 'gu',                    // Gujarati

  // Hausa (Experimental)
  HA = 'ha',                    // Hausa

  // Hebrew
  HE = 'he',                    // Hebrew
  IW = 'iw',                    // Hebrew (alternative code)

  // Hindi
  HI = 'hi',                    // Hindi

  // Hungarian
  HU = 'hu',                    // Hungarian

  // Icelandic
  IS = 'is',                    // Icelandic

  // Igbo (Experimental)
  IG = 'ig',                    // Igbo

  // Indonesian
  ID = 'id',                    // Indonesian

  // Irish (Experimental)
  GA = 'ga',                    // Irish

  // Italian
  IT = 'it',                    // Italian

  // Japanese
  JA = 'ja',                    // Japanese

  // Kannada
  KN = 'kn',                    // Kannada

  // Khmer
  KM = 'km',                    // Khmer

  // Korean
  KO = 'ko',                    // Korean

  // Kyrgyz
  KY = 'ky',                    // Kyrgyz

  // Lao
  LO = 'lo',                    // Lao

  // Latvian
  LV = 'lv',                    // Latvian

  // Lingala
  LN = 'ln',                    // Lingala

  // Lithuanian
  LT = 'lt',                    // Lithuanian

  // Luxembourgish (Experimental)
  LB = 'lb',                    // Luxembourgish

  // Macedonian
  MK = 'mk',                    // Macedonian

  // Malay
  MS = 'ms',                    // Malay

  // Malayalam
  ML = 'ml',                    // Malayalam

  // Maltese (Experimental)
  MT = 'mt',                    // Maltese

  // Marathi
  MR = 'mr',                    // Marathi

  // Mongolian (Experimental)
  MN = 'mn',                    // Mongolian

  // Nepali
  NE = 'ne',                    // Nepali

  // Norwegian
  NB = 'nb',                    // Norwegian Bokmål
  NO = 'no',                    // Norwegian

  // Odia (Experimental)
  OR = 'or',                    // Odia

  // Persian
  FA = 'fa',                    // Persian

  // Polish
  PL = 'pl',                    // Polish

  // Portuguese
  PT = 'pt',                    // Portuguese

  // Punjabi
  PA = 'pa',                    // Punjabi

  // Romanian
  RO = 'ro',                    // Romanian

  // Russian
  RU = 'ru',                    // Russian

  // Serbian
  SR = 'sr',                    // Serbian

  // Sinhala
  SI = 'si',                    // Sinhala

  // Slovak
  SK = 'sk',                    // Slovak

  // Slovenian
  SL = 'sl',                    // Slovenian

  // Somali
  SO = 'so',                    // Somali

  // Spanish
  ES = 'es',                    // Spanish

  // Sundanese
  SU = 'su',                    // Sundanese

  // Swahili
  SW = 'sw',                    // Swahili

  // Swati
  SS = 'ss',                    // Swati

  // Swedish
  SV = 'sv',                    // Swedish

  // Tajik
  TG = 'tg',                    // Tajik

  // Tamil
  TA = 'ta',                    // Tamil

  // Tatar
  TT = 'tt',                    // Tatar

  // Telugu
  TE = 'te',                    // Telugu

  // Tetum
  TET = 'tet',                  // Tetum

  // Thai
  TH = 'th',                    // Thai

  // Tigrinya
  TI = 'ti',                    // Tigrinya

  // Tsonga
  TS = 'ts',                    // Tsonga

  // Tswana
  TN = 'tn',                    // Tswana

  // Turkish
  TR = 'tr',                    // Turkish

  // Turkmen
  TK = 'tk',                    // Turkmen

  // Twi (Akan)
  AK = 'ak',                    // Twi (Akan)

  // Ukrainian
  UK = 'uk',                    // Ukrainian

  // Urdu
  UR = 'ur',                    // Urdu

  // Uyghur
  UG = 'ug',                    // Uyghur

  // Uzbek
  UZ = 'uz',                    // Uzbek

  // Vietnamese
  VI = 'vi',                    // Vietnamese

  // Welsh
  CY = 'cy',                    // Welsh

  // Xhosa
  XH = 'xh',                    // Xhosa

  // Yiddish
  YI = 'yi',                    // Yiddish

  // Yoruba
  YO = 'yo',                    // Yoruba

  // Yucatec Maya
  YUA = 'yua',                  // Yucatec Maya

  // Zulu
  ZU = 'zu',                    // Zulu
}

// Metadata for each translation language
export interface CTLanguageMetadata {
  name: string;
  nativeName?: string;
  flag: string;
  isExperimental: boolean;
  baseCode: string; // Base language code (e.g., 'en' for 'en-US')
}

export const GOOGLE_CT_LANGUAGE_METADATA: Record<GoogleCTLanguageCode, CTLanguageMetadata> = {
  // Afrikaans
  [GoogleCTLanguageCode.AF]: { name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦', isExperimental: false, baseCode: 'af' },

  // Albanian
  [GoogleCTLanguageCode.SQ]: { name: 'Albanian', nativeName: 'Shqip', flag: '🇦🇱', isExperimental: false, baseCode: 'sq' },

  // Amharic
  [GoogleCTLanguageCode.AM]: { name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', isExperimental: true, baseCode: 'am' },

  // Arabic
  [GoogleCTLanguageCode.AR]: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', isExperimental: false, baseCode: 'ar' },
  [GoogleCTLanguageCode.AR_SA]: { name: 'Arabic (Saudi Arabia)', nativeName: 'العربية', flag: '🇸🇦', isExperimental: false, baseCode: 'ar' },

  // Armenian
  [GoogleCTLanguageCode.HY]: { name: 'Armenian', nativeName: 'Հայերեն', flag: '🇦🇲', isExperimental: true, baseCode: 'hy' },

  // Azerbaijani
  [GoogleCTLanguageCode.AZ]: { name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿', isExperimental: false, baseCode: 'az' },

  // Basque
  [GoogleCTLanguageCode.EU]: { name: 'Basque', nativeName: 'Euskara', flag: '🏴󠁥󠁳󠁰󠁶󠁿', isExperimental: true, baseCode: 'eu' },

  // Belarusian
  [GoogleCTLanguageCode.BE]: { name: 'Belarusian', nativeName: 'Беларуская', flag: '🇧🇾', isExperimental: false, baseCode: 'be' },

  // Bengali
  [GoogleCTLanguageCode.BN]: { name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', isExperimental: false, baseCode: 'bn' },
  [GoogleCTLanguageCode.BN_IN]: { name: 'Bengali (India)', nativeName: 'বাংলা', flag: '🇮🇳', isExperimental: false, baseCode: 'bn' },

  // Bosnian
  [GoogleCTLanguageCode.BS]: { name: 'Bosnian', nativeName: 'Bosanski', flag: '🇧🇦', isExperimental: false, baseCode: 'bs' },
  [GoogleCTLanguageCode.BS_CYRL]: { name: 'Bosnian (Cyrillic)', nativeName: 'Босански', flag: '🇧🇦', isExperimental: false, baseCode: 'bs' },

  // Bulgarian
  [GoogleCTLanguageCode.BG]: { name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬', isExperimental: false, baseCode: 'bg' },

  // Burmese
  [GoogleCTLanguageCode.MY]: { name: 'Burmese', nativeName: 'မြန်မာ', flag: '🇲🇲', isExperimental: false, baseCode: 'my' },

  // Catalan
  [GoogleCTLanguageCode.CA]: { name: 'Catalan', nativeName: 'Català', flag: '🏴󠁥󠁳󠁣󠁴󠁿', isExperimental: false, baseCode: 'ca' },

  // Chinese
  [GoogleCTLanguageCode.ZH]: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳', isExperimental: false, baseCode: 'zh' },
  [GoogleCTLanguageCode.ZH_CN]: { name: 'Chinese (China)', nativeName: '中文（简体）', flag: '🇨🇳', isExperimental: false, baseCode: 'zh-CN' },
  [GoogleCTLanguageCode.ZH_HK]: { name: 'Chinese (Hong Kong)', nativeName: '中文（香港）', flag: '🇭🇰', isExperimental: false, baseCode: 'zh-HK' },
  [GoogleCTLanguageCode.ZH_HANS]: { name: 'Chinese (Simplified)', nativeName: '中文（简体）', flag: '🇨🇳', isExperimental: false, baseCode: 'zh-CN' },
  [GoogleCTLanguageCode.ZH_TW]: { name: 'Chinese (Taiwan)', nativeName: '中文（繁體）', flag: '🇹🇼', isExperimental: false, baseCode: 'zh-TW' },
  [GoogleCTLanguageCode.ZH_HANT]: { name: 'Chinese (Traditional)', nativeName: '中文（繁體）', flag: '🇹🇼', isExperimental: false, baseCode: 'zh-TW' },

  // Croatian
  [GoogleCTLanguageCode.HR]: { name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷', isExperimental: false, baseCode: 'hr' },

  // Czech
  [GoogleCTLanguageCode.CS]: { name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', isExperimental: false, baseCode: 'cs' },

  // Danish
  [GoogleCTLanguageCode.DA]: { name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', isExperimental: false, baseCode: 'da' },

  // Dutch
  [GoogleCTLanguageCode.NL]: { name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', isExperimental: false, baseCode: 'nl' },
  [GoogleCTLanguageCode.NL_BE]: { name: 'Dutch (Belgium)', nativeName: 'Nederlands', flag: '🇧🇪', isExperimental: false, baseCode: 'nl' },

  // English
  [GoogleCTLanguageCode.EN]: { name: 'English', flag: '🇺🇸', isExperimental: false, baseCode: 'en' },
  [GoogleCTLanguageCode.EN_AU]: { name: 'English (Australia)', flag: '🇦🇺', isExperimental: false, baseCode: 'en' },
  [GoogleCTLanguageCode.EN_CA]: { name: 'English (Canada)', flag: '🇨🇦', isExperimental: false, baseCode: 'en' },
  [GoogleCTLanguageCode.EN_NZ]: { name: 'English (New Zealand)', flag: '🇳🇿', isExperimental: false, baseCode: 'en' },
  [GoogleCTLanguageCode.EN_PH]: { name: 'English (Philippines)', flag: '🇵🇭', isExperimental: false, baseCode: 'en' },
  [GoogleCTLanguageCode.EN_ZA]: { name: 'English (South Africa)', flag: '🇿🇦', isExperimental: false, baseCode: 'en' },
  [GoogleCTLanguageCode.EN_GB]: { name: 'English (United Kingdom)', flag: '🇬🇧', isExperimental: false, baseCode: 'en' },
  [GoogleCTLanguageCode.EN_US]: { name: 'English (United States)', flag: '🇺🇸', isExperimental: false, baseCode: 'en' },

  // Estonian
  [GoogleCTLanguageCode.ET]: { name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪', isExperimental: false, baseCode: 'et' },

  // Filipino
  [GoogleCTLanguageCode.FIL]: { name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭', isExperimental: false, baseCode: 'tl' },

  // Finnish
  [GoogleCTLanguageCode.FI]: { name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', isExperimental: false, baseCode: 'fi' },

  // French
  [GoogleCTLanguageCode.FR]: { name: 'French', nativeName: 'Français', flag: '🇫🇷', isExperimental: false, baseCode: 'fr' },
  [GoogleCTLanguageCode.FR_CA]: { name: 'French (Canada)', nativeName: 'Français', flag: '🇨🇦', isExperimental: false, baseCode: 'fr' },
  [GoogleCTLanguageCode.FR_CH]: { name: 'French (Switzerland)', nativeName: 'Français', flag: '🇨🇭', isExperimental: false, baseCode: 'fr' },

  // Frisian
  [GoogleCTLanguageCode.FY]: { name: 'Frisian', nativeName: 'Frysk', flag: '🇳🇱', isExperimental: false, baseCode: 'fy' },

  // Galician
  [GoogleCTLanguageCode.GL]: { name: 'Galician', nativeName: 'Galego', flag: '🏴󠁥󠁳󠁧󠁡󠁿', isExperimental: false, baseCode: 'gl' },

  // Georgian
  [GoogleCTLanguageCode.KA]: { name: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪', isExperimental: false, baseCode: 'ka' },

  // German
  [GoogleCTLanguageCode.DE]: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', isExperimental: false, baseCode: 'de' },

  // Greek
  [GoogleCTLanguageCode.EL]: { name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', isExperimental: false, baseCode: 'el' },

  // Guarani
  [GoogleCTLanguageCode.GN]: { name: 'Guarani', nativeName: 'Avañe\'ẽ', flag: '🇵🇾', isExperimental: false, baseCode: 'gn' },

  // Gujarati
  [GoogleCTLanguageCode.GU]: { name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', isExperimental: false, baseCode: 'gu' },

  // Hausa
  [GoogleCTLanguageCode.HA]: { name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬', isExperimental: true, baseCode: 'ha' },

  // Hebrew
  [GoogleCTLanguageCode.HE]: { name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', isExperimental: false, baseCode: 'he' },
  [GoogleCTLanguageCode.IW]: { name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', isExperimental: false, baseCode: 'he' },

  // Hindi
  [GoogleCTLanguageCode.HI]: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', isExperimental: false, baseCode: 'hi' },

  // Hungarian
  [GoogleCTLanguageCode.HU]: { name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', isExperimental: false, baseCode: 'hu' },

  // Icelandic
  [GoogleCTLanguageCode.IS]: { name: 'Icelandic', nativeName: 'Íslenska', flag: '🇮🇸', isExperimental: false, baseCode: 'is' },

  // Igbo
  [GoogleCTLanguageCode.IG]: { name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬', isExperimental: true, baseCode: 'ig' },

  // Indonesian
  [GoogleCTLanguageCode.ID]: { name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', isExperimental: false, baseCode: 'id' },

  // Irish
  [GoogleCTLanguageCode.GA]: { name: 'Irish', nativeName: 'Gaeilge', flag: '🇮🇪', isExperimental: true, baseCode: 'ga' },

  // Italian
  [GoogleCTLanguageCode.IT]: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', isExperimental: false, baseCode: 'it' },

  // Japanese
  [GoogleCTLanguageCode.JA]: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', isExperimental: false, baseCode: 'ja' },

  // Kannada
  [GoogleCTLanguageCode.KN]: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', isExperimental: false, baseCode: 'kn' },

  // Khmer
  [GoogleCTLanguageCode.KM]: { name: 'Khmer', nativeName: 'ខ្មែរ', flag: '🇰🇭', isExperimental: false, baseCode: 'km' },

  // Korean
  [GoogleCTLanguageCode.KO]: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷', isExperimental: false, baseCode: 'ko' },

  // Kyrgyz
  [GoogleCTLanguageCode.KY]: { name: 'Kyrgyz', nativeName: 'Кыргызча', flag: '🇰🇬', isExperimental: false, baseCode: 'ky' },

  // Lao
  [GoogleCTLanguageCode.LO]: { name: 'Lao', nativeName: 'ລາວ', flag: '🇱🇦', isExperimental: false, baseCode: 'lo' },

  // Latvian
  [GoogleCTLanguageCode.LV]: { name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻', isExperimental: false, baseCode: 'lv' },

  // Lingala
  [GoogleCTLanguageCode.LN]: { name: 'Lingala', nativeName: 'Lingála', flag: '🇨🇩', isExperimental: false, baseCode: 'ln' },

  // Lithuanian
  [GoogleCTLanguageCode.LT]: { name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹', isExperimental: false, baseCode: 'lt' },

  // Luxembourgish
  [GoogleCTLanguageCode.LB]: { name: 'Luxembourgish', nativeName: 'Lëtzebuergesch', flag: '🇱🇺', isExperimental: true, baseCode: 'lb' },

  // Macedonian
  [GoogleCTLanguageCode.MK]: { name: 'Macedonian', nativeName: 'Македонски', flag: '🇲🇰', isExperimental: false, baseCode: 'mk' },

  // Malay
  [GoogleCTLanguageCode.MS]: { name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', isExperimental: false, baseCode: 'ms' },

  // Malayalam
  [GoogleCTLanguageCode.ML]: { name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', isExperimental: false, baseCode: 'ml' },

  // Maltese
  [GoogleCTLanguageCode.MT]: { name: 'Maltese', nativeName: 'Malti', flag: '🇲🇹', isExperimental: true, baseCode: 'mt' },

  // Marathi
  [GoogleCTLanguageCode.MR]: { name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', isExperimental: false, baseCode: 'mr' },

  // Mongolian
  [GoogleCTLanguageCode.MN]: { name: 'Mongolian', nativeName: 'Монгол', flag: '🇲🇳', isExperimental: true, baseCode: 'mn' },

  // Nepali
  [GoogleCTLanguageCode.NE]: { name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵', isExperimental: false, baseCode: 'ne' },

  // Norwegian
  [GoogleCTLanguageCode.NB]: { name: 'Norwegian Bokmål', nativeName: 'Norsk Bokmål', flag: '🇳🇴', isExperimental: false, baseCode: 'no' },
  [GoogleCTLanguageCode.NO]: { name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', isExperimental: false, baseCode: 'no' },

  // Odia
  [GoogleCTLanguageCode.OR]: { name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', isExperimental: true, baseCode: 'or' },

  // Persian
  [GoogleCTLanguageCode.FA]: { name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', isExperimental: false, baseCode: 'fa' },

  // Polish
  [GoogleCTLanguageCode.PL]: { name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', isExperimental: false, baseCode: 'pl' },

  // Portuguese
  [GoogleCTLanguageCode.PT]: { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', isExperimental: false, baseCode: 'pt' },

  // Punjabi
  [GoogleCTLanguageCode.PA]: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', isExperimental: false, baseCode: 'pa' },

  // Romanian
  [GoogleCTLanguageCode.RO]: { name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', isExperimental: false, baseCode: 'ro' },

  // Russian
  [GoogleCTLanguageCode.RU]: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', isExperimental: false, baseCode: 'ru' },

  // Serbian
  [GoogleCTLanguageCode.SR]: { name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸', isExperimental: false, baseCode: 'sr' },

  // Sinhala
  [GoogleCTLanguageCode.SI]: { name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰', isExperimental: false, baseCode: 'si' },

  // Slovak
  [GoogleCTLanguageCode.SK]: { name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰', isExperimental: false, baseCode: 'sk' },

  // Slovenian
  [GoogleCTLanguageCode.SL]: { name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮', isExperimental: false, baseCode: 'sl' },

  // Somali
  [GoogleCTLanguageCode.SO]: { name: 'Somali', nativeName: 'Soomaali', flag: '🇸🇴', isExperimental: false, baseCode: 'so' },

  // Spanish
  [GoogleCTLanguageCode.ES]: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isExperimental: false, baseCode: 'es' },

  // Sundanese
  [GoogleCTLanguageCode.SU]: { name: 'Sundanese', nativeName: 'Basa Sunda', flag: '🇮🇩', isExperimental: false, baseCode: 'su' },

  // Swahili
  [GoogleCTLanguageCode.SW]: { name: 'Swahili', nativeName: 'Kiswahili', flag: '🇹🇿', isExperimental: false, baseCode: 'sw' },

  // Swati
  [GoogleCTLanguageCode.SS]: { name: 'Swati', nativeName: 'SiSwati', flag: '🇸🇿', isExperimental: false, baseCode: 'ss' },

  // Swedish
  [GoogleCTLanguageCode.SV]: { name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', isExperimental: false, baseCode: 'sv' },

  // Tajik
  [GoogleCTLanguageCode.TG]: { name: 'Tajik', nativeName: 'Тоҷикӣ', flag: '🇹🇯', isExperimental: false, baseCode: 'tg' },

  // Tamil
  [GoogleCTLanguageCode.TA]: { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', isExperimental: false, baseCode: 'ta' },

  // Tatar
  [GoogleCTLanguageCode.TT]: { name: 'Tatar', nativeName: 'Татар', flag: '🇷🇺', isExperimental: false, baseCode: 'tt' },

  // Telugu
  [GoogleCTLanguageCode.TE]: { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', isExperimental: false, baseCode: 'te' },

  // Tetum
  [GoogleCTLanguageCode.TET]: { name: 'Tetum', nativeName: 'Tetun', flag: '🇹🇱', isExperimental: false, baseCode: 'tet' },

  // Thai
  [GoogleCTLanguageCode.TH]: { name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', isExperimental: false, baseCode: 'th' },

  // Tigrinya
  [GoogleCTLanguageCode.TI]: { name: 'Tigrinya', nativeName: 'ትግርኛ', flag: '🇪🇷', isExperimental: false, baseCode: 'ti' },

  // Tsonga
  [GoogleCTLanguageCode.TS]: { name: 'Tsonga', nativeName: 'Xitsonga', flag: '🇿🇦', isExperimental: false, baseCode: 'ts' },

  // Tswana
  [GoogleCTLanguageCode.TN]: { name: 'Tswana', nativeName: 'Setswana', flag: '🇧🇼', isExperimental: false, baseCode: 'tn' },

  // Turkish
  [GoogleCTLanguageCode.TR]: { name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', isExperimental: false, baseCode: 'tr' },

  // Turkmen
  [GoogleCTLanguageCode.TK]: { name: 'Turkmen', nativeName: 'Türkmen', flag: '🇹🇲', isExperimental: false, baseCode: 'tk' },

  // Twi (Akan)
  [GoogleCTLanguageCode.AK]: { name: 'Twi (Akan)', nativeName: 'Twi', flag: '🇬🇭', isExperimental: false, baseCode: 'ak' },

  // Ukrainian
  [GoogleCTLanguageCode.UK]: { name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', isExperimental: false, baseCode: 'uk' },

  // Urdu
  [GoogleCTLanguageCode.UR]: { name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', isExperimental: false, baseCode: 'ur' },

  // Uyghur
  [GoogleCTLanguageCode.UG]: { name: 'Uyghur', nativeName: 'ئۇيغۇرچە', flag: '🇨🇳', isExperimental: false, baseCode: 'ug' },

  // Uzbek
  [GoogleCTLanguageCode.UZ]: { name: 'Uzbek', nativeName: 'Oʻzbek', flag: '🇺🇿', isExperimental: false, baseCode: 'uz' },

  // Vietnamese
  [GoogleCTLanguageCode.VI]: { name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', isExperimental: false, baseCode: 'vi' },

  // Welsh
  [GoogleCTLanguageCode.CY]: { name: 'Welsh', nativeName: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', isExperimental: false, baseCode: 'cy' },

  // Xhosa
  [GoogleCTLanguageCode.XH]: { name: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦', isExperimental: false, baseCode: 'xh' },

  // Yiddish
  [GoogleCTLanguageCode.YI]: { name: 'Yiddish', nativeName: 'ייִדיש', flag: '🇮🇱', isExperimental: false, baseCode: 'yi' },

  // Yoruba
  [GoogleCTLanguageCode.YO]: { name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬', isExperimental: false, baseCode: 'yo' },

  // Yucatec Maya
  [GoogleCTLanguageCode.YUA]: { name: 'Yucatec Maya', nativeName: 'Maya', flag: '🇲🇽', isExperimental: false, baseCode: 'yua' },

  // Zulu
  [GoogleCTLanguageCode.ZU]: { name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦', isExperimental: false, baseCode: 'zu' },
};

// Helper functions
export const getCTLanguageName = (code: GoogleCTLanguageCode): string => {
  return GOOGLE_CT_LANGUAGE_METADATA[code]?.name || 'Unknown';
};

export const getCTLanguageFlag = (code: GoogleCTLanguageCode): string => {
  return GOOGLE_CT_LANGUAGE_METADATA[code]?.flag || '🏳️';
};

export const getCTLanguageInfo = (code: GoogleCTLanguageCode) => {
  const metadata = GOOGLE_CT_LANGUAGE_METADATA[code];
  return {
    code,
    name: metadata?.name || 'Unknown',
    nativeName: metadata?.nativeName,
    flag: metadata?.flag || '🏳️',
    isExperimental: metadata?.isExperimental || false,
    baseCode: metadata?.baseCode || code,
  };
};

export const getAllCTLanguages = () => {
  return Object.values(GoogleCTLanguageCode).map(code => getCTLanguageInfo(code));
};

// Get base language code (for translation API compatibility)
// Converts locale codes like 'en-US' to 'en', but keeps special cases like 'zh-CN'
export const getBaseLanguageCode = (code: GoogleCTLanguageCode | string): string => {
  const codeStr = typeof code === 'string' ? code : code;
  const metadata = GOOGLE_CT_LANGUAGE_METADATA[codeStr as GoogleCTLanguageCode];
  
  if (metadata) {
    return metadata.baseCode;
  }
  
  // Fallback: extract base code manually
  if (codeStr === 'zh-CN' || codeStr === 'zh-TW') {
    return codeStr; // Chinese needs to distinguish simplified vs traditional
  }
  
  if (codeStr.startsWith('yue-')) {
    return 'yue'; // Cantonese
  }
  
  // Extract base code (en-US -> en, fr-FR -> fr)
  const parts = codeStr.split('-');
  if (parts[0] === 'fil') {
    return 'tl';
  }
  return parts[0];
};

// Check if two language codes represent the same base language
export const isSameBaseLanguage = (code1: GoogleCTLanguageCode | string, code2: GoogleCTLanguageCode | string): boolean => {
  const base1 = getBaseLanguageCode(code1);
  const base2 = getBaseLanguageCode(code2);
  return base1 === base2;
};

// Get available target languages for a given source language
// With Translation LLM, all languages can translate to all languages, but we can filter out the source language
export const getAvailableTargetLanguages = (sourceLanguage?: GoogleCTLanguageCode | string): GoogleCTLanguageCode[] => {
  const allLanguages = Object.values(GoogleCTLanguageCode);
  
  if (!sourceLanguage) {
    return allLanguages;
  }
  
  // Filter out languages that are the same base language as source
  const sourceBase = getBaseLanguageCode(sourceLanguage);
  return allLanguages.filter(target => {
    const targetBase = getBaseLanguageCode(target);
    return targetBase !== sourceBase;
  });
};

// Get languages that can translate from a given source language
// This is essentially the same as getAvailableTargetLanguages since Translation LLM supports all-to-all
export const getTranslatableLanguages = (sourceLanguage?: GoogleCTLanguageCode | string): GoogleCTLanguageCode[] => {
  return getAvailableTargetLanguages(sourceLanguage);
};

// Check if a language code is valid
export const isValidCTLanguageCode = (code: string): code is GoogleCTLanguageCode => {
  return Object.values(GoogleCTLanguageCode).includes(code as GoogleCTLanguageCode);
};

export const normalizeSavedCTLanguage = (code: string | null | undefined): GoogleCTLanguageCode | null => {
  if (!code) {
    return null;
  }
  if (code === 'fil' || code.startsWith('fil-')) {
    return GoogleCTLanguageCode.FIL;
  }
  if (isValidCTLanguageCode(code)) {
    return code;
  }
  return null;
};

// Get primary language variant (e.g., for English, return en-US)
export const getPrimaryVariant = (baseCode: string): GoogleCTLanguageCode | null => {
  const primaryMap: Record<string, GoogleCTLanguageCode> = {
    'en': GoogleCTLanguageCode.EN_US,
    'es': GoogleCTLanguageCode.ES,
    'fr': GoogleCTLanguageCode.FR,
    'de': GoogleCTLanguageCode.DE,
    'it': GoogleCTLanguageCode.IT,
    'pt': GoogleCTLanguageCode.PT,
    'zh': GoogleCTLanguageCode.ZH_CN,
    'ar': GoogleCTLanguageCode.AR,
    'nl': GoogleCTLanguageCode.NL,
    'ja': GoogleCTLanguageCode.JA,
    'ko': GoogleCTLanguageCode.KO,
    'ru': GoogleCTLanguageCode.RU,
    'tr': GoogleCTLanguageCode.TR,
    'ta': GoogleCTLanguageCode.TA,
    'sw': GoogleCTLanguageCode.SW,
  };
  return primaryMap[baseCode] || null;
};

// Convert STT language code to CT language code (if possible)
// This helps when the speaker uses an STT language code and we need to find compatible translation codes
export const convertSTTToCTLanguage = (sttCode: string): GoogleCTLanguageCode | null => {
  // Try direct match first
  if (isValidCTLanguageCode(sttCode)) {
    return sttCode as GoogleCTLanguageCode;
  }
  
  // Extract base code and find a match
  const baseCode = getBaseLanguageCode(sttCode);
  const primaryVariant = getPrimaryVariant(baseCode);
  
  if (primaryVariant) {
    return primaryVariant;
  }
  
  // Try to find any variant with the same base
  const matchingLanguage = Object.values(GoogleCTLanguageCode).find(code => {
    const codeBase = getBaseLanguageCode(code);
    return codeBase === baseCode;
  });
  
  return matchingLanguage || null;
};

