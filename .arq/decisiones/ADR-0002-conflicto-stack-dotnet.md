---
name: ADR-0002-conflicto-stack-dotnet
description: Conflicto entre el stack ya construido (web estática) y una petición del usuario de usar .NET + SQL Server
metadata:
  type: project
---

# ADR-0002 — Conflicto de stack: web estática (ya construida) vs. .NET + SQL Server (petición nueva)

## Estado

**Resuelto (07/10/2026).** El usuario confirmó: *"vale si. queda como web estática. Si a futuro
desarrollamos la parte de clientes lo migraremos a .net"*. Conclusión:
- El stack de Seppala **sigue siendo web estática HTML/CSS/JS**, sin cambios respecto a `CLAUDE.md`. No se
  toca `web/`, `herramientas/` ni `recursos/` por este motivo.
- Queda registrado como **decisión futura, no actual**: si el área de clientes pasa de demo a un desarrollo
  real con pedidos/datos de verdad, en ese momento (y no antes) se migraría a .NET + SQL Server, igual que
  el resto de proyectos del usuario en este entorno. Hasta entonces el área de clientes sigue siendo 100 %
  demo con JSON estático, tal como pide el Goal 6 de `CLAUDE.md`.
- El remoto de GitHub ya se creó y se ha hecho `push` de los 10 commits actuales a
  `git@github.com:jbanon/Seppala.git` (rama `master`), resolviendo [[backlog]] BL-0003.

## Contexto

El 07/10/2026, mientras el arquitecto completaba la primera auditoría del proyecto (ver [[bitacora]]), el
usuario escribió, en mitad de la revisión: *"El stack tecnologico debe ser .net con sql server como el
resto de proyectos"*, y a continuación dio la URL de un repositorio remoto recién creado
(`https://github.com/jbanon/Seppala.git`).

Esto entra en conflicto directo con:
- `CLAUDE.md` de este proyecto, que especifica explícitamente web estática HTML/CSS/JS sin backend ni
  base de datos, montada **igual que** `/home/dev/proyectos/GestionMarchante/webClientes/` (que también es
  estática).
- El encargo que recibió el propio arquitecto para gobernar este proyecto, que advertía expresamente: *"a
  diferencia de la mayoría de proyectos con los que puedas estar familiarizado aquí (aplicaciones ASP.NET
  Core / .NET con Razor Pages), este proyecto no es .NET"* — es decir, ya se anticipaba esta posible
  confusión con el patrón habitual del resto del entorno de trabajo del usuario.
- El trabajo ya hecho y verificado: los 9 Goals del brief están completos y commiteados sobre el stack
  estático, con datos contrastados contra fuentes oficiales (ver bitácora del 07/10/2026). Rehacerlo en
  .NET + SQL Server no es un ajuste menor: implica una reescritura completa (páginas HTML → Razor Pages,
  demo del área de clientes en JSON estático → esquema de SQL Server + backend real, `herramientas/*.py` de
  autoría dejarían de tener sentido tal cual, publicación por `rsync` a nginx estático → despliegue de una
  aplicación .NET).

## Por qué no se actúa todavía

Cambiar el stack de un proyecto ya completado y verificado, por una instrucción de una frase recibida en
mitad de otra tarea, sin confirmar que no es una confusión con otro proyecto del usuario (el propio brief
ya avisa de que "el resto de proyectos" de este entorno suelen ser .NET, lo cual hace plausible la
confusión), es una decisión de alcance mayor que debe confirmar el usuario explícitamente antes de tocar
`web/`, `herramientas/` o `recursos/`.

## Qué se ha hecho mientras tanto

- Se ha añadido el remoto `origin` al repositorio git (`git remote add origin
  https://github.com/jbanon/Seppala.git`), que es una acción reversible y explícitamente proporcionada por
  el usuario (resuelve [[backlog]] BL-0003). No se ha hecho `push` todavía, a la espera de confirmar el
  punto del stack, ya que una de las dos situaciones siguientes cambia qué contenido conviene publicar.
- No se ha escrito ni una línea de código .NET ni se ha tocado el contenido existente.
- Se ha preguntado al usuario para desambiguar antes de proceder.

## Próximo paso

Según la respuesta del usuario:
- **Si confirma que Seppala debe pasar a .NET + SQL Server**: esto implica reabrir el brief del proyecto
  (`CLAUDE.md`) con el usuario antes de que el programador reescriba nada, porque cambia el documento de
  especificación que gobierna los 9 Goals, no solo el código. Habría que decidir qué se conserva (contenido,
  textos cotejados, imágenes, investigación, decisiones legales) y qué se descarta (toda la capa de
  herramientas Python de autoría, el patrón de Marchante como referencia).
- **Si fue una confusión con otro proyecto**: se descarta esta ADR como resuelta sin cambios, se deja
  constancia aquí, y se continúa con el plan existente ([[ADR-0001-criterio-priorizacion-tareas]]).
