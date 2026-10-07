# Datos de la demo del panel de gestión interna

**Todo es ficticio.** Los genera `herramientas/datos_gestion.py`; no editar a mano. Es la vista del personal de
Seppala (varios clientes y los proveedores a la vez), a diferencia de `web/area-clientes/datos/`, que es la vista
de un único cliente de ejemplo. Los nombres de clientes, obras y personas son inventados; los productos son los que
fabrica e instala Seppala (ventanas de aluminio y PVC, persianas, motores y mosquiteras).

Cada fichero tiene la forma `{ "meta": {…}, "datos": … }` e imita la respuesta del endpoint que algún día servirá
el sistema de gestión de Seppala:

| Fichero | Futuro endpoint (propuesta) | Contenido |
|---|---|---|
| `usuario.json` | `GET /api/v1/gestion/usuario` | Quién ha entrado (nombre, rol, correo) y datos de la empresa para el marco del panel |
| `presupuestos.json` | `GET /api/v1/gestion/presupuestos` · `POST …/enviar` | Presupuestos de **todos** los clientes: cliente (código, nombre, contacto, correo), obra, resumen de partidas, unidades, importes, estado interno (`redactado` = sin enviar · `enviado` · `revision` · `aceptado` · `rechazado` · `caducado`), PDF y `envios` ya registrados (fecha, destinatario, asunto) |
| `facturas.json` | `GET /api/v1/gestion/facturas` · `POST …/enviar` | Facturas de todos los clientes: cliente, obra, concepto, pedido, base, IVA, total, vencimiento, estado (`pendiente` · `pagada` · `vencida`), PDF y `envios` |

El cliente de ejemplo del área de clientes (C-02087) aparece aquí con sus mismos presupuestos y facturas (el
generador los importa de `datos_demo.py`), para que las dos demos cuadren. Los envíos hechos desde el panel en una
sesión se guardan en `sessionStorage` (`seppala-gestion-cambios`) y se suman a los `envios` del JSON; un presupuesto
`redactado` con algún envío pasa a verse como `enviado`. Los PDF adjuntos son los de muestra de
`/area-clientes/docs-demo/`. La siguiente entrega de la demo añade aquí los pedidos a proveedores.

Convenciones: fechas ISO `AAAA-MM-DD`, importes numéricos en euros, estados como claves en minúsculas (el texto
visible lo pone `gestion.js`). En `gestion.js`, la capa `api` es la única que conoce el origen de los datos: para
conectar la API real se cambia `API_BASE` y se elimina la capa de sesión.
