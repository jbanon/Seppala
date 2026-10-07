# Informe 0001 — Auditoría móvil con motor WebKit

**Estado: BLOQUEADA (no hecha).** Necesita `sudo` con contraseña, que no puedo dar desde esta sesión.
Fecha: 07/10/2026. Tarea: `.arq/tareas/0001-auditoria-webkit.md`.

## Qué hice, en orden

1. Comprobé que el navegador WebKit de Playwright **sí está descargado**: `~/.cache/ms-playwright/webkit-2359`
   (Playwright 1.63.0, `.venv/bin/playwright --version`).
2. Intenté lanzarlo directamente desde Python (`p.webkit.launch()`), para no depender de suposiciones. Falla con:
   ```
   BrowserType.launch:
   ╔══════════════════════════════════════════════════════╗
   ║ Host system is missing dependencies to run browsers. ║
   ║ Missing libraries:                                   ║
   ║     libgtk-4.so.1                                    ║
   ║     libpangocairo-1.0.so.0                           ║
   ║     libgdk_pixbuf-2.0.so.0                           ║
   ║     libcairo-gobject.so.2                            ║
   ║     libgraphene-1.0.so.0                             ║
   ║     libevent-2.1.so.7                                ║
   ║     libopus.so.0                                     ║
   ║     … (libsoup-3.0, libwayland-*, libflite*, libavif, libjxl, libenchant-2, libmanette…)
   ```
3. `.venv/bin/playwright install-deps webkit --dry-run` → «Missing system dependencies (237)» (gtk4, gstreamer,
   libavcodec, hunspell, etc.). No instalé nada.
4. `sudo -n -l` confirma que el usuario solo tiene `NOPASSWD` para `nginx -t`, `systemctl reload nginx` y el
   restart/status de dos servicios; para todo lo demás pide contraseña:
   ```
   $ sudo -n .venv/bin/playwright install-deps webkit
   sudo: interactive authentication is required
   ```
5. **No simulé ni omití el paso.** Siguiendo el punto 5 de la tarea, dejé constancia en `CHECKLIST.md` §7 (fila
   «WebKit»: error exacto, nº de paquetes, quién lo resuelve y los dos comandos). El apartado §6 sigue en
   `[r] No probado`, como pide la tarea («sin marcar la tarea como hecha»).

## Lo que tiene que ejecutar el responsable (con el prefijo `!` en su sesión)

```
! sudo /home/dev/proyectos/AluminiosSeppala/.venv/bin/playwright install-deps webkit
```
y a continuación (ya sin sudo):
```
! cd /home/dev/proyectos/AluminiosSeppala && .venv/bin/python herramientas/movil.py --motor webkit
```
En cuanto se ejecute lo primero, la tarea 0001 puede reanudarse tal cual (pasos 2–4 y 6 de la tarea): no hay
nada más que preparar.

## Ficheros tocados y commit

- `CHECKLIST.md`: solo la fila «WebKit» del §7 (1 línea). Nada más.
- Commit: el inmediatamente posterior a `f936b1a` en `master`, asunto «Tarea 0001: documenta el bloqueo de la
  auditoría WebKit (faltan dependencias de sistema, requiere sudo)». Incluye este informe.

## Observación fuera del alcance (no tocada, para el arquitecto)

`CHECKLIST.md` §7 todavía dice «[r] Repositorio remoto en GitHub: no existe», pero `ARQ-ESTADO.md` da BL-0003
por cerrado (`git@github.com:jbanon/Seppala.git`, `origin` ya configurado). No lo he corregido porque la tarea
pedía no tocar nada más; conviene actualizarlo cuando se revise el CHECKLIST (la tarea 0005 pide tocarlo).
