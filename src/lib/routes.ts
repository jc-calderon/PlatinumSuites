import { defaultLocale, locales, type Locale, type SuiteId } from '../i18n/config';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

function join(...parts: string[]): string {
  const path = parts.filter(Boolean).join('/');
  return `${base}/${path}`;
}

/** URL de la portada en un idioma: `/` o `/en/`. */
export function homePath(lang: Locale): string {
  const { prefix } = locales[lang];
  return prefix ? join(prefix) + '/' : join();
}

/** URL de la guía de una suite: `/departamentos/tunari` o `/en/suites/tunari`. */
export function guidePath(lang: Locale, suite: SuiteId): string {
  const { prefix, guideSegment } = locales[lang];
  return join(prefix, guideSegment, suite);
}

/** URL de un archivo de `public/`: `/favicon.svg` o `/<base>/favicon.svg`. */
export function assetPath(file: string): string {
  return join(file.replace(/^\/+/, ''));
}

/** Parámetro `route` de `[...route].astro` (sin barras iniciales/finales). */
export function routeParam(path: string): string | undefined {
  const clean = path.replace(base, '').replace(/^\/+|\/+$/g, '');
  return clean === '' ? undefined : clean;
}

export { defaultLocale };
