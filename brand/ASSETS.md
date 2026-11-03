# Origen de los recursos

## Identidad oficial

Carpeta facilitada por el usuario: https://drive.google.com/drive/folders/1qErGt10OvEl_Fsk3S_OIn-IXGMTzJzT9

- `source/novara-manual.pdf`: manual de marca original. Diseño, planificación y construcción, paleta y sistema tipográfico.
- `source/membrete.docx`: dirección, correo y teléfono comercial. Datos leídos visualmente de la imagen del membrete.
- `source/logo-white.png`, `source/logo-green.png`, `source/icon-1.png`: originales descargados de la subcarpeta `png`. Las versiones en `public/brand` conservan el diseño; se optimizó su formato y se retiró el margen transparente para dimensionarlas con CSS.
- `source/el-pacre-personal-use.regular.otf`: archivo original de la carpeta `fuentes`. La licencia comercial no está acreditada en los materiales revisados; confirmar antes de publicar. Copia de desarrollo en `public/fonts/el-pacre.otf`.
- `public/fonts/poppins-regular.ttf` y `poppins-semibold.ttf`: copias locales de Poppins, fuente secundaria indicada por el manual. Licencia SIL OFL en `public/fonts/OFL-Poppins.txt`.
- `public/images/architecture-perspective.webp` y `architecture-detail.webp`: referencias fotográficas extraídas de la página 10 del manual. No acreditadas como obras de Novara; la galería las identifica como referencias de marca. La segunda queda disponible como recurso y no se utiliza en la página principal.

Colores: carbón `#1e221a`, ébano `#4a4e3b`, oliva `#878261`, terracota `#b44a17`. El fondo marfil `#f5f3ec` complementa la paleta como superficie neutra. Para ébano se tomó el valor hexadecimal del manual, cuya línea RGB difiere.

## Visualizaciones generadas

Herramienta: `image_gen.imagegen`, modo integrado. Generadas el 16 de septiembre de 2026. Son conceptos para la propuesta web; no imágenes de proyectos reales. Los originales se conservan en el directorio de imágenes generadas de Codex y las versiones consumidas por la web están dentro de este proyecto.

### Portada

Archivo final: `public/images/architecture-concept.webp`.

Prompt:

> Use case: photorealistic-natural. Asset type: wide architectural hero photograph for NOVARA Grupo Constructor's premium website, a conceptual visualization, not a real completed project. Primary request: an exceptional editorial architectural photograph of a sophisticated modern tropical residence, built in warm pale limestone and exposed concrete, long horizontal cantilevered volumes, warm timber screens, expansive glass, soft interior lights, tall indigenous greenery and sculptural plants, landscaped sloping terrain with an understated courtyard. Composition: panoramic 16:9, view from garden level looking slightly upward; building dominates right two-thirds with architectural lines running across frame; left third has quieter dark olive vegetation suitable for website headline overlay. Lighting: elegant late-afternoon sunlight, soft hazy blue sky, tactile stone, natural shadows, understated sophisticated art direction. Palette: warm cream, charcoal, olive, natural wood with subtle terracotta accents. Professional architectural photography, realistic buildable architecture, 35mm lens, subtle grain, no HDR. No text, no logos, no watermark, no people, no collage, no white borders. Save generated image as a local asset and return its path.

### Interior

Archivo final: `public/images/interior-concept.webp`.

Prompt:

> Use case: photorealistic-natural. Asset type: architectural interior concept photograph for premium Colombian construction company NOVARA, editorial website image. Primary request: a serene double-height contemporary living room looking out to a lush green Andean garden through huge sliding glass panes, warm ivory travertine flooring and walls, dark walnut floor-to-ceiling cabinetry, low sculptural cream linen sofa, one warm terracotta armchair, organic stone coffee table, dramatic sunlight creating architectural shadows, understated olive accents. Composition: landscape 4:3, impeccable geometry, quiet lived-in elegance, refined spaciousness, eye-level 28mm professional architectural photography. Materials detailed and tactile, natural light, restrained film grain. No people, text, logos, watermarks, collage, exaggerated curves or impossible architecture.

## Imagen para compartir

`src/app/opengraph-image.tsx` compone la vista social mediante código con el logo oficial y la imagen conceptual. Los archivos `brand/og-architecture.jpg` y `brand/og-logo.png` son variantes de formato compatibles con el renderizador de Next.js.


## Segunda versión: exploración interactiva

Se añadieron tres imágenes con `image_gen.imagegen`, modo integrado. Continúan identificadas como visualizaciones conceptuales.

### Residencia al anochecer

Archivo final: `public/images/twilight-concept.webp`.

Prompt:

> Use case: photorealistic-natural. Asset type: panoramic architectural website hero for NOVARA, Colombian construction brand, conceptual inspiration. Ultra-refined editorial photograph of a contemporary courtyard home in an Andean landscape at blue hour. Wide horizontal volumes of creamy travertine, warm timber louvers, expansive glass glowing softly amber from inside. A linear dark reflecting pool in the foreground, an elegant olive tree in a planted courtyard, stone stepping slabs, Andean hills behind. A second-floor block cantilevered on the right, serene sophisticated architectural composition with space in left half for a large headline. Rich navy-teal twilight sky, warm terracotta accents, muted olive greenery. Cinematic yet believable professional architectural photography, tactile natural materials, fine film grain, no oversaturated HDR. Landscape 16:9. No people, no text, no logos, no watermark. This is a conceptual visualization, not an actual Novara project.

### Patio de luz

Archivo final: `public/images/courtyard-concept.webp`.

Prompt:

> Use case: photorealistic-natural. Asset type: luxury architectural editorial website image for NOVARA Grupo Constructor, conceptual inspiration. A cinematic vertical-looking perspective in a landscape 4:3 photograph of an extraordinary contemporary courtyard: tall textured pale travertine walls, elegant floating straight stone staircase ascending on the right, a single sculptural mature olive tree planted in a circular gravel garden, dark bronze narrow window frame, warm timber accent on left, a large rectangle of open blue sky above, warm sun slicing diagonally down the wall creating a graphic shadow. Quiet, poetic, minimal yet tactile and rich. Colombian Andean contemporary architecture, professional 28mm architectural photograph, precise geometry, editorial realism. Warm ivory, soft sand, deep olive and charcoal palette. No people, no text, no logos, no watermarks. No arches. This is a conceptual visualization, not an actual Novara project.

### Terrazas urbanas

Archivo final: `public/images/urban-concept.webp`.

Prompt:

> Use case: photorealistic-natural. Asset type: panoramic architecture website visual for NOVARA Grupo Constructor. Editorial architectural photograph of an elegant contemporary six-storey residential building in a green Colombian Andean city, viewed from a quiet landscaped pedestrian approach at golden hour. Sculptural offset terraces, natural pale limestone facades, charcoal slender window frames, warm wood soffits, planted balconies with restrained olive greenery. Strong rhythmic facade and deep warm shadows, lush native landscaping in foreground, layered low blue-green mountains in distance. Sophisticated understated premium developer aesthetics, buildable structure, real physical details, professional architectural tilt-shift photography, no surreal forms. Wide landscape 16:9. Building on right two-thirds, calmer landscaped negative space left. No visible people, no text, no logos, no watermark. Conceptual visualization only, not an actual Novara completed project.

### Maqueta 3D

Modelo conceptual original, creado con geometría de Three.js en `src/components/architecture-scene.ts`. No usa modelos descargados ni texturas externas. Contiene una casa de dos niveles, terraza, piscina, celosías, mobiliario y vegetación. Los acabados y la separación de niveles son una exploración visual; no representan especificaciones constructivas ni un proyecto ejecutado.

Capturas previas conservadas en `artifacts/version-1/`. Capturas actuales de la maqueta en `artifacts/novara-3d.png`, `artifacts/novara-3d-exploded.png` y `artifacts/novara-3d-mobile.png`.
