---
name: 0006-legal-segunda-demo
description: Actualizar aviso legal y privacidad para cubrir la demo del panel de gestión interna; corregir nota obsoleta sobre el remoto de GitHub
metadata:
  type: project
---

# Tarea 0006 — Legal de la segunda demo + corrección menor

> Contexto: `.arq/decisiones/ADR-0004-textos-legales-segunda-demo.md`. Tarea corta, dos cambios de texto.

## Qué hacer

1. **`web/aviso-legal/index.html`**, apartado "Objeto": donde dice que la web sirve para "mostrar una
   demostración del área de clientes", amplíalo para cubrir también el panel de gestión interna. Revisa
   también si hay un `<h3>`/apartado dedicado a "Área de clientes (demostración)" y, si lo hay, añade una
   frase equivalente para `/gestion/` (puedes basarte en la propuesta del informe de la tarea 0005, con tu
   propio criterio de redacción, no hace falta copiarla literal).
2. **`web/privacidad/index.html`** §9 (o el apartado que trate la demo del área de clientes): añade que lo
   mismo aplica a la demo del panel de gestión interna — no comprueba usuario ni contraseña reales, y los
   cambios (envíos simulados de presupuestos/facturas, recepciones de material) se guardan solo en el
   navegador del visitante, igual que ya se explica para `/area-clientes/`.
3. **`CHECKLIST.md` §7**: corrige la frase que dice que el repositorio remoto en GitHub "no existe" — ya se
   creó y se hizo `push` el 07/10/2026 (`git@github.com:jbanon/Seppala.git`, rama `master`). Marca ese punto
   como hecho.

## Qué NO hacer

- No cambies nada más del aviso legal ni de la privacidad (direcciones, NIF, etc. siguen pendientes de
  confirmación del cliente, no los toques).
- No renumeres apartados existentes si no es necesario.

## Criterio de aceptación

- Los dos textos legales mencionan ambas demos sin ambigüedad.
- `CHECKLIST.md` §7 ya no dice que el remoto "no existe".
- `herramientas/enlaces.py` sigue en 0 problemas.
- Commit en castellano, solo con esta tarea.
- Informe en `.arq/informes/0006-legal-segunda-demo.md`.
