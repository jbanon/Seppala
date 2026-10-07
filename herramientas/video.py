#!/usr/bin/env python3
"""Vídeos de la web: comprime los originales de recursos/video/ a web/video/ (H.264 720p,
reproducción solo al pulsar, sin terceros) y genera su póster en web/img/video/.

Uso: .venv/bin/python herramientas/video.py [--forzar]
Necesita el ffmpeg del paquete imageio-ffmpeg instalado en .venv (pip install imageio-ffmpeg).
Herramienta de autoría: solo hay que ejecutarla si cambian los vídeos de origen."""
import subprocess, sys
from pathlib import Path
import imageio_ffmpeg
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ORIG, DEST, POSTER = RAIZ / "recursos/video", RAIZ / "web/video", RAIZ / "web/img/video"
FF = imageio_ffmpeg.get_ffmpeg_exe()
VIDEOS = {  # nombre en web/video/ : (original, segundo del fotograma para el póster)
    "aislamiento-termico": ("aislamiento-termico-original.mp4", 8),
    "aislamiento-acustico": ("aislamiento-acustico-original.mp4", 8),
}


def main():
    forzar = "--forzar" in sys.argv
    DEST.mkdir(parents=True, exist_ok=True); POSTER.mkdir(parents=True, exist_ok=True)
    for nombre, (orig, seg) in VIDEOS.items():
        src, mp4 = ORIG / orig, DEST / f"{nombre}.mp4"
        if not src.exists():
            print("FALTA", src); continue
        if forzar or not mp4.exists():
            subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-y", "-i", str(src), "-c:v", "libx264", "-preset", "slow", "-crf", "30",
                            "-vf", "scale=1280:720", "-movflags", "+faststart", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "80k", "-ac", "2", str(mp4)], check=True)
        tmp = POSTER / f"{nombre}.png"
        subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-y", "-ss", str(seg), "-i", str(mp4), "-frames:v", "1", str(tmp)], check=True)
        im = Image.open(tmp).convert("RGB")
        for w in (640, 1280):
            im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(POSTER / f"{nombre}-{w}.webp", "WEBP", quality=80, method=6)
        tmp.unlink()
        print(f"{nombre}: {mp4.stat().st_size / 1024 / 1024:.1f} MB, póster {im.size}")


if __name__ == "__main__":
    main()
