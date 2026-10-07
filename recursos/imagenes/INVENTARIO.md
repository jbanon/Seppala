# Inventario de imágenes (recursos/imagenes/ y recursos/marca/)

Goal 2. Todo procede del espejo de la web antigua (`antigua/`, no versionado) salvo lo que se indica; lo copia
con estos nombres `herramientas/importar_antigua.py`. Los nombres originales están en `INVESTIGACION.md` §4.
Calidad: **buena** (ancho completo), **aceptable** (media columna o tarjeta), **baja** (icono o descartar).

**Procedencia y licencia.** Los renders y las fotos de ambiente son material de catálogo del fabricante de
perfiles (Cortizo), reutilizado por la web antigua. No hay fotos de obras, nave ni equipo de Seppala. Se usan de
forma provisional; licencia y fotos propias pedidas en `PREGUNTAS_CLIENTE.md` (3.1).

## marca/
| Fichero | Tamaño | Qué es | Calidad | Uso |
|---|---|---|---|---|
| `logo-seppala.jpg` | 546×165 | Logotipo actual (lobo en círculo azul marino, SEPPALA en degradado azul, ALUMINIOS S.A gris). JPG sobre blanco, sin vectorial | Aceptable | Cabecera. Para el pie oscuro se genera una versión recortada (`herramientas/imagenes.py`). Vectorial pedido (3.2) |
| `icono-lobo.jpg` | 158×165 | Lobo solo, pixelado | Baja | Referencia para el favicon |
| `ayudas/logos-ue-feder-comunidad-madrid.jpg` | 740×110 | UE «Cofinanciado por la Unión Europea» + Fondos Europeos + Comunidad de Madrid | Aceptable | Junto al texto de la ayuda FEDER (obligatorio) |
| `ayudas/logo-comunidad-madrid-dg-economia-industria.jpg` | 1100×400 | Comunidad de Madrid · DG de Economía e Industria · Consejería de Economía, Hacienda y Empleo | Buena | Junto al texto de la ayuda de la Comunidad de Madrid (obligatorio) |
| `partners/logo-cortizo.svg` | vectorial | Logo oficial de Cortizo, descargado de cortizo.com (07/10/2026) | — | Bloque de marcas |
| `partners/logo-cortizo-web-antigua.jpg` | 1200×300 | El que usaba la web antigua (JPG sobre blanco) | Aceptable | Reserva |
| `partners/logo-guardian-glass.png` | 741×207 RGBA | Logo oficial Guardian Glass (guardianglass.com) | Buena | Marcas (vidrio Guardian Sun / ClimaGuard) |
| `partners/logo-guardian-glass-guardiansun-es.png` | 253×40 | Versión pequeña de guardiansun.es | Baja | Reserva |
| `partners/logo-nice.svg` | vectorial | Logo oficial Nice (niceforyou.com) | — | Marcas (motorización) |
| `partners/logo-gaviota.svg` | vectorial | Logo oficial Gaviota (gaviotagroup.com) | — | Marcas (motorización) |
| `partners/logo-climalit.*`, `partners/logo-somfy.*` | — | Ver nota al final: descarga pendiente o hecha según lo que haya en la carpeta | — | Marcas |

Logos **no** incluidos a propósito: Kömmerling (solo aparece como cajón RolaPlus; pregunta 2.3) y el fabricante
de persianas (pregunta 2.4). Se añadirán cuando el cliente confirme.

## imagenes/renders/ (875×1000 salvo indicación; catálogo Cortizo; sistema concreto sin confirmar)
| Fichero | Qué muestra | Calidad | Uso |
|---|---|---|---|
| `aluminio-abisagrada-blanco-1..4.jpg` | Esquina de ventana abisagrada de aluminio blanca, triple vidrio | Aceptable | `/aluminios/` (abisagradas), tarjetas |
| `aluminio-abisagrada-madera.jpg` | Ídem con acabado efecto madera | Aceptable | Acabados |
| `aluminio-corredera-1..6.jpg` (3: 766×875) | Esquinas y secciones de correderas de aluminio (dos y tres carriles) | Aceptable | `/aluminios/` (correderas) |
| `aluminio-minimalista-1.jpg`, `-2.jpg` | Corredera de hoja mínima / gran formato | Aceptable | `/aluminios/` (minimalistas) |
| `muro-cortina-nudo-1..4.jpg` | Nudo montante-travesaño con vidrio (varias tapetas) | Aceptable | `/aluminios/` (fachadas) |
| `muro-cortina-seccion.jpg`, `muro-cortina-modulacion.jpg` | Sección de montante; modulación de fachada | Aceptable | `/aluminios/` (fachadas) |
| `pvc-abisagrada-a84-passivhaus-rotulado.jpg` | Esquina de PVC rotulada «A84 PASSIVHAUS HI» (con sello) | Aceptable | Solo si el cliente confirma el sistema |
| `pvc-abisagrada-1..7.jpg` | Esquinas de ventana abisagrada de PVC blanca (varias profundidades) | Aceptable | `/pvc/`, tarjetas |
| `pvc-balconera-umbral.jpg` (766×875) | Balconera de PVC con umbral bajo | Aceptable | `/pvc/` |
| `iconos/perfil-pvc.png`, `iconos/vidrio.jpg`, `iconos/lamas.jpg`, `iconos/perfil-aluminio.jpg`, `iconos/perfil-aluminio-2.jpg` (368×342) | Iconos de producto de la portada antigua | Baja | Solo pequeños |

## imagenes/ambiente/ (fotografía de ambiente, banco del fabricante)
| Fichero | Tamaño | Qué muestra | Calidad | Uso previsto |
|---|---|---|---|---|
| `casa-piscina-correderas-atardecer.jpg` | 2582×1248 | Casa moderna con piscina y grandes correderas al atardecer | **Buena** | **Héroe de portada** |
| `vivienda-anochecer-cerramientos.jpg` | 1600×920 | Vivienda de dos plantas iluminada al anochecer | Buena | Portada / `/empresa/` / proyectos |
| `loft-barandilla-vidrio.jpg` | 1600×902 | Interior loft con barandilla de vidrio y ventanal | Buena | `/vidrio/` / proyectos |
| `interior-escalera-ventanal-noche.jpg` | 1600×920 | Interior con escalera y ventanal, de noche | Aceptable | Proyectos |
| `dormitorio-plegable-terraza.jpg` | 1920×1080 | Dormitorio con puerta plegable de aluminio abierta a terraza | Buena | `/productos/` / `/aluminios/` |
| `oficinas-mamparas-vidrio.jpg` | 1500×1000 | Oficinas con mamparas de vidrio | Buena | Profesionales / `/asesoramiento/` |
| `fachada-vidrio-contrapicado.jpg` | 1800×750 | Fachada de vidrio de edificio | Buena | `/vidrio/` / fachadas |
| `salon-corredera-negra-vistas.jpg` | 1024×696 | Salón con corredera negra y vistas al valle | Aceptable | `/aluminios/` correderas |
| `salon-correderas-negras-campo.jpg` | 1024×683 | Salón con tres correderas negras al campo | Aceptable | Proyectos |
| `corredera-terraza-piscina.jpg` | 1024×768 | Corredera abierta a terraza con piscina | Aceptable | `/aluminios/` |
| `corredera-nieve.jpg` | 1024×768 | Corredera con paisaje nevado | Aceptable | `/vidrio/` (aislamiento) |
| `pvc-corredera-madera-interior.jpg` | 1024×718 | Corredera de PVC efecto madera, interior | Aceptable | `/pvc/` |
| `pvc-corredera-madera-piscina.jpg` | 1021×734 | Corredera de PVC efecto madera a piscina | Aceptable | `/pvc/` |
| `pvc-corredera-negra-salon.jpg` | 1024×683 | Corredera negra de PVC, salón | Aceptable | `/pvc/` |
| `pvc-corredera-negra-cocina.jpg` | 1024×683 | Corredera negra de PVC, cocina | Aceptable | `/pvc/` |
| `dormitorio-balconera.jpg` | 1068×768 | Balconera abisagrada en dormitorio | Aceptable | `/aluminios/` abisagradas |
| `cocina-ventana-montanas.jpg` | 1068×768 | Ventana de cocina con vistas a montañas | Aceptable | `/aluminios/` / `/vidrio/` |
| `oficina-ventanas-abisagradas.jpg` | 1024×768 | Oficina con ventanas abisagradas | Aceptable | Profesionales |
| `ventana-persiana-fachada-gris.jpg` | 1156×768 | Ventana con persiana en fachada gris | Aceptable | `/persianas/` |
| `casa-madera-ventanas-negras.jpg` | 1054×829 | Casa revestida de madera con ventanas negras | Aceptable | `/pvc/` / proyectos |
| `interior-balconeras-blancas-jardin.jpg` | 1024×683 | Interior con balconeras blancas a jardín | Aceptable | `/pvc/` / `/asesoramiento/` |
| `comedor-minimalista-vistas-mar.jpg` | 1024×768 | Comedor con cerramiento minimalista al mar | Aceptable | `/aluminios/` minimalistas |
| `lucernario-techo-madera.jpg` | 1024×768 | Lucernario sobre techo de madera | Aceptable | `/aluminios/` fachadas y lucernarios |
| `muro-cortina-noche.jpg` | 1024×768 | Muro cortina iluminado de noche | Aceptable | Fachadas |
| `edificio-fachada-ligera.jpg` | 1024×768 | Edificio con fachada ligera | Aceptable | Fachadas / profesionales |
| `salon-blanco-ventanal.jpg` | 1000×750 | Salón blanco con ventanal | Aceptable | Reserva |
| `bodegon-perfil-planos.jpg` | 1000×750 | Sección de perfil sobre planos | Aceptable | `/asesoramiento/` / contacto |
| `interior-muro-cortina.jpg` | 740×492 | Interior de muro cortina | Baja-aceptable | Reserva |

## imagenes/persianas/
| Fichero | Tamaño | Qué muestra | Calidad | Uso |
|---|---|---|---|---|
| `lamas-contraluz.jpg` | 1920×700 | Lamas de persiana a contraluz | Buena | Cabecera de `/persianas/` |
| `cajon-compacto-seccion.jpg` | 369×650 | Sección de cajón compacto | Baja-aceptable | Ilustración pequeña |
| `catalogo-cajones-compactos.png`, `catalogo-lamas-guias.png`, `catalogo-baseroll-45.png`, `catalogo-airluz.png`, `catalogo-multiroll.png` | 732×611 | Páginas de catálogo del fabricante de persianas | Baja | **Solo referencia interna** (composiciones de catálogo con texto ilegible) |
| `orientable-interior.png` | 366×245 | Persiana orientable desde el interior | Baja | Icono |

## imagenes/motorizacion/
| Fichero | Tamaño | Qué muestra | Calidad | Uso |
|---|---|---|---|---|
| `salon-mando-distancia.jpg` | 800×450 | Persona con mando en un salón | Aceptable | `/motorizacion/` |
| `lamas-luz-azul.jpg` | 790×450 | Lamas con luz | Aceptable | `/motorizacion/` |
| `somfy-dispositivos.jpeg` | 732×229 | Dispositivos Somfy | Baja-aceptable | Pequeño |
| `catalogo-somfy-mandos.png`, `catalogo-somfy-domotica.png` | 732×593 | Páginas de catálogo Somfy (mandos io/RTS, TaHoma) | Baja | Referencia interna |

## imagenes/vidrio/ y imagenes/mosquiteras/
| Fichero | Tamaño | Qué muestra | Calidad | Uso |
|---|---|---|---|---|
| `vidrio/esquema-doble-acristalamiento.jpg` | 732×350 | Esquema de doble acristalamiento (lunas, cámara, laminado) | Aceptable | `/vidrio/` (se redibuja en SVG si hace falta) |
| `vidrio/canto-doble-acristalamiento.jpg` | 200×324 | Canto de doble acristalamiento | Baja | Descartar |
| `mosquiteras/enrollable-ventana.jpg` | 640×429 | Mosquitera enrollable en ventana | Aceptable | `/mosquiteras/` |
| `mosquiteras/detalle-perfil-cajon.jpg` | 1153×324 | Detalle de perfil y cajón | Aceptable | Banda |
| `mosquiteras/cajon-enrollable.jpg` | 732×229 | Cajón de mosquitera enrollable | Baja-aceptable | Pequeño |

## imagenes/descartadas/
`banner-5-esquina-vidrio-545px.jpg`, `ventana-01-render-422px.jpg`, `productos-2-293px.jpg`,
`productos-3-293px.jpg` (demasiado pequeñas) y `circle-background-pattern-tema.png` (decoración del tema). No usar.

## video/ (no versionado; originales de la web antigua)
| Fichero | Duración | Qué es | Decisión |
|---|---|---|---|
| `aislamiento-termico-original.mp4` | 4:00, 1280×720, 34 MB | Vídeo formativo de **Cortizo** («Aislamiento térmico», un técnico de Cortizo explica la rotura de puente térmico, profundidades de marco 70/84 mm en PVC, etc.) | Se sirve comprimido en `web/video/` (720p, ~1/3 del peso), **solo al pulsar**, sin terceros. Licencia pendiente (3.3) |
| `aislamiento-acustico-original.mp4` | 2:53, 1280×720, 23 MB | Vídeo formativo de **Cortizo** («Aislamiento acústico»: masa, difracción, hasta 50 dB) | Ídem |
