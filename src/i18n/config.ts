/**
 * Idiomas admitidos: este es el ÚNICO lugar donde se declaran.
 *
 * Para añadir un idioma (por ejemplo, portugués):
 *  1. Añade una entrada aquí (`pt: { ... }`).
 *  2. Crea `src/i18n/ui/pt.ts` con los textos de interfaz y regístralo en `src/i18n/index.ts`.
 *  3. Crea `src/content/guides/pt/common.md`, `tunari.md` y `concordia.md`.
 *  4. (Opcional) Añade la clave `pt` a los textos traducibles de `places.yaml` y `site.yaml`.
 * No hace falta tocar páginas ni componentes.
 */
export const locales = {
  es: {
    label: 'Español',
    short: 'ES',
    htmlLang: 'es-BO',
    ogLocale: 'es_BO',
    /** Prefijo de URL ('' = raíz). */
    prefix: '',
    /** Segmento de URL para las guías de cada suite. */
    guideSegment: 'departamentos',
  },
  en: {
    label: 'English',
    short: 'EN',
    htmlLang: 'en',
    ogLocale: 'en_US',
    prefix: 'en',
    guideSegment: 'suites',
  },
} as const;

export type Locale = keyof typeof locales;

/** Idioma predeterminado y de respaldo (fallback). */
export const defaultLocale: Locale = 'es';

export const localeList = Object.keys(locales) as Locale[];

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && value in locales;
}

/** Identificadores técnicos estables de las suites. El orden es el de la portada. */
export const suiteIds = ['tunari', 'concordia'] as const;
export type SuiteId = (typeof suiteIds)[number];
