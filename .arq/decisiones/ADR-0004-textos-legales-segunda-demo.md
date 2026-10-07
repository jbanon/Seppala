---
name: ADR-0004-textos-legales-segunda-demo
description: Ampliar aviso legal y política de privacidad para cubrir también la demo del panel de gestión interna
metadata:
  type: project
---

# ADR-0004 — Cubrir la segunda demo en los textos legales

## Contexto

El informe de la tarea 0005 (ver `.arq/informes/0005-panel-de-mando-demo.md`) señala que `web/aviso-legal/`
y `web/privacidad/` solo mencionan explícitamente la demo del área de clientes (`/area-clientes/`), redactados
antes de que existiera la segunda demo, `/gestion/` (ADR-0003). No hay nada falso en el texto actual, pero
queda incompleto: ahora hay dos demostraciones con datos ficticios, no una.

## Decisión

Aceptada la redacción que propuso el programador en su informe, con pequeños ajustes de estilo si hace
falta al implementarla:
- `web/aviso-legal/`, apartado "Objeto": mencionar las dos demostraciones (área de clientes y panel de
  gestión interna) en vez de solo una.
- `web/privacidad/` §9: extender la explicación de "no se tratan datos personales reales" a la demo del
  panel de gestión (ni usuario/contraseña reales, ni envíos de correo reales; los cambios se guardan solo en
  el navegador del visitante).

## Consecuencia

Tarea para el programador: [[0006-legal-segunda-demo]]. De paso, corrige una nota obsoleta en
`CHECKLIST.md` §7 que todavía dice que el repositorio remoto "no existe" (ya se creó y se hizo `push` el
07/10/2026, ver `.arq/decisiones/ADR-0002-conflicto-stack-dotnet.md` y `.arq/bitacora.md`).
