# Estado del proyecto (vista del arquitecto)

> Se reescribe entero en cada revisión. Última revisión: **07/10/2026**, tras verificar las 5 tareas
> commiteadas por el programador (0001 a 0005). Commit auditado: `40ff9b5` (Tarea 0005, HEAD de `master`).

## Resumen

Los 9 Goals de `CLAUDE.md` están hechos (auditados el 07/10/2026, sin desviaciones ni datos inventados, ver
bitácora). Encima de eso, el usuario pidió una ampliación — el panel de gestión interna, demo de uso del
personal (ADR-0003) — y el programador ha hecho sus 4 tareas (0002 a 0005); la 0001 (auditoría WebKit) quedó
documentada como bloqueada por `sudo`, no por el programador. Verificado independientemente (no solo el
informe): `enlaces.py` 37 páginas 0 problemas, `movil.py` sobre `/gestion/inicio/` 0 problemas, `/gestion/`
fuera de `sitemap.xml` y bloqueado en `robots.txt`, `CHECKLIST.md` tiene su apartado "3 bis" con el detalle.
El usuario confirmó explícitamente que quiere el panel de mando aunque sea simplificado — ya está hecho así
(cuatro indicadores tipo mini-KPI, sin el kanban de fases de Marchante, ver ADR-0003).

## Qué está hecho

- **Los 9 Goals del brief** (`CLAUDE.md`), verificados el 07/10/2026: stack estático correcto, 28 páginas +
  área de clientes, sin datos inventados (contrastado con fuentes oficiales), sin contenido de relleno.
  Detalle completo en la entrada de bitácora de esa fecha.
- **Repositorio remoto**: `git@github.com:jbanon/Seppala.git`, rama `master`, publicado. BL-0003 cerrado.
- **Subdominio de pruebas `seppala.winsoft.es`**: configuración lista (`despliegue/seppala.winsoft.es.nginx.conf`,
  `herramientas/publicar.sh` → `/var/www/seppala`); **falta que el responsable ejecute el alta en el servidor**
  (pasos con `sudo` en `despliegue/LEEME-despliegue.md`, el arquitecto no puede ejecutarlos). BL-0002 en curso.
- **Panel de gestión interna (demo), `web/gestion/`** — ampliación pedida el 07/10/2026, ver
  [[ADR-0003-panel-gestion-interna-demo]]:
  - Acceso simulado propio, independiente del de `area-clientes/`.
  - Inicio = panel de mando: 4 indicadores (presupuestos sin enviar, pedidos a proveedores en curso,
    facturación del mes, pendiente de cobro) calculados de los JSON, no escritos a mano; lista "Necesita
    atención", próximas entregas, últimos movimientos.
  - Presupuestos y facturas de 7 clientes ficticios con acción Enviar/Reenviar por email (simulada, sin
    correo real) y diálogo editable.
  - Pedidos a proveedores (Cortizo, Kömmerling, Guardian Glass, Saint-Gobain, Somfy, Nice, Gaviota — los
    proveedores reales de `INVESTIGACION.md`, no los de Marchante): listado con progreso, ficha con
    recepción simulada, historial con filtros.
  - Deliberadamente recortado frente a Marchante: sin cálculo de demanda de stock, sin kanban de fases.
  - `noindex`, fuera de `sitemap.xml`, bloqueado en `robots.txt`, aviso de demo en cada pantalla.
  - BL-0012 a BL-0015 cerrados. `CHECKLIST.md` tiene su apartado "3 bis".

## Pendiente de este ciclo: textos legales de la segunda demo

El programador señaló en su informe de la 0005 que `web/aviso-legal/` y `web/privacidad/` solo mencionan la
demo de `area-clientes/`, no la nueva de `/gestion/`. Aceptado como [[ADR-0004-textos-legales-segunda-demo]]:
tarea [[0006-legal-segunda-demo]] asignada (también corrige una nota obsoleta en `CHECKLIST.md` §7 que decía
que el remoto de GitHub "no existe", cuando ya se creó). BL-0016.

## Stack: confirmado, sin cambios (ver [[ADR-0002-conflicto-stack-dotnet]])

Seppala sigue siendo web estática. La migración a .NET + SQL Server solo se plantearía en el futuro, si el
área de clientes deja de ser una demo y pasa a desarrollo real (BL-0011, sin fecha, no es tarea actual).

## Qué falta (y de quién depende)

Ver [[backlog]]. No depende del programador:
- **Responsable del proyecto**: ejecutar el alta de `seppala.winsoft.es` (BL-0002), instalar dependencias de
  WebKit (BL-0001, necesita `sudo`), confirmar licencias de material de catálogo de fabricantes (BL-0005),
  alojamiento/DNS final del dominio de producción (BL-0010).
- **Cliente**: dirección correcta, NIF y datos registrales, horario, destino del formulario, nombres de
  sistemas Cortizo/Persycom, revisión legal por gestoría, y ahora también si quiere ver la demo de gestión y
  qué proveedores faltan (mosquiteras, lamas) — todo en `PREGUNTAS_CLIENTE.md`.

## Tarea asignada ahora

[[0006-legal-segunda-demo]] — corta, dos textos legales + una corrección de `CHECKLIST.md`.

## Próxima revisión

Cuando el programador reporte la 0006, releer el informe + `git diff` (no fiarse solo del texto), actualizar
este fichero. Si no hay más tareas en cola tras eso, el proyecto vuelve a quedar a la espera de respuestas
externas (cliente/responsable) — revisar `PREGUNTAS_CLIENTE.md` y `CHECKLIST.md` §7/§8 antes de inventar una
tarea nueva, siguiendo [[ADR-0001-criterio-priorizacion-tareas]].
