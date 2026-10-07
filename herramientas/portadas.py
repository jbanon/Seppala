#!/usr/bin/env python3
"""Genera en web/img/docs/ la portada (primera página) de los PDF de web/docs/ en WebP (300 y 600 px).

Uso: .venv/bin/python herramientas/portadas.py
Necesita pdftoppm (poppler-utils). Herramienta de autoría: volver a ejecutarla solo si cambia
algún PDF de web/docs/."""
import subprocess, tempfile
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
DOCS, IMG = RAIZ / "web" / "docs", RAIZ / "web" / "img" / "docs"


def main():
    IMG.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for pdf in sorted(DOCS.glob("*.pdf")):
            nombre = pdf.stem
            subprocess.run(["pdftoppm", "-png", "-r", "110", "-f", "1", "-l", "1", "-singlefile", str(pdf), f"{tmp}/{nombre}"], check=True)
            im = Image.open(f"{tmp}/{nombre}.png").convert("RGB")
            for w in (300, 600):
                im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(IMG / f"{nombre}-{w}.webp", "WEBP", quality=80, method=6)
            print(nombre, im.size, f"{pdf.stat().st_size / 1024 / 1024:.1f} MB")


if __name__ == "__main__":
    main()
