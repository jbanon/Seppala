---
name: 0003-envio-email-presupuestos-facturas
description: Presupuestos y facturas en el panel de gestión, con la acción de enviar/reenviar por email (demo, sin envío real)
metadata:
  type: project
---

# Tarea 0003 — Presupuestos y facturas con envío por email (demo)

> Depende de: [[0002-base-panel-gestion]] hecha. Contexto completo en
> `.arq/decisiones/ADR-0003-panel-gestion-interna-demo.md`.

## Qué construir

Dentro de `web/gestion/`:

- `web/gestion/presupuestos/index.html`: listado de presupuestos de **varios clientes de ejemplo** (no solo
  el cliente único de `area-clientes/`), con columnas similares a lo que ya usa `area-clientes/presupuestos/`
  (nº, fecha, proyecto/cliente, importe, estado) más una columna o botón de **Email** del cliente y la
  acción **Enviar** (o **Reenviar**, con la fecha del último envío, si ya se envió antes en esta sesión de
  demo).
- Acción **Enviar**: abre un diálogo (modal o panel, a tu criterio de diseño) con:
  - Destinatario (precargado desde el dato del cliente, editable).
  - Asunto (precargado con un texto razonable, p. ej. "Presupuesto Nº… — Aluminios Seppala", editable).
  - Nota de que se adjuntará el PDF del presupuesto y que, si no se edita el texto, se envía una plantilla
    por defecto (como ya hace Marchante, pero con tu propio texto, no copiado).
  - Botones Cancelar / Confirmar y enviar.
  - Al confirmar: **no se envía nada de verdad**. Muestra una confirmación visual (ej. aviso de éxito) y
    actualiza el botón de la fila a "Reenviar" con la fecha simulada (guardada en `sessionStorage`, mismo
    patrón que los cambios de `area-clientes/portal.js`).
- `web/gestion/facturas/index.html`: igual planteamiento que presupuestos, adaptado a facturas (puedes
  añadir selección múltiple con "Enviar varias" si aporta al diseño, no es obligatorio).
- Reutiliza o amplía los datos ya generados para presupuestos/facturas donde tenga sentido, pero en esta
  vista interna deben aparecer **varios clientes inventados** (nombres, obras y proyectos nuevos, coherentes
  con el negocio de Seppala: ventanas y puertas de aluminio/PVC, persianas, mosquiteras, motorización — no
  reutilices los datos de Marchante ni los inventes sin ton ni son). Genera el JSON necesario con una
  herramienta (amplía `herramientas/datos_demo.py` o crea una equivalente) para que quede reproducible, no a
  mano dentro del HTML.

## Qué NO hacer

- No implementes un envío de email real ni una cola de envíos: es una simulación visual.
- No toques `web/area-clientes/presupuestos/` ni `web/area-clientes/facturas/` (son la vista del cliente,
  no se tocan).
- No menciones a Marchante.

## Criterio de aceptación

- Flujo de principio a fin probado: listado → Enviar → confirmar → el botón pasa a "Reenviar" con fecha.
- Aviso de demo visible; sección fuera de `sitemap.xml`/`robots.txt` (ya heredado de 0002, compruébalo).
- `herramientas/enlaces.py` y `herramientas/movil.py` sin problemas en las páginas nuevas.
- Commit en castellano, solo con esta tarea.
- Informe en `.arq/informes/0003-envio-email-presupuestos-facturas.md`.
