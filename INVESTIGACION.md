# Aluminios Seppala · Investigación y auditoría de la web actual

> Goal 1 del brief (`CLAUDE.md`). Hecho el 07/10/2026 sobre el espejo `antigua/www.aluminioseppala.com/`
> (descarga con wget del mismo día; **solo lectura**, no versionado) y sobre fuentes externas que se citan
> en cada apartado. Lo que **no** se ha podido verificar está marcado como *pendiente* y recogido en
> `PREGUNTAS_CLIENTE.md`. Nada de lo que figura aquí es inventado: cada dato lleva su fuente.

## 1. Fuentes consultadas

| Fuente | Qué aporta | Fiabilidad |
|---|---|---|
| `antigua/www.aluminioseppala.com/` (espejo wget, 218 ficheros en `uploads/`, 80 MB) | Todo el contenido actual: 17 páginas HTML, 88 imágenes originales, 2 vídeos MP4 | Alta (es la web del cliente) |
| `https://www.aluminioseppala.com/wp-sitemap-posts-page-1.xml` (comprobado en vivo el 07/10/2026) | 16 páginas; **no ha cambiado** respecto al espejo. Sin `lastmod` | Alta |
| `wp-sitemap-posts-post-1.xml` (en vivo) | 1 sola entrada: `/hola-mundo/` (la entrada de ejemplo de WordPress) | Alta |
| `recursos/textos/*.md` | Texto de cada página extraído del espejo con `herramientas/extraer_textos.py` | Alta (extracción automática; conserva erratas del original) |
| Informa (directorio de empresas) | Fecha de constitución, forma jurídica, CNAE, nº de empleados, dirección registral | Media (directorio comercial, no el Registro Mercantil) |
| TrustLocal | Dirección «C. Portugal 16», 16 reseñas, nota 7,9/10, horario «desconocido» | Baja (agregador) |
| Nominatim (OpenStreetMap), geocodificación inversa de las coordenadas del mapa de Google de `/contacto/` | El mapa apunta al Distrito III de Alcalá de Henares, código postal 28806 | Media |
| Webs oficiales de marcas (Cortizo, Kömmerling, Guardian, Saint-Gobain, Somfy) y prensa sectorial (Interempresas) | Identificación de los sistemas y fabricantes citados en la web antigua | Alta para la identificación; los datos técnicos se cotejarán en el Goal 5 |
| Búsquedas de redes sociales | **No se ha encontrado** ningún perfil de la empresa en Instagram, Facebook ni LinkedIn | — |

Herramientas del sistema comprobadas para los goals 2–4: Python 3.14 en `.venv` (Pillow, Playwright, BeautifulSoup,
markdownify), Chromium de Playwright **OK**, WebKit **no arranca** (faltan librerías del sistema; requiere
`sudo .venv/bin/playwright install-deps webkit`, igual que en Marchante), `pdftoppm` y `gs` disponibles,
`rsync` disponible, `ffmpeg` del sistema **no** (hay un binario de Playwright en `~/.cache/ms-playwright/ffmpeg-1011/`).

## 2. La web actual en dos párrafos

WordPress 5.9.19 con el tema Divi 4.2 (sin actualizar desde 2019: todas las imágenes están en
`uploads/2019/02..04` y el único texto reciente es el de las ayudas públicas de la portada). Menú plano de 13
entradas en mayúsculas (INICIO · PRODUCTOS · ALUMINIOS · PVC · COMPONENTES · VIDRIO · PERSIANAS · AUTOMATISMO ·
MOSQUITERAS · ASESORAMIENTO · TRABAJOS REALIZADOS · NOTICIAS · CONTACTO). Tipografías de Google Fonts
(Oswald, Nunito Sans, Kanit, Abel). Color dominante: azul `#2c90c3` (29 usos en el CSS de la portada), con verde
`#86bf01` puntual. Sin meta description en ninguna página. Titles del tipo «ALUMINIOS | Aluminios Seppala».

Carga terceros **sin consentimiento**: Google Fonts, reCAPTCHA de Google (en todas las páginas con formulario),
un iframe de Google Maps en `/contacto/`, y el plugin «Asesor de Cookies» (aviso informativo, no de consentimiento).
La política de cookies habla de Google Analytics y de botones de redes sociales, pero en el HTML del espejo **no
hay** código de Analytics ni botones sociales: el texto está desfasado respecto a lo que realmente hace la web.
Formularios: Contact Form 7 (campos nombre, email, teléfono, consulta y casilla de privacidad) en portada,
asesoramiento y contacto. Pie: «© Aluminios Seppala. Todos los derechos reservados | Aviso legal | Política de
privacidad | CLICKA2.ES» (la agencia que la hizo).

## 3. Inventario de páginas y contenido real

Texto completo de cada una en `recursos/textos/<slug>.md`. «Reutilizable» indica qué parte vale como
contenido de fondo para la web nueva (se redacta de nuevo, sin cambiar los datos).

| URL antigua | Qué contiene de verdad | Reutilizable | Destino en la web nueva |
|---|---|---|---|
| `/` | Slider de 3 frases («Carpintería de aluminio y PVC», «Su proyecto es nuestro compromiso», «Realizamos todo tipo de proyectos»); formulario «Solicite presupuesto»; presentación («más de 25 años», «Aluminios Seppala S.A.», rapidez de entrega, eficacia, calidad); vídeo `aislamiento-termico.mp4`; 4 bloques (Aluminio y PVC · Materiales de alta calidad · Profesionalidad · Presupuestos sin compromiso); 4 productos (Aluminios, PVC, Vidrios, Persianas); teléfono y email; **texto de dos ayudas públicas** (ver §6) | Sí: toda la presentación y los 4 bloques son el discurso real de la empresa | Portada + `/empresa/` (ayudas y trayectoria) |
| `/productos/` | Presentación («equipo altamente cualificado», «nosotros le asesoramos») y 4 enlaces (Aluminio, PVC, Persianas, Vidrios; los dos últimos apuntan por error a `/componentes/`) | Sí, el párrafo | `/productos/` (índice de ventanas y cerramientos) |
| `/aluminios/` | Abatibles (canal europeo, **80 mm de marco**, estanqueidad, ahorro energético), correderas (rotura de puente térmico con pletinas de poliamida, «hasta un 60 %» de ahorro, vidrios de hasta **26 mm**), «sistemas minimalistas» (muro cortina), fachadas y lucernarios (montantes/travesaños, presor continuo, tapeta); 33 imágenes (renders Cortizo y fotos de ambiente); bloque «Instalador oficial» con logo Cortizo | Sí, es la página más completa | `/aluminios/` con anclas por tipología |
| `/pvc/` | Abatibles y correderas de PVC, con Cortizo citado por su nombre («contamos con la experiencia y confianza de Cortizo»); 18 imágenes (renders de perfiles PVC, uno rotulado «A84 PASSIVHAUS HI»; fotos de ambiente) | Sí | `/pvc/` |
| `/vidrio/` | Doble y triple acristalamiento, gases (argón, kriptón, «SFC» [sic]), «proporción de gas 84–90 %»; aislamiento acústico (vidrios hasta **34 mm**), vidrio de seguridad (fuerte / antirrobo / antibala con composiciones), «sistema energético», **ClimaGuard Premium** (factor solar 63 %) y **Guardian Sun**; «Nuestros fabricantes»: Guardian Sun (guardiansun.es) y «Saint Globain» [sic] (climalit.es) | Sí, con revisión técnica (ver §5) | `/vidrio/` |
| `/persianas/` | Persiana enrollable **Monoblock** (compacto); capialzados **Decorbox** (Um 0,91 W/m²K, 37 dB, clase 4), **cuadrado** (2,10 W/m²K, 28 dB, clase 3), **RolaPlus** («solo con ventanas Kömmerling»; 1,2 W/m²K, 40 dB, clase 4); lama térmica estándar; autoblocante de alta seguridad (44 puntos de bloqueo/m, siempre motorizada); microperforada autoblocante **BaseRoll**; **Airluz** (hasta 4 m de ancho, lama 0,5 mm, lista de colores RAL); orientable **Multiroll** (120º, motor vía radio) | Sí, con los datos técnicos marcados como pendientes de cotejar | `/persianas/` |
| `/automatismo/` | Ahorro energético, seguridad (simulación de presencia), salud; motores con termoprotección y receptor de radio; marcas **Somfy, Nice, Gaviota**; mandos a distancia; control domótico | Sí | `/motorizacion/` (nuevo slug, redirección desde `/automatismo/`) |
| `/mosquiteras/` | 5 tipos: enrollable vertical, enrollable lateral simple, enrollable lateral doble, fija, corredera; malla de fibra de vidrio gris, perfil de aluminio, variedad de colores | Sí | `/mosquiteras/` |
| `/componentes/` | Solo 4 títulos sin texto (Vidrios · Persianas · Automatismo · Mosquiteras) + teléfono | No (vacía) | `/complementos/` (índice de los 4 complementos, redirección desde `/componentes/`) |
| `/asesoramiento/` | «Cómo mejorar el confort de tu vivienda»; «Calidad garantizada» (eficacia energética «con la garantía de Cortizo», confort, seguridad); 2 vídeos (aislamiento térmico y acústico); «Tipos de apertura» (vacío, repite el vídeo térmico); «Te escuchamos» + formulario; «Nuestros trabajos» | Sí, el enfoque de servicio | `/asesoramiento/` (proceso de principio a fin) |
| `/trabajos-realizados/` | Un título y 4 fotos de ambiente (`banner-1..4`) **sin pie ni descripción** | Fotos sí (ver §4); no hay obras identificadas | `/trabajos-realizados/` (ver decisión en §8) |
| `/noticias/` y `/hola-mundo/` | Solo la entrada de ejemplo de WordPress («Bienvenido a WordPress…», 12/02/2019) con su comentario de muestra | No | Se suprime (ver §8) |
| `/contacto/` | «Si necesitas más información sobre nuestro **proyecto residencial**…» [texto de plantilla]; formulario; dirección **Calle Portugal, 16, 28802 Alcalá de Henares**; teléfono 91 830 05 43; email; mapa de Google | Datos sí; texto no | `/contacto/` |
| `/aviso-legal-politica-privacidad/` | **No es un aviso legal**: es la información de protección de datos (RGPD) **repetida dos veces** (la segunda bajo el título «Política de privacidad»). Responsable ALUMINIOS SEPPALA S.A., NIF **A83404772**, «C/ Habana Nº18 Nave 7 Polígono industrial Camporroso 28806 Alacala [sic] de Henares», 918300543, «asministracion@aluminiosseppala.com» [sic, dos erratas] | Sí como base de la política de privacidad; falta un aviso legal real | `/privacidad/` + `/aviso-legal/` (nuevo) |
| `/politica-de-cookies/` | Texto genérico del plugin Asesor de Cookies: cookies de sesión para comentarios, Google Analytics y redes sociales; enlace a «Safe Harbor» (acuerdo invalidado en 2015) | No (describe cookies que la web no usa) | `/cookies/` (texto nuevo y honesto) |
| `/mas-informacion-sobre-las-cookies/` | Guía genérica del plugin («¿Qué es una cookie?», cómo borrarlas por navegador, incluye Windows Phone) | Parcialmente (apartado de navegadores, actualizado) | `/cookies/#navegadores` |

Erratas y problemas de texto detectados (se corrigen al redactar): «Porporcionando», «séan», «Grácias», «natual»,
«reducciendo», «enbergadura», «diseñoa», «usus multiples accesocios», «comodidas», «GUARADIAN», «SAINT GLOBAIN»,
«acutico», «faciles», «Alacala», «asministracion@aluminiosseppala.com», «Expertos en C**arpintería**», la «k»
suelta antes de «CONTACTO» en varias páginas, el «proyecto residencial» de contacto y el «SFC» de los gases
(probablemente SF6, se pregunta).

## 4. Inventario de imágenes, vídeos y documentos

88 imágenes originales en `uploads/2019/{02,03,04}` (las 129 miniaturas `-300x200` etc. se ignoran) + 2 logos de
ayudas en la carpeta del tema + 2 vídeos. **No hay ningún PDF** (ni catálogos ni fichas) en la web antigua.
Hojas de contacto revisadas una a una. Calidad: **buena** (sirve a ancho completo), **aceptable** (media columna
o tarjeta), **baja** (solo icono o descartar).

### 4.1 Marca y logotipos
| Fichero | Tamaño | Qué es | Calidad | Uso |
|---|---|---|---|---|
| `LOGO-2-01.jpg` | 546×165 | Logotipo actual: cabeza de lobo/husky blanca en círculo azul oscuro, «SEPPALA» en degradado azul, «ALUMINIOS S.A» en gris. JPG con fondo blanco, **sin versión vectorial ni transparente** | Aceptable para cabecera (se muestra a ~190 px) | Cabecera. Para el pie sobre fondo oscuro habrá que recortar el fondo. *Pendiente*: pedir el vectorial |
| `icono-01.jpg` | 158×165 | El lobo solo, pixelado | Baja | Se redibuja el favicon a partir del logo |
| `logo-cortizo.jpg` | 1200×300 | Logo Cortizo sobre blanco (bloque «Instalador oficial») | Aceptable | Marcas; mejor el oficial de cortizo.com (Goal 2) |
| `themes/Divi/images/logos_ayudas.jpg` | ~740×110 | «Cofinanciado por la Unión Europea» + «Fondos Europeos» + Comunidad de Madrid | Aceptable | Obligatorio junto al texto de la ayuda FEDER |
| `themes/Divi/images/logo_cuminidad_madrid.jpg` | ~1100×400 | Comunidad de Madrid · Dirección General de Economía e Industria · Consejería de Economía, Hacienda y Empleo | Buena | Obligatorio junto al texto de la ayuda de la Comunidad de Madrid |

### 4.2 Renders de perfil (catálogo del fabricante de perfiles, fondo blanco, 875×1000)
Son renders 3D en esquina del tipo que publica Cortizo. Muy útiles como serie en tarjetas y fichas; no admiten
ampliación. **El sistema concreto de cada render no está rotulado** (salvo `abatible-pvc-1.jpg`, con la leyenda
«A84 PASSIVHAUS HI»): se pregunta al cliente qué sistemas trabaja antes de ponerles nombre.

| Grupo | Ficheros | Calidad |
|---|---|---|
| Aluminio abisagrado | `abatibles-01.jpg`, `abatibles-03..05.jpg` (blanco, triple vidrio), `abatibles-06.jpg` (acabado madera) | Aceptable |
| Aluminio corredera | `corredera-1.jpg`, `corredera-2.jpg`, `corredera-4..6.jpg` (875×1000), `corredera-3.jpg` (766×875) | Aceptable |
| Minimalista / corredera de gran formato | `muro-info-1.jpg`, `muro-info-2.jpg` | Aceptable |
| Muro cortina (nudos de montante y travesaño) | `fachada-1..4.jpg` (nudos en cruz), `fachada-5.jpg` (sección), `fachada-6.jpg` (modulación) | Aceptable |
| PVC abisagrado | `abatible-pvc-1.jpg` (rotulado A84 Passivhaus HI), `abatible-pvc-1-1.jpg`, `abatible-pvc-2.jpg`, `abatible-pvc-2-2.jpg`, `abatible-pvc-3.jpg`, `abatible-pvc-3-3.jpg`, `abatible-pvc-4.jpg`, `abatible-pvc-6.jpg` (875×1000), `abatible-pvc-5.jpg` (766×875, con umbral) | Aceptable |
| Iconos pequeños de portada | `image.png` (perfil PVC), `1421317276.368x342…` (vidrio), `1500303764.368x342…` (lamas), `1535723609.368x342…` (perfil aluminio), `abatibles-02.jpg` (368×342) | Baja: solo como icono |

### 4.3 Fotografías de ambiente (banco de imágenes del fabricante, no obras propias identificadas)
| Fichero | Tamaño | Qué muestra | Calidad | Uso sugerido |
|---|---|---|---|---|
| `banner-4.jpg` | 2582×1248 | Casa moderna con piscina y grandes correderas de aluminio, al atardecer | **Buena** | Candidata a héroe de portada |
| `banner-2.jpg` | 1600×920 (1,5 MB) | Vivienda de dos plantas al anochecer, cerramientos iluminados | Buena | Portada / empresa |
| `banner-1.jpg` | 1600×902 | Interior tipo loft con barandilla de vidrio y ventanal | Buena | Vidrio / aluminio |
| `banner-3.jpg` | 1600×920 | Interior con escalera y ventanal de noche | Aceptable (oscura) | Secundario |
| `productos_01.jpg` | 1920×1080 | Dormitorio con puerta plegable de aluminio abierta a terraza | Buena | Productos / aluminio |
| `inicio.jpg` | 1500×1000 | Oficinas con mamparas de vidrio (fondo de cabeceras en la web antigua) | Buena | Profesionales / empresa |
| `vidrios-4.jpg` | 1800×750 | Fachada de vidrio de edificio a contrapicado | Buena | Vidrio / fachadas |
| `correderas-2.jpg`, `correderas-3.jpg` | 1024×696 / 683 | Salones con correderas de aluminio negras y vistas | Aceptable | Aluminio correderas |
| `correderas-4.jpg`, `correderas-5.jpg` | 1024×768 | Corredera con terraza y piscina; corredera con nieve | Aceptable | Aluminio correderas |
| `corredera-pvc-1..4.jpg` | ~1024×700 | Correderas de PVC en madera y negro, interiores y jardín | Aceptable | PVC |
| `abatibles-1.jpg`, `abatibles-2.jpg` | 1068×768 | Balconera en dormitorio; ventana de cocina con montañas | Aceptable | Aluminio abatibles |
| `abatibles-3.jpg` | 1024×768 | Oficina con ventanas abisagradas | Aceptable | Profesionales |
| `abatible-pvc-7.jpg` | 1156×768 | Ventana con persiana en fachada gris | Aceptable | PVC / persianas |
| `abatible-pvc-8.jpg` | 1054×829 | Casa revestida de madera con ventanas negras | Aceptable | PVC |
| `abatible-pvc-9.jpg` | 1024×683 | Interior con balconeras blancas de PVC a jardín | Aceptable | PVC / asesoramiento |
| `muro-1.jpg` | 1024×768 | Comedor con cerramiento minimalista y vistas al mar | Aceptable | Aluminio minimalista |
| `fachada-7.jpg` | 1024×768 | Lucernario sobre techo de madera | Aceptable | Fachadas y lucernarios |
| `fachada-9.jpg`, `fachadas-8.jpg` | 1024×768 | Muro cortina de noche; edificio con fachada ligera | Aceptable | Fachadas |
| `banner-6.jpg` | 1000×750 | Salón blanco con ventanal | Aceptable | Secundario |
| `banner.jpg` | 1000×750 | Bodegón: sección de perfil, planos y rollos | Aceptable | Asesoramiento / presupuesto |
| `fondo.jpg` | 740×492 | Interior de muro cortina | Baja-aceptable | Solo pequeño |
| `banner-5.jpg`, `ventana-01.jpg`, `productos-2.jpg`, `productos-3.jpg` | < 550 px | Esquina de vidrio; ventana blanca (render); dos ambientes pequeños | Baja | Descartar |
| `circle-background-pattern.png` | 1920×848 | Patrón decorativo del tema | — | Descartar |

Por arquitectura y acabado, estas fotos son de banco de imágenes del fabricante de perfiles (igual que ocurrió
en Marchante). **No hay ninguna foto identificable de una obra de Seppala, de su nave ni de su equipo.** Se usan de
forma provisional y se pide al cliente material propio (ver `PREGUNTAS_CLIENTE.md`).

### 4.4 Persianas, motorización, vidrio y mosquiteras
| Fichero | Tamaño | Qué es | Calidad | Uso |
|---|---|---|---|---|
| `persiana-01.jpg` | 1920×700 | Lamas de persiana a contraluz | Buena | Cabecera de `/persianas/` |
| `persiana-02.jpg` | 369×650 | Sección de cajón compacto con persiana enrollada | Baja-aceptable | Ilustración pequeña |
| `Persianas-01.png` | 732×611 | Página de catálogo: cajones compactos (PVC, Fussion, Decoblock…) | Baja (composición de catálogo) | Solo como referencia interna |
| `Persianas-02.png` | 732×611 | Página de catálogo: tipos de lamas, guías y esquineros | Baja | Referencia interna |
| `persianas-03.png` | 732×611 | Página de catálogo «BASEROLL 45» | Baja | Referencia interna |
| `persianas-04.png` | 732×611 | Página de catálogo «AIRLUZ» | Baja | Referencia interna |
| `Persiana-06.png` | 732×611 | Página de catálogo «MULTIROLL» | Baja | Referencia interna |
| `Persianas-1.png` | 366×245 | Persiana orientable vista desde el interior | Baja | Icono |
| `automatismo.jpg` | 800×450 | Persona con mando en un salón (stock) | Aceptable | `/motorizacion/` |
| `domotica.jpg` | 790×450 | Lamas de persiana con luz azul | Aceptable | `/motorizacion/` |
| `TECNOLOGIA.jpeg` | 732×229 | Dispositivos Somfy (mando, tablet, móvil) | Baja-aceptable | Pequeño |
| `mandos-distancia.png` | 732×593 | Página de catálogo: mandos Somfy io / RTS | Baja | Referencia interna |
| `Control-domotico.png` | 732×593 | Página de catálogo: domótica Somfy (TaHoma) | Baja | Referencia interna |
| `vidrio-seppala.jpg` | 732×350 | Esquema de doble acristalamiento (luna, cámara, vidrio laminado) | Aceptable | `/vidrio/` (o se redibuja en SVG) |
| `VIDRIO-3.jpg` | 200×324 | Canto de doble acristalamiento | Baja | Descartar |
| `mosquiteras-seppala.jpg` | 640×429 | Mosquitera enrollable en ventana | Aceptable | `/mosquiteras/` |
| `mosquiteras.jpg` | 1153×324 | Detalle de perfil y cajón de mosquitera | Aceptable (muy apaisada) | Banda |
| `mosquitera-1.jpg` | 732×229 | Cajón de mosquitera enrollable | Baja-aceptable | Pequeño |

### 4.5 Vídeos
| Fichero | Peso | Dónde se usaba | Observaciones |
|---|---|---|---|
| `uploads/2019/03/aislamiento-termico.mp4` | 34 MB | Portada y asesoramiento | Vídeo promocional (aislamiento térmico). Demasiado pesado para servirlo tal cual; se decide en el Goal 2 (recomprimir o póster + enlace). Autoría *pendiente* (parece material del fabricante) |
| `uploads/2019/03/aislamiento-acustico.mp4` | 23 MB | Asesoramiento | Ídem |

### 4.6 Documentos
Ninguno. La web antigua no enlaza PDF, catálogos ni fichas técnicas. Para la demo del área de clientes y la
página de documentación se usarán documentos oficiales de las marcas que estén publicados (Goal 2) y se pedirán
al cliente los suyos.

## 5. Marcas y sistemas que trabaja Seppala

| Ámbito | Marca / sistema | Cómo lo sabemos | Estado |
|---|---|---|---|
| Perfiles de aluminio y PVC | **Cortizo** | Logo y bloque «Instalador oficial» en `/aluminios/`, `/pvc/` y `/vidrio/`; citada por nombre en `/pvc/` y `/asesoramiento/`; renders de catálogo Cortizo | Confirmado que trabajan Cortizo. **Pendiente** qué sistemas concretos: la web describe un abisagrado de aluminio «de canal europeo con 80 mm de marco» (coincide con la familia COR 80 de Cortizo) y un render de PVC rotulado «A84 Passivhaus HI». No se pondrá nombre de sistema sin confirmación |
| Vidrio | **Guardian Glass** (ClimaGuard Premium, Guardian Sun) y **Saint-Gobain / Climalit** | `/vidrio/`, apartado «Nuestros fabricantes» con enlaces a guardiansun.es y climalit.es | Confirmado. Datos (factor solar 63 % de ClimaGuard Premium, etc.) se cotejarán con las fichas oficiales en el Goal 5 |
| Cajón de persiana | **RolaPlus de Kömmerling** | `/persianas/`: «RolaPlus solo se instalará con ventanas sistemas KÖMMERLING» | Confirmado como producto; **contradicción**: la ficha oficial de Kömmerling da Usb desde 0,79 W/m²K y hasta 50 dB; la web antigua pone 1,2 W/m²K y 40 dB. Se pregunta. También llama la atención que ofrezcan ventanas Kömmerling siendo instaladores Cortizo |
| Cajón de persiana | **Decorbox** y «capialzado cuadrado» | `/persianas/` | Fabricante **no identificado** en la búsqueda. *Pendiente* |
| Persianas de aluminio | **BaseRoll 45**, **Airluz**, **Multiroll** (y lama térmica estándar, autoblocante) | `/persianas/` y páginas de catálogo en `persianas-03/04.png`, `Persiana-06.png` | Los tres nombres corresponden al catálogo del fabricante **Persycom** (fuente: Interempresas, «Persycom desarrolla su nuevo sistema Airluz»; «Blinds Car-blocante Baseroll»; «Persycom presenta sus novedades Multiroll»). La web antigua no nombra al fabricante: se pide confirmación antes de citarlo |
| Sistema compacto | «Monoblock» | `/persianas/` | Es una denominación genérica de cajón compacto, no una marca |
| Motorización | **Somfy** (io, RTS, TaHoma), **Nice**, **Gaviota** | `/automatismo/` cita las tres; las imágenes son de catálogo Somfy | Confirmado |
| Maquinaria propia | Centro de corte y mecanizado CNC **Schirmer BAZ-G4**; soldadora **Disomaq SL4FF EVO** | Texto de la ayuda de la Comunidad de Madrid en la portada | Schirmer BAZ existe (fabricante alemán de centros de mecanizado para PVC/aluminio); Disomaq no verificado en la búsqueda. Se cita tal cual lo publica el cliente, como parte del texto de la ayuda |

## 6. Datos de empresa verificados

| Dato | Valor | Fuente | Estado |
|---|---|---|---|
| Razón social | **Aluminios Seppala, S.A.** (en la web: «Aluminios Seppala S.A.», «ALUMINIOS SEPPALA SA», «SEPPALA, S.A.») | Web antigua (portada y legal); Informa | Verificado |
| NIF | **A83404772** | Página legal de la web antigua | Solo una fuente (Informa no lo muestra). *Pendiente* de confirmar |
| Forma jurídica | Sociedad anónima | Informa | Verificado |
| Constitución | **24/09/2002** | Informa | Una fuente. Coherente con «más de 25 años» solo si se cuenta actividad anterior: se pregunta |
| Actividad (CNAE) | 4332 Instalación de carpintería; objeto social «contratación y ejecución de construcciones y obras» | Informa | — |
| Plantilla | 35 empleados (2026) | Informa | Coherente con la ayuda «empresas industriales de menos de 50 trabajadores» |
| Teléfono | **91 830 05 43** | Web antigua (todas las páginas), Informa | Verificado |
| Email | **administracion@aluminioseppala.com** | Web antigua (cabecera y contacto) | Verificado (la página legal lo escribe mal) |
| Dirección (contacto) | **Calle Portugal, 16, 28802 Alcalá de Henares (Madrid)** | `/contacto/`, TrustLocal | Una fuente propia |
| Dirección (legal) | **C/ Habana, 18, nave 7, Polígono Industrial Camporroso, 28806 Alcalá de Henares** | Página legal de la web antigua | Una fuente propia |
| Dirección (registro) | «Calle Bulevar de la Habana, 8 N, 28806 Alcalá de Henares» | Informa | Tercera variante |
| Mapa de `/contacto/` | Coordenadas 40,5154 / −3,4155 → Distrito III, 28806 | Geocodificación inversa | Apunta a la zona del 28806 (Camporroso), **no** al 28802 |
| Horario | **Desconocido** | No figura en ninguna fuente | *Pendiente* |
| Redes sociales | **Ninguna encontrada** | Búsquedas | *Pendiente* |
| WhatsApp | No figura | — | *Pendiente* |
| Ayuda 1 | «ALUMINIOS SEPPALA SA ha sido beneficiaria de una ayuda concedida por la Dirección General de Economía e Industria de la CONSEJERÍA DE ECONOMÍA, HACIENDA Y EMPLEO DE LA COMUNIDAD DE MADRID, en el marco del Programa de Ayudas a Empresas Industriales de menos de 50 trabajadores para inversión en infraestructura y equipamiento. Esta ayuda está financiada en un 75 % del gasto subvencionable realizado para la anualidad 2026.» | Portada | Se reproduce literal (obligación de publicidad) |
| Ayuda 2 | «Proyecto de transformación digital y modernización del proceso productivo de SEPPALA, S.A.» … adquisición de un centro de corte y mecanizado CNC Schirmer BAZ-G4 y una soldadora Disomaq SL4FF EVO. «SEPPALA, S.A. ha sido beneficiaria en la anualidad 2025 de una subvención en la convocatoria AYUDAS DESTINADAS A PROYECTOS DE DIGITALIZACIÓN DE LA PYME MADRILEÑA, COFINANCIADAS POR EL FONDO EUROPEO DE DESARROLLO REGIONAL (FEDER). EXP. 05-DEM1-00022.1/2025» | Portada | Se reproduce literal con los logos |
| Reseñas | 16 reseñas, 7,9/10 en TrustLocal (sin texto aprovechable) | TrustLocal | No se usan |

Conclusión sobre la dirección: hay **tres direcciones distintas** y el mapa apunta al polígono (28806). Hasta que el
cliente confirme, en la web nueva se mostrará la de `/contacto/` (Calle Portugal, 16) en contacto y la de la página
legal en los textos legales, cada una con nota interna de pendiente, y **no se incrustará mapa** (ni de Google ni
de otro tercero) sin consentimiento: se pondrá un enlace «Cómo llegar».

## 7. Identidad visual actual (base para el Goal 3)
- Logo: lobo blanco sobre círculo azul marino; texto «SEPPALA» en degradado azul claro→azul; «ALUMINIOS S.A» gris.
- Colores del tema: azul `#2c90c3` (acentos, botones), grises `#828282`/`#6d6d6d`/`#2d2d2d`, verde `#86bf01` (muy puntual).
- Tipografías de Google (Oswald para títulos, Nunito Sans/Kanit/Abel): son de plantilla, no de marca; se cambian.
- No hay manual de marca. Se propondrá una paleta a partir de los azules del logo (Goal 3), sin reutilizar los tokens de Marchante.

## 8. Decisiones tomadas en esta fase (para validar con el cliente)
1. **Noticias se suprime.** Solo existe la entrada de ejemplo de WordPress. `/noticias/` y `/hola-mundo/` redirigirán a la portada. Si el cliente quiere actualidad más adelante, se añade una sección menor.
2. **`/componentes/` pasa a `/complementos/`** como índice de vidrio, persianas, motorización y mosquiteras (la página antigua no tenía contenido). `/automatismo/` pasa a `/motorizacion/` (nombre que entiende cualquiera). El resto de URLs se mantienen. Redirecciones 301 en `web/.htaccess` y `despliegue/`.
3. **Trabajos realizados** se construye como «Proyectos» por tipo de obra (vivienda nueva, reforma, oficinas y locales, fachadas), ilustrado con las fotos disponibles y rotulado con honestidad (imágenes de los sistemas que instalan), hasta que el cliente aporte fotos de obras propias.
4. **Sin mapa incrustado ni reCAPTCHA ni Google Fonts**: cero peticiones a terceros sin consentimiento. Los dos vídeos se servirán en local si se consigue reducir su peso; si no, póster con enlace.
5. **Menú nuevo** (6 entradas): Ventanas y cerramientos (Aluminio · PVC · Fachadas y lucernarios) · Complementos (Vidrio · Persianas · Motorización · Mosquiteras) · Asesoramiento · Proyectos · Empresa · Contacto, más el botón «Pedir presupuesto» y el enlace «Área clientes».
6. **Datos técnicos**: se publican solo los que ya publica el cliente o los que confirme la web oficial de la marca; donde haya contradicción (RolaPlus) se pregunta y, mientras tanto, se redacta sin la cifra.
7. **Cortizo** se nombra como marca de perfiles (lo hace la web antigua). No se nombra ningún sistema concreto (COR 80, A84…) hasta confirmación.
