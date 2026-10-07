# Bitácora (append-only)

---

## 2026-10-07 — Primera auditoría del arquitecto

**Punto de partida:** repositorio en `286d87a` (HEAD de `master`), los 9 Goals de `CLAUDE.md` marcados
como hechos por el programador (commits `baf06a4`..`286d87a`, 10 commits en total, uno por goal más el
brief inicial). Working tree limpio.

**Comprobado (no solo leído el informe/CHECKLIST del programador):**
- `git log --oneline` y `git status`: 10 commits, árbol limpio, confirma el relato del CHECKLIST.
- Estructura real de `web/` (28 `index.html` + `404.html` + `sitemap.xml` + `robots.txt` + `.htaccess`),
  `recursos/` (120 ficheros versionados) y `herramientas/` (12 scripts + `LEEME.md`).
- `.gitignore`: `antigua/` (espejo de la web actual, material bruto), `.venv/`, `referencia/capturas/*`
  y `recursos/video/*.mp4` correctamente excluidos del repo; nada de esto estaba mal versionado.
- `despliegue/aluminioseppala-pruebas.nginx.conf` y `herramientas/publicar.sh`: confirmado que el stack es
  estático de verdad (nginx + `rsync`), sin Python como servidor de producción. Sin desviación del stack.
- Búsqueda de `lorem ipsum`/`PENDIENTE`/"texto pendiente" visible en `web/*.html`: solo aparece el
  `action` del formulario de contacto, gestionado por JS y documentado como provisional, no visible al
  usuario. Sin contenido de relleno.
- Canonical/sitemap/robots apuntan a `https://www.aluminioseppala.com/` (dominio real, no de pruebas):
  confirmado que es el mismo patrón que usa el proyecto de referencia Marchante (`marchantepvc.com`), no es
  un error.
- Contraste externo de una muestra de datos:
  - Teléfono, email y dirección de contacto de la web antigua (`www.aluminioseppala.com/contacto/`):
    coinciden con lo publicado en el proyecto.
  - Aviso legal antiguo: NIF A83404772 y dirección C/ Habana 18 nave 7 — coinciden con lo que el proyecto
    usa en sus textos legales, y el NIF está correctamente marcado como pendiente de confirmar por el
    cliente en `PREGUNTAS_CLIENTE.md` 1.2 en vez de darse por bueno sin más.
  - Ficha técnica oficial de Kömmerling RolaPlus (búsqueda web): Usb desde 0,79 W/m²K, 50 dB, clase 4 de
    permeabilidad — coincide exactamente con el texto de `web/persianas/index.html`.
  - Datos de Guardian Sun (búsqueda web, ficha/fuentes oficiales): 1,1 W/m²K, 43 % radiación solar, 70 %
    luz — coincide exactamente con `web/vidrio/index.html`.
  - No se ha encontrado ningún dato inventado en la muestra revisada.
- Repo: 43 MB en `.git`, 28 MB en `web/`; vídeos de `web/video/` (6,2 y 10,9 MB) correctamente versionados
  (son parte de lo que sirve `web/`); nada de tamaño anómalo.

**Conclusión:** no se ha encontrado ninguna desviación que corregir. El trabajo del programador es sólido y
está bien verificado contra fuentes externas, no inventado. Primera estructura `.arq/` creada para
gobernar el proyecto a partir de ahora (ver `ARQ-ESTADO.md`, `trampas.md`, `backlog.md`,
`decisiones/ADR-0001-*.md`).

**Tarea dejada:** [[0001-auditoria-webkit]] — único punto de calidad técnica pendiente (CHECKLIST.md §6)
que el programador puede resolver sin esperar respuesta de nadie más.

---

## 2026-10-07 — Mensaje del usuario en mitad de la auditoría: conflicto de stack + remoto de GitHub

Mientras se completaba la auditoría anterior, el usuario escribió dos mensajes: (1) que el stack "debe ser
.net con sql server como el resto de proyectos", y (2) la URL de un repositorio remoto ya creado
(`https://github.com/jbanon/Seppala.git`).

El punto (1) contradecía directamente `CLAUDE.md` y el propio encargo recibido por el arquitecto (que ya
avisaba de esta posible confusión con el patrón .NET habitual del resto del entorno del usuario), así que
en vez de empezar a reescribir un proyecto completo y verificado por una frase suelta, se abrió
[[ADR-0002-conflicto-stack-dotnet]] y se preguntó directamente al usuario antes de tocar nada.

**Respuesta del usuario:** confirma que Seppala sigue siendo web estática; el cambio a .NET + SQL Server
solo se haría en el futuro, si el área de clientes pasa de demo a desarrollo real. Queda registrado como
BL-0011, sin fecha, no accionable ahora.

Sobre el punto (2): se añadió el remoto `origin` por SSH (`git@github.com:jbanon/Seppala.git`, las
credenciales HTTPS no estaban disponibles pero la clave SSH del usuario sí está dada de alta en GitHub) y,
con su confirmación explícita, se hizo `push -u origin master`: los 10 commits existentes ya están
publicados en GitHub. BL-0003 cerrado.

**Aprendizaje para [[trampas]]:** cuando llega una instrucción que contradice el brief de un proyecto ya
avanzado, parar y preguntar en vez de ejecutar, incluso si la instrucción es corta y suena tajante — aquí
evitó descartar sin necesidad 9 Goals completos y verificados.
