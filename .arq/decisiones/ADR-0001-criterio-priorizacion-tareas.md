---
name: ADR-0001-criterio-priorizacion-tareas
description: Criterio para elegir qué tarea asignar al programador cuando los 9 Goals ya están cerrados
metadata:
  type: project
---

# ADR-0001 — Criterio de priorización de tareas tras el cierre de los 9 Goals

## Contexto

A fecha de la primera auditoría (07/10/2026) los 9 Goals de `CLAUDE.md` están hechos y commiteados. Lo que
queda listado en `CHECKLIST.md` ("Pendiente del responsable del proyecto" y "Pendiente del cliente") son en
su mayoría decisiones externas (subdominio, remoto de GitHub, respuestas del cliente en
`PREGUNTAS_CLIENTE.md`) que el programador no puede resolver por su cuenta sin inventar datos, lo cual viola
el criterio no negociable del brief.

## Decisión

Mientras no lleguen respuestas del cliente o del responsable, las tareas que se asignen al programador en
`.arq/tareas/` se limitan a trabajo técnico que:
1. No dependa de un dato que haya que inventar o decidir por el cliente/responsable.
2. Sea verificable por el arquitecto leyendo el repositorio (no solo el informe del programador).
3. Deje el proyecto en un estado mejor sin tocar lo que ya está correctamente marcado como pendiente.

Ejemplos que SÍ encajan: completar una auditoría técnica que falta (WebKit), revisar consistencia interna,
mejorar cobertura de pruebas de las herramientas. Ejemplos que NO encajan: rellenar el NIF, decidir el
subdominio, elegir el destino del formulario, nombrar sistemas Cortizo sin confirmación — todo eso espera
respuesta externa y está correctamente bloqueado en `PREGUNTAS_CLIENTE.md`/`CHECKLIST.md`.

## Consecuencia

La primera tarea asignada ([[0001-auditoria-webkit]]) es la auditoría móvil con motor WebKit, el único punto
de calidad técnica pendiente que no depende de nadie más que de poder instalar una dependencia de sistema.
