# Platinum Suites · Guía digital para huéspedes

Guía de bienvenida digital, mobile-first y bilingüe (español / inglés) para **Suite Tunari** y **Suite Concordia** de Platinum Suites Cochabamba (Edificio Fontana Di Fiori, Cala Cala).

Es un sitio **100 % estático** hecho con [Astro](https://astro.build): no tiene backend, base de datos, cuentas ni servicios de pago. Todo el contenido se edita en archivos Markdown/YAML y en carpetas de fotos.

---

## 1. Requisitos

- **Windows, macOS o Linux**
- **Node.js 22.22 o superior** (recomendado: la versión LTS de <https://nodejs.org>). npm se instala junto con Node.

## 2. Iniciar la guía

### Opción fácil (Windows): doble clic en `start.bat`

El script:

1. comprueba que Node.js y npm estén instalados (si no, indica dónde descargarlos);
2. instala las dependencias **solo la primera vez** o cuando cambia `package.json`;
3. inicia el servidor de desarrollo y **abre el navegador** en <http://localhost:4321>.

Para detenerlo, cierre la ventana o pulse `Ctrl+C`.

### Opción manual (cualquier sistema)

```bash
npm install        # solo la primera vez
npm run dev        # servidor de desarrollo → http://localhost:4321
```

| Comando           | Qué hace                                                        |
| ----------------- | --------------------------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con recarga automática                   |
| `npm start`       | Igual que `dev`, pero abre el navegador                         |
| `npm run build`   | Genera el sitio estático en `dist/` (valida todo el contenido)  |
| `npm run preview` | Sirve `dist/` localmente para revisarlo como en producción     |
| `npm run check`   | Revisión de tipos de TypeScript/Astro                           |

## 3. Rutas

| Ruta                       | Contenido                         |
| -------------------------- | --------------------------------- |
| `/`                        | Portada en español (elegir suite) |
| `/departamentos/tunari`    | Guía de Suite Tunari (español)    |
| `/departamentos/concordia` | Guía de Suite Concordia (español) |
| `/en/`                     | Portada en inglés                 |
| `/en/suites/tunari`        | Suite Tunari (inglés)             |
| `/en/suites/concordia`     | Suite Concordia (inglés)          |

Los enlaces directos funcionan al abrirlos en una pestaña nueva (por ejemplo, desde un código QR en cada suite). Cualquier otra ruta muestra una página 404 bilingüe.

## 4. Estructura del proyecto

```
start.bat                         Inicio con doble clic (Windows)
deploy.bat                        Publicar: copia al repositorio público y sube a GitHub (sección 8)
astro.config.mjs                  Configuración de Astro (site y base para GitHub Pages)
.github/workflows/deploy.yml      Valida en cada push; publica en GitHub Pages (solo en el repo público)
docs/                             SOLO en el repositorio privado: no se copia al público
  FUENTES.md                      Procedencia de cada dato, discrepancias y pendientes
  source/                         Fuentes originales (guía impresa, Word, QR, lugares.md)
src/
  content.config.ts               Esquemas que validan todo el contenido
  content/
    guides/
      es/common.md                Contenido COMÚN a ambas suites (español)
      es/tunari.md                Solo lo específico de Suite Tunari (español)
      es/concordia.md             Solo lo específico de Suite Concordia (español)
      en/…                        Lo mismo en inglés
    settings/site.yaml            Datos generales: Wi-Fi, horarios, contacto, emergencias, mapa
    places/places.yaml            Lugares recomendados (alrededores, dónde comer, qué visitar)
    images/                       Fotos por carpetas (ver sección 6)
  i18n/
    config.ts                     Idiomas admitidos y segmentos de URL (lugar central)
    ui/es.ts, ui/en.ts            Textos de la interfaz (botones, etiquetas…)
  components/                     Componentes Astro (plantilla única de guía, widgets)
  lib/                            Utilidades (imágenes, contenido, iconos, plugin Markdown)
  pages/[...route].astro          Genera todas las rutas en el build
  pages/404.astro                 Página no encontrada
  styles/global.css               Diseño (paleta, tipografía, componentes)
```

## 5. Editar el contenido

> En desarrollo (`npm run dev` / `start.bat`), al **guardar** cualquier archivo de contenido o foto, el navegador se actualiza solo en uno o dos segundos. **No hace falta ejecutar un build.**
>
> Una web ya **publicada** es estática: para que reciba los cambios hay que volver a publicarla con `deploy.bat` (sección 8).

### ¿Qué va en cada archivo?

| Archivo                             | Contenido                                                                                                                                                       |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `guides/<idioma>/common.md`         | Todo lo que es **igual** en ambas suites: bienvenida, llegada y salida, estacionamiento, Wi-Fi, TV, cocina, piscina, reglas, basura, antes de irse, alrededores, contacto, Airbnb. **Se edita una vez y cambia en las dos guías.** |
| `guides/<idioma>/tunari.md`         | Solo lo de Suite Tunari: nombre, lema, descripción, piso, capacidad, espacio de parqueo y distribución (habitaciones, camas, TV, baños).                       |
| `guides/<idioma>/concordia.md`      | Lo mismo para Suite Concordia.                                                                                                                                  |
| `settings/site.yaml`                | Wi-Fi (red y contraseña), horarios de ingreso y salida, anfitriones y WhatsApp, enlaces de Airbnb (`airbnb.home` y uno por suite en `airbnb.suites`), números de emergencia, enlace del edificio y mapa de My Maps.                   |
| `places/places.yaml`                | Lugares: cerca del edificio, recomendados del anfitrión y qué visitar. **El orden del archivo es el orden en pantalla.**                                        |

### Datos de cada suite (encabezado del archivo)

```yaml
---
kind: suite
lang: es
suite: tunari            # identificador estable: tunari | concordia
name: Suite Tunari       # nombre comercial (no se traduce)
title: Guía de Suite Tunari
tagline: Espacio de ensueño y lujo
description: Texto para buscadores y vista previa
floor: 13                # número
capacity: 4              # número
capacityNote: " (el tercer huésped duerme en el sofá cama)"   # opcional
size: "≈ 90 m²"          # opcional
parking:
  spot: 17               # número
  position: al costado de la rampa
airbnbHighlights:       # opcional: reconocimientos del anuncio de Airbnb, uno por línea
  - Favorito entre huéspedes
translation: original    # original | unreviewed | reviewed
---
```

Si un dato falta o tiene el formato equivocado (por ejemplo `floor: trece`), la ventana del servidor muestra el archivo y el campo exacto, y `npm run build` se detiene sin generar un sitio roto.

### Convenciones del Markdown

| Escriba                                    | Resultado                                                                      |
| ------------------------------------------ | ------------------------------------------------------------------------------ |
| `## Título {#id}`                          | Una sección del índice. El `{#id}` es estable: **no lo traduzca ni lo cambie**. |
| `### Título`                               | Subtítulo dentro de la sección                                                 |
| `### Título {+}`                           | Acordeón desplegable (hasta el siguiente `###`, `##` o `---`)                  |
| `> [!AVISO]` + texto en líneas con `>`     | Caja de advertencia (también `[!WARNING]`)                                     |
| `> [!IMPORTANTE]`                          | Caja destacada (también `[!IMPORTANT]`)                                        |
| `> [!NOTA]`                                | Caja informativa (también `[!NOTE]`)                                           |
| `> [!CONSEJO]`                             | Consejo (también `[!TIP]`)                                                     |
| `**negrita**`, `*cursiva*`, listas, enlaces | Formato normal de Markdown                                                     |
| `![texto](../../images/common/foto.jpg)`   | Imagen local (optimizada automáticamente)                                      |

Los `id` de sección que usan la navegación inferior y los iconos son: `bienvenida`, `suite`, `llegada`, `estacionamiento`, `wifi`, `tv`, `cocina`, `piscina`, `reglas`, `basura`, `antes-de-irse`, `alrededores`, `contacto`, `airbnb`. Puede añadir secciones nuevas con cualquier `{#id}`: aparecen solas en el índice, con un icono genérico.

**Seguridad:** el Markdown solo controla texto y formato. Se eliminan automáticamente `<script>`, `<iframe>`, `<style>`, formularios, atributos `on…` y enlaces `javascript:`.

### Tokens `{{…}}`

En `common.md` puede insertar datos de la suite o bloques especiales.

**Datos** (dentro de una frase): `{{name}}`, `{{tagline}}`, `{{floor}}`, `{{capacity}}`, `{{capacityNote}}`, `{{size}}`, `{{parking.spot}}`, `{{parking.position}}`, `{{checkin}}`, `{{checkout}}`, `{{wifi.ssid}}`, `{{building}}`, `{{hosts}}`.

Ejemplo: `Su espacio es el **Nº {{parking.spot}}**` → «Su espacio es el **Nº 17**» en Tunari y «**Nº 10**» en Concordia.

**Bloques** (en un párrafo propio):

| Token              | Bloque                                                         |
| ------------------ | -------------------------------------------------------------- |
| `{{suite}}`        | El texto del archivo de la suite (`tunari.md` / `concordia.md`) |
| `{{suite-<id>}}`   | Sección `## Título {#id}` escrita en el archivo de la suite (hoy: `{{suite-tv}}`). Cada suite la define; `common.md` solo marca dónde va |
| `{{gallery}}`      | Galería de la suite (carpeta `images/<suite>/galeria/`)         |
| `{{gallery-pool}}` | Galería de la piscina (`images/common/piscina/`)               |
| `{{wifi}}`         | Tarjeta Wi-Fi con botones de copiar y QR                       |
| `{{map}}`          | Mapa de My Maps + tarjetas de lugares cercanos                 |
| `{{places-eat}}`   | Recomendados del anfitrión                                     |
| `{{places-visit}}` | Qué visitar (en la ciudad y escapadas)                         |
| `{{contacts}}`     | Tarjeta de anfitriones con WhatsApp y llamada                  |
| `{{airbnb}}`       | Tarjeta de Airbnb: enlace al anuncio de la suite, a todos los alojamientos y reconocimientos. La portada muestra la insignia de Superanfitriona y «todos los alojamientos» |
| `{{emergency}}`    | Números de emergencia (tocar para llamar)                      |
| `{{directions}}`   | Enlace «Cómo llegar» al edificio (puede ir dentro de una frase) |

Un token mal escrito detiene el servidor o el build con un mensaje que lista los tokens válidos.

### Lugares y mapa

- Edite `src/content/places/places.yaml`. Cada lugar tiene `name`, `group` (`nearby`, `eat`, `city`, `trip`), `categories`, `description` en `es` y `en`, el enlace `maps` y `mapsType` (`exact` o `search`).
- Para obtener un enlace exacto: en Google Maps, **Compartir → Copiar enlace**.
- Los **pines del mapa** se editan en **Google My Maps** («Platinum Suites - Alrededores»): los cambios se ven al instante, sin reconstruir el sitio. Para usar otro mapa, cambie el `mid=` en `map.embed` y `map.viewer` de `site.yaml`.

## 6. Fotografías (sin tocar código)

```
src/content/images/
  common/portada/      Foto de portada de la página de inicio (se usa la primera)
  common/piscina/      Galería de la sección Piscina
  common/wifi/         Código QR del Wi-Fi
  tunari/portada/      Foto principal de Suite Tunari (se usa la primera)
  tunari/galeria/      Galería de Suite Tunari
  concordia/portada/   Foto principal de Suite Concordia
  concordia/galeria/   Galería de Suite Concordia
```

- **Cambiar una foto:** reemplace el archivo por otro con **el mismo nombre**.
- **Añadir fotos a una galería:** copie archivos en la carpeta. Se ordenan por nombre, así que use prefijos: `01-sala.jpg`, `02-cocina.jpg`, `03-dormitorio.jpg`…
- **Quitar una foto:** bórrela de la carpeta.
- **Cambiar la portada de una suite:** deje en `<suite>/portada/` la foto que quiera (si hay varias, se usa la primera por nombre).
- El **nombre del archivo** se usa como descripción accesible: `02-sala-de-estar.jpg` → «Sala de estar».
- Formatos: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`. Use fotos horizontales de al menos 1600 px de ancho; Astro genera versiones optimizadas (AVIF/WebP) para cada pantalla.
- Si una carpeta está vacía, se muestra una composición tipográfica elegante en lugar de la foto.

> Las fotos actuales de Concordia y de la piscina son **provisionales**: están recortadas de la guía impresa y tienen baja resolución. Suite Tunari todavía no tiene fotos. Sustitúyalas por las originales cuando las tenga.

## 7. Traducciones (i18n)

- **Idiomas admitidos:** se declaran solo en `src/i18n/config.ts` (español predeterminado).
- **Textos de interfaz** (botones, etiquetas): `src/i18n/ui/es.ts` y `en.ts`. TypeScript avisa si falta una clave.
- **Contenido editorial:** `src/content/guides/<idioma>/`.
- **Datos traducibles** de los YAML: claves `es:` / `en:`.
- Los nombres propios («Suite Tunari», «Suite Concordia», nombres de lugares, direcciones) no se traducen.
- El selector de idioma conserva la suite actual.

**Política de fallback:** si falta un archivo en un idioma (por ejemplo `en/concordia.md`), la página se genera igual con el texto del idioma predeterminado, marcado con `lang="es-BO"` y con un aviso visible. Si falta un texto de interfaz o un campo traducible, se usa el español. Nunca se muestra una página vacía.

**Estado de la traducción:** el campo `translation` (`original`, `unreviewed`, `reviewed`) controla el aviso «Traducción pendiente de revisión». **Las versiones en inglés están marcadas como `unreviewed`**: cámbielas a `reviewed` cuando las haya revisado.

**Añadir un idioma (por ejemplo, portugués):**

1. Añada `pt` en `src/i18n/config.ts` (etiqueta, prefijo de URL `pt` y segmento, por ejemplo `suites`).
2. Cree `src/i18n/ui/pt.ts` (copie `en.ts`) y regístrelo en `src/i18n/index.ts`.
3. Cree `src/content/guides/pt/common.md`, `tunari.md` y `concordia.md` (sin cambiar los `{#id}` ni los `{{tokens}}`).
4. Opcional: añada `pt:` a los textos de `places.yaml` y `site.yaml`.

Las rutas `/pt/…` se generan solas; no hay que tocar páginas ni componentes.

## 8. Publicar en GitHub Pages

El proyecto vive en **dos repositorios** de GitHub, uno al lado del otro en el disco:

| Carpeta / repositorio                                  | Visibilidad | Para qué                                                                                                   |
| ------------------------------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------- |
| `PlatinumSuites-dev` (este)                            | **Privado** | Donde se trabaja. Contiene todo, incluida `docs/` con las fuentes originales.                               |
| `PlatinumSuites` (carpeta vecina `..\PlatinumSuites`) | **Público** | Copia sin `docs/` ni archivos de desarrollo. Es el que GitHub Pages publica. **No se edita a mano.**        |

En cuentas gratuitas GitHub Pages solo publica desde repositorios públicos, y un repositorio público deja ver todo su contenido; por eso las fuentes se quedan en el privado y al público solo va lo necesario para generar el sitio.

### Publicar: doble clic en `deploy.bat`

El script, desde este repositorio:

1. ejecuta `npm run build` aquí para **validar el contenido**; si hay un error, lo muestra y **no publica nada**;
2. copia el proyecto a `..\PlatinumSuites` como espejo (lo que se borró aquí se borra allí), **excluyendo** `docs/`, `CLAUDE.md`, el propio `deploy.bat`, `node_modules/`, `dist/`, `.astro/` y `.git/`;
3. hace `git commit` en el repositorio público (el mensaje indica desde qué commit de `-dev` se publicó) y `git push` a `main`;
4. GitHub Actions genera y publica el sitio en unos dos minutos. El progreso se ve en <https://github.com/jc-calderon/PlatinumSuites/actions>.

Opciones: `deploy.bat /local` hace la copia y el commit pero no sube nada (para revisar antes); cualquier otro texto se usa como mensaje del commit, por ejemplo `deploy.bat "Nuevas fotos de Tunari"`.

Si la carpeta `..\PlatinumSuites` no existe o no es un repositorio Git, el script la crea y la enlaza con `git@github.com:jc-calderon/PlatinumSuites.git`. Las listas de exclusión (`EXCLUIR_CARPETAS`, `EXCLUIR_ARCHIVOS`) y el usuario/repositorio están al principio de `deploy.bat`: **si añade al proyecto algo que no deba ser público, añádalo ahí.**

### Configuración inicial (una sola vez)

1. En GitHub, en el repositorio de trabajo: **Settings → General → Repository name** → `PlatinumSuites-dev`, y en **Danger Zone → Change visibility** → **Private**. (Este repositorio local ya apunta a `git@github.com:jc-calderon/PlatinumSuites-dev.git`.)
2. Cree un repositorio nuevo **público** llamado `PlatinumSuites`, **vacío** (sin README, `.gitignore` ni licencia).
3. Ejecute `deploy.bat`: hará el primer push.
4. En el repositorio público: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Si el primer workflow corrió antes de este paso, vuelva a lanzarlo desde **Actions → Build and deploy → Run workflow**.

La dirección será `https://<usuario>.github.io/<repositorio>/`, es decir, `https://jc-calderon.github.io/PlatinumSuites/`. Los enlaces internos y las fotos ya tienen en cuenta ese prefijo: el workflow define las variables `SITE` y `BASE_PATH` que lee `astro.config.mjs`.

El mismo workflow (`.github/workflows/deploy.yml`) existe en los dos repositorios: en el privado solo valida (`npm run check` y `npm run build`) cada push a `main`; en el público, además, publica. Lo decide solo según la visibilidad del repositorio.

**Dominio propio:** si más adelante se usa un dominio (por ejemplo, `guia.platinumsuites.bo`), cambie en el workflow `SITE` por `https://guia.platinumsuites.bo` y `BASE_PATH` por `/`, y configure el dominio en **Settings → Pages** del repositorio público.

**Revisión local antes de publicar:**

```bash
npm run build      # genera dist/ (en local, con rutas desde la raíz /)
npm run preview    # revisión local en http://localhost:4321
```

> Un sitio publicado en GitHub Pages es **público** (ver sección 9), y el repositorio `PlatinumSuites` también: todo lo que `deploy.bat` copia puede verse en GitHub. `docs/` y las fuentes originales nunca se copian.

## 9. Privacidad

- Un sitio estático publicado es **público**: cualquiera con el enlace puede verlo. Esta guía **no es privada** ni está protegida con contraseña. Las páginas incluyen `noindex` para que los buscadores no las muestren, pero eso no impide el acceso.
- La red y la contraseña del Wi-Fi para huéspedes, y su QR, se publican **por decisión del propietario**.
- El **código de la cerradura no se publica**: se envía a cada huésped antes de su llegada.
- La red Wi-Fi antigua que aparece en `docs/source/Rules.docx` está obsoleta y no se copió al sitio.
- `docs/` no forma parte del sitio publicado ni se copia al repositorio público: solo existe en `PlatinumSuites-dev` (privado).

## 10. Decisiones técnicas

- **Astro 7 + TypeScript**, contenido con **Content Collections** (`glob` y `file` loaders) validado con Zod.
- **Markdown con el procesador `unified`** (`@astrojs/markdown-remark`) y un plugin propio sin dependencias (`src/lib/rehype-guide.mjs`) para secciones, acordeones, avisos y limpieza de seguridad. Astro 7 usa Sätteri por defecto; se eligió `unified` porque admite plugins rehype.
- **Sin React:** ningún control lo necesitaba. Copiar, la galería, el índice móvil y el resaltado de secciones son scripts nativos de unos pocos KB; los acordeones son `<details>` y el mapa es un `<iframe>`. Así se ahorran unos 45 KB de JavaScript en móviles.
- **Iconos:** Lucide (`lucide-static`), insertados como SVG durante el build, sin JavaScript en el cliente.
- **Tipografías locales:** Cormorant Garamond (títulos) y Jost (texto) vía Fontsource, sin depender de Google Fonts.

## 11. Problemas frecuentes

| Problema                                     | Solución                                                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `start.bat` dice que falta Node.js           | Instale Node.js LTS desde <https://nodejs.org> y vuelva a abrir `start.bat`.                     |
| El navegador no muestra un cambio            | Mire la ventana del servidor: si hay un error de formato, indica el archivo y el campo.          |
| El puerto 4321 está ocupado                  | Astro usa el siguiente libre (4322…) y lo muestra en la ventana.                                 |
| Una foto nueva no aparece                    | Revise que esté en la carpeta correcta y que la extensión sea .jpg, .png, .webp o .avif.         |
| El mapa no carga                             | Compruebe que el mapa de My Maps siga siendo público («Cualquier persona con el vínculo»).      |
| El sitio publicado muestra 404 o sin estilos  | En **Settings → Pages** del repositorio público, la fuente debe ser **GitHub Actions**. Revise su pestaña **Actions** por si el build falló. |
| `deploy.bat` se detiene en «Validando el contenido» | Hay un error en un archivo de contenido: el mensaje indica cuál y qué corregir. Corríjalo y vuelva a ejecutar `deploy.bat`. |
| En **Actions** falla «pages build and deployment» con un error de Jekyll o «Invalid YAML front matter» | La fuente de Pages está en «Deploy from a branch»: cámbiela a **GitHub Actions** (sección 8). Compruebe además que el repositorio público esté en la rama `main`: el workflow no se ejecuta en `master`. `deploy.bat` renombra la rama local si hace falta; en GitHub cámbiela en **Settings → Branches**. |
| `deploy.bat` no puede hacer el `push`      | El repositorio público debe existir en GitHub (vacío la primera vez) y la clave SSH estar configurada (`ssh -T git@github.com`). Al reintentar no se duplica nada. |
