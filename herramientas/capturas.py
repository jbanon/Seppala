#!/usr/bin/env python3
"""Capturas de las páginas de web/ en móvil (390 px) y escritorio (1440 px).

Uso:  .venv/bin/python herramientas/capturas.py [ruta ...]
      Sin argumentos captura todas las páginas (cada index.html, estilo.html y 404.html).
      Ejemplo: .venv/bin/python herramientas/capturas.py / /aluminios/
Salida: referencia/capturas/<pagina>-movil.png y <pagina>-escritorio.png (no versionadas).
Avisa de errores de consola, recursos que fallan y desborde horizontal.
"""
import functools, http.server, sys, threading
from pathlib import Path
from playwright.sync_api import sync_playwright

RAIZ = Path(__file__).resolve().parent.parent
WEB, SALIDA = RAIZ / "web", RAIZ / "referencia" / "capturas"
ANCHOS = {"movil": (390, 844), "escritorio": (1440, 900)}
DETALLE = {"presupuestos": "PR-2026-0412", "pedidos": "PE-2026-0587", "incidencias": "IN-2026-0044", "pedidos-proveedores": "PP-2026-0229"}  # ids de las demos
DEMOS = {"/area-clientes/": "seppala-demo-sesion", "/gestion/": "seppala-gestion-sesion"}  # demos con acceso simulado: clave de sesión


def rutas():
    r = ["/" + str(p.parent.relative_to(WEB)).replace(".", "") for p in sorted(WEB.rglob("index.html"))]
    r = [x if x.endswith("/") else x + "/" for x in r]
    return r + [f"/{n}" for n in ("estilo.html", "404.html") if (WEB / n).exists()]


def main():
    class Silencioso(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Silencioso, directory=str(WEB)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{srv.server_address[1]}"
    SALIDA.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        nav = p.chromium.launch()
        for nombre, (w, h) in ANCHOS.items():
            ctx = nav.new_context(viewport={"width": w, "height": h}, device_scale_factor=1)
            pag = ctx.new_page()
            errores = []
            pag.on("console", lambda m: errores.append(m.text) if m.type == "error" else None)
            pag.on("requestfailed", lambda r: errores.append("FALLO " + r.url))
            pag.on("response", lambda r: errores.append(f"{r.status} {r.url}") if r.status >= 400 else None)
            for ruta in sys.argv[1:] or rutas():
                pag.goto(base + ruta, wait_until="networkidle")
                demo = [d for d in DEMOS if ruta.startswith(d) and ruta != d]
                if demo:  # demos con acceso simulado: sesión
                    pag.evaluate("sessionStorage.setItem('%s', '1')" % DEMOS[demo[0]])
                    sufijo = "?id=" + DETALLE.get(ruta.split("/")[2], "") if "detalle" in ruta else ""
                    pag.goto(base + ruta + sufijo, wait_until="networkidle")
                pag.evaluate("try { localStorage.setItem('seppala-cookies-terceros', 'no') } catch (e) {}")  # sin banner en las capturas
                pag.evaluate("var c = document.getElementById('cookies'); if (c) c.hidden = true")
                pag.evaluate("document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager')")
                pag.wait_for_load_state("networkidle"); pag.wait_for_timeout(250)
                desborde = pag.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
                fich = SALIDA / f"{ruta.strip('/').replace('/', '_').replace('.html', '') or 'inicio'}-{nombre}.png"
                pag.screenshot(path=str(fich), full_page=True)
                print(f"{fich.name}{'  ¡DESBORDE HORIZONTAL!' if desborde else ''}")
            for e in dict.fromkeys(errores):
                print("  ERROR:", e)
            ctx.close()
        nav.close()


if __name__ == "__main__":
    main()
