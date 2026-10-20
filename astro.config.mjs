// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeGuide from './src/lib/rehype-guide.mjs';

/**
 * Despliegue en GitHub Pages: el workflow (.github/workflows/deploy.yml) define
 * SITE y BASE_PATH según el repositorio (https://<usuario>.github.io/<repo>/).
 * En local no hace falta definirlos: el sitio se sirve en la raíz (/).
 * Con dominio propio, deje BASE_PATH en "/" y ponga SITE en https://su-dominio.
 */
const site = process.env.SITE || 'http://localhost:4321';
const base = process.env.BASE_PATH || '/';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site,
  base,
  // Sitio 100 % estático: `npm run build` genera la carpeta `dist/`.
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  markdown: {
    // Procesador unified (remark/rehype) con el plugin de la guía:
    // secciones {#id}, acordeones {+} y avisos > [!AVISO] (ver README).
    processor: unified({ rehypePlugins: [rehypeGuide] }),
  },
  server: { port: 4321, host: false },
  devToolbar: { enabled: false },
});
