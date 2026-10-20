import { defaultLocale, isLocale, locales, type Locale } from './config';
import { es } from './ui/es';
import { en } from './ui/en';

export type UiKey = keyof typeof es;
export type UiDictionary = Record<UiKey, string>;

/** Diccionarios de interfaz por idioma. Al añadir un idioma, regístralo aquí. */
const dictionaries: Record<Locale, UiDictionary> = { es, en };

/**
 * Devuelve la función de traducción de un idioma.
 * Fallback: si falta una clave, se usa el idioma predeterminado.
 * Sustituye `{variable}` por los valores indicados.
 */
export function useTranslations(lang: Locale) {
  const dict = dictionaries[lang] ?? dictionaries[defaultLocale];
  return function t(key: UiKey, vars: Record<string, string | number> = {}): string {
    const template = dict[key] ?? dictionaries[defaultLocale][key] ?? key;
    return template.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`));
  };
}

export type Translator = ReturnType<typeof useTranslations>;

/** Campo traducible de los archivos de datos: `{ es: '...', en: '...' }`. */
export type LocalizedText = Partial<Record<string, string>>;

/** Elige el texto de un campo traducible. Fallback: idioma predeterminado. */
export function pick(text: LocalizedText | string | undefined, lang: Locale): string {
  if (text === undefined) return '';
  if (typeof text === 'string') return text;
  return text[lang] ?? text[defaultLocale] ?? '';
}

export { defaultLocale, isLocale, locales, type Locale };
