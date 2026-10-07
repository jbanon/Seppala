# Backlog

Estado: `abierto` · `asignado` · `bloqueado` · `cerrado`.

| id | descripción | estado | bloqueado por | dónde |
|---|---|---|---|---|
| BL-0001 | Auditoría móvil con motor WebKit (Safari de iPhone): instalar dependencias y ejecutar `movil.py --motor webkit` | asignado | — (solo depende de poder instalar deps de sistema) | [[0001-auditoria-webkit]] |
| BL-0002 | Subdominio de pruebas: crear `/var/www/aluminioseppala-pruebas/` y fijar `server_name` en `despliegue/aluminioseppala-pruebas.nginx.conf` | bloqueado | responsable del proyecto | `CHECKLIST.md` §7 |
| BL-0003 | Repositorio remoto en GitHub | **cerrado** (07/10/2026) | — | `git@github.com:jbanon/Seppala.git`, rama `master` con push hecho |
| BL-0011 | Migración futura del área de clientes a .NET + SQL Server **cuando** deje de ser demo y pase a desarrollo real (decisión del usuario, no antes) | abierto, sin fecha | desarrollo real del backend de clientes | [[ADR-0002-conflicto-stack-dotnet]] |
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
