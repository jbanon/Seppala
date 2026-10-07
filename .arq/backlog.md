# Backlog

Estado: `abierto` · `asignado` · `bloqueado` · `cerrado`.

| id | descripción | estado | bloqueado por | dónde |
|---|---|---|---|---|
| BL-0001 | Auditoría móvil con motor WebKit (Safari de iPhone) | **bloqueado** (sudo, no se puede instalar `playwright install-deps webkit`) | responsable ejecute la instalación | [[0001-auditoria-webkit]], `.arq/informes/0001-auditoria-webkit.md` |
| BL-0002 | Subdominio de pruebas `seppala.winsoft.es`: falta ejecutar el alta en el servidor (`despliegue/LEEME-despliegue.md`, requiere sudo) | **en curso** (07/10/2026) | el responsable ejecute el alta (dado el paso, el arquitecto publica) | `despliegue/seppala.winsoft.es.nginx.conf` |
| BL-0003 | Repositorio remoto en GitHub | **cerrado** (07/10/2026) | — | `git@github.com:jbanon/Seppala.git`, rama `master` con push hecho |
| BL-0011 | Migración futura del área de clientes a .NET + SQL Server **cuando** deje de ser demo y pase a desarrollo real (decisión del usuario, no antes) | abierto, sin fecha | desarrollo real del backend de clientes | [[ADR-0002-conflicto-stack-dotnet]] |
| BL-0012 | Panel de gestión interna (demo): base + acceso | **cerrado** (07/10/2026) | — | [[0002-base-panel-gestion]], commit `f1bdb4b` |
| BL-0013 | Panel de gestión interna (demo): presupuestos/facturas con envío por email | **cerrado** (07/10/2026) | — | [[0003-envio-email-presupuestos-facturas]], commit `09ce7b1` |
| BL-0014 | Panel de gestión interna (demo): pedidos a proveedores | **cerrado** (07/10/2026) | — | [[0004-pedidos-proveedores-demo]], commit `474bb06` |
| BL-0015 | Panel de gestión interna (demo): panel de mando / inicio | **cerrado** (07/10/2026), confirmado por el usuario ("muy interesante... hay que incluirla") | — | [[0005-panel-de-mando-demo]], commit `40ff9b5` |
| BL-0016 | Textos legales de la segunda demo + corrección de nota obsoleta sobre el remoto en `CHECKLIST.md` §7 | asignado | — | [[0006-legal-segunda-demo]], [[ADR-0004-textos-legales-segunda-demo]] |
| BL-0004 | `action` del formulario de contacto (`web/contacto/index.html`) | bloqueado | cliente (pregunta 5.1) | `PREGUNTAS_CLIENTE.md` §5 |
| BL-0005 | Licencias de material de catálogo (fotos/vídeos Cortizo, PDF Kömmerling/Saint-Gobain) en uso provisional | bloqueado | responsable / marcas | `CHECKLIST.md` §7 |
| BL-0006 | Datos de empresa: dirección única, NIF + datos registrales, horario, redes sociales, "25+ años" | bloqueado | cliente | `PREGUNTAS_CLIENTE.md` §1 |
| BL-0007 | Nombres de sistemas Cortizo/Persycom a publicar (aluminio, PVC, persianas) | bloqueado | cliente | `PREGUNTAS_CLIENTE.md` §2 |
| BL-0008 | Fotos reales de obras de Seppala para `/trabajos-realizados/` (hoy son imágenes de catálogo rotuladas como tal) | bloqueado | cliente | `PREGUNTAS_CLIENTE.md` §3 |
| BL-0009 | Revisión de los textos legales por la gestoría del cliente | bloqueado | cliente | `PREGUNTAS_CLIENTE.md` §4 |
| BL-0010 | Alojamiento final y DNS | bloqueado | responsable | `CHECKLIST.md` §7 / `PREGUNTAS_CLIENTE.md` §7.2 |

Los bloqueados no se asignan como tarea del programador (ver [[ADR-0001-criterio-priorizacion-tareas]]):
inventar la respuesta violaría el criterio no negociable de `CLAUDE.md` de no inventar datos de empresa,
legales o técnicos.
