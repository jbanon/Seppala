# Informe 0002 — Base del panel de gestión interna (demo)

**Estado: HECHA.** Fecha: 07/10/2026. Tarea: `.arq/tareas/0002-base-panel-gestion.md` (ADR-0003).

## Qué hay ahora en `web/gestion/`

| Ruta | Qué es |
|---|---|
| `/gestion/` (`index.html`) | Acceso simulado para el personal: cualquier usuario/contraseña entra (`gestion.js` guarda `seppala-gestion-sesion` en sessionStorage y lleva a `/gestion/inicio/`). Textos para personal interno, no para un cliente. Aviso de demo visible en la franja y en un recuadro. `noindex, nofollow`. Foto: `bodegon-perfil-planos` (perfil, vidrio y planos). |
| `/gestion/inicio/` | Aterrizaje tras entrar: saludo con nombre y rol, aviso de uso interno/demo, tres accesos (Presupuestos · Facturas · Pedidos a proveedores) con etiqueta discreta «En construcción», y un bloque «Panel de mando» marcado también «En construcción» explicando qué mostrará (se completa en la tarea 0005). |
| `/gestion/presupuestos/`, `/gestion/facturas/`, `/gestion/pedidos-proveedores/` | **Pantallas marcadoras** con estado «En construcción» explícito (título real, una frase de lo que llegará, botón «Volver al inicio»). Las creé para que la navegación funcione de principio a fin sin enlaces a 404 y para que las tareas 0003/0004 solo tengan que sustituir la pantalla en `gestion.js`. No contienen datos ni relleno. |
| `gestion.js` | Capa `api` (hoy solo `usuario`), almacenamiento tolerante, marco (franja, cabecera, navegación, pie), pantallas, acceso y arranque. Mismo patrón que `portal.js`. |
| `gestion.css` | Solo lo propio de la sección (40 líneas): punto celeste en la franja, rol en la cabecera, barra inferior de 4 columnas con etiqueta corta «Proveedores», accesos del inicio, etiqueta y bloque «En construcción». |
| `datos/usuario.json` + `datos/LEEME.md` | Quién ha entrado (persona ficticia «Usuario Demo», rol Administración) y datos de la empresa para el marco. Generado por `herramientas/datos_gestion.py`. |

Navegación propia: **Inicio · Presupuestos · Facturas · Pedidos a proveedores** (pestañas en escritorio, barra
inferior fija en móvil, como el área de clientes). La cabecera lleva nombre · rol, enlace al área de clientes y
«Salir» (borra la sesión y vuelve a `/gestion/`).

## Decisiones tomadas (documentadas en comentarios del código)

1. **Fichero propio `gestion.js`, no extensión de `portal.js`.** Son dos roles distintos (un cliente ve lo suyo; el
   personal ve a todos los clientes y a los proveedores) con sesión, navegación y datos propios; extender
   `portal.js` obligaría a tocar `web/area-clientes/` (prohibido por la tarea) cada vez que cambie esta demo. Las
   utilidades comunes (escape, fechas, importes, almacenamiento) son ~15 líneas y se repiten a propósito.
2. **El marco visual sí se reutiliza sin copiarlo**: las páginas de `/gestion/` cargan `/area-clientes/portal.css`
   (franja, cabecera, navegación, paneles, pastillas, botones, pantalla de acceso) y `gestion.css` solo añade lo
   propio. Es una dependencia de lectura: no se modifica nada en `area-clientes/`. Si el arquitecto prefiere
   desacoplar del todo, bastaría mover `portal.css` a `/css/portal.css` (eso sí tocaría `area-clientes/`).
3. **Clave de sesión distinta** (`seppala-gestion-sesion` frente a `seppala-demo-sesion`): entrar en una demo no
   abre la otra. Probado.
4. **Generador aparte `herramientas/datos_gestion.py`** (hermano de `datos_demo.py`), para no mezclar los datos
   del cliente único con los de la vista interna. Las tareas 0003/0004 añadirán ahí presupuestos, facturas y
   pedidos a proveedores.
5. **No he añadido `/gestion/` al menú público ni al pie** (`herramientas/comunes/cabecera.html`/`pie.html`): es
   una demo de uso interno del personal, no un destino para visitantes, y la tarea pedía «navegación propia de
   esta sección». Se llega desde la URL, desde el acceso del área de clientes no (no se toca), y desde el propio
   panel hay enlaces al área de clientes y a la web. Si se quiere un enlace discreto en el pie público, es una
   decisión del arquitecto (una línea en `pie.html` + `comunes.py`).

## Cambios fuera de `web/gestion/` (los mínimos para que las herramientas la cubran)

- `web/robots.txt`: `Disallow: /gestion/`. `sitemap.xml` no la incluye (no se ha tocado; se genera a mano y solo
  lista las 16 URL públicas). Todas las páginas llevan `noindex, nofollow`.
- `herramientas/comunes.py`: ignora también `web/gestion/` (pinta su marco con JS, como `area-clientes/`).
- `herramientas/movil.py` y `herramientas/capturas.py`: la sesión simulada se pone ahora por demo
  (`DEMOS = {"/area-clientes/": "seppala-demo-sesion", "/gestion/": "seppala-gestion-sesion"}`), para que la
  auditoría audite las pantallas internas y no la redirección al acceso. Sin cambio de comportamiento para
  `area-clientes/`.
- `herramientas/LEEME.md`: fila de `datos_gestion.py` y nota en `comunes.py`.
- No se ha tocado `web/area-clientes/`, ni `CHECKLIST.md`/`PREGUNTAS_CLIENTE.md` (la tarea 0005 pide actualizarlos
  al cerrar la ampliación), ni los textos legales (ver observación abajo).

## Comandos ejecutados y resultado

```
.venv/bin/python herramientas/datos_gestion.py      → web/gestion/datos/usuario.json
.venv/bin/python herramientas/enlaces.py            → 35 páginas comprobadas, 0 problemas
.venv/bin/python herramientas/movil.py /gestion/ /gestion/inicio/ /gestion/presupuestos/ /gestion/facturas/ /gestion/pedidos-proveedores/
                                                    → chromium: 5 páginas × 4 vistas, 0 problemas
.venv/bin/python herramientas/comunes.py            → «cabecera y pie sincronizados», git status sin cambios en otras páginas
.venv/bin/python herramientas/capturas.py /gestion/ /gestion/inicio/ /gestion/pedidos-proveedores/
                                                    → 6 capturas revisadas (móvil y escritorio), sin errores de consola ni recursos 404
node -e "new Function(fs.readFileSync('web/gestion/gestion.js'))"  → sintaxis OK
```
Prueba de extremo a extremo con Playwright (script temporal, no versionado), en 390 px:
1. `/gestion/inicio/` sin sesión → redirige a `/gestion/` (franja «Demo de gestión interna · Datos ficticios»).
2. Usuario «quien-sea» / clave «lo-que-sea» → `/gestion/inicio/`, h1 «Hola, Usuario Demo», cabecera «Usuario Demo ·
   Administración», navegación de 4 entradas con «Inicio» activa, 3 accesos y 4 etiquetas «En construcción».
3. Clic en cada entrada de la navegación → `/gestion/presupuestos/`, `/gestion/facturas/`,
   `/gestion/pedidos-proveedores/`: h1 correcto, bloque «En construcción», franja de demo presente.
4. «Salir» → `/gestion/`; volver a pedir `/gestion/facturas/` → redirige al acceso.
5. Con sesión de gestión, `/area-clientes/inicio/` sigue redirigiendo a `/area-clientes/` (sesiones independientes).
Resultado: 0 errores JS, 0 respuestas ≥ 400, 0 peticiones externas.

## Commit

El inmediatamente posterior a `a600ae1` en `master`, asunto «Tarea 0002: base del panel de gestión interna
(demo): acceso simulado, inicio y navegación en /gestion/». Incluye este informe.

## Observaciones para el arquitecto (no tocadas, fuera del alcance de 0002)

- `web/aviso-legal/` y `web/privacidad/` mencionan que el área de clientes es una demo con datos ficticios; no
  mencionan esta segunda demo. Conviene decidir si se añade una frase (yo lo haría en la tarea 0005, junto con
  `CHECKLIST.md`, si el arquitecto está de acuerdo).
- `capturas.py` y `movil.py` tienen `DETALLE` solo con los ids del área de clientes; en la tarea 0004 añadiré el id
  del pedido a proveedor de ejemplo para que `pedidos-proveedores/detalle/` se audite con datos.
