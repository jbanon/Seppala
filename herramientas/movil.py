#!/usr/bin/env python3
"""Auditoría de móvil de todas las páginas de web/ (requisito prioritario, ver CLAUDE.md).

Comprueba en 360×800, 390×844, 414×896 y horizontal 844×390:
  · scroll horizontal (y qué elementos se salen)   · zonas táctiles < 44×44 px (enlaces y botones no «en línea»)
  · campos de formulario < 16 px                   · texto < 12 px
  · elementos fijos (barra de contacto, navegación del portal) que tapen enlaces o botones al final de página
Uso:  .venv/bin/python herramientas/movil.py [--motor webkit] [--capturas] [ruta ...]
      --motor chromium|webkit (por defecto chromium; webkit = motor de Safari en iPhone)
      --capturas guarda referencia/capturas/movil/<pagina>-<ancho>.png
"""
import functools, http.server, sys, threading
from pathlib import Path
from playwright.sync_api import sync_playwright

RAIZ = Path(__file__).resolve().parent.parent
WEB = RAIZ / "web"
VISTAS = {"360": (360, 800), "390": (390, 844), "414": (414, 896), "horizontal": (844, 390)}
DETALLE = {"presupuestos": "PR-2026-0412", "pedidos": "PE-2026-0587", "incidencias": "IN-2026-0044"}  # ids de la demo
DEMOS = {"/area-clientes/": "seppala-demo-sesion", "/gestion/": "seppala-gestion-sesion"}  # demos con acceso simulado: clave de sesión

JS = r"""
() => {
  const vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && e.offsetParent !== null || s.position === 'fixed' && r.width > 0; };
  const out = { desborde: document.documentElement.scrollWidth > window.innerWidth + 1, tactil: [], campos: [], texto: [], anchos: [] };
  if (out.desborde) document.querySelectorAll('body *').forEach(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); if (s.position !== 'fixed' && r.right > innerWidth + 1 && r.width < 3000 && out.anchos.length < 6) out.anchos.push(e.tagName + '.' + String(e.className).slice(0, 40) + ' ' + Math.round(r.right)); });
  document.querySelectorAll('a, button, summary, input[type=checkbox], input[type=radio], select, input:not([type=hidden]), textarea').forEach(e => {
    if (!vis(e) || e.closest('.trampa') || e.classList.contains('salto') || e.closest('[hidden]')) return;
    let r = e.getBoundingClientRect();
    if (e.matches('input[type=radio], input[type=checkbox]')) { const l = e.closest('label'); if (l) r = l.getBoundingClientRect(); }
    const enLinea = e.tagName === 'A' && getComputedStyle(e).display === 'inline' && e.parentElement && e.parentElement.textContent.trim().length > e.textContent.trim().length + 12;
    if (!enLinea && (r.height < 43.5 || r.width < 43.5)) out.tactil.push((e.textContent.trim() || e.getAttribute('aria-label') || e.name || e.tagName).slice(0, 28) + ` ${Math.round(r.width)}×${Math.round(r.height)}`);
  });
  document.querySelectorAll('input:not([type=checkbox]):not([type=radio]), select, textarea').forEach(e => { if (vis(e) && !e.closest('.trampa') && parseFloat(getComputedStyle(e).fontSize) < 16) out.campos.push(e.name || e.id); });
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) { const t = n.textContent.trim(), p = n.parentElement; if (t.length > 2 && p && vis(p) && !p.closest('[hidden]') && parseFloat(getComputedStyle(p).fontSize) < 12 && out.texto.length < 5) out.texto.push(t.slice(0, 24)); }
  return out;
}
"""
JS_FIJOS = r"""
() => { // al final de la página: ¿algún elemento fijo tapa un enlace o botón?
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
  const tapados = [];
  document.querySelectorAll('.barra-contacto, .p-nav').forEach(f => {
    if (getComputedStyle(f).display === 'none' || f.hidden) return;
    const fr = f.getBoundingClientRect();
    document.querySelectorAll('main a, main button, footer a, footer button').forEach(e => {
      if (f.contains(e)) return; const r = e.getBoundingClientRect();
      if (r.width && r.bottom > fr.top + 2 && r.top < fr.bottom - 2 && r.right > fr.left + 2 && r.left < fr.right - 2) tapados.push(e.textContent.trim().slice(0, 24));
    });
  });
  return tapados;
}
"""


def rutas():
    r = ["/" + str(p.parent.relative_to(WEB)).replace(".", "") for p in sorted(WEB.rglob("index.html"))]
    return [x if x.endswith("/") else x + "/" for x in r] + ["/404.html"]


def main():
    args = sys.argv[1:]; motor = "chromium"; capt = False
    if "--motor" in args: i = args.index("--motor"); motor = args[i + 1]; del args[i:i + 2]
    if "--capturas" in args: capt = True; args.remove("--capturas")

    class H(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(H, directory=str(WEB)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{srv.server_address[1]}"
    problemas = 0
    with sync_playwright() as p:
        nav = getattr(p, motor).launch()
        for nombre, (w, h) in VISTAS.items():
            ctx = nav.new_context(viewport={"width": w, "height": h}, device_scale_factor=1, has_touch=True, is_mobile=(motor == "chromium"))
            pag = ctx.new_page()
            for ruta in args or rutas():
                pag.goto(base + ruta, wait_until="networkidle")
                # estado estable: el visitante ya ha decidido sobre las cookies (el aviso tapa el pie hasta entonces)
                pag.evaluate("try { localStorage.setItem('seppala-cookies-terceros', 'no') } catch (e) {}; var c = document.getElementById('cookies'); if (c) c.hidden = true")
                demo = [d for d in DEMOS if ruta.startswith(d) and ruta != d]
                if demo:  # las demos redirigen al acceso sin sesión
                    pag.evaluate("try { sessionStorage.setItem('%s', '1'); localStorage.setItem('%s', '1') } catch (e) {}" % (DEMOS[demo[0]], DEMOS[demo[0]]))
                    sufijo = "?id=" + DETALLE.get(ruta.split("/")[2], "") if "detalle" in ruta else ""
                    pag.goto(base + ruta + sufijo, wait_until="networkidle")
                r = pag.evaluate(JS); tap = pag.evaluate(JS_FIJOS)
                fallos = []
                if r["desborde"]: fallos.append("SCROLL HORIZONTAL " + ", ".join(r["anchos"]))
                if r["tactil"]: fallos.append(f"táctil<44: {len(r['tactil'])} → " + " | ".join(r["tactil"][:8]))
                if r["campos"]: fallos.append("campos<16px: " + ",".join(r["campos"]))
                if r["texto"]: fallos.append("texto<12px: " + " | ".join(r["texto"]))
                if tap: fallos.append("tapado por elemento fijo: " + " | ".join(tap[:5]))
                if fallos:
                    problemas += len(fallos); print(f"[{motor} {nombre}] {ruta}"); [print("    " + f) for f in fallos]
                if capt:
                    d = RAIZ / "referencia/capturas/movil"; d.mkdir(parents=True, exist_ok=True)
                    pag.evaluate("window.scrollTo(0,0)"); pag.evaluate("document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager')"); pag.wait_for_load_state("networkidle")
                    pag.screenshot(path=str(d / f"{ruta.strip('/').replace('/', '_').replace('.html', '') or 'inicio'}-{nombre}.png"), full_page=True)
            ctx.close()
        nav.close()
    print(f"{motor}: {len(args or rutas())} páginas × {len(VISTAS)} vistas, {problemas} problemas")


if __name__ == "__main__":
    main()
