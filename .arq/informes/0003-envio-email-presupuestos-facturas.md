# Informe 0003 — Presupuestos y facturas con envío por correo (demo)

**Estado: HECHA.** Fecha: 07/10/2026. Tarea: `.arq/tareas/0003-envio-email-presupuestos-facturas.md` (ADR-0003).

## Qué hay ahora

### `/gestion/presupuestos/`
- Tabla de **15 presupuestos de 7 clientes ficticios** (tarjetas apiladas en móvil < 48em). Columnas: Nº · Fecha (y
  «válido hasta») · Cliente y obra (nombre, obra + resumen de partidas, **correo del cliente**) · Importe (IVA incl.)
  · Estado · Correo (acción).
- Estados internos (pastillas): **Sin enviar** (`redactado`) · Enviado · En revisión · Aceptado · Rechazado · Caducado.
- Filtros por estado con recuento («Todos (15)», «Sin enviar (3)»…) y buscador por cliente, obra o número (sin
  tildes, sin mayúsculas).
- Acción **Enviar** (botón primario) o **Reenviar** con «Enviado el dd/mm/aaaa» debajo si ya hay un envío (del JSON
  o de esta sesión).
- Diálogo de envío (`<dialog>` nativo, modal, cierra con Escape, devuelve el foco al botón): **Destinatario**
  (precargado con el correo del cliente, editable), **Asunto** («Presupuesto PR-… — Aluminios Seppala, S.A.»,
  editable), **Texto del correo** (plantilla propia precargada y editable: saludo al contacto, nº, obra, importe,
  validez, firma del usuario y la empresa), «Se adjunta: PDF PR-….pdf», nota «Se adjunta el PDF del presupuesto.
  Si no cambias el texto, se envía esta plantilla tal cual. Demo: no se envía ningún correo…», botones
  **Confirmar y enviar** / **Cancelar**.
- Al confirmar: no se envía nada; `api.enviar()` registra `{fecha, destinatario, asunto}` en `sessionStorage`
  (`seppala-gestion-cambios`), la lista se repinta (el botón pasa a «Reenviar» + fecha, el estado «Sin enviar» pasa
  a «Enviado») y aparece un aviso de éxito con el destinatario y el recordatorio de demo. Persiste al recargar.

### `/gestion/facturas/`
- Tabla de **10 facturas** (mismos clientes): casilla de selección · Nº · Fecha y vencimiento · Cliente y concepto
  (+ obra, + correo) · Total (y base) · Estado (Pendiente de cobro · Vencida · Pagada) · Correo.
- Resumen arriba: «6 facturas pendientes de cobro por 49.660,53 €, de las que 1 está vencida (11.942,70 €). 2 sin
  enviar todavía al cliente.» (calculado de los datos).
- Filtros (Todas · Sin enviar · Pendientes de cobro · Vencidas · Pagadas) y buscador.
- **Enviar varias** (opcional en la tarea, hecho): barra de selección que cambia con las casillas marcadas:
  sin selección explica el uso; con facturas de clientes distintos avisa de que deben ser del mismo cliente; con
  uno solo muestra «n facturas de <cliente>» y el botón «Enviar las n juntas». El diálogo lista los n PDF adjuntos y
  la plantilla enumera cada factura con importe y vencimiento. Al confirmar, todas pasan a «Reenviar» con fecha.
- Enviar/Reenviar individual igual que en presupuestos.

### Inicio
Las tarjetas de Presupuestos y Facturas ya no llevan «En construcción» (enlazan con «Entrar»); Pedidos a
proveedores y el bloque «Panel de mando» siguen marcados (tareas 0004 y 0005).

## Datos (reproducibles, no escritos a mano en el HTML)

`herramientas/datos_gestion.py` ampliado; genera `web/gestion/datos/presupuestos.json` y `facturas.json`
(`usuario.json` sin cambios). Decisiones:
- **7 clientes ficticios** con tipo, persona de contacto, correo `*.example` y localidad inventada: constructora,
  comunidad de propietarios, dos particulares, estudio de arquitectura, instalador, y **el mismo cliente del área
  de clientes (C-02087)**, cuyos 8 presupuestos y 3 facturas se **importan de `datos_demo.py`** (no se copian) con
  el estado traducido a la vista interna (`pendiente` del cliente = `enviado` aquí). Así las dos demos cuadran: lo
  que el cliente ve en su portal es lo que el personal ve en el panel.
- **7 presupuestos y 7 facturas nuevos** con obras nuevas (promoción de 12 viviendas, nave y oficinas, sustitución
  de ventanas en una comunidad, reforma de piso, unifamiliar, cerramiento de ático, suministro sin instalación),
  construidos con las mismas ayudas `linea()`/`totales()` de `datos_demo.py` para que los importes salgan calculados
  de las partidas (PVC 70/84 mm, aluminio RPT, minimalista, muro cortina, persianas RolaPlus, motores Somfy/Nice,
  mosquiteras). Sin nombres de sistemas Cortizo (igual que el resto de la web).
- 3 presupuestos y 2 facturas sin envío previo para que el flujo «Enviar» tenga casos reales; el resto con un envío
  registrado en el JSON (fecha = fecha del documento).
- PDF adjuntos: los de muestra ya existentes en `/area-clientes/docs-demo/` (solo lectura).
- `web/gestion/datos/LEEME.md` documenta los dos ficheros, los estados y el mecanismo de envíos en sesión.

## Código

- `web/gestion/gestion.js` (345 líneas): `api.presupuestos()`, `api.facturas()` (ambas mezclan los envíos de sesión
  y derivan el estado) y `api.enviar(tipo, ids, datos)` (futuro `POST …/enviar`; hoy escribe en sessionStorage);
  componentes `filtros`, `buscador`, `tabla`, `botonEnvio`, `dialogoEnvio`, plantillas de correo; pantallas
  `presupuestos` y `facturas`.
- `web/gestion/gestion.css` (93 líneas): herramientas de listado, tabla (tabla/tarjetas), casillas de 44 px,
  diálogo y barra de selección. Todo con los tokens existentes.
- Sin cambios en `web/area-clientes/`, ni en herramientas (las de 0002 ya cubren esta sección), ni en HTML
  estático de las páginas (el contenido lo pinta el JS).

## Comandos ejecutados y resultado

```
.venv/bin/python herramientas/datos_gestion.py   → 15 presupuestos, 10 facturas, 7 clientes
.venv/bin/python herramientas/enlaces.py         → 35 páginas comprobadas, 0 problemas
.venv/bin/python herramientas/movil.py /gestion/ /gestion/inicio/ /gestion/presupuestos/ /gestion/facturas/ /gestion/pedidos-proveedores/
                                                 → chromium: 5 páginas × 4 vistas, 0 problemas
.venv/bin/python herramientas/capturas.py /gestion/presupuestos/ /gestion/facturas/ → 4 capturas, sin errores
node -e "new Function(…gestion.js)"              → sintaxis OK
```
Prueba de extremo a extremo con Playwright (script temporal, 1280 px, también revisado a 390 px con capturas):
1. Presupuestos: 15 filas; PR-2026-0418 «Sin enviar / Enviar» → diálogo abierto con destinatario, asunto,
   plantilla («Estimado/a Laura:…»), adjunto `PR-2026-0418.pdf`; **Cancelar** cierra sin cambios; volver a abrir,
   cambiar el destinatario y **Confirmar** → fila «Enviado / Reenviar / Enviado el 07/10/2026», aviso de éxito,
   `sessionStorage` con el envío; **persiste tras recargar**; filtro «Sin enviar» pasa de 3 a 2; búsqueda
   «comunidad» → PR-2026-0415.
2. Facturas: 10 filas; marcar FV-0673 + FV-0670 (clientes distintos) → aviso; FV-0673 + FV-0672 (mismo cliente) →
   «Enviar las 2 juntas» → diálogo con 2 adjuntos y asunto «Facturas FV-2026-0673, FV-2026-0672 — …» → confirmar →
   ambas «Reenviar / Enviado el 07/10/2026», selección vaciada; «Reenviar» de FV-0652 abre con el correo del
   estudio; filtro «Sin enviar» queda en 0 filas con mensaje de vacío.
3. Inicio: solo quedan 2 etiquetas «En construcción» (proveedores y panel de mando).
Resultado: 0 errores JS, 0 respuestas ≥ 400, 0 peticiones externas. `/gestion/` sigue en `robots.txt` y fuera del
`sitemap.xml`; franja de demo en todas las pantallas.

## Commit

El inmediatamente posterior a `f1bdb4b` en `master`, asunto «Tarea 0003: presupuestos y facturas del panel de
gestión con envío por correo simulado». Incluye este informe.

## Observaciones

- El diálogo usa `<dialog>.showModal()` (Chrome 37+, Firefox 98+, Safari 15.4+); hay un fallback con el atributo
  `open` para navegadores sin soporte. Ha sido imposible probarlo en WebKit por el bloqueo de la tarea 0001.
- No hay pantalla de detalle de presupuesto/factura en la vista interna (la tarea no la pedía; el detalle hueco por
  hueco ya existe en el área de clientes). Lo dejo señalado en la nota «Propuesta» de cada listado.
