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

---

## 2026-10-07 — Subdominio seppala.winsoft.es: configuración de nginx

El usuario redirigió el DNS de `seppala.winsoft.es` a este servidor (compartido con otras webs:
`clientesmarchante.winsoft.es`, `gd.winsoft.es`, etc.) y pidió configurar nginx para verlo ahí. Se auditó la
configuración real del servidor (`/etc/nginx/sites-available/`, patrón Certbot ya usado en los otros sitios)
en vez de inventar una configuración genérica, y se adaptó `despliegue/seppala.winsoft.es.nginx.conf`
(renombrado desde el placeholder `aluminioseppala-pruebas.nginx.conf`) siguiendo exactamente el patrón de
`clientesmarchante.conf` (root propio, `noindex` por ser subdominio de revisión, logs propios, a la espera
de que Certbot añada HTTPS). `herramientas/publicar.sh` actualizado a `/var/www/seppala`.

No se pudo completar el alta en el servidor: `sudo` requiere contraseña interactiva que no se puede dar por
este medio (confirmado con `sudo -n`; solo hay `NOPASSWD` para `nginx -t`, `systemctl reload nginx` y dos
servicios concretos, no para crear ficheros en `/etc/nginx/sites-available/` ni para `certbot`). Se dejaron
los comandos exactos para que el responsable los ejecute él mismo (ver `despliegue/LEEME-despliegue.md`).
Commits `8b62b5e` y siguientes.

**Aprendizaje para [[trampas]]:** en este servidor, antes de escribir una configuración de nginx desde cero,
mirar cómo están montados los sitios ya existentes (`/etc/nginx/sites-available/`) — hay un patrón
establecido (Certbot, `/var/www/<nombre-subdominio>`, logs propios) que conviene seguir para no desentonar
con el resto de webs que comparten el servidor.

---

## 2026-10-07 — Ampliación: panel de gestión interna (demo)

El usuario pidió sumar al alcance de `CLAUDE.md` una demo de uso interno (no de clientes) inspirada en tres
pantallas reales de la aplicación de gestión de Marchante (`GestionMarchante`, ASP.NET Core/C#, un stack
totalmente distinto): envío de presupuestos/facturas por email, pedidos a proveedores, y panel de mando.
Se leyó el marcado (`.cshtml`) de las pantallas señaladas — solo para entender qué información y qué
acciones ofrece cada una, nunca su código ni sus datos de ejemplo — y se tradujo a un alcance deliberadamente
más simple para Seppala, priorizando diseño sobre completitud (como pidió el usuario): se descarta el cálculo
de demanda de `GenerarPedido.cshtml` y el kanban de fases de `Tablero.cshtml`/`_TarjetaPedido.cshtml` por ser
la parte más compleja y menos visual, y específica de cómo fabrica Marchante.

Decisión y alcance completos en [[ADR-0003-panel-gestion-interna-demo]]. Tareas dejadas en cola, encadenadas:
[[0002-base-panel-gestion]], [[0003-envio-email-presupuestos-facturas]], [[0004-pedidos-proveedores-demo]],
[[0005-panel-de-mando-demo]] (backlog BL-0012 a BL-0015). No se ha tocado código de producción: solo lectura
de Marchante (sin copiar nada) y escritura dentro de `.arq/`.

---

## 2026-10-07 — Revisión de las tareas 0001–0005 y confirmación del usuario sobre el panel de mando

El programador reportó las 5 tareas en cola (commits `a600ae1`, `f1bdb4b`, `09ce7b1`, `474bb06`, `40ff9b5`).
Se verificó **sin fiarse solo del informe**: se volvió a ejecutar `herramientas/enlaces.py` (37 páginas, 0
problemas) y `herramientas/movil.py /gestion/inicio/` (0 problemas) de forma independiente, se comprobó que
`/gestion/` está excluido de `sitemap.xml` y bloqueado en `robots.txt`, y se leyó el apartado nuevo "3 bis"
de `CHECKLIST.md`. Todo coincide con lo que reportó el programador.

La tarea 0001 (WebKit) sigue bloqueada por falta de `sudo`, documentado correctamente en su informe en vez
de omitirse o simularse — buena práctica, coherente con [[trampas]].

En paralelo, el usuario escribió (tras un primer mensaje interrumpido sobre un pedido de otro sistema, ajeno
a este proyecto, que no se ha tenido en cuenta por no ser aplicable aquí): *"Es muy interesante la parte del
panel de mando. Aunque sea simplificado tenemos que incluir esa parte también"*. Coincide exactamente con lo
ya decidido y hecho en la tarea 0005 (panel de mando simplificado, sin el kanban de Marchante): no hace
falta ningún cambio de alcance, solo confirmar que ya está.

El informe de la 0005 planteó tres puntos al arquitecto: (1) los textos legales no cubren la segunda demo —
aceptado, ver [[ADR-0004-textos-legales-segunda-demo]] y tarea [[0006-legal-segunda-demo]]; (2)
`CHECKLIST.md` §7 tiene una frase obsoleta sobre el remoto de GitHub — se corrige en la misma tarea; (3) sin
enlace público a `/gestion/` desde el menú o el pie — decisión correcta, se mantiene así (es una demo interna,
no un destino para visitantes).
