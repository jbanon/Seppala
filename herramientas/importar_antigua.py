#!/usr/bin/env python3
"""Copia las imágenes reutilizables del espejo de la web antigua (antigua/, solo lectura) a
recursos/ con nombres descriptivos, según la clasificación de INVESTIGACION.md §4.
Herramienta de autoría: solo hay que volver a ejecutarla si se vuelve a descargar la web antigua.
Uso: .venv/bin/python herramientas/importar_antigua.py"""
import shutil
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
UP = RAIZ / "antigua/www.aluminioseppala.com/wp-content/uploads"
TEMA = RAIZ / "antigua/www.aluminioseppala.com/wp-content/themes/Divi/images"
REC = RAIZ / "recursos"

MAPA = {  # destino en recursos/ : origen
    "marca/logo-seppala.jpg": UP / "2019/02/LOGO-2-01.jpg",
    "marca/icono-lobo.jpg": UP / "2019/02/icono-01.jpg",
    "marca/ayudas/logos-ue-feder-comunidad-madrid.jpg": TEMA / "logos_ayudas.jpg",
    "marca/ayudas/logo-comunidad-madrid-dg-economia-industria.jpg": TEMA / "logo_cuminidad_madrid.jpg",
    "marca/partners/logo-cortizo-web-antigua.jpg": UP / "2019/03/logo-cortizo.jpg",
    # Renders de perfil (catálogo del fabricante, 875x1000)
    "imagenes/renders/aluminio-abisagrada-blanco-1.jpg": UP / "2019/03/abatibles-01.jpg",
    "imagenes/renders/aluminio-abisagrada-blanco-2.jpg": UP / "2019/03/abatibles-03.jpg",
    "imagenes/renders/aluminio-abisagrada-blanco-3.jpg": UP / "2019/03/abatibles-04.jpg",
    "imagenes/renders/aluminio-abisagrada-blanco-4.jpg": UP / "2019/03/abatibles-05.jpg",
    "imagenes/renders/aluminio-abisagrada-madera.jpg": UP / "2019/03/abatibles-06.jpg",
    **{f"imagenes/renders/aluminio-corredera-{i}.jpg": UP / f"2019/03/corredera-{i}.jpg" for i in range(1, 7)},
    "imagenes/renders/aluminio-minimalista-1.jpg": UP / "2019/03/muro-info-1.jpg",
    "imagenes/renders/aluminio-minimalista-2.jpg": UP / "2019/03/muro-info-2.jpg",
    **{f"imagenes/renders/muro-cortina-nudo-{i}.jpg": UP / f"2019/03/fachada-{i}.jpg" for i in range(1, 5)},
    "imagenes/renders/muro-cortina-seccion.jpg": UP / "2019/03/fachada-5.jpg",
    "imagenes/renders/muro-cortina-modulacion.jpg": UP / "2019/03/fachada-6.jpg",
    "imagenes/renders/pvc-abisagrada-a84-passivhaus-rotulado.jpg": UP / "2019/03/abatible-pvc-1.jpg",
    "imagenes/renders/pvc-abisagrada-1.jpg": UP / "2019/03/abatible-pvc-1-1.jpg",
    "imagenes/renders/pvc-abisagrada-2.jpg": UP / "2019/03/abatible-pvc-2.jpg",
    "imagenes/renders/pvc-abisagrada-3.jpg": UP / "2019/03/abatible-pvc-2-2.jpg",
    "imagenes/renders/pvc-abisagrada-4.jpg": UP / "2019/03/abatible-pvc-3.jpg",
    "imagenes/renders/pvc-abisagrada-5.jpg": UP / "2019/03/abatible-pvc-3-3.jpg",
    "imagenes/renders/pvc-abisagrada-6.jpg": UP / "2019/03/abatible-pvc-4.jpg",
    "imagenes/renders/pvc-abisagrada-7.jpg": UP / "2019/03/abatible-pvc-6.jpg",
    "imagenes/renders/pvc-balconera-umbral.jpg": UP / "2019/03/abatible-pvc-5.jpg",
    "imagenes/renders/iconos/perfil-pvc.png": UP / "2019/03/image.png",
    "imagenes/renders/iconos/vidrio.jpg": UP / "2019/03/1421317276.368x342.fm_.fe_.380.jpg",
    "imagenes/renders/iconos/lamas.jpg": UP / "2019/03/1500303764.368x342.fm_.fe_.0109.jpg",
    "imagenes/renders/iconos/perfil-aluminio.jpg": UP / "2019/03/1535723609.368x342.fm_.fe_.6122.jpg",
    "imagenes/renders/iconos/perfil-aluminio-2.jpg": UP / "2019/03/abatibles-02.jpg",
    # Fotografías de ambiente (banco de imágenes del fabricante)
    "imagenes/ambiente/casa-piscina-correderas-atardecer.jpg": UP / "2019/02/banner-4.jpg",
    "imagenes/ambiente/vivienda-anochecer-cerramientos.jpg": UP / "2019/02/banner-2.jpg",
    "imagenes/ambiente/loft-barandilla-vidrio.jpg": UP / "2019/02/banner-1.jpg",
    "imagenes/ambiente/interior-escalera-ventanal-noche.jpg": UP / "2019/02/banner-3.jpg",
    "imagenes/ambiente/dormitorio-plegable-terraza.jpg": UP / "2019/03/productos_01.jpg",
    "imagenes/ambiente/oficinas-mamparas-vidrio.jpg": UP / "2019/02/inicio.jpg",
    "imagenes/ambiente/fachada-vidrio-contrapicado.jpg": UP / "2019/04/vidrios-4.jpg",
    "imagenes/ambiente/salon-corredera-negra-vistas.jpg": UP / "2019/03/correderas-2.jpg",
    "imagenes/ambiente/salon-correderas-negras-campo.jpg": UP / "2019/03/correderas-3.jpg",
    "imagenes/ambiente/corredera-terraza-piscina.jpg": UP / "2019/03/correderas-4.jpg",
    "imagenes/ambiente/corredera-nieve.jpg": UP / "2019/03/correderas-5.jpg",
    "imagenes/ambiente/pvc-corredera-madera-interior.jpg": UP / "2019/03/corredera-pvc-1.jpg",
    "imagenes/ambiente/pvc-corredera-madera-piscina.jpg": UP / "2019/03/corredera-pvc-2.jpg",
    "imagenes/ambiente/pvc-corredera-negra-salon.jpg": UP / "2019/03/corredera-pvc-3.jpg",
    "imagenes/ambiente/pvc-corredera-negra-cocina.jpg": UP / "2019/03/corredera-pvc-4.jpg",
    "imagenes/ambiente/dormitorio-balconera.jpg": UP / "2019/03/abatibles-1.jpg",
    "imagenes/ambiente/cocina-ventana-montanas.jpg": UP / "2019/03/abatibles-2.jpg",
    "imagenes/ambiente/oficina-ventanas-abisagradas.jpg": UP / "2019/03/abatibles-3.jpg",
    "imagenes/ambiente/ventana-persiana-fachada-gris.jpg": UP / "2019/03/abatible-pvc-7.jpg",
    "imagenes/ambiente/casa-madera-ventanas-negras.jpg": UP / "2019/03/abatible-pvc-8.jpg",
    "imagenes/ambiente/interior-balconeras-blancas-jardin.jpg": UP / "2019/03/abatible-pvc-9.jpg",
    "imagenes/ambiente/comedor-minimalista-vistas-mar.jpg": UP / "2019/03/muro-1.jpg",
    "imagenes/ambiente/lucernario-techo-madera.jpg": UP / "2019/03/fachada-7.jpg",
    "imagenes/ambiente/muro-cortina-noche.jpg": UP / "2019/03/fachada-9.jpg",
    "imagenes/ambiente/edificio-fachada-ligera.jpg": UP / "2019/03/fachadas-8.jpg",
    "imagenes/ambiente/salon-blanco-ventanal.jpg": UP / "2019/02/banner-6.jpg",
    "imagenes/ambiente/bodegon-perfil-planos.jpg": UP / "2019/02/banner.jpg",
    "imagenes/ambiente/interior-muro-cortina.jpg": UP / "2019/02/fondo.jpg",
    # Persianas
    "imagenes/persianas/lamas-contraluz.jpg": UP / "2019/04/persiana-01.jpg",
    "imagenes/persianas/cajon-compacto-seccion.jpg": UP / "2019/04/persiana-02.jpg",
    "imagenes/persianas/catalogo-cajones-compactos.png": UP / "2019/04/Persianas-01.png",
    "imagenes/persianas/catalogo-lamas-guias.png": UP / "2019/04/Persianas-02.png",
    "imagenes/persianas/catalogo-baseroll-45.png": UP / "2019/04/persianas-03.png",
    "imagenes/persianas/catalogo-airluz.png": UP / "2019/04/persianas-04.png",
    "imagenes/persianas/catalogo-multiroll.png": UP / "2019/04/Persiana-06.png",
    "imagenes/persianas/orientable-interior.png": UP / "2019/04/Persianas-1.png",
    # Motorización
    "imagenes/motorizacion/salon-mando-distancia.jpg": UP / "2019/04/automatismo.jpg",
    "imagenes/motorizacion/lamas-luz-azul.jpg": UP / "2019/04/domotica.jpg",
    "imagenes/motorizacion/somfy-dispositivos.jpeg": UP / "2019/04/TECNOLOGIA.jpeg",
    "imagenes/motorizacion/catalogo-somfy-mandos.png": UP / "2019/04/mandos-distancia.png",
    "imagenes/motorizacion/catalogo-somfy-domotica.png": UP / "2019/04/Control-domotico.png",
    # Vidrio
    "imagenes/vidrio/esquema-doble-acristalamiento.jpg": UP / "2019/04/vidrio-seppala.jpg",
    "imagenes/vidrio/canto-doble-acristalamiento.jpg": UP / "2019/04/VIDRIO-3.jpg",
    # Mosquiteras
    "imagenes/mosquiteras/enrollable-ventana.jpg": UP / "2019/04/mosquiteras-seppala.jpg",
    "imagenes/mosquiteras/detalle-perfil-cajon.jpg": UP / "2019/04/mosquiteras.jpg",
    "imagenes/mosquiteras/cajon-enrollable.jpg": UP / "2019/04/mosquitera-1.jpg",
    # Descartadas (se conservan para que conste el motivo en INVENTARIO.md)
    "imagenes/descartadas/banner-5-esquina-vidrio-545px.jpg": UP / "2019/02/banner-5.jpg",
    "imagenes/descartadas/ventana-01-render-422px.jpg": UP / "2019/02/ventana-01.jpg",
    "imagenes/descartadas/productos-2-293px.jpg": UP / "2019/03/productos-2.jpg",
    "imagenes/descartadas/productos-3-293px.jpg": UP / "2019/03/productos-3.jpg",
    "imagenes/descartadas/circle-background-pattern-tema.png": UP / "2019/03/circle-background-pattern.png",
    # Vídeos originales (no versionados: recursos/video/*.mp4 está en .gitignore)
    "video/aislamiento-termico-original.mp4": UP / "2019/03/aislamiento-termico.mp4",
    "video/aislamiento-acustico-original.mp4": UP / "2019/03/aislamiento-acustico.mp4",
}


def main():
    n = 0
    for dest, orig in MAPA.items():
        if not orig.exists():
            print("FALTA", orig); continue
        d = REC / dest; d.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(orig, d); n += 1
    print(f"{n} ficheros copiados a recursos/")


if __name__ == "__main__":
    main()
