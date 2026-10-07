# Web corporativa Aluminios Seppala — Brief para el agente

## Contexto
Aluminios Seppala es un fabricante e instalador de carpintería metálica con más de 25
años de actividad, en Madrid. Fabrica e instala ventanas y puertas de aluminio y PVC,
cerramientos y fachadas a medida, vidrio (aislamiento térmico, acústico y de humedad),
persianas, motorización y mosquiteras. Trabaja desde pedidos pequeños hasta grandes
construcciones, con diseño, fabricación e instalación propios.

Su web actual es **https://www.aluminioseppala.com/** (WordPress). Hay permiso
explícito del cliente para reutilizar todos los recursos que haya en esa web: textos,
fotos, logos, catálogos y cualquier otro material. El encargo es **ampliar y mejorar**
esa web, no limitarse a copiarla: mismo contenido de fondo, aspecto mucho más cuidado y
profesional, mejor organización, y una funcionalidad nueva (área de clientes).

Este proyecto se monta **igual que el de Marchante PVC**
(`/home/dev/proyectos/GestionMarchante/webClientes/`), que es la referencia directa de
cómo trabajar aquí: mismo stack, misma forma de organizar carpetas y herramientas, mismo
criterio de diseño y de calidad. Antes de empezar, revisa ese proyecto entero (estructura
de `web/`, `herramientas/`, `recursos/`, el propio `CLAUDE.md`, y sobre todo el área de
clientes de demostración en `web/area-clientes/`) y reutiliza lo que aplique: convenciones
de nombres, patrón de componentes, forma de generar imágenes, auditoría móvil, aviso de
cookies, textos legales tipo, etc. No copies contenido de Marchante (PVC, Cortizo...),
solo el patrón de trabajo.

## Público
- Particulares que reforman vivienda o construyen.
- Profesionales: constructoras, arquitectos, promotores, otros instaladores.

Objetivo principal de la web: que el visitante pida presupuesto o contacte, y que un
cliente ya captado pueda ver el estado de sus pedidos en el área de clientes.

## Material disponible
No hay nada descargado todavía. Tienes acceso a internet: investiga
`https://www.aluminioseppala.com/` a fondo antes de diseñar nada. Como mínimo:
- Recorre todas las páginas (home, `/aluminios/`, `/pvc/`, `/productos/`, `/vidrio/`,
  `/persianas/`, `/automatismo/`, `/mosquiteras/`, `/componentes/`, `/asesoramiento/`,
  `/trabajos-realizados/`, `/noticias/`, `/contacto/`, `/aviso-legal-politica-privacidad/`,
  `/politica-de-cookies/`, `/mas-informacion-sobre-las-cookies/`). El sitemap de páginas
  está en `https://www.aluminioseppala.com/wp-sitemap-posts-page-1.xml` (compruébalo por
  si ha cambiado) y el de entradas en `wp-sitemap-posts-post-1.xml`.
- Descarga o referencia (según lo que permita cada recurso) los textos, fotos de obra,
  catálogos/PDF, logos de marcas con las que trabajan (perfiles de aluminio, PVC, vidrio,
  persianas, motorización) y cualquier dato de contacto, horario, ubicación o certificación
  que encuentres. Si una foto o texto no tiene calidad suficiente para la web nueva, busca
  alternativa (puedes usar recursos de los fabricantes/marcas que mencionen, igual que se
  hizo en Marchante con Cortizo e Indupanel) o dilo como pendiente en vez de inventar datos.
- Identifica las marcas/sistemas concretos que trabaja Seppala (perfilería de aluminio,
  sistema de PVC, vidrio, persianas, motorización) y, si se puede, usa sus webs oficiales
  como fuente de datos técnicos, igual que en Marchante se cotejó todo con Cortizo.
- **No inventes datos técnicos, legales ni de empresa** (NIF, dirección exacta, cifras de
  prestaciones, etc.). Lo que no puedas verificar en la web actual o en fuentes oficiales
  de las marcas, márcalo como pendiente de confirmar por el cliente, tal como se hizo en
  Marchante (`PREGUNTAS_CLIENTE.md`).

## Stack (igual que Marchante)
- Web estática HTML + CSS + JS, sin build ni framework. URLs limpias (`/seccion/` sirve
  `/seccion/index.html`).
- Mobile-first. Tipografía serif para titulares + sans para texto, tokens de color en CSS
  (adapta la paleta a la identidad de Seppala, no reutilices los tokens exactos de
  Marchante; si no hay manual de marca, propón una paleta coherente con su logo actual).
- `herramientas/comunes.py` para sincronizar cabecera/pie en todas las páginas desde
  plantillas (`herramientas/comunes/cabecera.html` y `pie.html`), igual que Marchante.
- Herramientas equivalentes a las de Marchante, adaptadas: generación de WebP desde
  `recursos/`, portadas de PDF, auditoría de móvil (sin texto <12px, objetivos táctiles
  <44px, sin scroll horizontal), comprobación de enlaces rotos, script de publicación.
- Aviso de cookies con consentimiento real (aceptar/rechazar con el mismo peso visual),
  política de cookies y de privacidad con lenguaje honesto, sin videos/iframes de terceros
  cargando sin consentimiento.
- Repositorio git propio (ya inicializado en este directorio). Commits en castellano,
  descriptivos. Aún no tiene remoto en GitHub: cuando el repo tenga contenido publicable,
  pregunta al usuario si quiere crear uno nuevo o indícale cómo hacerlo, no lo inventes.

## Alcance de páginas (de mínimos; amplía si la investigación lo justifica)
- Portada.
- Aluminio: sistemas/ventanas y puertas de aluminio (equivalente a `/aluminios/`).
- PVC: sistemas/ventanas y puertas de PVC (equivalente a `/pvc/`).
- Vidrio (equivalente a `/vidrio/`).
- Persianas (equivalente a `/persianas/`).
- Automatismo / motorización (equivalente a `/automatismo/`).
- Mosquiteras (equivalente a `/mosquiteras/`).
- Componentes/accesorios (equivalente a `/componentes/`).
- Asesoramiento (equivalente a `/asesoramiento/`): cómo es el proceso de principio a fin.
- Trabajos realizados: galería de obra con fotos reales (si las hay y tienen calidad).
- Noticias/actualidad, si aporta algo (si no, se puede prescindir o dejar como sección
  menor; usa tu criterio y explica la decisión).
- Empresa/Quiénes somos: trayectoria, los 25+ años, reconocimientos (hay subvenciones de
  la Comunidad de Madrid mencionadas en la web actual: verifícalo e inclúyelo si procede).
- Contacto, con formulario (mismo patrón que Marchante: sin servicio de envío conectado
  todavía, un único punto para cambiar el `action` del formulario cuando se decida).
- Aviso legal, Política de privacidad, Política de cookies.
- Sitemap.xml, robots.txt.
- Menú reorganizado con criterio propio (no copies la estructura de Marchante tal cual si
  no encaja): agrupa de forma que un visitante entienda rápido qué fabrica Seppala y a
  quién se dirige cada cosa.

## Área de clientes (NUEVO, solo demostración)
No existe hoy en la web de Seppala: es la ampliación que pide el cliente. Debe verse y
sentirse real, pero ser 100% demo, exactamente con el mismo planteamiento que
`web/area-clientes/` en el proyecto de Marchante:
- Login que acepta cualquier usuario/contraseña, con aviso visible de que es una demo y
  los datos son ficticios.
- Datos de ejemplo en JSON (pedidos, presupuestos, facturas/albaranes, incidencias,
  documentación técnica, datos de cuenta), coherentes con el negocio de Seppala
  (ventanas/puertas de aluminio y PVC, persianas, etc., no copies los datos de Marchante).
- Páginas: inicio del portal, pedidos (listado + detalle), presupuestos (listado +
  detalle), facturas/albaranes, incidencias (listado + detalle + alta), documentación
  técnica, datos de cuenta.
- Deja claro en el propio portal y en un comentario en el código que es una demo
  navegable con datos ficticios, igual que se hizo en Marchante.

## Goals (ejecútalos en este orden; cada uno debe dejar el repo en un estado consistente
y commiteado antes de pasar al siguiente)

1. **Investigación y auditoría.** Recorre toda la web actual de Seppala y sus redes/
   fuentes que encuentres enlazadas. Escribe un `INVESTIGACION.md` con: inventario de
   páginas y su contenido real, inventario de imágenes y PDF reutilizables (con su
   calidad), marcas/sistemas que trabajan, datos de contacto/empresa verificados, y una
   lista de preguntas abiertas para el cliente (equivalente a `PREGUNTAS_CLIENTE.md` de
   Marchante) con todo lo que no hayas podido verificar.
2. **Recursos.** Reúne en `recursos/` lo reutilizable (textos extraídos por página en
   markdown, imágenes, logos de marcas, PDF/catálogos), igual que `contenido/paginas/` y
   `recursos/` en Marchante. Si una imagen clave no tiene calidad suficiente, busca
   alternativa de la marca correspondiente o anótalo como pendiente.
3. **Diseño.** Define la identidad visual (paleta, tipografías, tono) coherente con el
   logo y la marca actuales de Seppala, y los componentes base (cabecera, pie, botones,
   tarjetas, formularios, aviso de cookies) en `web/css/estilo.css`. Cuida tanto escritorio
   como móvil desde el primer momento.
4. **Herramientas.** Monta en `herramientas/` el equivalente a las de Marchante que
   necesites: generación de imágenes WebP, sincronización de cabecera/pie, auditoría
   móvil, comprobación de enlaces, script de publicación local (puede apuntar a una ruta
   de pruebas tipo `/var/www/aluminioseppala-pruebas/`, confirma con el usuario el dominio
   o subdominio de pruebas antes de automatizar su publicación pública).
5. **Páginas de contenido.** Construye todas las páginas del alcance, con las migas de
   pan, SEO básico (title, meta description, canonical, sitemap) y textos cotejados con la
   información real investigada, no genéricos de relleno.
6. **Área de clientes demo.** Monta el portal completo descrito arriba.
7. **Legal y cookies.** Aviso legal, privacidad y cookies con datos reales de la empresa
   que hayas podido verificar (marca como pendiente lo que no); banner de consentimiento
   funcional.
8. **Calidad.** Pasa auditoría móvil (sin texto <12px, objetivivos táctiles ≥44px, sin
   scroll horizontal) y de enlaces rotos en todas las páginas; corrige lo que falle.
9. **Cierre.** Deja un `CHECKLIST.md` con el estado de cada punto (hecho / pendiente de
   cliente / decisión tomada y por qué), y un resumen final legible para el usuario de qué
   se ha construido, qué decisiones se han tomado por cuenta propia y qué preguntas quedan
   abiertas.

## Criterios de calidad (no negociables)
- Nunca inventar datos de empresa, legales o técnicos: marcar como pendiente.
- Nunca dejar contenido de ejemplo/relleno (lorem ipsum, "texto pendiente" visible al
  usuario final) en una página que no esté señalada como en construcción.
- Cookies: nada de terceros (vídeos embebidos, mapas, etc.) se carga sin consentimiento
  explícito.
- Todo el texto del área de clientes y de cualquier dato ficticio debe decir claramente
  que es una demostración.
- Commits frecuentes y descriptivos en castellano a medida que avanzas, no un único commit
  gigante al final.
