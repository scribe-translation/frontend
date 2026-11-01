// Flag image utilities for better cross-browser compatibility

// Country code to flag image mapping
const COUNTRY_FLAG_IMAGES: Record<string, string> = {
  // Major countries
  'US': 'https://flagcdn.com/w20/us.png',
  'GB': 'https://flagcdn.com/w20/gb.png',
  'CA': 'https://flagcdn.com/w20/ca.png',
  'AU': 'https://flagcdn.com/w20/au.png',
  'NZ': 'https://flagcdn.com/w20/nz.png',
  'IE': 'https://flagcdn.com/w20/ie.png',
  'ZA': 'https://flagcdn.com/w20/za.png',
  
  // Spanish-speaking countries
  'ES': 'https://flagcdn.com/w20/es.png',
  'MX': 'https://flagcdn.com/w20/mx.png',
  'AR': 'https://flagcdn.com/w20/ar.png',
  'CO': 'https://flagcdn.com/w20/co.png',
  'PE': 'https://flagcdn.com/w20/pe.png',
  'VE': 'https://flagcdn.com/w20/ve.png',
  'CL': 'https://flagcdn.com/w20/cl.png',
  'EC': 'https://flagcdn.com/w20/ec.png',
  'UY': 'https://flagcdn.com/w20/uy.png',
  'PY': 'https://flagcdn.com/w20/py.png',
  'BO': 'https://flagcdn.com/w20/bo.png',
  'CR': 'https://flagcdn.com/w20/cr.png',
  'PA': 'https://flagcdn.com/w20/pa.png',
  'DO': 'https://flagcdn.com/w20/do.png',
  'CU': 'https://flagcdn.com/w20/cu.png',
  'PR': 'https://flagcdn.com/w20/pr.png',
  'GT': 'https://flagcdn.com/w20/gt.png',
  'SV': 'https://flagcdn.com/w20/sv.png',
  'HN': 'https://flagcdn.com/w20/hn.png',
  'NI': 'https://flagcdn.com/w20/ni.png',
  
  // French-speaking countries
  'FR': 'https://flagcdn.com/w20/fr.png',
  'BE': 'https://flagcdn.com/w20/be.png',
  'CH': 'https://flagcdn.com/w20/ch.png',
  'LU': 'https://flagcdn.com/w20/lu.png',
  'MC': 'https://flagcdn.com/w20/mc.png',
  
  // Portuguese-speaking countries
  'PT': 'https://flagcdn.com/w20/pt.png',
  'BR': 'https://flagcdn.com/w20/br.png',
  
  // Chinese regions
  'CN': 'https://flagcdn.com/w20/cn.png',
  'TW': 'https://flagcdn.com/w20/tw.png',
  'HK': 'https://flagcdn.com/w20/hk.png',
  'MO': 'https://flagcdn.com/w20/mo.png',
  'SG': 'https://flagcdn.com/w20/sg.png',
  
  // Arabic-speaking countries
  'SA': 'https://flagcdn.com/w20/sa.png',
  'EG': 'https://flagcdn.com/w20/eg.png',
  'AE': 'https://flagcdn.com/w20/ae.png',
  'LB': 'https://flagcdn.com/w20/lb.png',
  'SY': 'https://flagcdn.com/w20/sy.png',
  'JO': 'https://flagcdn.com/w20/jo.png',
  'PS': 'https://flagcdn.com/w20/ps.png',
  'IL': 'https://flagcdn.com/w20/il.png',
  'MA': 'https://flagcdn.com/w20/ma.png',
  'DZ': 'https://flagcdn.com/w20/dz.png',
  'TN': 'https://flagcdn.com/w20/tn.png',
  'LY': 'https://flagcdn.com/w20/ly.png',
  'SD': 'https://flagcdn.com/w20/sd.png',
  'IQ': 'https://flagcdn.com/w20/iq.png',
  'KW': 'https://flagcdn.com/w20/kw.png',
  'QA': 'https://flagcdn.com/w20/qa.png',
  'BH': 'https://flagcdn.com/w20/bh.png',
  'OM': 'https://flagcdn.com/w20/om.png',
  'YE': 'https://flagcdn.com/w20/ye.png',
  
  // Other major languages
  'DE': 'https://flagcdn.com/w20/de.png',
  'IT': 'https://flagcdn.com/w20/it.png',
  'RU': 'https://flagcdn.com/w20/ru.png',
  'JP': 'https://flagcdn.com/w20/jp.png',
  'KO': 'https://flagcdn.com/w20/kr.png',
  'KR': 'https://flagcdn.com/w20/kr.png',
  'HI': 'https://flagcdn.com/w20/in.png',
  'IN': 'https://flagcdn.com/w20/in.png',
  'NL': 'https://flagcdn.com/w20/nl.png',
  'SE': 'https://flagcdn.com/w20/se.png',
  'DK': 'https://flagcdn.com/w20/dk.png',
  'NO': 'https://flagcdn.com/w20/no.png',
  'FI': 'https://flagcdn.com/w20/fi.png',
  'PL': 'https://flagcdn.com/w20/pl.png',
  'CZ': 'https://flagcdn.com/w20/cz.png',
  'SK': 'https://flagcdn.com/w20/sk.png',
  'HU': 'https://flagcdn.com/w20/hu.png',
  'RO': 'https://flagcdn.com/w20/ro.png',
  'BG': 'https://flagcdn.com/w20/bg.png',
  'HR': 'https://flagcdn.com/w20/hr.png',
  'RS': 'https://flagcdn.com/w20/rs.png',
  'SI': 'https://flagcdn.com/w20/si.png',
  'EE': 'https://flagcdn.com/w20/ee.png',
  'LV': 'https://flagcdn.com/w20/lv.png',
  'LT': 'https://flagcdn.com/w20/lt.png',
  'GR': 'https://flagcdn.com/w20/gr.png',
  'TR': 'https://flagcdn.com/w20/tr.png',
  'UA': 'https://flagcdn.com/w20/ua.png',
  'BY': 'https://flagcdn.com/w20/by.png',
  'MK': 'https://flagcdn.com/w20/mk.png',
  'AL': 'https://flagcdn.com/w20/al.png',
  'IS': 'https://flagcdn.com/w20/is.png',
  'FO': 'https://flagcdn.com/w20/fo.png',
  'MT': 'https://flagcdn.com/w20/mt.png',
  'TH': 'https://flagcdn.com/w20/th.png',
  'VN': 'https://flagcdn.com/w20/vn.png',
  'ID': 'https://flagcdn.com/w20/id.png',
  'MY': 'https://flagcdn.com/w20/my.png',
  'BD': 'https://flagcdn.com/w20/bd.png',
  'NP': 'https://flagcdn.com/w20/np.png',
  'LK': 'https://flagcdn.com/w20/lk.png',
  'MM': 'https://flagcdn.com/w20/mm.png',
  'KH': 'https://flagcdn.com/w20/kh.png',
  'LA': 'https://flagcdn.com/w20/la.png',
  'MN': 'https://flagcdn.com/w20/mn.png',
  'KZ': 'https://flagcdn.com/w20/kz.png',
  'KG': 'https://flagcdn.com/w20/kg.png',
  'UZ': 'https://flagcdn.com/w20/uz.png',
  'TM': 'https://flagcdn.com/w20/tm.png',
  'TJ': 'https://flagcdn.com/w20/tj.png',
  'AF': 'https://flagcdn.com/w20/af.png',
  'IR': 'https://flagcdn.com/w20/ir.png',
  'PK': 'https://flagcdn.com/w20/pk.png',
  'TZ': 'https://flagcdn.com/w20/tz.png',
  'SO': 'https://flagcdn.com/w20/so.png',
  'ET': 'https://flagcdn.com/w20/et.png',
  'NG': 'https://flagcdn.com/w20/ng.png',
  'LS': 'https://flagcdn.com/w20/ls.png',
  'BW': 'https://flagcdn.com/w20/bw.png',
  'SZ': 'https://flagcdn.com/w20/sz.png',
  'ZW': 'https://flagcdn.com/w20/zw.png',
  'MV': 'https://flagcdn.com/w20/mv.png',
  'WS': 'https://flagcdn.com/w20/ws.png',
  'TO': 'https://flagcdn.com/w20/to.png',
  'FJ': 'https://flagcdn.com/w20/fj.png',
  'PF': 'https://flagcdn.com/w20/pf.png',
  
  // Additional countries for missing languages (only new ones)
  'BA': 'https://flagcdn.com/w20/ba.png',
  'AM': 'https://flagcdn.com/w20/am.png',
  'AZ': 'https://flagcdn.com/w20/az.png',
  'GE': 'https://flagcdn.com/w20/ge.png',
  'MW': 'https://flagcdn.com/w20/mw.png',
  'ZM': 'https://flagcdn.com/w20/zm.png',
  'MU': 'https://flagcdn.com/w20/mu.png',
  'SC': 'https://flagcdn.com/w20/sc.png',
  'CY': 'https://flagcdn.com/w20/cy.png',
  'PG': 'https://flagcdn.com/w20/pg.png',
  'SB': 'https://flagcdn.com/w20/sb.png',
  'VU': 'https://flagcdn.com/w20/vu.png',
  'NR': 'https://flagcdn.com/w20/nr.png',
  'KI': 'https://flagcdn.com/w20/ki.png',
  'TV': 'https://flagcdn.com/w20/tv.png',
  'CK': 'https://flagcdn.com/w20/ck.png',
  'NU': 'https://flagcdn.com/w20/nu.png',
  'PW': 'https://flagcdn.com/w20/pw.png',
  'FM': 'https://flagcdn.com/w20/fm.png',
  'MH': 'https://flagcdn.com/w20/mh.png',
  'GU': 'https://flagcdn.com/w20/gu.png',
  'MP': 'https://flagcdn.com/w20/mp.png',
  'AS': 'https://flagcdn.com/w20/as.png',
  'VI': 'https://flagcdn.com/w20/vi.png',
  'BZ': 'https://flagcdn.com/w20/bz.png',
  'GY': 'https://flagcdn.com/w20/gy.png',
  'TT': 'https://flagcdn.com/w20/tt.png',
  'BB': 'https://flagcdn.com/w20/bb.png',
  'JM': 'https://flagcdn.com/w20/jm.png',
  'BS': 'https://flagcdn.com/w20/bs.png',
  'AG': 'https://flagcdn.com/w20/ag.png',
  'DM': 'https://flagcdn.com/w20/dm.png',
  'GD': 'https://flagcdn.com/w20/gd.png',
  'KN': 'https://flagcdn.com/w20/kn.png',
  'LC': 'https://flagcdn.com/w20/lc.png',
  'VC': 'https://flagcdn.com/w20/vc.png',
  'TC': 'https://flagcdn.com/w20/tc.png',
  'AI': 'https://flagcdn.com/w20/ai.png',
  'VG': 'https://flagcdn.com/w20/vg.png',
  'MS': 'https://flagcdn.com/w20/ms.png',
  'KY': 'https://flagcdn.com/w20/ky.png',
  'BM': 'https://flagcdn.com/w20/bm.png',
  'FK': 'https://flagcdn.com/w20/fk.png',
  'SH': 'https://flagcdn.com/w20/sh.png',
  'AC': 'https://flagcdn.com/w20/ac.png',
  'TA': 'https://flagcdn.com/w20/ta.png',
  'IO': 'https://flagcdn.com/w20/io.png',
  'PN': 'https://flagcdn.com/w20/pn.png',
  'GS': 'https://flagcdn.com/w20/gs.png',
  
  // Fallback flag for unknown languages
  'WHITE': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAyMCAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE1IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9IjAuNSIvPgo8L3N2Zz4K'
}

// Language code to country code mapping with regional variants
const LANGUAGE_TO_COUNTRY: Record<string, string> = {
  // English variants
  'en': 'US',        // Default English (US)
  'en-US': 'US',     // American English
  'en-GB': 'GB',     // British English
  'en-CA': 'CA',     // Canadian English
  'en-AU': 'AU',     // Australian English
  'en-NZ': 'NZ',     // New Zealand English
  'en-IE': 'IE',     // Irish English
  'en-ZA': 'ZA',     // South African English
  'en-KE': 'KE',     // Kenyan English
  'en-GH': 'GH',     // Ghanaian English
  'en-NG': 'NG',     // Nigerian English
  'en-UG': 'UG',     // Ugandan English
  'en-TZ': 'TZ',     // Tanzanian English
  'en-ZW': 'ZW',     // Zimbabwean English
  'en-BW': 'BW',     // Botswanan English
  'en-LS': 'LS',     // Lesotho English
  'en-SZ': 'SZ',     // Eswatini English
  'en-MW': 'MW',     // Malawian English
  'en-ZM': 'ZM',     // Zambian English
  'en-MU': 'MU',     // Mauritian English
  'en-SC': 'SC',     // Seychellois English
  'en-MT': 'MT',     // Maltese English
  'en-CY': 'CY',     // Cypriot English
  'en-MY': 'MY',     // Malaysian English
  'en-SG': 'SG',     // Singaporean English
  'en-PH': 'PH',     // Philippine English
  'en-IN': 'IN',     // Indian English
  'en-PK': 'PK',     // Pakistani English
  'en-BD': 'BD',     // Bangladeshi English
  'en-LK': 'LK',     // Sri Lankan English
  'en-MM': 'MM',     // Myanmar English
  'en-TH': 'TH',     // Thai English
  'en-VN': 'VN',     // Vietnamese English
  'en-KH': 'KH',     // Cambodian English
  'en-LA': 'LA',     // Laotian English
  'en-ID': 'ID',     // Indonesian English
  'en-FJ': 'FJ',     // Fijian English
  'en-PG': 'PG',     // Papua New Guinean English
  'en-SB': 'SB',     // Solomon Islands English
  'en-VU': 'VU',     // Vanuatu English
  'en-NR': 'NR',     // Nauruan English
  'en-KI': 'KI',     // Kiribati English
  'en-TV': 'TV',     // Tuvaluan English
  'en-TO': 'TO',     // Tongan English
  'en-WS': 'WS',     // Samoan English
  'en-CK': 'CK',     // Cook Islands English
  'en-NU': 'NU',     // Niuean English
  'en-PW': 'PW',     // Palauan English
  'en-FM': 'FM',     // Micronesian English
  'en-MH': 'MH',     // Marshallese English
  'en-GU': 'GU',     // Guamanian English
  'en-MP': 'MP',     // Northern Mariana Islands English
  'en-AS': 'AS',     // American Samoan English
  'en-VI': 'VI',     // US Virgin Islands English
  'en-PR': 'PR',     // Puerto Rican English
  'en-BZ': 'BZ',     // Belizean English
  'en-GY': 'GY',     // Guyanese English
  'en-TT': 'TT',     // Trinidadian English
  'en-BB': 'BB',     // Barbadian English
  'en-JM': 'JM',     // Jamaican English
  'en-BS': 'BS',     // Bahamian English
  'en-AG': 'AG',     // Antiguan English
  'en-DM': 'DM',     // Dominican English
  'en-GD': 'GD',     // Grenadian English
  'en-KN': 'KN',     // Kittitian English
  'en-LC': 'LC',     // Saint Lucian English
  'en-VC': 'VC',     // Vincentian English
  'en-TC': 'TC',     // Turks and Caicos English
  'en-AI': 'AI',     // Anguillan English
  'en-VG': 'VG',     // British Virgin Islands English
  'en-MS': 'MS',     // Montserrat English
  'en-KY': 'KY',     // Cayman Islands English
  'en-BM': 'BM',     // Bermudian English
  'en-FK': 'FK',     // Falkland Islands English
  'en-SH': 'SH',     // Saint Helena English
  'en-AC': 'AC',     // Ascension Island English
  'en-TA': 'TA',     // Tristan da Cunha English
  'en-IO': 'IO',     // British Indian Ocean Territory English
  'en-PN': 'PN',     // Pitcairn Islands English
  'en-GS': 'GS',     // South Georgia and South Sandwich Islands English
  'en-HK': 'HK',     // Hong Kong English
  'en-MO': 'MO',     // Macau English
  
  // Spanish variants
  'es': 'ES',        // Default Spanish (Spain)
  'es-ES': 'ES',     // Spain Spanish
  'es-MX': 'MX',     // Mexican Spanish
  'es-AR': 'AR',     // Argentine Spanish
  'es-CO': 'CO',     // Colombian Spanish
  'es-PE': 'PE',     // Peruvian Spanish
  'es-VE': 'VE',     // Venezuelan Spanish
  'es-CL': 'CL',     // Chilean Spanish
  'es-EC': 'EC',     // Ecuadorian Spanish
  'es-UY': 'UY',     // Uruguayan Spanish
  'es-PY': 'PY',     // Paraguayan Spanish
  'es-BO': 'BO',     // Bolivian Spanish
  'es-CR': 'CR',     // Costa Rican Spanish
  'es-PA': 'PA',     // Panamanian Spanish
  'es-DO': 'DO',     // Dominican Spanish
  'es-CU': 'CU',     // Cuban Spanish
  'es-PR': 'PR',     // Puerto Rican Spanish
  'es-GT': 'GT',     // Guatemalan Spanish
  'es-SV': 'SV',     // Salvadoran Spanish
  'es-HN': 'HN',     // Honduran Spanish
  'es-NI': 'NI',     // Nicaraguan Spanish
  
  // French variants
  'fr': 'FR',        // Default French (France)
  'fr-FR': 'FR',     // France French
  'fr-CA': 'CA',     // Canadian French
  'fr-BE': 'BE',     // Belgian French
  'fr-CH': 'CH',     // Swiss French
  'fr-LU': 'LU',     // Luxembourg French
  'fr-MC': 'MC',     // Monégasque French
  
  // Portuguese variants
  'pt': 'PT',        // Default Portuguese (Portugal)
  'pt-PT': 'PT',     // Portugal Portuguese
  'pt-BR': 'BR',     // Brazilian Portuguese
  
  // Chinese variants
  'zh': 'CN',        // Default Chinese (Simplified)
  'zh-Hans': 'CN',   // Simplified Chinese (China)
  'zh-Hant': 'TW',   // Traditional Chinese (Taiwan)
  'zh-CN': 'CN',     // China Chinese
  'zh-TW': 'TW',     // Taiwan Chinese
  'zh-HK': 'HK',     // Hong Kong Chinese
  'zh-MO': 'MO',     // Macau Chinese
  'zh-SG': 'SG',     // Singapore Chinese
  
  // Arabic variants
  'ar': 'SA',        // Default Arabic (Saudi Arabia)
  'ar-SA': 'SA',     // Saudi Arabic
  'ar-EG': 'EG',     // Egyptian Arabic
  'ar-AE': 'AE',     // UAE Arabic
  'ar-LB': 'LB',     // Lebanese Arabic
  'ar-SY': 'SY',     // Syrian Arabic
  'ar-JO': 'JO',     // Jordanian Arabic
  'ar-PS': 'PS',     // Palestinian Arabic
  'ar-IL': 'IL',     // Israeli Arabic
  'ar-MA': 'MA',     // Moroccan Arabic
  'ar-DZ': 'DZ',     // Algerian Arabic
  'ar-TN': 'TN',     // Tunisian Arabic
  'ar-LY': 'LY',     // Libyan Arabic
  'ar-SD': 'SD',     // Sudanese Arabic
  'ar-IQ': 'IQ',     // Iraqi Arabic
  'ar-KW': 'KW',     // Kuwaiti Arabic
  'ar-QA': 'QA',     // Qatari Arabic
  'ar-BH': 'BH',     // Bahraini Arabic
  'ar-OM': 'OM',     // Omani Arabic
  'ar-YE': 'YE',     // Yemeni Arabic
  
  // Other major languages
  'de': 'DE',        // German
  'it': 'IT',        // Italian
  'ru': 'RU',        // Russian
  'ja': 'JP',        // Japanese
  'ko': 'KR',        // Korean
  'hi': 'IN',        // Hindi
  'nl': 'NL',        // Dutch
  'sv': 'SE',        // Swedish
  'da': 'DK',        // Danish
  'nb': 'NO',        // Norwegian
  'fi': 'FI',        // Finnish
  'pl': 'PL',        // Polish
  'cs': 'CZ',        // Czech
  'sk': 'SK',        // Slovak
  'hu': 'HU',        // Hungarian
  'ro': 'RO',        // Romanian
  'bg': 'BG',        // Bulgarian
  'hr': 'HR',        // Croatian
  'sr': 'RS',        // Serbian (Latin)
  'sr-Cyrl': 'RS',   // Serbian (Cyrillic)
  'sl': 'SI',        // Slovenian
  'et': 'EE',        // Estonian
  'lv': 'LV',        // Latvian
  'lt': 'LT',        // Lithuanian
  'el': 'GR',        // Greek
  'tr': 'TR',        // Turkish
  'uk': 'UA',        // Ukrainian
  'be': 'BY',        // Belarusian
  'mk': 'MK',        // Macedonian
  'sq': 'AL',        // Albanian
  'ca': 'ES',        // Catalan (Spain)
  'eu': 'ES',        // Basque (Spain)
  'gl': 'ES',        // Galician (Spain)
  'is': 'IS',        // Icelandic
  'fo': 'FO',        // Faroese
  'ga': 'IE',        // Irish
  'mt': 'MT',        // Maltese
  'cy': 'GB',        // Welsh (UK)
  'th': 'TH',        // Thai
  'vi': 'VN',        // Vietnamese
  'id': 'ID',        // Indonesian
  'ms': 'MY',        // Malay
  'ta': 'IN',        // Tamil (India)
  'te': 'IN',        // Telugu (India)
  'kn': 'IN',        // Kannada (India)
  'ml': 'IN',        // Malayalam (India)
  'bn': 'BD',        // Bangla (Bangladesh)
  'pa': 'IN',        // Punjabi (India)
  'gu': 'IN',        // Gujarati (India)
  'mr': 'IN',        // Marathi (India)
  'or': 'IN',        // Odia (India)
  'as': 'IN',        // Assamese (India)
  'ne': 'NP',        // Nepali
  'si': 'LK',        // Sinhala (Sri Lanka)
  'my': 'MM',        // Myanmar
  'km': 'KH',        // Khmer
  'lo': 'LA',        // Lao
  'mn-Cyrl': 'MN',   // Mongolian
  'kk': 'KZ',        // Kazakh
  'ky': 'KG',        // Kyrgyz
  'uz': 'UZ',        // Uzbek
  'tk': 'TM',        // Turkmen
  'tg': 'TJ',        // Tajik
  'ps': 'AF',        // Pashto (Afghanistan)
  'fa': 'IR',        // Persian (Iran)
  'ur': 'PK',        // Urdu (Pakistan)
  'sd': 'PK',        // Sindhi (Pakistan)
  'yue': 'HK',       // Cantonese (Hong Kong)
  'lzh': 'CN',       // Chinese Literary
  'af': 'ZA',        // Afrikaans (South Africa)
  'sw': 'TZ',        // Swahili (Tanzania)
  'so': 'SO',        // Somali
  'am': 'ET',        // Amharic (Ethiopia)
  'ha': 'NG',        // Hausa (Nigeria)
  'ig': 'NG',        // Igbo (Nigeria)
  'yo': 'NG',        // Yoruba (Nigeria)
  'zu': 'ZA',        // Zulu (South Africa)
  'xh': 'ZA',        // Xhosa (South Africa)
  'st': 'LS',        // Southern Sotho (Lesotho)
  'tn': 'BW',        // Tswana (Botswana)
  've': 'ZA',        // Venda (South Africa)
  'ts': 'ZA',        // Tsonga (South Africa)
  'ss': 'SZ',        // Swati (Eswatini)
  'nr': 'ZA',        // Southern Ndebele (South Africa)
  'nd': 'ZW',        // Northern Ndebele (Zimbabwe)
  'he': 'IL',        // Hebrew (Israel)
  'ku': 'IQ',        // Kurdish (Iraq)
  'dv': 'MV',        // Divehi (Maldives)
  'mi': 'NZ',        // Maori (New Zealand)
  'sm': 'WS',        // Samoan
  'to': 'TO',        // Tongan
  'fj': 'FJ',        // Fijian
  'ty': 'PF',        // Tahitian (French Polynesia)
  'iu': 'CA',        // Inuktitut (Canada)
  'ikt': 'CA',       // Inuinnaqtun (Canada)
  'iu-Latn': 'CA',   // Inuktitut Latin (Canada)
  
  // Additional languages that were showing wrong flags (only new ones)
  'jv': 'ID',        // Javanese (Indonesia)
  'fil': 'PH',       // Filipino (Philippines)
  'tl': 'PH',        // Tagalog / Filipino (Philippines)
  'sw-KE': 'KE',     // Swahili (Kenya)
  'bs': 'BA',        // Bosnian (Bosnia and Herzegovina)
  'hy': 'AM',        // Armenian (Armenia)
  'az': 'AZ',        // Azerbaijani (Azerbaijan)
  'ka': 'GE',        // Georgian (Georgia)
  
  // Specific language codes from the enum files
  'mn-MN': 'MN',     // Mongolian (Mongolia)
  'fil-PH': 'PH',    // Filipino (Philippines)
  'jv-ID': 'ID'      // Javanese (Indonesia)
}

/**
 * Gets the country code for a language code with regional variant support
 */
export function getCountryCode(languageCode: string): string {
  // First try exact match
  if (LANGUAGE_TO_COUNTRY[languageCode]) {
    return LANGUAGE_TO_COUNTRY[languageCode]
  }
  
  // If no exact match, try to extract the base language code
  const baseLanguage = languageCode.split('-')[0]
  if (LANGUAGE_TO_COUNTRY[baseLanguage]) {
    return LANGUAGE_TO_COUNTRY[baseLanguage]
  }
  
  // Fallback to white flag for unknown languages
  return 'WHITE'
}

/**
 * Gets the flag image URL for a language code
 */
export function getFlagImageUrl(languageCode: string): string {
  const countryCode = getCountryCode(languageCode)
  return COUNTRY_FLAG_IMAGES[countryCode] || COUNTRY_FLAG_IMAGES['WHITE']
}

/**
 * Creates a React element with a flag image
 */
export function createFlagImageElement(languageCode: string, size: number = 20): React.ReactElement {
  const flagUrl = getFlagImageUrl(languageCode)
  const countryCode = getCountryCode(languageCode)
  
  return (
    <img
      src={flagUrl}
      alt={`${countryCode} flag`}
      style={{
        width: size,
        height: Math.round(size * 0.75), // Maintain flag aspect ratio
        objectFit: 'cover',
        borderRadius: '2px',
        verticalAlign: 'middle',
        display: 'inline-block'
      }}
      onError={(e) => {
        // Fallback to country code if image fails to load
        const target = e.target as HTMLImageElement
        target.style.display = 'none'
        const fallback = document.createElement('span')
        fallback.textContent = countryCode
        fallback.style.cssText = `
          display: inline-block;
          font-size: ${Math.round(size * 0.6)}px;
          font-weight: bold;
          color: #666;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          vertical-align: middle;
        `
        target.parentNode?.insertBefore(fallback, target.nextSibling)
      }}
    />
  )
}
