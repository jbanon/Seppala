# Checklist de revisión · Web de Aluminios Seppala

> Estado a **07/10/2026**, al cerrar los 9 goals de `CLAUDE.md`. Leyenda: **[x] hecho** · **[c] pendiente del cliente**
> (ver `PREGUNTAS_CLIENTE.md`) · **[r] pendiente del responsable del proyecto** · **[d] decisión tomada por cuenta propia**.
> Para revisar en local: `python3 -m http.server 8080 --bind 0.0.0.0 --directory web` y abrir `http://<ip>:8080`.

## 1. Goals

| Goal | Estado | Dónde |
|---|---|---|
| 1. Investigación y auditoría | [x] | `INVESTIGACION.md` (17 páginas, 88 imágenes, 2 vídeos, marcas, datos verificados con fuente), `PREGUNTAS_CLIENTE.md` |
| 2. Recursos | [x] | `recursos/` (imágenes clasificadas con `INVENTARIO.md`, logos oficiales de 6 marcas, 3 PDF oficiales, colores del logo), `web/img/`, `web/video/`, `web/fonts/` |
| 3. Diseño | [x] | `web/css/estilo.css`, `web/estilo.html`, `herramientas/comunes/cabecera.html` y `pie.html` |
| 4. Herramientas | [x] | `herramientas/` (12 scripts, documentados en `herramientas/LEEME.md`), `web/.htaccess`, `despliegue/`, `REDIRECCIONES.md` |
| 5. Páginas de contenido | [x] | 13 páginas + 404 + `sitemap.xml` + `robots.txt` |
| 6. Área de clientes demo | [x] | `web/area-clientes/` (12 pantallas, `datos/*.json`, `docs-demo/*.pdf`) |
| 7. Legal y cookies | [x] | `/aviso-legal/`, `/privacidad/`, `/cookies/`, aviso de consentimiento en todas las páginas |
| 8. Calidad | [x] | Resultados en el apartado 6 de este documento |
| 9. Cierre | [x] | Este documento y el resumen final |
| Ampliación (07/10/2026): panel de gestión interna, demo | [x] | `web/gestion/` (7 pantallas, `datos/*.json` generados por `herramientas/datos_gestion.py`). Pedida por el usuario tras el cierre (ADR-0003 del arquitecto); ver apartado 3 bis |

## 2. Alcance de páginas

| Página | Estado | Notas |
|---|---|---|
| `/` Portada | [x] | Héroe con foto, datos clave, 6 productos, dos públicos, proceso, dos vídeos de Cortizo (locales), empresa, marcas, ayudas públicas, contacto |
| `/productos/` Ventanas y cerramientos | [x] | Índice de aluminio, PVC y fachadas; comparativa aluminio/PVC (tarjetas en móvil); preguntas frecuentes |
| `/aluminios/` | [x] | Abisagradas, correderas, minimalistas, fachadas y lucernarios, rotura de puente térmico, vídeo. [c] Sin nombres de sistemas Cortizo hasta confirmación (2.1) |
| `/pvc/` | [x] | Abisagradas y correderas; profundidades 70 y 84 mm (fuente: vídeo oficial de Cortizo); vídeo acústico |
| `/complementos/` (antes `/componentes/`) | [x] | Índice de los cuatro complementos. [d] Redirección 301 desde la URL antigua |
| `/vidrio/` | [x] | Cifras de Guardian Sun de guardiansun.es; Climalit del folleto oficial; sin el «63 %» de ClimaGuard de la web antigua (no verificado) |
| `/persianas/` | [x] | RolaPlus con cifras de la ficha oficial de Kömmerling. [c] Decorbox y cuadrado sin cifras; fabricante de BaseRoll/Airluz/Multiroll sin nombrar (2.4, 2.5) |
| `/motorizacion/` (antes `/automatismo/`) | [x] | Somfy, Nice y Gaviota con logos oficiales. [d] Redirección 301 |
| `/mosquiteras/` | [x] | Cinco tipos |
| `/asesoramiento/` | [x] | Proceso en cinco pasos, calidad garantizada, vídeos, dos públicos |
| `/trabajos-realizados/` Proyectos | [x] | Galería de 15 imágenes con filtro por tipo de obra, rotulada como imágenes de los sistemas instalados. [c] Fotos de obras reales (3.1) |
| Noticias | [d] | **Suprimida**: la web antigua solo tenía la entrada de ejemplo de WordPress. `/noticias/` y `/hola-mundo/` redirigen a la portada. Se añade sección si el cliente la quiere |
| `/empresa/` | [x] | Trayectoria (+25 años), valores, fábrica (maquinaria citada en la ayuda), **textos literales de las dos ayudas públicas con sus logos**, marcas. [c] Año de fundación y fotos propias (1.5, 3.1) |
| `/contacto/` | [x] | Formulario con `action` único pendiente (envío provisional por `mailto:`), cláusula RGPD, mapa de Google solo con consentimiento. [c] Servicio de envío, horario, dirección (5.1, 1.3, 1.1) |
| `/aviso-legal/`, `/privacidad/`, `/cookies/` | [x] | [c] Datos registrales y revisión por la gestoría (1.2, 4.1–4.3) |
| `404.html`, `sitemap.xml`, `robots.txt` | [x] | 16 URL en el sitemap; `/area-clientes/`, `/gestion/` y `/estilo.html` excluidos |
| `/gestion/` Gestión interna (demo) | [x] | Panel de uso interno del personal, con acceso simulado propio. `noindex`, fuera del sitemap y bloqueado en `robots.txt`. [d] Sin enlace desde el menú ni el pie públicos (no es un destino para visitantes); se entra por la URL. Ver 3 bis |
| Menú | [d] | Seis entradas: Ventanas y cerramientos · Complementos · Asesoramiento · Proyectos · Empresa · Contacto, más «Pedir presupuesto» y «Área clientes (Demo)». Sección activa marcada por `comunes.py` |

## 3. Área de clientes (demo)

- [x] Login simulado (cualquier usuario y contraseña) con aviso visible de demo y datos ficticios.
- [x] Datos de ejemplo en JSON coherentes con el negocio (ventanas de aluminio y PVC, muro cortina, persianas con cajón y motor, mosquiteras; obras, clientes y personas inventadas). Generados por `herramientas/datos_demo.py`.
- [x] Pantallas: inicio, presupuestos (listado + detalle + aceptar), pedidos (listado + detalle), facturas y actas de instalación, incidencias (listado + detalle + alta con fotos), documentación, cuenta.
- [x] Franja «Demo · Datos ficticios» en todas; `noindex`; fuera del sitemap y bloqueada en `robots.txt`; comentario en el código de cada pantalla; aviso en el aviso legal y en la política de privacidad.
- [x] Recorrido probado con Playwright: entrar → aceptar presupuesto → abrir incidencia con pedido preseleccionado → listado → salir; 0 errores, 0 peticiones externas.
- [d] Fases del pedido propuestas para un instalador: aceptado → medición → fabricación → instalación programada → instalado (6.2). Propuestas marcadas en pantalla con la etiqueta «Propuesta».

## 3 bis. Panel de gestión interna (demo, ampliación del 07/10/2026)

Demo **de uso interno del personal de Seppala** (no de clientes), hermana del área de clientes, pedida por el usuario tras el cierre
de los 9 goals (ADR-0003 del arquitecto, tareas 0002–0005). Prioridad explícita: diseño y pocas pantallas cuidadas sobre
completitud funcional.

- [x] Acceso simulado propio en `/gestion/` (cualquier usuario y contraseña; sesión independiente de la del área de clientes), con aviso de demo visible y textos para personal interno.
- [x] **Inicio = panel de mando**: cuatro indicadores calculados de los JSON (presupuestos sin enviar, pedidos a proveedores en curso, facturación del mes, pendiente de cobro), lista «Necesita atención» (presupuestos y facturas sin enviar, facturas vencidas, presupuestos a punto de caducar, pedidos retrasados o con recepción parcial) con enlace a cada sección, próximas entregas de material y últimos movimientos. Nada escrito a mano en el HTML.
- [x] **Presupuestos** y **facturas** de 7 clientes ficticios (incluido el cliente de ejemplo del área de clientes, con sus mismos documentos, importados de `datos_demo.py` para que las dos demos cuadren): tabla (tarjetas en móvil), filtros con recuento, buscador, **Enviar / Reenviar con fecha del último envío** y diálogo de envío (destinatario y asunto precargados y editables, plantilla de texto editable, PDF adjunto, Cancelar / Confirmar). Facturas: «enviar varias» del mismo cliente en un solo correo. **No se envía ningún correo**: el envío se registra en `sessionStorage`.
- [x] **Pedidos a proveedores**: en curso (tarjetas con progreso de recepción y filtro por familia), ficha con líneas (pedidas / recibidas / restantes) y **recepción simulada** (cantidad por línea, «Rellenar pedido completo», «Confirmar recepción»; el estado pasa de Pendiente a Parcial y Completado), e historial de completados y cancelados con filtro por estado y proveedor. Proveedores: solo las marcas confirmadas en `INVESTIGACION.md` §5 (Cortizo, Kömmerling, Guardian Glass, Saint-Gobain Glass, Somfy, Nice, Gaviota); artículos con descripción genérica y código interno ficticio, sin referencias reales ni precios. [c] Sin proveedor de mosquiteras ni de lamas de persiana porque no consta (6b.2).
- [x] Franja «Demo de gestión interna · Datos ficticios» en todas las pantallas; comentario de demo en cada HTML y en `gestion.js`; datos en `web/gestion/datos/` con `LEEME.md`; capa `api` única (hoy JSON + `sessionStorage`) pensada para un backend futuro, igual que `portal.js`.
- [d] Fichero propio `gestion.js` (dos roles distintos, sesión y datos propios) que reutiliza `/area-clientes/portal.css` para el marco visual; `gestion.css` solo añade lo propio. Sin tocar `web/area-clientes/`.
- [d] Fuera de alcance, a propósito: generación de pedidos a proveedor por cálculo de demanda y tablero de fases de fabricación (ADR-0003); pantalla de «nuevo pedido» (opcional, no hecha); detalle de presupuesto o factura en la vista interna (ya existe en el área de clientes).
- [c] Preguntas abiertas en `PREGUNTAS_CLIENTE.md` 6 bis (si les interesa, proveedores, qué más acciones internas).

## 4. Criterios de calidad no negociables

- [x] **Sin datos inventados.** Cada dato de empresa, legal o técnico procede de la web antigua o de la web oficial de la marca (fuentes en `INVESTIGACION.md`). Lo no verificable está en `PREGUNTAS_CLIENTE.md` y **no** aparece en la web (ni como texto de relleno).
- [x] **Sin contenido de relleno visible.** Comprobado con búsqueda de «lorem», «pendiente», «PENDIENTE» en `web/` (solo quedan el `action` del formulario, no visible, y la guía de estilo interna).
- [x] **Cookies.** Cero peticiones a terceros sin consentimiento en las 30 páginas (barrido con Playwright). Aceptar y Rechazar con la misma clase y tamaño. Mapa de Google solo tras aceptar; vídeos, fuentes e imágenes en local.
- [x] **Demo señalada** en el portal, en el código, en el aviso legal y en la política de privacidad.
- [x] **Commits** frecuentes en castellano: uno por goal más el brief inicial (10 commits).

## 5. Decisiones tomadas por cuenta propia (y por qué)

1. **Paleta y tipografía.** Tinta petróleo `#0b2a33` (del círculo del emblema), azul `#2c90c3` del rótulo como acento, azul UI `#1b6f99` para botones (contraste AA). Newsreader (titulares) y Figtree (texto), servidas en local. Distintas de Marchante a propósito.
2. **Logotipo.** Solo existe un JPG de 546 px sobre blanco: en la cabecera va tal cual; en el pie oscuro, dentro de un recuadro blanco; el favicon es el emblema recortado. Se pide el vectorial (3.2).
3. **URLs.** Se mantienen las de la web antigua salvo `/automatismo/` → `/motorizacion/` y `/componentes/` → `/complementos/` (nombres más claros), con redirecciones 301 en Apache y nginx. Noticias suprimida.
4. **Fotos.** Todas son de catálogo del fabricante de perfiles (no hay fotos propias). Se usan rotuladas como «imágenes de los sistemas que fabricamos e instalamos», nunca como obras de Seppala.
5. **Vídeos.** Los dos vídeos de Cortizo que ya usaba la web antigua se sirven en local comprimidos (34+23 MB → 10,4+6,1 MB) y solo se cargan al pulsar, para no depender de YouTube ni necesitar consentimiento.
6. **Sistemas Cortizo sin nombre.** La web describe los sistemas sin «COR 80», «A84»… hasta que el cliente confirme cuáles fabrica (2.1). Los renders se rotulan de forma genérica.
7. **Cifras técnicas.** Se publican solo las verificadas: Guardian Sun (web oficial), RolaPlus (ficha oficial de Kömmerling), 70/84 mm de Cortizo PVC (vídeo oficial), lo que la propia web antigua afirmaba sobre sus productos (26 mm de vidrio en correderas, 34 mm máximo, 44 puntos de bloqueo, 120º, 4 m, 0,5 mm). Fuera: el «60 %» de ahorro, el «63 %» de ClimaGuard y las cifras de los cajones Decorbox y cuadrado.
8. **Fabricante de persianas.** BaseRoll, Airluz y Multiroll son del catálogo de Persycom (comprobado), pero la web antigua no lo nombra: no se cita hasta confirmación (2.4).
9. **Direcciones.** Calle Portugal, 16 (la de contacto de la web antigua) en contacto, pie y datos estructurados; C/ Habana, 18, nave 7 (la de su página legal) en aviso legal y privacidad. Sin mapa incrustado por defecto; enlace «Cómo llegar» a Google Maps.
10. **Sin horario ni WhatsApp ni redes**, porque no constan en ninguna fuente. La barra móvil es Llamar · Escribir · Presupuesto.
11. **Aviso de cookies** aunque la web no use cookies propias: gobierna el mapa de Google y cumple la petición del brief; el texto dice exactamente lo que hace la web.
12. **Formulario.** `action` único pendiente; mientras tanto, abre el correo del visitante con la solicitud redactada (igual que Marchante).
13. **Afirmaciones retiradas en la revisión final.** «Retirada de la carpintería antigua», «anodizados» y «trabajamos sobre vuestras mediciones» no están en la web antigua: fuera y a preguntas (2.10).
14. **Área de clientes para profesionales y particulares** con un único cliente de ejemplo (empresa de reformas); las actas de instalación sustituyen a los albaranes de entrega porque Seppala instala.

## 6. Cómo se ha comprobado

| Comprobación | Herramienta | Resultado |
|---|---|---|
| Enlaces, anclas, recursos, `alt`, `width/height`, h1, title, description, canonical | `herramientas/enlaces.py` | 30 páginas, 0 problemas · tras la ampliación (07/10/2026): 37 páginas, 0 problemas |
| Móvil: scroll horizontal, texto < 12 px, campos < 16 px, táctil < 44 px, elementos fijos | `herramientas/movil.py` (Chromium, 360/390/414/844×390) | 29 páginas × 4 vistas, 0 problemas · ampliación: las 7 páginas de `/gestion/` × 4 vistas, 0 problemas (dos fallos encontrados y corregidos por el camino: selector a 15 px, enlaces «Ver» de 43 px) |
| Panel de gestión demo de extremo a extremo | Prueba con Playwright | Correcto: acceso → envío de presupuesto (Enviar → Reenviar con fecha, persiste al recargar) → envío de varias facturas del mismo cliente → recepción parcial y completa de un pedido a proveedor → indicadores del panel recalculados; 0 errores JS, 0 peticiones externas |
| Capturas a 390 y 1440 px, errores de consola, recursos 404, desborde | `herramientas/capturas.py` | 30 páginas, sin errores (capturas en `referencia/capturas/`, no versionadas) |
| Peticiones a terceros sin consentimiento | Barrido con Playwright | 30 páginas, ninguna |
| Consentimiento (aceptar/rechazar/cambiar), mapa, vídeo local | Prueba con Playwright | Correcto |
| Portal demo de extremo a extremo | Prueba con Playwright | Correcto, 0 errores JS |
| Teclado: menú móvil, Escape, enlace de salto, submenús | Prueba con Playwright | Correcto |
| Estructura HTML: `lang`, viewport, un `main`, ids únicos, etiquetas cerradas | Script de comprobación | 30 páginas, 0 problemas |
| Revisión visual de capturas | Manual | Portada, productos, aluminio, persianas, contacto, proyectos y portal revisadas en móvil y escritorio |
| **WebKit (Safari de iPhone)** | `movil.py --motor webkit` | [r] **No probado**: faltan librerías del sistema (`sudo .venv/bin/playwright install-deps webkit`). Precauciones tomadas: campos a 16 px, `viewport-fit=cover` y `env(safe-area-inset-bottom)`, `svh` con reserva en `vh`, `-webkit-text-size-adjust` |

## 7. Pendiente del responsable del proyecto

- [x] **Subdominio de pruebas**: `seppala.winsoft.es` (confirmado por el responsable, 07/10/2026). `herramientas/publicar.sh` copia a `/var/www/seppala/`; configuración en `despliegue/seppala.winsoft.es.nginx.conf` (ver `despliegue/LEEME-despliegue.md` para el alta en el servidor, pendiente de ejecutar los pasos con sudo).
- [r] **Repositorio remoto en GitHub**: no existe. Decidir si se crea y con qué nombre (ver resumen final).
- [r] **WebKit**: intentado el 07/10/2026 (tarea 0001 del arquitecto). El navegador WebKit de Playwright ya está descargado (`~/.cache/ms-playwright/webkit-2359`), pero al lanzarlo falla con «Host system is missing dependencies to run browsers» (faltan `libgtk-4.so.1`, `libpangocairo-1.0.so.0`, `libsoup-3.0.so.0`… en total 237 paquetes apt según `playwright install-deps webkit --dry-run`), y `sudo` exige contraseña interactiva (`sudo -n` → «interactive authentication is required»). Lo tiene que ejecutar el responsable: `sudo .venv/bin/playwright install-deps webkit` y después `.venv/bin/python herramientas/movil.py --motor webkit` (apartado 6 sigue en «No probado» hasta entonces).
- [r] **Servicio de envío del formulario** (cuando el cliente responda 5.1): cambiar el `action` en `web/contacto/index.html`.
- [r] **Textos legales y la segunda demo**: el aviso legal («Objeto» y «Área de clientes (demostración)») y la política de privacidad (§9) hablan solo de la demo del área de clientes. Decidir si se añade una frase sobre la demo del panel de gestión interna (misma naturaleza: sin datos personales, cambios solo en el navegador). Redacción propuesta en `.arq/informes/0005-panel-de-mando-demo.md`.
- [r] **Licencias**: imágenes y vídeos de catálogo de Cortizo y PDF de Kömmerling y Saint-Gobain, en uso provisional (ya los usaba la web antigua, salvo los PDF). Confirmar con las marcas o sustituir por material del cliente.
- [r] Alojamiento final y DNS (7.2 de las preguntas al cliente).

## 8. Pendiente del cliente

Todo en `PREGUNTAS_CLIENTE.md`, por temas y por orden de importancia. Lo que bloquea la publicación definitiva: la dirección correcta (1.1), el NIF y los datos registrales (1.2), el horario (1.3), el destino del formulario (5.1) y la revisión de los textos legales por su gestoría (4).
