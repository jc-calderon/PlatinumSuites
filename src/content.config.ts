/**
 * Colecciones de contenido (Astro Content Layer).
 * Cada archivo se valida con estos esquemas: si falta un dato obligatorio o tiene
 * un formato incorrecto, `npm run dev` / `npm run build` muestran el archivo y el campo.
 */
import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defaultLocale, localeList, suiteIds } from './i18n/config';

const localeEnum = z.enum(localeList as [string, ...string[]]);
const suiteEnum = z.enum(suiteIds);

/** Texto traducible: `{ es: '...', en: '...' }`. El idioma predeterminado es obligatorio. */
const localized = z
  .record(z.string(), z.string())
  .refine((value) => typeof value[defaultLocale] === 'string' && value[defaultLocale].length > 0, {
    message: `Falta el texto en el idioma predeterminado ("${defaultLocale}").`,
  });

/** Estado de la traducción, para no presentar como revisado lo que no lo está. */
const translation = z.enum(['original', 'unreviewed', 'reviewed']).default('original');

/* ------------------------------------------------------------------ */
/* Guías: src/content/guides/<idioma>/<common|tunari|concordia>.md     */
/* ------------------------------------------------------------------ */
const guides = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/guides' }),
  schema: ({ image }) =>
    z.discriminatedUnion('kind', [
      // Contenido común a ambas suites (un archivo por idioma).
      z.object({
        kind: z.literal('common'),
        lang: localeEnum,
        title: z.string(),
        description: z.string(),
        translation,
      }),
      // Contenido específico de una suite.
      z.object({
        kind: z.literal('suite'),
        lang: localeEnum,
        suite: suiteEnum,
        /** Nombre comercial confirmado. No se traduce. */
        name: z.string(),
        title: z.string(),
        tagline: z.string(),
        description: z.string(),
        floor: z.number().int().positive(),
        capacity: z.number().int().positive(),
        capacityNote: z.string().optional(),
        size: z.string().optional(),
        parking: z.object({
          spot: z.number().int().positive(),
          position: z.string(),
        }),
        /** Reconocimientos del anuncio de Airbnb (opcional), uno por línea. Se muestran en la tarjeta de Airbnb. */
        airbnbHighlights: z.array(z.string()).optional(),
        /** Portada opcional. Si se omite, se usa la primera foto de images/<suite>/portada/. */
        cover: image().optional(),
        coverAlt: z.string().optional(),
        translation,
      }),
    ]),
});

/* ------------------------------------------------------------------ */
/* Lugares: src/content/places/places.yaml                            */
/* ------------------------------------------------------------------ */
const categories = [
  'supermarket',
  'pharmacy',
  'food',
  'bakery',
  'typical',
  'landmark',
  'nature',
  'museum',
  'market',
  'walk',
] as const;

const places = defineCollection({
  loader: file('src/content/places/places.yaml'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    /** nearby = cerca (tarjetas bajo el mapa) · eat = recomendados · city / trip = qué visitar */
    group: z.enum(['nearby', 'eat', 'city', 'trip']),
    categories: z.array(z.enum(categories)).min(1),
    recommended: z.boolean().default(false),
    /** Plato recomendado (opcional). */
    order: localized.optional(),
    area: z.string().optional(),
    description: localized,
    maps: z.url(),
    /** exact = enlace del propietario · search = búsqueda provisional por nombre */
    mapsType: z.enum(['exact', 'search']),
    coords: z.tuple([z.number(), z.number()]).optional(),
  }),
});

/* ------------------------------------------------------------------ */
/* Datos generales: src/content/settings/site.yaml                    */
/* ------------------------------------------------------------------ */
const phone = z.string().regex(/^\+\d{8,15}$/, 'Use formato internacional, por ejemplo +59165754543.');

const settings = defineCollection({
  loader: file('src/content/settings/site.yaml'),
  schema: z.object({
    brand: z.string(),
    building: z.object({
      name: z.string(),
      area: z.string(),
      maps: z.url(),
    }),
    stay: z.object({
      checkin: localized,
      checkout: localized,
    }),
    hosts: z.object({
      names: z.string(),
      phone,
      display: z.string(),
    }),
    airbnb: z.object({
      /** Insignia de la anfitriona (opcional). */
      superhost: localized.optional(),
      home: z.url(),
      /** Un enlace por suite: si se añade una suite en i18n/config.ts, el build exige su enlace aquí. */
      suites: z.record(suiteEnum, z.url()),
    }),
    wifi: z.object({
      ssid: z.string(),
      password: z.string(),
    }),
    emergency: z.array(
      z.object({
        label: localized,
        number: z.string(),
      }),
    ),
    map: z.object({
      embed: z.url(),
      viewer: z.url(),
    }),
  }),
});

export const collections = { guides, places, settings };
