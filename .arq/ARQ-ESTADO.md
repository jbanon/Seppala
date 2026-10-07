# Estado del proyecto (vista del arquitecto)

> Se reescribe entero en cada revisión. Última revisión: **07/10/2026**, tras primera auditoría completa
> del repositorio por el ARQUITECTO. Commit auditado: `286d87a` (Goal 9, HEAD de `master`).

## Resumen

Los 9 Goals de `CLAUDE.md` están hechos y commiteados (10 commits: brief + 9 goals, uno por goal, en
castellano). La auditoría de esta revisión ha comprobado el repositorio real (`git log`, estructura de
`web/`, `recursos/`, `herramientas/`, contenido de `CHECKLIST.md`, `PREGUNTAS_CLIENTE.md`,
`INVESTIGACION.md`) y ha contrastado una muestra de datos técnicos y de empresa contra fuentes externas.
**No se ha encontrado ninguna desviación del stack ni dato inventado.** Ver detalle en la bitácora
([[bitacora]]).

## Qué está hecho (verificado, no solo de oído del programador)

- **Stack correcto**: web estática HTML/CSS/JS sin build; Python solo como herramienta de autoría
  (`herramientas/*.py`, ejecutadas con `.venv/bin/python`); publicación por `rsync` a una ruta local vía
  `herramientas/publicar.sh` + `despliegue/aluminioseppala-pruebas.nginx.conf` (nginx estático, sin
  servidor de aplicación Python). Nada que montar un backend de producción.
- **28 páginas** (`index.html` por carpeta) + `404.html` + `sitemap.xml` + `robots.txt` + `.htaccess`,
  cubriendo el alcance mínimo del brief (aluminio, PVC, vidrio, persianas, motorización, mosquiteras,
  complementos, asesoramiento, trabajos realizados, empresa, contacto, legal/privacidad/cookies), más el
  área de clientes demo (12 pantallas).
- **Sin datos inventados** en la muestra verificada externamente: teléfono, email, direcciones (contacto
  vs. legal), NIF, y las cifras técnicas de Kömmerling RolaPlus (Usb 0,79 W/m²K, 50 dB, clase 4) y Guardian
  Sun (1,1 W/m²K, 43 % radiación, 70 % luz) coinciden exactamente con las fichas oficiales. El NIF
  encontrado en el aviso legal antiguo (A83404772) se ha marcado correctamente como pendiente de
  confirmar por el cliente en vez de darlo por bueno sin más — buena práctica, ver [[trampas]].
- **`sitemap.xml`/`robots.txt`/canonical apuntan al dominio real** `www.aluminioseppala.com` (no a una URL
  de pruebas): es el mismo patrón que usa el proyecto de referencia Marchante (sustituirá a la web actual
  en el mismo dominio), no es un error.
- **Sin contenido de relleno visible**: el único "PENDIENTE" que queda en `web/` es el `action` del
  formulario de contacto (`web/contacto/index.html`), gestionado explícitamente por JS y documentado como
  provisional; no es visible como texto para el usuario.
- **Herramientas** (`herramientas/LEEME.md`) completas y documentadas: `comunes.py`, `imagenes.py`,
  `video.py`, `portadas.py`, `enlaces.py`, `movil.py` (incluye `--motor webkit`, aún no ejecutado),
  `capturas.py`, `publicar.sh`, `importar_antigua.py`, `extraer_textos.py`, `datos_demo.py`, `pdf_demo.py`.
- **Documentos de gobierno del propio proyecto** al día: `INVESTIGACION.md`, `PREGUNTAS_CLIENTE.md`,
  `CHECKLIST.md`, `REDIRECCIONES.md`.

## Stack: confirmado, sin cambios (ver [[ADR-0002-conflicto-stack-dotnet]])

El 07/10/2026 el usuario pidió en mitad de esta auditoría pasar el stack a .NET + SQL Server "como el resto
de proyectos". Se confirmó con él antes de tocar nada: **Seppala sigue siendo web estática**; la migración a
.NET solo se plantearía en el futuro, si el área de clientes deja de ser una demo y pasa a desarrollo real
con datos de verdad (registrado sin fecha como BL-0011). No es una tarea actual.

## Repositorio remoto: ya creado y publicado

`git@github.com:jbanon/Seppala.git`, rama `master`, con los 10 commits existentes ya empujados (07/10/2026).
BL-0003 cerrado.

## Qué falta (y de quién depende)

Ver [[backlog]] para la lista con id. En resumen, todo lo que queda **no depende del programador** sino de:
- **Responsable del proyecto**: subdominio de pruebas, instalar dependencias de WebKit (necesita `sudo`),
  confirmar licencias de material de catálogo de fabricantes, alojamiento/DNS final.
- **Cliente**: dirección correcta, NIF y datos registrales, horario, destino del formulario, nombres de
  sistemas Cortizo/Persycom, revisión legal por gestoría — todo recogido en `PREGUNTAS_CLIENTE.md`.

La única pieza de calidad técnica pendiente que **sí puede ejecutar el programador sin esperar a nadie**
es la auditoría móvil con motor WebKit (Safari de iPhone), que solo falta por una dependencia del sistema.
Es la tarea asignada ahora: [[0001-auditoria-webkit]].

## Próxima revisión

Cuando el programador reporte en `.arq/informes/`, releer el informe + `git diff` del commit
correspondiente (no fiarse solo del texto del informe), actualizar este fichero y dejar la siguiente tarea.
