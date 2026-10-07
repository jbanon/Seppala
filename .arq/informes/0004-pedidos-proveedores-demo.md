# Informe 0004 — Pedidos a proveedores (demo)

**Estado: HECHA.** Fecha: 07/10/2026. Tarea: `.arq/tareas/0004-pedidos-proveedores-demo.md` (ADR-0003).

## Qué hay ahora en `web/gestion/pedidos-proveedores/`

| Ruta | Pantalla |
|---|---|
| `index.html` | **Pedidos en curso** (pendientes y parciales), ordenados por entrega prevista, como tarjetas (2 columnas en escritorio): nº, estado (pastilla), proveedor y qué suministra, destino (obra de la demo del área de clientes con su nº de pedido, o «stock de taller»), barra de progreso de recepción (uds. recibidas / pedidas), fecha de pedido, entrega prevista (con «Retrasada» si ya pasó), nº de artículos, familia. Filtros por familia con recuento (Perfil · Persianas · Vidrio · Motorización). Resumen arriba y botón «Historial». |
| `detalle/index.html?id=PP-…` | **Ficha del pedido**: tabla de líneas (código interno ficticio, descripción genérica y unidad, pedidas, recibidas, restantes) con un campo **Recibir ahora** por línea (deshabilitado si no queda nada), botones **Confirmar recepción** y **Rellenar pedido completo**, validación (nada indicado / cantidad mayor que las restantes), aviso de éxito y repintado sin recargar: cambian las cantidades, el total «Recibido x / y», la pastilla de estado (Pendiente → Parcial → Completado) y el historial. Lateral con datos del pedido (proveedor, suministra, fechas, destino, pedido de cliente o presupuesto, referencia del proveedor) e historial. En completados y cancelados no hay formulario, solo la nota correspondiente. |
| `historial/index.html` | **Historial**: tabla (tarjetas en móvil) de completados y cancelados con filtro por estado (Todos · Completados · Cancelados) y **selector de proveedor**; columna «Recibido / cancelado» con la fecha del último apunte; botón «Ver» a la ficha. |

Un pedido que se completa desde la ficha desaparece de «en curso» y pasa al historial en la misma sesión (probado).

## Datos (`herramientas/datos_gestion.py` → `proveedores.json`, `pedidos-proveedores.json`)

- **Proveedores**: solo los que `INVESTIGACION.md` §5 confirma: Cortizo (perfiles de aluminio y PVC), Kömmerling (cajones
  RolaPlus), Guardian Glass y Saint-Gobain Glass (vidrio), Somfy, Nice y Gaviota (motorización). **Sin proveedor de
  mosquiteras ni de lamas de persiana**: no consta ninguno (Persycom sigue pendiente de confirmar, pregunta 2.4), así
  que no lo he inventado; lo apunto para `PREGUNTAS_CLIENTE.md` en la tarea 0005.
- **10 pedidos**: 4 en curso (Cortizo stock pendiente, Somfy pendiente, Guardian **parcial** 7/9, Kömmerling pendiente),
  5 completados y **1 cancelado** (Gaviota, motor para un presupuesto aún no aceptado). Los destinos son obras de la
  demo del área de clientes (chalet en fabricación, oficinas con instalación programada, reforma ya instalada) o
  stock de taller, con el nº de pedido de cliente cuando procede, para que todo cuadre entre las dos demos.
- **Artículos**: códigos internos ficticios (`PF-0101`, `VI-0603`, `CP-0701`…) y descripciones genéricas («Perfil
  marco corredera RPT, blanco, barra de 6,5 m», «Doble acristalamiento 4+4/16/6 control solar, 3200 × 2300 mm»,
  «Motor tubular con receptor de radio, 10 Nm»), coherentes con las partidas de los presupuestos de la demo. Ninguna
  referencia real de fabricante. **Sin precios** de proveedor (la tarea no los pedía y serían datos inventados sobre
  marcas reales).
- Referencias del proveedor marcadas como `*-DEMO-*`. `web/gestion/datos/LEEME.md` documenta ambos ficheros.

## Código

- `gestion.js` (470 líneas): `api.proveedores()`, `api.pedidosProveedores()`, `api.pedidoProveedor(id)` y
  `api.recibir(id, {codigo: cantidad})` (futuro `POST …/{id}/recepcion`; hoy `sessionStorage`). `conRecepciones()`
  suma las recepciones de sesión a las líneas y recalcula restantes, totales, estado e historial. Tres pantallas
  nuevas; la tarjeta de «Pedidos a proveedores» del inicio ya no lleva «En construcción» (solo queda el bloque del
  panel de mando para la 0005).
- `gestion.css` (117 líneas): tarjetas de pedidos, barra de progreso, selector, campo de cantidad (44 px, 16 px de
  letra), tabla de líneas dentro de panel y su versión apilada en móvil.
- `herramientas/movil.py` y `capturas.py`: `DETALLE` incluye `"pedidos-proveedores": "PP-2026-0229"` para que la
  ficha se audite con un pedido real.
- No se ha hecho la pantalla opcional de «nuevo pedido» (no era criterio de aceptación; prioridad diseño sobre
  completitud, ADR-0003). No se ha tocado `web/area-clientes/`.

## Comandos ejecutados y resultado

```
.venv/bin/python herramientas/datos_gestion.py   → 10 pedidos a 7 proveedores (+ lo anterior)
.venv/bin/python herramientas/enlaces.py         → 37 páginas comprobadas, 0 problemas
.venv/bin/python herramientas/movil.py /gestion/ … (7 páginas)
     → 1.ª pasada: 4 problemas, todos «campos<16px: prov» (selector del historial a 15 px); corregido a 1rem
     → 2.ª pasada sobre detalle/ e historial/: 2 páginas × 4 vistas, 0 problemas (las otras 5 no cambiaron: 0)
.venv/bin/python herramientas/capturas.py … pedidos-proveedores/ detalle/ historial/ → 6 capturas revisadas
node -e "new Function(…gestion.js)"              → sintaxis OK
```
Prueba de extremo a extremo con Playwright (script temporal):
1. Listado: 4 en curso ordenados por entrega prevista (0229, 0231, 0228, 0230), filtros con recuento, filtro
   «Vidrio» → solo PP-0229, barra «Recibidas 7 de 9 unidades».
2. Ficha PP-0229 (parcial): 1 campo activo (las otras líneas ya completas). Confirmar sin cantidades → nota de
   error; 5 unidades (restan 2) → nota de error; 1 unidad → sigue «Parcial», «8 / 9 uds.», aviso y apunte en el
   historial («1 unidad», en singular); «Rellenar pedido completo» pone la restante; confirmar → **Completado**, sin
   formulario, nota «Pedido completado el 07/10/2026». Persiste tras recargar (`sessionStorage`).
3. Volver: en curso ya son 3. Historial: 7 filas con PP-0229 como completado; filtro «Cancelados» → PP-0221; selector
   «Cortizo» → PP-0226 y PP-0214. Ficha del cancelado: sin campos, nota «no se espera material».
4. PP-0231 pendiente: recibir una línea → «Parcial», «24 / 154 uds.». `?id=NO-EXISTE` → «No encontrado».
Resultado: 0 errores JS, 0 respuestas ≥ 400, 0 peticiones externas.

## Commit

El inmediatamente posterior a `09ce7b1` en `master`, asunto «Tarea 0004: pedidos a proveedores en el panel de
gestión (en curso, ficha con recepción e historial)». Incluye este informe.
