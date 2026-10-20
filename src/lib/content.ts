import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { defaultLocale, type Locale, type SuiteId } from '../i18n/config';
import placesYaml from '../content/places/places.yaml?raw';

export type GuideEntry = CollectionEntry<'guides'>;
export type CommonGuide = GuideEntry & { data: Extract<GuideEntry['data'], { kind: 'common' }> };
export type SuiteGuide = GuideEntry & { data: Extract<GuideEntry['data'], { kind: 'suite' }> };
export type Place = CollectionEntry<'places'>['data'];

export interface Resolved<T> {
  entry: T;
  /** true si no existe la traducción y se usa el idioma predeterminado. */
  isFallback: boolean;
}

/**
 * Política de fallback: si falta `guides/<lang>/<id>.md`, se usa la versión en el idioma
 * predeterminado y la página muestra un aviso. Nunca se muestra una página vacía.
 */
async function resolveGuide(lang: Locale, id: string): Promise<Resolved<GuideEntry>> {
  const own = await getEntry('guides', `${lang}/${id}`);
  if (own) {
    if (own.data.lang !== lang) {
      throw new Error(
        `src/content/guides/${lang}/${id}.md: el campo "lang: ${own.data.lang}" no coincide con la carpeta "${lang}".`,
      );
    }
    return { entry: own, isFallback: false };
  }
  const fallback = await getEntry('guides', `${defaultLocale}/${id}`);
  if (!fallback) throw new Error(`Falta el archivo obligatorio src/content/guides/${defaultLocale}/${id}.md`);
  return { entry: fallback, isFallback: true };
}

export async function getCommonGuide(lang: Locale): Promise<Resolved<CommonGuide>> {
  const result = await resolveGuide(lang, 'common');
  if (result.entry.data.kind !== 'common') throw new Error(`guides/*/common.md debe tener "kind: common".`);
  return result as Resolved<CommonGuide>;
}

export async function getSuiteGuide(lang: Locale, suite: SuiteId): Promise<Resolved<SuiteGuide>> {
  const result = await resolveGuide(lang, suite);
  const { data } = result.entry;
  if (data.kind !== 'suite' || data.suite !== suite) {
    throw new Error(`guides/*/${suite}.md debe tener "kind: suite" y "suite: ${suite}".`);
  }
  return result as Resolved<SuiteGuide>;
}

export async function getSettings() {
  const entry = await getEntry('settings', 'site');
  if (!entry) throw new Error('Falta la clave "site:" en src/content/settings/site.yaml');
  return entry.data;
}

export type Settings = Awaited<ReturnType<typeof getSettings>>;

/** Posición de cada lugar en places.yaml: el orden del archivo es el orden en pantalla. */
const placeOrder = new Map(
  [...placesYaml.matchAll(/^- id:\s*["']?([\w-]+)/gm)].map((match, index) => [match[1], index]),
);

export async function getPlaces(...groups: Place['group'][]): Promise<Place[]> {
  const all = await getCollection('places');
  return all
    .map((p) => p.data)
    .filter((p) => groups.includes(p.group))
    .sort((a, b) => (placeOrder.get(a.id) ?? 0) - (placeOrder.get(b.id) ?? 0));
}
