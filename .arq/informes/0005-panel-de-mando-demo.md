# Informe 0005 — Panel de mando (demo) y cierre de la ampliación

**Estado: HECHA.** Fecha: 07/10/2026. Tarea: `.arq/tareas/0005-panel-de-mando-demo.md` (ADR-0003). Última de la
ampliación: las cuatro tareas 0002–0005 están hechas y commiteadas; la 0001 sigue bloqueada (sudo).

## Qué hay ahora en `/gestion/inicio/`

Sustituye por completo la pantalla marcadora de la 0002 (fuera las tarjetas de acceso y el bloque «En construcción»;
el código y el CSS de ese estado se han retirado, no queda nada de relleno). Todo sale de los tres JSON a través de
`api.presupuestos()`, `api.facturas()` y `api.pedidosProveedores()`, con los cambios de la sesión incluidos:

- **Cuatro indicadores** (`.p-resumen` de `portal.css`, etiqueta pequeña en mayúsculas + cifra grande + línea de
  apoyo), cada uno enlazando a su sección:
  - *Presupuestos sin enviar*: 3 · «76.887,03 € pendientes de salir».
  - *Pedidos a proveedores en curso*: 4 · «1 con recepción parcial» (o la próxima entrega si no hay parciales).
  - *Facturación de octubre* (mes de la fecha fija de la demo): 22.371 € · «3 facturas emitidas, 2 sin enviar».
  - *Pendiente de cobro*: 49.661 € · «1 factura vencida (11.943 €)». Los importes de las cifras grandes van sin
    decimales para que quepan en móvil; las líneas de apoyo y la lista llevan los céntimos.
- **Necesita atención**: presupuestos sin enviar (ids e importe) → Enviar; facturas sin enviar → Enviar; facturas
  vencidas → Ver; presupuestos enviados que caducan en ≤ 10 días (PR-2026-0398) → Ver; pedidos con entrega
  retrasada o con recepción parcial (PP-2026-0229) → Recibir. Si no hay nada: «Todo al día».
- **Próximas entregas de material**: pedidos en curso por fecha prevista, con proveedor, destino y barra de progreso.
- **Últimos movimientos**: los seis apuntes más recientes mezclando envíos de presupuestos y facturas e historial de
  pedidos; los hechos en la sesión se marcan «· en esta sesión» y van primero.
- Saludo con nombre, rol, empresa y «7 de octubre de 2026»; aviso corto de uso interno/demo; nota «Propuesta» final.

Probado que **reacciona a los datos**: tras enviar un presupuesto desde su listado, el indicador baja de 3 a 2 y el
envío aparece como primer movimiento; tras completar la recepción de PP-2026-0229, «en curso» baja a 3, la línea de
apoyo pasa a «Próxima entrega: 14/10/2026» y la lista de atención pierde ese ítem.

## Cierre de la ampliación (lo que pedía «Al terminar»)

- `CHECKLIST.md`: sección nueva **3 bis. Panel de gestión interna (demo)** con el estado de cada pieza, decisiones
  ([d]) y pendientes ([c]); fila en §1 (ampliación), filas en §2 (`/gestion/` y exclusión del sitemap), filas en §6
  (enlaces 37 páginas / móvil 7 páginas × 4 vistas / prueba de extremo a extremo) y un [r] nuevo en §7 sobre los
  textos legales (abajo). No he renumerado los apartados para no romper las referencias de `.arq/`.
- `PREGUNTAS_CLIENTE.md`: intro actualizada (dos demostraciones) y sección nueva **6 bis** con tres preguntas: si les
  interesa que se la enseñemos (6b.1), proveedores (confirmar la lista y quién suministra mosquiteras y lamas, 6b.2) y
  qué otras tareas internas querrían ver representadas (6b.3).

## Código y comprobaciones

- `gestion.js` (496 líneas): pantalla `inicio` nueva; utilidades `eurosEnteros`, `fechaLarga`, `dias`; retirados
  `SECCIONES`, `etiqueta`, `enConstruccion`. `gestion.css` (113 líneas): fuera `.g-accesos/.g-acceso/.g-etiqueta/
  .g-construccion`; dentro `.g-kpi--euros`, `.g-cortas`, `.g-ok`.
```
.venv/bin/python herramientas/enlaces.py   → 37 páginas comprobadas, 0 problemas
.venv/bin/python herramientas/movil.py /gestion/ … (7 páginas)
     → 1.ª pasada: 4 problemas (los enlaces «Ver» de la lista de atención medían 43×44 px); corregido con min-width
     → 2.ª pasada sobre /gestion/inicio/: 1 página × 4 vistas, 0 problemas (el resto no cambió: 0)
.venv/bin/python herramientas/capturas.py /gestion/inicio/ → revisado en móvil y escritorio
node -e "new Function(…gestion.js)"        → sintaxis OK
```
Prueba con Playwright (script temporal): los cuatro indicadores coinciden exactamente con los valores calculados
en Python directamente de los JSON (3 · 4 · 22.371 € · 49.661 €); 5 ítems de atención, 4 entregas, 6 movimientos;
los 6 enlaces internos del panel responden 200; reacciona a envíos y recepciones (arriba). 0 errores JS, 0
peticiones externas.

## Commit

El inmediatamente posterior a `474bb06` en `master`, asunto «Tarea 0005: panel de mando del panel de gestión y
cierre de la ampliación (CHECKLIST y preguntas)». Incluye este informe.

## Para el arquitecto

1. **Textos legales (no tocados, decisión vuestra).** `web/aviso-legal/` dice en «Objeto» que la web sirve para
   «mostrar una demostración del área de clientes» y tiene un apartado «Área de clientes (demostración)»;
   `web/privacidad/` §9 explica que esa demo no trata datos personales. Nada de eso es falso, pero ahora hay una
   segunda demo de la misma naturaleza. Redacción propuesta, si se quiere cubrirla:
   - Aviso legal, «Objeto»: «…y mostrar dos demostraciones con datos ficticios: el área de clientes y un panel de
     gestión interna.» Y en el h3: «Área de clientes y panel de gestión interna (demostraciones)», añadiendo al
     párrafo «Lo mismo vale para el apartado «Gestión interna» (`/gestion/`): es una demostración del panel que usaría
     el personal de la empresa; sus clientes, proveedores, importes y pedidos son ficticios y ningún envío de correo
     ni pedido se realiza de verdad.»
   - Privacidad §9: «Lo mismo se aplica a la demostración del panel de gestión interna: no comprueba usuario ni
     contraseña y los cambios (envíos simulados, recepciones de material) se guardan únicamente en el navegador del
     visitante durante la sesión.»
2. `CHECKLIST.md` §7 sigue diciendo que el repositorio remoto «no existe» (ya señalado en los informes 0001 y 0002);
   no lo he tocado.
3. Sin enlace público a `/gestion/` (decisión de la 0002, recogida como [d] en el 3 bis): si se quiere uno discreto
   en el pie, es una línea en `herramientas/comunes/pie.html` + `comunes.py`.
4. La tarea 0001 (WebKit) sigue bloqueada por `sudo`; el panel de gestión tampoco se ha podido probar en WebKit.
