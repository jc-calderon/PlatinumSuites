/**
 * Imágenes gestionadas por carpetas (sin tocar código).
 *
 *   src/content/images/common/portada/     portada de la página de inicio
 *   src/content/images/common/piscina/     galería de la piscina
 *   src/content/images/common/wifi/        código QR del Wi-Fi
 *   src/content/images/<suite>/portada/    portada de la suite (se usa la primera)
 *   src/content/images/<suite>/galeria/    galería de la suite
 *
 * Las fotos se ordenan por nombre de archivo (01-sala.jpg, 02-cocina.jpg…).
 * Al copiar, borrar o reemplazar un archivo, el servidor de desarrollo recarga la página.
 */
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/images/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);

const ROOT = '/src/content/images/';

export interface FolderImage {
  src: ImageMetadata;
  /** Nombre del archivo sin extensión. */
  name: string;
  /** Texto descriptivo derivado del nombre: "02-sala-de-estar.jpg" → "Sala de estar". */
  label: string;
}

function labelFrom(name: string): string {
  const words = name.replace(/^\d+[-_ ]*/, '').replace(/[-_]+/g, ' ').trim();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : '';
}

/** Imágenes directamente dentro de una carpeta (sin subcarpetas), ordenadas por nombre. */
export function imagesIn(folder: string): FolderImage[] {
  const prefix = `${ROOT}${folder.replace(/^\/|\/$/g, '')}/`;
  return Object.entries(files)
    .filter(([path]) => path.startsWith(prefix) && !path.slice(prefix.length).includes('/'))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([path, mod]) => {
      const name = path.slice(prefix.length).replace(/\.[^.]+$/, '');
      return { src: mod.default, name, label: labelFrom(name) };
    });
}

/** Primera imagen de una carpeta, o `undefined` si está vacía (se mostrará un placeholder). */
export function firstImage(folder: string): FolderImage | undefined {
  return imagesIn(folder)[0];
}
