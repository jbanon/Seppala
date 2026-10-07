---
name: 0004-pedidos-proveedores-demo
description: Pedidos a proveedores en el panel de gestión — listado, ficha y historial (demo, sin generación de pedido por cálculo de demanda)
metadata:
  type: project
---

# Tarea 0004 — Pedidos a proveedores (demo)

> Depende de: [[0002-base-panel-gestion]] hecha. Contexto completo en
> `.arq/decisiones/ADR-0003-panel-gestion-interna-demo.md`.

## Qué construir

Dentro de `web/gestion/pedidos-proveedores/`:

- **Listado** (`index.html`): pedidos a los proveedores reales de Seppala ya identificados en
  `INVESTIGACION.md` (Cortizo para aluminio, Kömmerling para PVC y persianas, Saint-Gobain/Guardian para
  vidrio, Somfy/Nice/Gaviota para motorización, y el proveedor de mosquiteras si consta). Puedes organizarlo
  por pestañas de proveedor o por una tabla única con columna de proveedor, a tu criterio de diseño. Columnas
  orientativas: nº de pedido, fecha, proveedor, nº de artículos, estado (Pendiente / Parcial / Completado /
  Cancelado, con un color por estado).
- **Ficha de pedido** (`detalle/index.html` o similar, con id por query string como ya hace
  `area-clientes/pedidos/detalle/`): líneas del pedido (código, descripción, cantidad pedida, recibida,
  restante), y una acción simple para simular la recepción (marcar cantidad recibida y ver cómo cambia el
  estado), guardada en `sessionStorage` como el resto de la demo.
- **Historial** (`historial/index.html` o una pestaña/filtro dentro del listado, a tu criterio): vista de
  pedidos ya completados o cancelados, con filtro por proveedor y por estado.
- Datos: nuevo JSON de ejemplo (`web/gestion/datos/pedidos-proveedores.json` o similar), generado con una
  herramienta (amplía `herramientas/datos_demo.py` o crea una equivalente), con artículos y cantidades
  coherentes con lo que fabrica/instala Seppala (perfiles de aluminio, perfiles y persianas de Kömmerling,
  vidrio, motores Somfy/Nice, mosquiteras…). No inventes referencias de producto que suenen a un fabricante
  real sin verificar — usa descripciones genéricas tipo "Perfil serie corredera, color blanco" si no tienes
  una referencia real verificada, igual que se ha hecho en el resto de la web con los sistemas sin nombrar.

## Qué NO hacer

- No repliques `GenerarPedido.cshtml` de Marchante (cálculo de demanda desde stock y presupuestos en curso):
  es la parte más compleja y menos visual, y el usuario ha pedido priorizar diseño sobre completitud. Si
  quieres una pantalla de "nuevo pedido", que sea simple: elegir proveedor, añadir artículos a mano, enviar.
  Es opcional, no es criterio de aceptación.
- No menciones a Marchante ni reutilices sus datos de ejemplo.

## Criterio de aceptación

- Listado → ficha de un pedido → simular recepción → el estado cambia, coherente de principio a fin.
- Historial muestra al menos pedidos completados y uno cancelado, con filtro funcionando.
- Aviso de demo visible; páginas nuevas cubiertas por `enlaces.py` y `movil.py` sin problemas.
- Commit en castellano, solo con esta tarea.
- Informe en `.arq/informes/0004-pedidos-proveedores-demo.md`.
