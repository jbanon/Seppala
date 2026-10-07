---
name: ADR-0003-panel-gestion-interna-demo
description: Nueva sección de demo "Gestión" (uso interno del personal), inspirada en tres pantallas reales de GestionMarchante, añadida al alcance original de CLAUDE.md
metadata:
  type: project
---

# ADR-0003 — Panel de gestión interna (demo), ampliación de alcance

## Contexto

El usuario ha pedido (07/10/2026) ampliar la demo con tres piezas que existen **de verdad** en la
aplicación interna de gestión de Marchante (`/home/dev/proyectos/GestionMarchante/GestionMarchante/`, una
app ASP.NET Core en C#, stack completamente distinto al de Seppala), representadas aquí **solo como HTML
ficticio sin lógica real**:

1. Envío de presupuestos y facturas por email (botón "Enviar"/"Reenviar" con modal).
2. Pedidos a proveedores (listado, ficha de pedido, historial, recepción).
3. Panel de mando (indicadores del estado del trabajo en curso).

Esto **se suma** a `CLAUDE.md`, no lo sustituye: el área de clientes (`web/area-clientes/`) sigue siendo la
demo que ve un cliente externo (sus propios pedidos, presupuestos, facturas…), ya completa y commiteada
como Goal 6. Esto es nuevo.

## Por qué va en una sección separada, no dentro de `area-clientes/`

Las tres piezas pedidas (enviar un presupuesto por email, generar un pedido a un proveedor, ver el panel de
mando de producción) son acciones que hace **el personal de Seppala**, no el cliente. Un cliente no envía su
propio presupuesto por email ni gestiona pedidos a Cortizo o Kömmerling. Meterlo dentro de `area-clientes/`
confundiría los dos roles. Decisión: nueva sección hermana, **`/gestion/`** (demo de uso interno/personal),
con su propio acceso simulado — mismo mecanismo que `area-clientes/` (cualquier usuario/contraseña, aviso de
demo), pero un login y un "quién soy" distintos (personal de Seppala, no un cliente).

## Qué se mira de Marchante y cómo (investigación hecha por el arquitecto, 07/10/2026)

Solo se ha leído el marcado (`.cshtml`) de las pantallas señaladas por el usuario, para entender **qué
información se muestra y qué acciones ofrece cada una** — nunca su código C# ni su JSON de ejemplo, y nada
de eso se copia:

- **Envío por email** (`Pages/Sheets/Presupuestos.cshtml`, `Facturas.cshtml`): botón "Enviar" por fila (pasa
  a "Reenviar" con fecha si ya se envió antes); modal con *Destinatario* (precargado), *Asunto* (precargado,
  editable), cuerpo opcional ("si no editas el email, se envía la plantilla por defecto con el PDF
  adjunto"), botones Cancelar / Confirmar y enviar. Facturas añade "Enviar varias" (selección múltiple,
  solo si son del mismo cliente).
- **Pedidos a proveedores** (`Pages/Pedidos/`): pestañas por proveedor/categoría; `HistorialPedidos.cshtml`
  lista pedidos con nº, fecha, proveedor, nº de artículos y estado (badge: Pendiente/Parcial/Completado/
  Cancelado, con un desplegable de detalle por línea: código, descripción, pedidas/recibidas/restantes);
  `RecepcionPedidos.cshtml` muestra pedidos "en tránsito" como tarjetas (nº, proveedor, fecha, estado) y, al
  entrar en uno, una ficha con cada línea y un campo de cantidad recibida más un botón "Rellenar pedido
  completo" y "Confirmar recepción". `GenerarPedido.cshtml` es mucho más complejo (cálculo de demanda desde
  stock y presupuestos en curso): **no se traslada esa complejidad**, solo la idea de "elegir proveedor,
  añadir artículos, enviar pedido" de forma simple.
- **Panel de mando** (`Pages/PanelMando/`): `Tablero.cshtml`/`_TarjetaPedido.cshtml` son un kanban muy
  elaborado (círculos concéntricos por categoría de material, fases de fabricación, validación, stand-by…),
  específico de cómo Marchante fabrica ventanas: **no se traslada**, es demasiado complejo para una demo y
  no encaja con el negocio de Seppala tal cual. Lo que sí se traslada es el patrón más simple de
  `Informes.cshtml`: tarjetas "mini-KPI" (etiqueta pequeña en mayúsculas + cifra grande) y una tabla corta
  de actividad reciente.

## Decisión de alcance para Seppala

- **Ruta**: `/gestion/` (login demo) → `/gestion/inicio/` (panel de mando, página de aterrizaje tras entrar).
- **Secciones**: `/gestion/presupuestos/` y `/gestion/facturas/` (listado interno + acción de enviar/reenviar
  por email, demo), `/gestion/pedidos-proveedores/` (listado + ficha + historial, demo; sin generación de
  pedido por cálculo de demanda — eso queda fuera, es la parte más compleja y menos visual de Marchante).
- **Proveedores de ejemplo**: los reales de Seppala ya identificados en `INVESTIGACION.md` (Cortizo para
  aluminio, Kömmerling para PVC y persianas RolaPlus, Saint-Gobain/Guardian para vidrio, Somfy/Nice/Gaviota
  para motorización), no los de Marchante (Procomsa, Cortizo con otro uso, etc.) ni sus datos de ejemplo.
- **Datos**: el panel de gestión debe sentirse como una vista de varios clientes a la vez (a diferencia de
  `area-clientes/`, que es la vista de un único cliente de ejemplo) — nuevos ficheros JSON de ejemplo,
  generados con una herramienta nueva o ampliando `datos_demo.py`, con nombres y obras inventados distintos
  a los ya usados.
- **Nada real**: ningún envío de email de verdad, ningún backend, ningún dato que salga de este repositorio.
  Mismo patrón que `area-clientes/portal.js`: una capa `api` que hoy lee JSON y simula cambios en
  `sessionStorage`, pensada para conectarse a un backend real el día que exista.
- **Prioridad explícita del usuario: diseño sobre completitud.** Pocas pantallas muy cuidadas, no un
  sistema funcional completo. Si hay que recortar alcance, se recorta función, no cuidado visual.
- **Fuera de buscadores** igual que `area-clientes/`: `noindex`, excluido de `sitemap.xml` y bloqueado en
  `robots.txt`, aviso de demo visible y en el código.

## Secuencia de tareas

Se parte en 4 tareas encadenadas (cada una deja el repo consistente y commiteado antes de la siguiente),
después de la tarea ya asignada ([[0001-auditoria-webkit]], que sigue siendo la inmediata):
- [[0002-base-panel-gestion]] — estructura, acceso demo, navegación.
- [[0003-envio-email-presupuestos-facturas]] — presupuestos y facturas con acción de enviar.
- [[0004-pedidos-proveedores-demo]] — pedidos a proveedores.
- [[0005-panel-de-mando-demo]] — panel de mando (inicio), con KPIs que ya pueden apoyarse en los datos de
  las dos tareas anteriores.
