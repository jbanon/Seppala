#!/usr/bin/env python3
"""Genera los PDF de MUESTRA de la demo del portal (presupuesto, factura y acta de instalación
ficticios) en web/area-clientes/docs-demo/ con Chromium. Uso: .venv/bin/python herramientas/pdf_demo.py"""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

RAIZ = Path(__file__).resolve().parent.parent
A = RAIZ / "web/area-clientes"
pr = json.loads((A / "datos/presupuestos.json").read_text(encoding="utf-8"))["datos"][0]
cl = json.loads((A / "datos/cliente.json").read_text(encoding="utf-8"))["datos"]
eur = lambda n: f"{n:,.2f} €".replace(",", "X").replace(".", ",").replace("X", ".")

F = (RAIZ / "web/fonts").as_uri()
PLANTILLA = """<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
@font-face{{font-family:S;src:url({f}/newsreader-latin-wght-normal.woff2);font-weight:200 800}} @font-face{{font-family:T;src:url({f}/figtree-latin-wght-normal.woff2);font-weight:300 900}}
@page{{size:A4;margin:18mm 16mm}} body{{font:10pt/1.5 T,sans-serif;color:#3e4f56;margin:0}} h1{{font:400 30pt/1 S,serif;color:#0b2a33;margin:0}}
.cab{{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid #0b2a33;padding-bottom:6mm;margin-bottom:8mm}} .cab img{{height:14mm}}
.demo{{background:#0b2a33;color:#fff;text-align:center;font-size:8pt;letter-spacing:.14em;text-transform:uppercase;padding:2mm;margin-bottom:8mm}}
.dos{{display:flex;gap:12mm;margin-bottom:8mm}} .dos div{{flex:1}} h2{{font:600 8pt T;letter-spacing:.12em;text-transform:uppercase;color:#5f7076;margin:0 0 2mm}} b,strong{{color:#0b2a33}}
table{{width:100%;border-collapse:collapse}} th{{text-align:left;font:600 8pt T;letter-spacing:.08em;text-transform:uppercase;color:#5f7076;border-bottom:1px solid #0b2a33;padding:2mm 0}}
td{{padding:3mm 0;border-bottom:1px solid #dbe3e6;vertical-align:top}} .n{{text-align:right;white-space:nowrap}} small{{color:#5f7076}}
.tot{{margin:6mm 0 0 auto;width:70mm}} .tot td{{padding:1.5mm 0}} .tot tr:last-child td{{font-size:12pt;color:#0b2a33;font-weight:600;border-bottom:0;border-top:1px solid #0b2a33}}
.pie{{position:fixed;bottom:0;left:0;right:0;font-size:8pt;color:#5f7076;border-top:1px solid #dbe3e6;padding-top:3mm}}
</style></head><body>
<div class="demo">Documento de muestra · Demo · Datos ficticios · Sin validez</div>
<div class="cab"><div><h1>{titulo}</h1><p><b>{numero}</b> · {fecha}</p></div><img src="{logo}"></div>
<div class="dos"><div><h2>Cliente</h2><b>{cliente}</b><br>NIF {nif}<br>{dir}</div><div><h2>Obra</h2><b>{obra}</b><br>{loc}<br>Ref. cliente: {ref}</div></div>
<table><thead><tr><th>Pos.</th><th>Descripción</th><th class="n">Uds.</th>{th_precio}</tr></thead><tbody>{filas}</tbody></table>
{totales}
<p style="margin-top:8mm">{nota}</p>
<div class="pie">Aluminios Seppala, S.A. · Carpintería de aluminio y PVC · Documento generado para la demo del área de clientes. No es un documento real.</div>
</body></html>"""


def html(titulo, numero, fecha, con_precios, nota):
    filas = "".join(
        f"<tr><td>{l['posicion']:02d}</td><td><b>{l['descripcion']}</b><br><small>{l['sistema']} · {l['apertura']}"
        + (f" · {l['anchoMm']} × {l['altoMm']} mm" if l['anchoMm'] else "") + (f"<br>Vidrio {l['vidrio']}" if l['vidrio'] else "") + (f"<br>Persiana: {l['persiana']}" if l['persiana'] else "")
        + (f"<br>Color exterior {l['color']['exterior']} · interior {l['color']['interior']}" if l['color']['exterior'] else "") + f"</small></td><td class='n'>{l['unidades']}</td>"
        + (f"<td class='n'>{eur(l['precioUnitario'])}</td><td class='n'>{eur(l['importe'])}</td>" if con_precios else "") + "</tr>" for l in pr["lineas"])
    i = pr["importes"]
    tot = (f"<table class='tot'><tr><td>Importe bruto</td><td class='n'>{eur(i['bruto'])}</td></tr><tr><td>Descuento {i['descuentoPct']} %</td><td class='n'>−{eur(i['descuento'])}</td></tr>"
           f"<tr><td>Base imponible</td><td class='n'>{eur(i['baseImponible'])}</td></tr><tr><td>IVA {i['ivaPct']} %</td><td class='n'>{eur(i['iva'])}</td></tr><tr><td>Total</td><td class='n'>{eur(i['total'])}</td></tr></table>") if con_precios else ""
    d = cl["direccionFiscal"]
    return PLANTILLA.format(f=F, titulo=titulo, numero=numero, fecha=fecha, logo=(RAIZ / "web/img/marca/logo-seppala.png").as_uri(), cliente=cl["razonSocial"], nif=cl["nif"],
                            dir=f"{d['linea']}<br>{d['cp']} {d['localidad']}", obra=pr["obra"]["nombre"], loc=pr["obra"]["localidad"], ref=pr["referenciaCliente"],
                            th_precio="<th class='n'>Precio</th><th class='n'>Importe</th>" if con_precios else "", filas=filas, totales=tot, nota=nota)


DOCS = {"presupuesto-demo.pdf": ("Presupuesto", "PR-2026-0000", "07/10/2026", True, "Validez: 30 días. Plazo estimado de fabricación e instalación: 35 días desde la medición definitiva."),
        "factura-demo.pdf": ("Factura", "FV-2026-0000", "07/10/2026", True, "Forma de pago: transferencia a 30 días. Cuenta: ES00 0000 0000 0000 0000 0000 (ficticia)."),
        "albaran-demo.pdf": ("Acta de instalación", "AL-2026-0000", "07/10/2026", False, "Instalado y comprobado el funcionamiento. Recibí conforme: ______________________")}

with sync_playwright() as p:
    nav = p.chromium.launch(); pag = nav.new_page()
    (A / "docs-demo").mkdir(exist_ok=True)
    tmp = A / "docs-demo/_tmp.html"
    for nombre, args in DOCS.items():
        tmp.write_text(html(*args), encoding="utf-8"); pag.goto(tmp.as_uri()); pag.wait_for_timeout(300)
        pag.pdf(path=str(A / "docs-demo" / nombre), format="A4", print_background=True); print(nombre)
    tmp.unlink(); nav.close()
