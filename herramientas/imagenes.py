#!/usr/bin/env python3
"""Genera web/img/ (WebP, logos, favicon, imagen para compartir) a partir de recursos/.

Uso: .venv/bin/python herramientas/imagenes.py
Herramienta de autoría (no es un paso de compilación de la web): solo hay que volver a
ejecutarla si cambian las imágenes de origen o se añade una entrada a FOTOS/LOGOS.
"""
import shutil
from pathlib import Path
from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
REC, IMG = RAIZ / "recursos", RAIZ / "web" / "img"
ANCHOS = (640, 1024, 1600)

# destino (sin sufijo) : origen en recursos/imagenes/ → se generan <destino>-640/-1024/-1600.webp
FOTOS = {
    # ambiente (banco de imágenes del fabricante; ver recursos/imagenes/INVENTARIO.md)
    "ambiente/casa-piscina-correderas": "ambiente/casa-piscina-correderas-atardecer.jpg",
    "ambiente/vivienda-anochecer": "ambiente/vivienda-anochecer-cerramientos.jpg",
    "ambiente/loft-barandilla-vidrio": "ambiente/loft-barandilla-vidrio.jpg",
    "ambiente/interior-escalera-noche": "ambiente/interior-escalera-ventanal-noche.jpg",
    "ambiente/dormitorio-plegable": "ambiente/dormitorio-plegable-terraza.jpg",
    "ambiente/oficinas-mamparas": "ambiente/oficinas-mamparas-vidrio.jpg",
    "ambiente/fachada-vidrio": "ambiente/fachada-vidrio-contrapicado.jpg",
    "ambiente/salon-corredera-vistas": "ambiente/salon-corredera-negra-vistas.jpg",
    "ambiente/salon-correderas-campo": "ambiente/salon-correderas-negras-campo.jpg",
    "ambiente/corredera-terraza-piscina": "ambiente/corredera-terraza-piscina.jpg",
    "ambiente/corredera-nieve": "ambiente/corredera-nieve.jpg",
    "ambiente/pvc-corredera-madera": "ambiente/pvc-corredera-madera-interior.jpg",
    "ambiente/pvc-corredera-madera-piscina": "ambiente/pvc-corredera-madera-piscina.jpg",
    "ambiente/pvc-corredera-negra-salon": "ambiente/pvc-corredera-negra-salon.jpg",
    "ambiente/pvc-corredera-negra-cocina": "ambiente/pvc-corredera-negra-cocina.jpg",
    "ambiente/dormitorio-balconera": "ambiente/dormitorio-balconera.jpg",
    "ambiente/cocina-ventana-montanas": "ambiente/cocina-ventana-montanas.jpg",
    "ambiente/oficina-abisagradas": "ambiente/oficina-ventanas-abisagradas.jpg",
    "ambiente/ventana-persiana-fachada": "ambiente/ventana-persiana-fachada-gris.jpg",
    "ambiente/casa-madera-ventanas-negras": "ambiente/casa-madera-ventanas-negras.jpg",
    "ambiente/balconeras-blancas-jardin": "ambiente/interior-balconeras-blancas-jardin.jpg",
    "ambiente/comedor-minimalista-mar": "ambiente/comedor-minimalista-vistas-mar.jpg",
    "ambiente/lucernario": "ambiente/lucernario-techo-madera.jpg",
    "ambiente/muro-cortina-noche": "ambiente/muro-cortina-noche.jpg",
    "ambiente/edificio-fachada-ligera": "ambiente/edificio-fachada-ligera.jpg",
    "ambiente/salon-blanco-ventanal": "ambiente/salon-blanco-ventanal.jpg",
    "ambiente/bodegon-perfil-planos": "ambiente/bodegon-perfil-planos.jpg",
    # persianas, motorización, vidrio, mosquiteras
    "persianas/lamas-contraluz": "persianas/lamas-contraluz.jpg",
    "persianas/cajon-compacto-seccion": "persianas/cajon-compacto-seccion.jpg",
    "motorizacion/salon-mando": "motorizacion/salon-mando-distancia.jpg",
    "motorizacion/lamas-luz": "motorizacion/lamas-luz-azul.jpg",
    "vidrio/esquema-doble-acristalamiento": "vidrio/esquema-doble-acristalamiento.jpg",
    "mosquiteras/enrollable-ventana": "mosquiteras/enrollable-ventana.jpg",
    "mosquiteras/detalle-perfil-cajon": "mosquiteras/detalle-perfil-cajon.jpg",
}
# Renders de perfil (875x1000, fondo blanco): recorte cuadrado centrado → 400 y 700 px
RENDERS = [
    "aluminio-abisagrada-blanco-1", "aluminio-abisagrada-blanco-2", "aluminio-abisagrada-blanco-3", "aluminio-abisagrada-madera",
    "aluminio-corredera-1", "aluminio-corredera-2", "aluminio-corredera-4", "aluminio-corredera-6",
    "aluminio-minimalista-1", "aluminio-minimalista-2",
    "muro-cortina-nudo-1", "muro-cortina-nudo-3", "muro-cortina-seccion", "muro-cortina-modulacion",
    "pvc-abisagrada-1", "pvc-abisagrada-2", "pvc-abisagrada-4", "pvc-abisagrada-7", "pvc-balconera-umbral",
]
LOGOS = {  # destino en web/img/marca/ : origen en recursos/marca/
    "partners/cortizo.svg": "partners/logo-cortizo.svg",
    "partners/guardian-glass.png": "partners/logo-guardian-glass.png",
    "partners/climalit.png": "partners/logo-climalit.png",
    "partners/somfy.svg": "partners/logo-somfy.svg",
    "partners/nice.svg": "partners/logo-nice.svg",
    "partners/gaviota.svg": "partners/logo-gaviota.svg",
    "ayudas/logos-ue-feder-comunidad-madrid.jpg": "ayudas/logos-ue-feder-comunidad-madrid.jpg",
    "ayudas/logo-comunidad-madrid-dg-economia-industria.jpg": "ayudas/logo-comunidad-madrid-dg-economia-industria.jpg",
}


def guardar(im, destino, calidad=78):
    destino.parent.mkdir(parents=True, exist_ok=True)
    im.save(destino, "WEBP", quality=calidad, method=6)


def logo_seppala():
    """Logo actual (JPG sobre blanco, 546x165): versión PNG recortada para la cabecera y el
    emblema (círculo del lobo) con fondo transparente para el favicon y el pie."""
    im = Image.open(REC / "marca/logo-seppala.jpg").convert("RGB")
    (IMG / "marca").mkdir(parents=True, exist_ok=True)
    im.save(IMG / "marca/logo-seppala.png", optimize=True)
    im.resize((im.width * 2, im.height * 2), Image.LANCZOS).save(IMG / "marca/logo-seppala-2x.png", optimize=True)
    # emblema: el círculo ocupa la parte izquierda (≈ 0–165 px); se recorta y se hace transparente el blanco exterior
    lado = im.height
    emb = im.crop((0, 0, lado, lado)).convert("RGBA")
    px = emb.load()
    cx = cy = lado / 2
    for y in range(lado):
        for x in range(lado):
            if (x - cx) ** 2 + (y - cy) ** 2 > (lado / 2 - 1) ** 2:  # fuera del círculo
                px[x, y] = (255, 255, 255, 0)
    # el original solo tiene 165 px: no se amplía más que para el icono táctil (180)
    emb.save(IMG / "marca/emblema.png", optimize=True)
    emb.resize((180, 180), Image.LANCZOS).save(RAIZ / "web/apple-touch-icon.png", optimize=True)
    emb.resize((64, 64), Image.LANCZOS).save(RAIZ / "web/favicon.png", optimize=True)


def main():
    for dest, orig in FOTOS.items():
        im = ImageOps.exif_transpose(Image.open(REC / "imagenes" / orig)).convert("RGB")
        for w in ANCHOS:
            if w > im.width * 1.25 and w != ANCHOS[0]:  # no se inventan tamaños mayores que el original (el menor siempre se genera)
                continue
            real = min(w, im.width)
            guardar(im.resize((real, round(im.height * real / im.width)), Image.LANCZOS), IMG / f"{dest}-{w}.webp")
    for r in RENDERS:
        im = Image.open(REC / f"imagenes/renders/{r}.jpg").convert("RGB")
        lado = min(im.width, im.height)
        x0, y0 = (im.width - lado) // 2, (im.height - lado) // 2
        cuadrado = im.crop((x0, y0, x0 + lado, y0 + lado))
        for w in (400, 700):
            guardar(cuadrado.resize((w, w), Image.LANCZOS), IMG / f"renders/{r}-{w}.webp", 86)
    for dest, orig in LOGOS.items():
        d = IMG / "marca" / dest; d.parent.mkdir(parents=True, exist_ok=True)
        if dest.endswith(".svg") or dest.endswith(".jpg"):
            shutil.copy2(REC / "marca" / orig, d)
        else:
            im = Image.open(REC / "marca" / orig).convert("RGBA"); im.thumbnail((600, 300), Image.LANCZOS); im.save(d, optimize=True)
    logo_seppala()
    # Imagen para compartir en redes (Open Graph, 1200x630)
    im = Image.open(REC / "imagenes" / FOTOS["ambiente/casa-piscina-correderas"]).convert("RGB")
    ImageOps.fit(im, (1200, 630), Image.LANCZOS).save(IMG / "compartir.jpg", quality=82)
    total = sum(f.stat().st_size for f in IMG.rglob("*") if f.is_file())
    print(f"{len([f for f in IMG.rglob('*') if f.is_file()])} archivos en web/img/, {total / 1024:.0f} KB")


if __name__ == "__main__":
    main()
