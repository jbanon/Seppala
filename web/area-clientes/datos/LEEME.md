# Datos de la demo del área de clientes

**Todo es ficticio.** Los genera `herramientas/datos_demo.py`; no editar a mano. Los nombres de clientes, obras,
personas y direcciones son inventados; los productos son los que fabrica e instala Seppala (ventanas de aluminio y
PVC, muro cortina, persianas, motores y mosquiteras).

Cada fichero tiene la forma `{ "meta": {…}, "datos": … }` e imita la respuesta del endpoint que algún día servirá
el sistema de gestión de Seppala:

| Fichero | Futuro endpoint (propuesta) | Contenido |
|---|---|---|
| `cliente.json` | `GET /api/v1/cliente` | Empresa, direcciones de entrega e instalación, usuarios, comercial, condiciones, avisos |
| `presupuestos.json` | `GET /api/v1/presupuestos` · `GET …/{id}` · `POST …/{id}/aceptar` | Cabecera, obra, líneas (familia, sistema, apertura, medidas, color, vidrio, persiana), importes, estado, PDF |
| `pedidos.json` | `GET /api/v1/pedidos` · `GET …/{id}` | Cinco fases con fecha (aceptado, medición, en fabricación, instalación programada, instalado), fecha prevista de instalación, datos de instalación, líneas |
| `facturas.json` | `GET /api/v1/facturas` | Importes, vencimiento, estado de pago, PDF |
| `albaranes.json` | `GET /api/v1/albaranes` | Actas de instalación: bultos, unidades, quién firma, PDF |
| `incidencias.json` | `GET /api/v1/incidencias` · `POST /api/v1/incidencias` | Tipo, asunto, descripción, fotos, historial |
| `documentos.json` | `GET /api/v1/documentos` | Fichas y folletos oficiales de las marcas (PDF reales de `/docs/`) y guías de la web |

Convenciones: fechas ISO `AAAA-MM-DD`, importes numéricos en euros, identificadores de texto (`PR-`, `PE-`, `FV-`,
`AL-`, `IN-`), estados como claves en minúsculas (el texto visible lo pone el portal). En `portal.js`, la capa `api`
es la única que conoce el origen de los datos: para conectar la API real se cambia `API_BASE` y se elimina la capa
de sesión. Las fases del pedido son una propuesta (PREGUNTAS_CLIENTE.md 6.2).
