import * as Localization from 'expo-localization';

/**
 * Locale information interface
 */
export interface LocaleInfo {
  locale: string;
  languageCode: string;
  regionCode: string;
  isRTL: boolean;
  timezone: string;
}

/**
 * Supported language codes
 */
export enum SupportedLanguages {
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  DE = 'de',
  IT = 'it',
  PT = 'pt',
  ZH = 'zh',
  JA = 'ja',
  KO = 'ko',
  AR = 'ar',
  HI = 'hi',
  RU = 'ru',
}

/**
 * RTL (Right-to-Left) language codes
 */
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'yi'];

/**
 * Default fallback locale
 */
const DEFAULT_LOCALE = 'en-US';
const DEFAULT_LANGUAGE = 'en';
const DEFAULT_REGION = 'US';
const DEFAULT_TIMEZONE = 'America/New_York';

/**
 * Get the current locale of the device with fallback
 * @returns The current locale string (e.g., 'en-US', 'fr-FR')
 */
export const getCurrentLocale = (): string => {
  try {
    return Localization.locale || DEFAULT_LOCALE;
  } catch (error) {
    console.warn('Error getting current locale:', error);
    return DEFAULT_LOCALE;
  }
};

/**
 * Get the current language code with fallback
 * @returns The language code (e.g., 'en', 'fr')
 */
export const getCurrentLanguage = (): string => {
  try {
    const locale = getCurrentLocale();
    const language = locale.split('-')[0]?.toLowerCase();
    return language || DEFAULT_LANGUAGE;
  } catch (error) {
    console.warn('Error getting current language:', error);
    return DEFAULT_LANGUAGE;
  }
};

/**
 * Get all available locales on the device
 * @returns Array of locale strings
 */
export const getAvailableLocales = (): string[] => {
  try {
    const locales = Localization.locales;
    return Array.isArray(locales) && locales.length > 0 
      ? locales 
      : [DEFAULT_LOCALE];
  } catch (error) {
    console.warn('Error getting available locales:', error);
    return [DEFAULT_LOCALE];
  }
};

/**
 * Check if the current locale is RTL (Right-to-Left)
 * @returns Boolean indicating if the locale is RTL
 */
export const isRTL = (): boolean => {
  try {
    // First check Localization.isRTL
    if (typeof Localization.isRTL === 'boolean') {
      return Localization.isRTL;
    }
    
    // Fallback: check language code against RTL languages
    const language = getCurrentLanguage();
    return RTL_LANGUAGES.includes(language);
  } catch (error) {
    console.warn('Error checking RTL:', error);
    return false;
  }
};

/**
 * Get the region code from the current locale
 * @returns The region code (e.g., 'US', 'FR')
 */
export const getRegion = (): string => {
  try {
    // First try the region property
    if (Localization.region) {
      return Localization.region;
    }
    
    // Fallback: extract from locale
    const locale = getCurrentLocale();
    const parts = locale.split('-');
    return parts[1]?.toUpperCase() || DEFAULT_REGION;
  } catch (error) {
    console.warn('Error getting region:', error);
    return DEFAULT_REGION;
  }
};

/**
 * Get the timezone of the device
 * @returns The timezone string (e.g., 'America/New_York')
 */
export const getTimezone = (): string => {
  try {
    return Localization.timezone || DEFAULT_TIMEZONE;
  } catch (error) {
    console.warn('Error getting timezone:', error);
    return DEFAULT_TIMEZONE;
  }
};

/**
 * Get comprehensive locale information
 * @returns LocaleInfo object with all locale details
 */
export const getLocaleInfo = (): LocaleInfo => {
  return {
    locale: getCurrentLocale(),
    languageCode: getCurrentLanguage(),
    regionCode: getRegion(),
    isRTL: isRTL(),
    timezone: getTimezone(),
  };
};

/**
 * Check if a language is supported
 * @param languageCode - The language code to check
 * @returns Boolean indicating if the language is supported
 */
export const isLanguageSupported = (languageCode: string): boolean => {
  try {
    const normalized = languageCode.toLowerCase();
    return Object.values(SupportedLanguages).includes(normalized as SupportedLanguages);
  } catch (error) {
    console.warn('Error checking language support:', error);
    return false;
  }
};

/**
 * Get a supported language code with fallback
 * @param preferredLanguage - Optional preferred language
 * @returns A supported language code
 */
export const getSupportedLanguage = (preferredLanguage?: string): string => {
  try {
    const language = preferredLanguage || getCurrentLanguage();
    return isLanguageSupported(language) ? language : DEFAULT_LANGUAGE;
  } catch (error) {
    console.warn('Error getting supported language:', error);
    return DEFAULT_LANGUAGE;
  }
};

/**
 * Format a locale string (e.g., 'en_US' to 'en-US')
 * @param locale - The locale string to format
 * @returns Formatted locale string
 */
export const formatLocale = (locale: string): string => {
  try {
    return locale.replace('_', '-');
  } catch (error) {
    console.warn('Error formatting locale:', error);
    return DEFAULT_LOCALE;
  }
};

/**
 * Get the display name of a language in its native form
 * @param languageCode - The language code
 * @returns The native language name
 */
export const getNativeLanguageName = (languageCode: string): string => {
  const languageNames: Record<string, string> = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    it: 'Italiano',
    pt: 'Português',
    zh: '中文',
    ja: '日本語',
    ko: '한국어',
    ar: 'العربية',
    hi: 'हिन्दी',
    ru: 'Русский',
  };
  
  try {
    return languageNames[languageCode.toLowerCase()] || languageCode;
  } catch (error) {
    console.warn('Error getting native language name:', error);
    return languageCode;
  }
};

/**
 * Check if device uses 12-hour time format
 * @returns Boolean indicating if 12-hour format is used
 */
export const uses12HourClock = (): boolean => {
  try {
    return Localization.uses24HourClock === false;
  } catch (error) {
    console.warn('Error checking clock format:', error);
    // Default to region-based assumption
    const region = getRegion();
    return ['US', 'CA', 'AU', 'NZ', 'PH'].includes(region);
  }
};

/**
 * Get currency code based on region
 * @returns Currency code (e.g., 'USD', 'EUR')
 */
export const getCurrencyCode = (): string => {
  const currencyMap: Record<string, string> = {
    US: 'USD',
    GB: 'GBP',
    EU: 'EUR',
    JP: 'JPY',
    CN: 'CNY',
    IN: 'INR',
    CA: 'CAD',
    AU: 'AUD',
    BR: 'BRL',
    MX: 'MXN',
  };
  
  try {
    const region = getRegion();
    return currencyMap[region] || 'USD';
  } catch (error) {
    console.warn('Error getting currency code:', error);
    return 'USD';
  }
};

/**
 * Validate locale format
 * @param locale - Locale string to validate
 * @returns Boolean indicating if locale format is valid
 */
export const isValidLocale = (locale: string): boolean => {
  try {
    // Check format: xx or xx-XX
    const localeRegex = /^[a-z]{2}(-[A-Z]{2})?$/;
    return localeRegex.test(locale);
  } catch (error) {
    console.warn('Error validating locale:', error);
    return false;
  }
};

export default {
  getCurrentLocale,
  getCurrentLanguage,
  getAvailableLocales,
  isRTL,
  getRegion,
  getTimezone,
  getLocaleInfo,
  isLanguageSupported,
  getSupportedLanguage,
  formatLocale,
  getNativeLanguageName,
  uses12HourClock,
  getCurrencyCode,
  isValidLocale,
  SupportedLanguages,
};