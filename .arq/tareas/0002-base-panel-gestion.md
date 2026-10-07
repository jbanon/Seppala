---
name: 0002-base-panel-gestion
description: Estructura base del nuevo portal de demo "Gestión" (uso interno), acceso simulado y navegación
metadata:
  type: project
---

# Tarea 0002 — Base del panel de gestión interna (demo)

> Depende de: nada (se puede hacer en paralelo o después de [[0001-auditoria-webkit]], que sigue siendo la
> tarea inmediata si no se ha hecho ya). Ver contexto completo en
> `.arq/decisiones/ADR-0003-panel-gestion-interna-demo.md` — léelo entero antes de empezar.

## Qué construir

Una nueva sección de demo, **de uso interno/personal de Seppala** (no de clientes), hermana de
`web/area-clientes/`:

- `web/gestion/index.html`: acceso simulado (mismo mecanismo que `area-clientes/index.html`: cualquier
  usuario/contraseña entra), pero con textos para personal interno, no para un cliente. Aviso de demo bien
  visible. `noindex`.
- `web/gestion/inicio/index.html`: página de aterrizaje tras "entrar", de momento con la navegación a las
  secciones (presupuestos, facturas, pedidos a proveedores) aunque todavía no tengan contenido final — esta
  pantalla se completará como panel de mando de verdad en [[0005-panel-de-mando-demo]]. No dejes contenido
  de relleno visible: usa un estado "en construcción" explícito y discreto en las tarjetas que aún no
  tengan pantalla, si hace falta.
- Navegación propia de esta sección (cabecera/menú lateral o superior, como prefieras dado el contenido):
  Inicio (panel de mando) · Presupuestos · Facturas · Pedidos a proveedores. Sigue el lenguaje visual ya
  establecido (`web/css/estilo.css`, tokens existentes), no inventes una paleta nueva.
- Capa de datos: sigue el mismo patrón que `web/area-clientes/portal.js` (una capa `api` que hoy lee JSON de
  `web/gestion/datos/` y simula cambios en `sessionStorage`, pensada para un backend futuro). Puedes
  extender `portal.js` o crear un fichero equivalente para esta sección (decide tú cuál encaja mejor sin
  duplicar innecesariamente); documenta la decisión en un comentario, como ya hace `portal.js`.
- `web/gestion/datos/`: de momento solo lo que necesites para el login y la navegación (p. ej. quién es el
  "usuario" de la demo — nombre, rol). Los datos de presupuestos/facturas/pedidos llegan en las siguientes
  tareas.

## Qué NO hacer en esta tarea

- No implementes todavía presupuestos, facturas ni pedidos a proveedores: eso es
  [[0003-envio-email-presupuestos-facturas]] y [[0004-pedidos-proveedores-demo]].
- No toques `web/area-clientes/` ni sus datos.
- No menciones a Marchante en ningún texto ni comentario visible; esto es una demo propia de Seppala.

## Criterio de aceptación

- `web/gestion/` fuera de `sitemap.xml` y bloqueado en `robots.txt` (igual que `/area-clientes/`).
- Aviso de demo visible en todas las pantallas de esta sección y comentario en el código.
- `herramientas/enlaces.py` y `herramientas/movil.py` pasan sin problemas sobre las páginas nuevas.
- Funciona de principio a fin: entrar con cualquier usuario/contraseña → ver `inicio/` con la navegación.
- Commit en castellano, descriptivo, solo con esta tarea.
- Informe en `.arq/informes/0002-base-panel-gestion.md`.
