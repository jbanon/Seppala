#!/usr/bin/env python3
"""Comprobación estática de web/: enlaces internos y anclas, recursos (img, srcset, css, js,
vídeo, póster), alt y width/height en imágenes, un solo h1, title y description presentes,
de longitud razonable y únicos, y canonical en las páginas indexables.
Uso: .venv/bin/python herramientas/enlaces.py"""
import re
from html.parser import HTMLParser
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent / "web"


class P(HTMLParser):
    def __init__(self):
        super().__init__(); self.refs = []; self.imgs = []; self.ids = set(); self.title = ""; self.desc = None
        self.h1 = 0; self._t = False; self.canonical = None; self.robots = ""
    def handle_starttag(self, tag, a):
        a = dict(a)
        if "id" in a: self.ids.add(a["id"])
        for k in ("href", "src", "poster", "data-video", "data-mapa", "action"):
            if a.get(k): self.refs.append(a[k])
        if a.get("srcset"): self.refs += [x.strip().split()[0] for x in a["srcset"].split(",")]
        if tag == "img": self.imgs.append(a)
        if tag == "title": self._t = True
        if tag == "h1": self.h1 += 1
        if tag == "meta" and a.get("name") == "description": self.desc = a.get("content", "")
        if tag == "meta" and a.get("name") == "robots": self.robots = a.get("content", "")
        if tag == "link" and a.get("rel") == "canonical": self.canonical = a.get("href")
    def handle_endtag(self, tag):
        if tag == "title": self._t = False
    def handle_data(self, d):
        if self._t: self.title += d


def main():
    pags = {}
    for f in sorted(WEB.rglob("*.html")):
        p = P(); p.feed(f.read_text(encoding="utf-8")); pags[f] = p
    errores = 0; titulos = {}; descs = {}
    for f, p in pags.items():
        rel = f.relative_to(WEB)
        def err(m):
            nonlocal errores; errores += 1; print(f"{rel}: {m}")
        for r in p.refs:
            if re.match(r"^(https?:|mailto:|tel:|data:|#$|javascript:)", r): continue
            ruta, _, ancla = r.partition("#"); ruta = ruta.split("?")[0]
            dest = f if not ruta else (WEB / ruta.lstrip("/") if ruta.startswith("/") else f.parent / ruta)
            if dest.is_dir(): dest = dest / "index.html"
            if not dest.exists(): err(f"enlace roto → {r}"); continue
            if ancla and dest.suffix == ".html" and ancla not in pags[dest].ids: err(f"ancla inexistente → {r}")
        for i in p.imgs:
            if "alt" not in i: err(f"img sin alt → {i.get('src')}")
            if not i.get("width") or not i.get("height"): err(f"img sin width/height → {i.get('src')}")
        if p.h1 != 1: err(f"{p.h1} h1")
        t = p.title.strip()
        if not t: err("sin title")
        elif len(t) > 80: err(f"title de {len(t)} caracteres")
        if not p.desc: err("sin meta description")
        elif not 50 <= len(p.desc) <= 170: err(f"description de {len(p.desc)} caracteres")
        if "noindex" not in p.robots and not p.canonical: err("sin canonical")
        titulos.setdefault(t, []).append(rel); descs.setdefault(p.desc, []).append(rel)
    for d in (titulos, descs):
        for k, v in d.items():
            if len(v) > 1: errores += 1; print("duplicado:", (k or "")[:60], [str(x) for x in v])
    print(f"{len(pags)} páginas comprobadas, {errores} problemas")


if __name__ == "__main__":
    main()
