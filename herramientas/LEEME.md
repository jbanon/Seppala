# Herramientas de autoría (herramientas/)

Las páginas de `web/` son HTML completo y son la fuente de verdad: no hay compilación. Todo se ejecuta con el
Python del proyecto: `.venv/bin/python herramientas/<script>.py`.

| Herramienta | Qué hace | Cuándo ejecutarla |
|---|---|---|
| `comunes.py` | Copia `comunes/cabecera.html` y `comunes/pie.html` a todas las páginas (entre `<!-- cabecera -->` y `<!-- pie -->`) y marca la entrada activa del menú. Ignora `web/area-clientes/` y `web/gestion/` (su marco lo pintan `portal.js` y `gestion.js`) | Tras tocar el menú o el pie, o al crear una página |
| `imagenes.py` | Genera `web/img/` (WebP a 640/1024/1600, renders cuadrados, logos de marcas, logo y emblema de Seppala, favicon, imagen Open Graph) desde `recursos/` | Si cambian las imágenes de origen o la lista `FOTOS`/`RENDERS`/`LOGOS` |
| `video.py` | Comprime los vídeos de `recursos/video/` a `web/video/` (720p H.264) y genera sus pósters. Necesita `imageio-ffmpeg` en `.venv` | Si cambian los vídeos |
| `portadas.py` | Portadas WebP de los PDF de `web/docs/` en `web/img/docs/` (necesita `pdftoppm`) | Si cambia algún PDF |
| `enlaces.py` | Comprobación estática: enlaces y anclas rotos, recursos, `alt`, `width/height`, un h1, title/description/canonical | Antes de cada commit de páginas |
| `movil.py` | Auditoría de móvil en 360/390/414 y horizontal: scroll horizontal, zonas táctiles < 44 px, campos < 16 px, texto < 12 px, elementos fijos que tapan enlaces. `--motor webkit` (requiere `sudo .venv/bin/playwright install-deps webkit`), `--capturas` | Antes de cada commit de páginas |
| `capturas.py` | Capturas a 390 y 1440 px en `referencia/capturas/` (no versionadas) con aviso de errores de consola y recursos que fallan | Para revisar visualmente |
| `publicar.sh` | `rsync` de `web/` a la carpeta local de pruebas (`/var/www/aluminioseppala-pruebas` por defecto). El subdominio público de pruebas está pendiente de confirmar | Al terminar un bloque de trabajo |
| `importar_antigua.py` | Copia las imágenes del espejo `antigua/` a `recursos/` con nombres descriptivos | Solo si se vuelve a descargar la web antigua |
| `extraer_textos.py` | Extrae el texto de cada página del espejo a `recursos/textos/*.md` | Ídem |
| `datos_demo.py`, `pdf_demo.py` | Datos ficticios y PDF de muestra de la demo del área de clientes | Si cambia la demo |
| `datos_gestion.py` | Datos ficticios de la demo del panel de gestión interna (`web/gestion/datos/`) | Si cambia esa demo |

Servidor local para revisar: `python3 -m http.server 8080 --bind 0.0.0.0 --directory web`.
