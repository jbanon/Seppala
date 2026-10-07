---
name: 0001-auditoria-webkit
description: Completar la auditoría móvil con motor WebKit (Safari de iPhone) pendiente en CHECKLIST.md §6
metadata:
  type: project
---

# Tarea 0001 — Auditoría móvil con motor WebKit

## Contexto

`CHECKLIST.md` §6 marca como `[r]` **no probado** la auditoría móvil con el motor WebKit (el que usa Safari
de iPhone), por faltar una dependencia de sistema. Es el único punto de calidad técnica del Goal 8 que
queda abierto y que no depende de ninguna respuesta del cliente ni del responsable del proyecto — solo de
instalar esa dependencia. El resto del proyecto (9 Goals, recursos, herramientas, legal, demo del área de
clientes) está completo y verificado; no toques nada de eso en esta tarea.

**Importante**: el stack del proyecto sigue siendo web estática HTML/CSS/JS, sin cambios (ver
`.arq/decisiones/ADR-0002-conflicto-stack-dotnet.md`). Esta tarea no tiene relación con eso.

## Qué hacer

1. Instalar las dependencias de sistema de WebKit para Playwright:
   ```
   sudo .venv/bin/playwright install-deps webkit
   ```
   Si tu modo de permisos requiere confirmación para `sudo`, pídela explícitamente en vez de omitir el
   paso o simularlo.
2. Ejecutar la auditoría con motor WebKit sobre todas las páginas:
   ```
   .venv/bin/python herramientas/movil.py --motor webkit
   ```
3. Si aparece algún problema (texto < 12px, zona táctil < 44px, scroll horizontal, elemento fijo que tapa
   contenido) que no aparecía con Chromium, corrígelo en el CSS/HTML correspondiente de `web/` y vuelve a
   pasar `movil.py` con ambos motores hasta que ambos den 0 problemas.
4. Actualizar `CHECKLIST.md` §6: cambiar la fila de WebKit de `[r] No probado` a `[x]` con el resultado
   (páginas × vistas, problemas encontrados y corregidos si los hubo). Si alguna corrección afecta a una
   decisión ya documentada en §5, añade una entrada nueva en vez de reescribir las existentes.
5. Si la instalación de dependencias de sistema **no es posible** en este entorno (p. ej. no hay acceso a
   `sudo` o falla por otra razón), no lo fuerces: deja constancia exacta del error en tu informe y en
   `CHECKLIST.md` §7 (quién tiene que resolverlo), sin marcar la tarea como hecha.
6. Commit en castellano, descriptivo, solo con este cambio (no mezclar con otras ediciones).

## Criterio de aceptación

- `movil.py --motor webkit` ejecutado sobre las 29 páginas públicas (todas menos quizá alguna excluida ya
  en el script) con 0 problemas, **o** un informe claro de por qué no se pudo ejecutar.
- `CHECKLIST.md` §6 y, si procede, §7 actualizados para reflejar el resultado real.
- Ningún cambio fuera de lo necesario para esta auditoría (no tocar contenido, legal, demo, ni otras
  herramientas).
- Informe en `.arq/informes/0001-auditoria-webkit.md`: qué comando ejecutaste, qué resultado diste, qué
  commit(s) corresponde(n).
