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

Las siguientes entregas de la demo añaden aquí presupuestos y facturas (de varios clientes, con el registro de
envíos por correo) y pedidos a proveedores.

Convenciones: fechas ISO `AAAA-MM-DD`, importes numéricos en euros, estados como claves en minúsculas (el texto
visible lo pone `gestion.js`). En `gestion.js`, la capa `api` es la única que conoce el origen de los datos: para
conectar la API real se cambia `API_BASE` y se elimina la capa de sesión.
