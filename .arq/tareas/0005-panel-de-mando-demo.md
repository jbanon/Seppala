---
name: 0005-panel-de-mando-demo
description: Panel de mando (pantalla de inicio del portal de gestión) con indicadores simples a partir de los datos demo ya creados
metadata:
  type: project
---

# Tarea 0005 — Panel de mando (demo)

> Depende de: [[0002-base-panel-gestion]], [[0003-envio-email-presupuestos-facturas]] y
> [[0004-pedidos-proveedores-demo]] hechas (usa sus datos). Contexto completo en
> `.arq/decisiones/ADR-0003-panel-gestion-interna-demo.md`.

## Qué construir

Completa `web/gestion/inicio/index.html` (creada como placeholder en la tarea 0002) como un panel de mando
de verdad: un vistazo rápido al estado del trabajo, con **indicadores simples ("mini-KPI"), no un tablero
kanban complejo** — esa complejidad (fases de fabricación, círculos de estado por categoría de material) es
deliberadamente de Marchante y no se traslada aquí (ver ADR-0003).

Indicadores orientativos (ajusta a lo que tenga más sentido una vez veas los datos reales de las tareas
0003/0004; no hace falta implementar los seis):
- Presupuestos pendientes de enviar (cuenta de los que no se han enviado en los datos de 0003).
- Pedidos a proveedores en curso, por estado.
- Facturación del mes (suma de un conjunto de facturas de ejemplo con fecha del mes actual).
- Próximas entregas o pedidos pendientes de recibir.

Formato: tarjetas pequeñas con una etiqueta corta y una cifra grande (patrón tipo "mini-KPI": etiqueta en
mayúsculas pequeña + número grande debajo), más, si aporta, una lista corta de actividad reciente o de
pedidos/presupuestos que necesitan atención (p. ej. "3 presupuestos sin enviar", con enlace directo a
`/gestion/presupuestos/`). Prioriza que se vea bien y se entienda de un vistazo sobre que cubra todos los
indicadores posibles.

## Qué NO hacer

- No repliques el tablero de `_TarjetaPedido.cshtml`/`Tablero.cshtml` de Marchante (círculos concéntricos,
  fases, validación, stand-by): no encaja con el negocio de Seppala y añade complejidad que el usuario ha
  pedido evitar.
- No menciones a Marchante.

## Criterio de aceptación

- Los números de los indicadores salen de los JSON de datos reales de la demo (0003/0004), no están
  escritos a mano en el HTML.
- Enlaces desde el panel a las secciones correspondientes funcionan.
- Aviso de demo visible; `enlaces.py` y `movil.py` sin problemas.
- Commit en castellano, solo con esta tarea.
- Informe en `.arq/informes/0005-panel-de-mando-demo.md`.

## Al terminar

Esta es la última tarea de la ampliación pedida el 07/10/2026 (ver ADR-0003). Actualiza `CHECKLIST.md` con
una sección nueva para el panel de gestión interna (igual que ya existe para el área de clientes), y
`PREGUNTAS_CLIENTE.md` si queda algo que preguntar (p. ej. si quieren que esta demo también se les enseñe, o
si hay más acciones internas que les gustaría ver representadas).
