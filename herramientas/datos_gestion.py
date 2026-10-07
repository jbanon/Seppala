#!/usr/bin/env python3
"""Genera los datos FICTICIOS de la demo del panel de gestión interna (web/gestion/datos/*.json).

Hermano de datos_demo.py (que genera los del área de clientes). Cada fichero imita la respuesta
de un futuro endpoint del sistema de gestión de Seppala (ver web/gestion/datos/LEEME.md). Todos
los clientes, obras, personas, importes y pedidos son inventados; los proveedores son las marcas
reales que trabaja Seppala (INVESTIGACION.md §5) con artículos descritos de forma genérica.

Para que las dos demos cuadren, el cliente único del área de clientes (C-02087) aparece aquí como
uno más, con sus mismos presupuestos y facturas (se importan de datos_demo.py, no se copian a mano).
Uso: .venv/bin/python herramientas/datos_gestion.py
"""
import json, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import datos_demo as area_clientes  # noqa: E402  (ayudas linea()/totales() y datos del cliente de la otra demo)

D = Path(__file__).resolve().parent.parent / "web/gestion/datos"
HOY = "2026-10-07"
linea, totales = area_clientes.linea, area_clientes.totales
ALU, PVC, COMP = area_clientes.ALU, area_clientes.PVC, area_clientes.COMP
PDF_PRESUPUESTO, PDF_FACTURA = "/area-clientes/docs-demo/presupuesto-demo.pdf", "/area-clientes/docs-demo/factura-demo.pdf"  # PDF de muestra

# Quién ha entrado en la demo (persona ficticia) y datos de la empresa que usa el marco del panel
USUARIO = {
    "nombre": "Usuario Demo", "rol": "Administración", "email": "usuario@seppala-demo.example", "ultimoAcceso": HOY,
    "empresa": {"nombre": "Aluminios Seppala, S.A.", "telefono": "91 830 05 43", "email": "administracion@aluminioseppala.com"},
}

# Clientes ficticios. El primero es el mismo cliente de ejemplo del área de clientes.
C = area_clientes.CLIENTE
CLIENTES = {c["codigo"]: c for c in [
    {"codigo": C["codigo"], "nombre": C["razonSocial"], "tipo": "Empresa de reformas", "contacto": C["usuarios"][0]["nombre"], "email": C["usuarios"][0]["email"], "localidad": C["direccionFiscal"]["localidad"]},
    {"codigo": "C-01542", "nombre": "Construcciones Modelo Henares, S.L. (cliente ficticio)", "tipo": "Constructora", "contacto": "Dpto. de compras", "email": "obras@constructora-demo.example", "localidad": "Villaejemplo"},
    {"codigo": "C-02210", "nombre": "C. P. Plaza de Ejemplo, 3 (comunidad ficticia)", "tipo": "Comunidad de propietarios", "contacto": "Administrador de fincas Demo", "email": "administrador@comunidad-demo.example", "localidad": "Villaejemplo"},
    {"codigo": "C-02233", "nombre": "Laura Ejemplo García (particular ficticio)", "tipo": "Particular", "contacto": "Laura", "email": "laura@particular-demo.example", "localidad": "Pueblo Demo"},
    {"codigo": "C-01987", "nombre": "Estudio de Arquitectura Imaginario, S.L.P. (cliente ficticio)", "tipo": "Estudio de arquitectura", "contacto": "Dirección de obra", "email": "proyectos@estudio-demo.example", "localidad": "Aldea Simulada"},
    {"codigo": "C-02251", "nombre": "Carlos Ejemplar Ruiz (particular ficticio)", "tipo": "Particular", "contacto": "Carlos", "email": "carlos@particular-demo.example", "localidad": "Villaejemplo"},
    {"codigo": "C-01760", "nombre": "Instalaciones Hipotéticas, S.L. (cliente ficticio)", "tipo": "Instalador", "contacto": "Compras", "email": "compras@instalador-demo.example", "localidad": "Polígono Ficticio"},
]}

# Obras nuevas (ficticias), distintas de las del área de clientes
OBRAS = {
    "promocion": {"nombre": "Promoción 12 viviendas C/ Figurada (obra ficticia)", "localidad": "Villaejemplo"},
    "nave": {"nombre": "Nave y oficinas Polígono Supuesto (obra ficticia)", "localidad": "Polígono Ficticio"},
    "comunidad": {"nombre": "Sustitución de ventanas en 24 viviendas, Plaza de Ejemplo, 3 (obra ficticia)", "localidad": "Villaejemplo"},
    "piso_laura": {"nombre": "Reforma de piso Avda. Supuesta, 8, 3.º B (obra ficticia)", "localidad": "Pueblo Demo"},
    "robles": {"nombre": "Vivienda unifamiliar Los Robles (obra ficticia)", "localidad": "Aldea Simulada"},
    "fachada": {"nombre": "Rehabilitación de fachada C/ Supuesta, 22 (obra ficticia)", "localidad": "Aldea Simulada"},
    "atico": {"nombre": "Cerramiento de terraza en ático (obra ficticia)", "localidad": "Villaejemplo"},
    "lote": {"nombre": "Suministro de ventanas sin instalación, lote 3 (obra ficticia)", "localidad": "Polígono Ficticio"},
    "lotes12": {"nombre": "Suministro de ventanas sin instalación, lotes 1 y 2 (obra ficticia)", "localidad": "Polígono Ficticio"},
}
GRIS, NEGRO, BLANCO, PLATA = "Gris antracita RAL 7016", "Negro RAL 9005", "Blanco", "Plata anodizado"
L = {
    "piso_laura": [linea(1, PVC, "PVC abisagrada 70 mm", "Ventana 2 hojas oscilobatiente con persiana", "Oscilobatiente + practicable", 1300, 1250, 3, BLANCO, BLANCO, "4/16/4 bajo emisivo", "Compacto con lama térmica, cinta", 598.00),
                   linea(2, PVC, "PVC abisagrada 70 mm", "Balconera 1 hoja oscilobatiente", "Oscilobatiente", 850, 2150, 1, BLANCO, BLANCO, "3+3/14/4 bajo emisivo", "Compacto con lama térmica, cinta", 575.00),
                   linea(3, COMP, "Mosquitera enrollable vertical", "Mosquitera enrollable para ventana", "Enrollable", 1300, 1250, 3, BLANCO, BLANCO, None, None, 92.00)],
    "promocion": [linea(1, PVC, "PVC abisagrada 84 mm", "Ventana 2 hojas oscilobatiente con persiana", "Oscilobatiente + practicable", 1200, 1200, 48, GRIS, BLANCO, "4/16/4 bajo emisivo", "Compacto RolaPlus, lama térmica, motor Somfy", 640.00),
                  linea(2, PVC, "PVC abisagrada 84 mm", "Balconera 2 hojas con persiana", "Practicable", 1500, 2100, 24, GRIS, BLANCO, "3+3/14/4 bajo emisivo", "Compacto RolaPlus, lama térmica, motor Somfy", 1090.00),
                  linea(3, PVC, "PVC corredera", "Corredera 2 hojas de cocina", "Corredera", 1400, 1000, 12, GRIS, BLANCO, "4/12/4", None, 420.00)],
    "atico": [linea(1, ALU, "Aluminio corredera RPT", "Cerramiento de terraza: corredera 3 hojas", "Corredera", 4200, 2300, 1, "Blanco lacado", "Blanco lacado", "4+4/16/6 Guardian Sun", None, 3480.00),
              linea(2, ALU, "Aluminio abisagrada RPT", "Fijo lateral", "Fijo", 900, 2300, 2, "Blanco lacado", "Blanco lacado", "4+4/16/6 Guardian Sun", None, 690.00),
              linea(3, COMP, "Mosquitera corredera", "Mosquitera corredera para terraza", "Corredera", 1400, 2300, 1, BLANCO, BLANCO, None, None, 310.00)],
    "comunidad": [linea(1, PVC, "PVC abisagrada 70 mm", "Ventana 2 hojas oscilobatiente con persiana (sustitución)", "Oscilobatiente + practicable", 1200, 1150, 72, BLANCO, BLANCO, "4/16/4 bajo emisivo", "Compacto con lama térmica, cinta", 585.00),
                  linea(2, PVC, "PVC abisagrada 70 mm", "Balconera 2 hojas con persiana (sustitución)", "Practicable", 1400, 2100, 48, BLANCO, BLANCO, "3+3/14/4 bajo emisivo", "Compacto con lama térmica, cinta", 960.00)],
    "robles": [linea(1, ALU, "Aluminio minimalista", "Corredera minimalista de salón, 2 hojas", "Corredera", 4800, 2600, 1, NEGRO, NEGRO, "6+6/16/6 Guardian Sun", None, 6900.00),
               linea(2, ALU, "Aluminio abisagrada RPT", "Ventana 1 hoja oscilobatiente", "Oscilobatiente", 900, 1300, 8, NEGRO, NEGRO, "4/16/4 bajo emisivo", "Compacto con persiana de aluminio, motor Nice", 1180.00),
               linea(3, ALU, "Aluminio abisagrada RPT", "Puerta de entrada con fijo lateral", "Practicable", 1400, 2400, 1, NEGRO, NEGRO, "5+5/12/4+4 seguridad", None, 2650.00)],
    "lote": [linea(1, PVC, "PVC corredera", "Corredera 2 hojas (solo suministro)", "Corredera", 1600, 1200, 10, BLANCO, BLANCO, "4/12/4", None, 395.00),
             linea(2, PVC, "PVC abisagrada 70 mm", "Ventana 1 hoja oscilobatiente (solo suministro)", "Oscilobatiente", 700, 1100, 14, BLANCO, BLANCO, "4/16/4 bajo emisivo", None, 310.00)],
    "nave": [linea(1, ALU, "Aluminio abisagrada RPT", "Ventana proyectante de nave", "Proyectante", 1500, 800, 20, PLATA, PLATA, "4/16/4 bajo emisivo", None, 690.00),
             linea(2, ALU, "Muro cortina", "Fachada de oficinas, módulo de 1,20 × 2,80 m", "Fijo", 1200, 2800, 10, PLATA, PLATA, "6/16/4+4 control solar", None, 1390.00),
             linea(3, ALU, "Aluminio abisagrada RPT", "Puerta de 2 hojas de acceso a oficinas", "Practicable", 1800, 2400, 2, PLATA, PLATA, "5+5/12/4+4 seguridad", None, 2980.00)],
}


def resumen(lineas):
    sistemas = list(dict.fromkeys(l["sistema"] for l in lineas))
    return f"{sum(l['unidades'] for l in lineas)} uds. · " + ", ".join(sistemas[:2]) + (" y más" if len(sistemas) > 2 else "")


def presupuesto(id_, fecha, valido, estado, cliente, obra, lineas, dto, enviado=None, pedido=None):
    """Vista interna de un presupuesto. `estado`: redactado (sin enviar) · enviado · revision · aceptado · rechazado · caducado.
    `enviado`: fecha del envío por correo ya registrado (None si aún no se ha enviado)."""
    c = CLIENTES[cliente]
    return {"id": id_, "fecha": fecha, "validoHasta": valido, "estado": estado, "cliente": c, "obra": obra, "resumen": resumen(lineas),
            "unidades": sum(l["unidades"] for l in lineas), "importes": totales(lineas, dto), "pedidoId": pedido, "pdf": PDF_PRESUPUESTO,
            "envios": [{"fecha": enviado, "destinatario": c["email"], "asunto": f"Presupuesto {id_} — Aluminios Seppala"}] if enviado else []}


# Los del cliente del área de clientes, con el estado traducido a la vista interna (allí «pendiente» = ya enviado, pendiente de aceptar)
ESTADO_INTERNO = {"pendiente": "enviado", "en_revision": "revision", "aceptado": "aceptado", "caducado": "caducado", "rechazado": "rechazado"}
DEL_AREA = [presupuesto(p["id"], p["fecha"], p["validoHasta"], ESTADO_INTERNO[p["estado"]], C["codigo"], p["obra"], p["lineas"], p["importes"]["descuentoPct"], enviado=p["fecha"], pedido=p["pedidoId"])
            for p in area_clientes.PRESUPUESTOS]
PRESUPUESTOS = sorted(DEL_AREA + [
    presupuesto("PR-2026-0418", "2026-10-06", "2026-11-05", "redactado", "C-02233", OBRAS["piso_laura"], L["piso_laura"], 0),
    presupuesto("PR-2026-0417", "2026-10-05", "2026-11-04", "redactado", "C-01542", OBRAS["promocion"], L["promocion"], 10),
    presupuesto("PR-2026-0416", "2026-10-02", "2026-11-01", "redactado", "C-02251", OBRAS["atico"], L["atico"], 0),
    presupuesto("PR-2026-0415", "2026-10-01", "2026-10-31", "enviado", "C-02210", OBRAS["comunidad"], L["comunidad"], 8, enviado="2026-10-01"),
    presupuesto("PR-2026-0409", "2026-09-25", "2026-10-25", "enviado", "C-01987", OBRAS["robles"], L["robles"], 5, enviado="2026-09-25"),
    presupuesto("PR-2026-0392", "2026-09-10", "2026-10-10", "rechazado", "C-01760", OBRAS["lote"], L["lote"], 12, enviado="2026-09-10"),
    presupuesto("PR-2026-0355", "2026-07-20", "2026-08-19", "aceptado", "C-01542", OBRAS["nave"], L["nave"], 10, enviado="2026-07-20", pedido="PE-2026-0541"),
], key=lambda p: p["id"], reverse=True)


def factura(id_, fecha, venc, cliente, obra, concepto, pedido, base, estado, enviada=None):
    """Vista interna de una factura. `estado`: pendiente (de cobro) · pagada · vencida. `enviada`: fecha del envío ya registrado."""
    c = CLIENTES[cliente]; iva = round(base * area_clientes.IVA, 2)
    return {"id": id_, "fecha": fecha, "vencimiento": venc, "cliente": c, "obra": obra, "concepto": concepto, "pedidoId": pedido,
            "baseImponible": round(base, 2), "iva": iva, "total": round(base + iva, 2), "formaPago": "Transferencia 30 días", "estado": estado, "pdf": PDF_FACTURA,
            "envios": [{"fecha": enviada, "destinatario": c["email"], "asunto": f"Factura {id_} — Aluminios Seppala"}] if enviada else []}


DEL_AREA_F = [factura(f["id"], f["fecha"], f["vencimiento"], C["codigo"], f["obra"], f.get("concepto") or "Instalación completa", f["pedidoId"], f["baseImponible"], f["estado"], enviada=f["fecha"])
              for f in area_clientes.FACTURAS]
NAVE_BASE = PRESUPUESTOS[[p["id"] for p in PRESUPUESTOS].index("PR-2026-0355")]["importes"]["baseImponible"]
FACTURAS = sorted(DEL_AREA_F + [
    factura("FV-2026-0673", "2026-10-06", "2026-11-05", "C-01542", OBRAS["nave"], "Trabajos adicionales: vierteaguas y remates", "PE-2026-0541", 2140.00, "pendiente"),
    factura("FV-2026-0672", "2026-10-03", "2026-11-02", "C-01542", OBRAS["nave"], "Certificación 3 (final de obra), 30 %", "PE-2026-0541", round(NAVE_BASE * .3, 2), "pendiente"),
    factura("FV-2026-0670", "2026-10-02", "2026-11-01", "C-01760", OBRAS["lotes12"], "Suministro lote 2", "PE-2026-0529", 7260.00, "pendiente", enviada="2026-10-02"),
    factura("FV-2026-0665", "2026-09-26", "2026-10-26", "C-01542", OBRAS["nave"], "Certificación 2, 30 %", "PE-2026-0541", round(NAVE_BASE * .3, 2), "pendiente", enviada="2026-09-26"),
    factura("FV-2026-0652", "2026-08-25", "2026-09-24", "C-01987", OBRAS["fachada"], "Liquidación de obra", "PE-2026-0503", 9870.00, "vencida", enviada="2026-08-25"),
    factura("FV-2026-0640", "2026-08-28", "2026-09-27", "C-01542", OBRAS["nave"], "Certificación 1, 40 %", "PE-2026-0541", round(NAVE_BASE * .4, 2), "pagada", enviada="2026-08-28"),
    factura("FV-2026-0633", "2026-08-20", "2026-09-19", "C-01760", OBRAS["lotes12"], "Suministro lote 1", "PE-2026-0529", 6980.00, "pagada", enviada="2026-08-20"),
], key=lambda f: f["id"], reverse=True)


# ---------------- Pedidos a proveedores ----------------
# Proveedores: las marcas que la investigación confirma que trabaja Seppala (INVESTIGACION.md §5). Sin proveedor de
# mosquiteras ni de lamas de persiana porque no consta ninguno confirmado (Persycom está pendiente, pregunta 2.4).
PROVEEDORES = {x["codigo"]: x for x in [
    {"codigo": "cortizo", "nombre": "Cortizo", "suministra": "Perfiles de aluminio y PVC, herrajes y accesorios", "familia": "perfil"},
    {"codigo": "kommerling", "nombre": "Kömmerling", "suministra": "Cajones de persiana RolaPlus", "familia": "persiana"},
    {"codigo": "guardian", "nombre": "Guardian Glass", "suministra": "Vidrio (Guardian Sun, ClimaGuard)", "familia": "vidrio"},
    {"codigo": "saint-gobain", "nombre": "Saint-Gobain Glass", "suministra": "Vidrio (Climalit)", "familia": "vidrio"},
    {"codigo": "somfy", "nombre": "Somfy", "suministra": "Motores y mandos para persianas", "familia": "motorizacion"},
    {"codigo": "nice", "nombre": "Nice", "suministra": "Motores y mandos para persianas", "familia": "motorizacion"},
    {"codigo": "gaviota", "nombre": "Gaviota", "suministra": "Motores para persianas y cierres enrollables", "familia": "motorizacion"},
]}
A_OBRAS = area_clientes.OBRAS
DESTINOS = {  # a qué obra (de la demo del área de clientes) o a stock va cada pedido
    "chalet": {"tipo": "obra", "nombre": A_OBRAS["chalet"]["nombre"], "pedidoClienteId": "PE-2026-0587"},
    "oficinas": {"tipo": "obra", "nombre": A_OBRAS["oficinas"]["nombre"], "pedidoClienteId": "PE-2026-0561"},
    "reforma": {"tipo": "obra", "nombre": A_OBRAS["reforma"]["nombre"], "pedidoClienteId": "PE-2026-0534"},
    "local": {"tipo": "obra", "nombre": A_OBRAS["local"]["nombre"], "pedidoClienteId": None, "presupuestoId": "PR-2026-0405"},
    "stock": {"tipo": "stock", "nombre": "Stock de taller", "pedidoClienteId": None},
}
# Artículos con código interno ficticio y descripción genérica (sin referencias reales de ningún fabricante)
def art(codigo, descripcion, unidad, pedidas, recibidas=0):
    return {"codigo": codigo, "descripcion": descripcion, "unidad": unidad, "pedidas": pedidas, "recibidas": recibidas}


def pedido_proveedor(id_, fecha, proveedor, destino, prevista, estado, lineas, historial, ref_proveedor=None):
    """`estado`: pendiente (nada recibido) · parcial · completado · cancelado. Coherente con las cantidades recibidas de las líneas;
    el panel lo recalcula con las recepciones registradas en la sesión de demo."""
    return {"id": id_, "fecha": fecha, "proveedor": PROVEEDORES[proveedor], "destino": DESTINOS[destino], "entregaPrevista": prevista, "estado": estado,
            "referenciaProveedor": ref_proveedor, "lineas": lineas, "articulos": len(lineas), "unidadesPedidas": sum(l["pedidas"] for l in lineas),
            "unidadesRecibidas": sum(l["recibidas"] for l in lineas), "historial": [{"fecha": f, "texto": t} for f, t in historial]}


GRIS7016 = "gris antracita RAL 7016"
PEDIDOS_PROVEEDORES = [
    pedido_proveedor("PP-2026-0231", "2026-10-06", "cortizo", "stock", "2026-10-14", "pendiente", [
        art("PF-0101", "Perfil marco corredera RPT, blanco, barra de 6,5 m", "barras", 24), art("PF-0102", "Perfil hoja corredera RPT, blanco, barra de 6,5 m", "barras", 24),
        art("PF-0201", "Perfil marco abisagrado RPT, blanco, barra de 6,5 m", "barras", 30), art("PF-0202", "Perfil hoja abisagrada RPT, blanco, barra de 6,5 m", "barras", 30),
        art("HE-0310", "Herraje oscilobatiente, juego completo", "uds", 40), art("AC-0405", "Junta de estanqueidad EPDM, rollo de 100 m", "rollos", 6)],
        [("2026-10-06", "Pedido enviado al proveedor (reposición de stock de perfil blanco).")]),
    pedido_proveedor("PP-2026-0230", "2026-10-05", "somfy", "chalet", "2026-10-16", "pendiente", [
        art("MO-0510", "Motor tubular para persiana con receptor de radio, 10 Nm", "uds", 5), art("MA-0520", "Mando a distancia de 5 canales", "uds", 1)],
        [("2026-10-05", "Pedido enviado al proveedor."), ("2026-10-06", "Confirmado por el proveedor: entrega prevista el 16/10.")], "SOM-DEMO-4471"),
    pedido_proveedor("PP-2026-0229", "2026-10-02", "guardian", "chalet", "2026-10-09", "parcial", [
        art("VI-0601", "Doble acristalamiento 4+4/16/6 control solar, 3200 × 2300 mm (2 hojas de corredera)", "uds", 2, 2),
        art("VI-0602", "Doble acristalamiento 4/16/4 bajo emisivo, 800 × 1100 mm", "uds", 5, 5),
        art("VI-0603", "Doble acristalamiento 4+4/16/6 control solar, 600 × 2200 mm (fijos de escalera)", "uds", 2, 0)],
        [("2026-10-02", "Pedido enviado al proveedor."), ("2026-10-06", "Recepción parcial: 7 de 9 unidades. Faltan los dos fijos de escalera, reprogramados para el 09/10.")], "GG-DEMO-20931"),
    pedido_proveedor("PP-2026-0228", "2026-10-01", "kommerling", "chalet", "2026-10-15", "pendiente", [
        art("CP-0701", "Cajón de persiana RolaPlus con lama de seguridad autoblocante, 800 mm, preparado para motor", "uds", 5),
        art("CP-0702", "Guías y accesorios de cajón, juego", "uds", 5)],
        [("2026-10-01", "Pedido enviado al proveedor."), ("2026-10-02", "Confirmado: fabricación a medida, entrega prevista el 15/10.")], "KOM-DEMO-8812"),
    pedido_proveedor("PP-2026-0226", "2026-09-24", "cortizo", "chalet", "2026-10-01", "completado", [
        art("PF-0101", f"Perfil marco corredera RPT, {GRIS7016}, barra de 6,5 m", "barras", 4, 4), art("PF-0102", f"Perfil hoja corredera RPT, {GRIS7016}, barra de 6,5 m", "barras", 4, 4),
        art("PF-0201", f"Perfil marco abisagrado RPT, {GRIS7016}, barra de 6,5 m", "barras", 8, 8), art("PF-0202", f"Perfil hoja abisagrada RPT, {GRIS7016}, barra de 6,5 m", "barras", 6, 6),
        art("HE-0310", "Herraje oscilobatiente, juego completo", "uds", 5, 5)],
        [("2026-09-24", "Pedido enviado al proveedor."), ("2026-09-25", "Confirmado por el proveedor."), ("2026-09-30", "Recibido completo. Material pasado a fabricación.")]),
    pedido_proveedor("PP-2026-0221", "2026-09-12", "gaviota", "local", "2026-09-26", "cancelado", [
        art("MO-0530", "Motor para cierre enrollable de alta seguridad, con electrofreno", "uds", 1)],
        [("2026-09-12", "Pedido enviado al proveedor."), ("2026-09-19", "Pedido anulado: el presupuesto PR-2026-0405 sigue pendiente de aceptación por el cliente.")]),
    pedido_proveedor("PP-2026-0219", "2026-09-08", "saint-gobain", "oficinas", "2026-09-19", "completado", [
        art("VI-0610", "Doble acristalamiento 6/16/4+4 control solar, 1200 × 3000 mm (muro cortina)", "uds", 18, 18),
        art("VI-0611", "Doble acristalamiento 6/16/4+4 control solar, 1200 × 600 mm (proyectantes)", "uds", 6, 6)],
        [("2026-09-08", "Pedido enviado al proveedor."), ("2026-09-19", "Recibido completo en obra.")], "SGG-DEMO-1172"),
    pedido_proveedor("PP-2026-0214", "2026-08-27", "cortizo", "oficinas", "2026-09-05", "completado", [
        art("MC-0801", "Montante de muro cortina, negro RAL 9005, barra de 6,5 m", "barras", 24, 24), art("MC-0802", "Travesaño de muro cortina, negro RAL 9005, barra de 6,5 m", "barras", 30, 30),
        art("MC-0803", "Tapeta exterior de muro cortina, negro RAL 9005, barra de 6,5 m", "barras", 54, 54), art("MC-0804", "Presor y junta de muro cortina, barra de 6,5 m", "barras", 54, 54),
        art("PF-0301", "Perfil marco proyectante RPT, negro RAL 9005, barra de 6,5 m", "barras", 4, 4), art("PF-0302", "Perfil hoja proyectante RPT, negro RAL 9005, barra de 6,5 m", "barras", 4, 4),
        art("HE-0320", "Herraje proyectante con compás, juego", "uds", 6, 6)],
        [("2026-08-27", "Pedido enviado al proveedor."), ("2026-08-28", "Confirmado por el proveedor."), ("2026-09-05", "Recibido completo.")]),
    pedido_proveedor("PP-2026-0207", "2026-08-18", "nice", "stock", "2026-08-26", "completado", [
        art("MO-0540", "Motor tubular con receptor de radio, 20 Nm", "uds", 4, 4), art("MA-0541", "Mando a distancia de 1 canal", "uds", 4, 4)],
        [("2026-08-18", "Pedido enviado al proveedor (stock de motores para posventa)."), ("2026-08-26", "Recibido completo.")]),
    pedido_proveedor("PP-2026-0188", "2026-07-01", "kommerling", "reforma", "2026-07-10", "completado", [
        art("CP-0701", "Cajón de persiana RolaPlus con lama térmica, 1400 mm, preparado para motor", "uds", 4, 4),
        art("CP-0703", "Cajón de persiana RolaPlus con lama térmica, 900 mm, accionamiento por cinta", "uds", 2, 2)],
        [("2026-07-01", "Pedido enviado al proveedor."), ("2026-07-08", "Recibido completo.")], "KOM-DEMO-8120"),
]


def main():
    D.mkdir(parents=True, exist_ok=True)
    for nombre, datos in [("usuario", USUARIO), ("presupuestos", PRESUPUESTOS), ("facturas", FACTURAS),
                          ("proveedores", list(PROVEEDORES.values())), ("pedidos-proveedores", PEDIDOS_PROVEEDORES)]:
        cuerpo = {"meta": {"demo": True, "aviso": "Datos ficticios", "generado": HOY}, "datos": datos}
        (D / f"{nombre}.json").write_text(json.dumps(cuerpo, ensure_ascii=False, indent=1), encoding="utf-8")
    print("datos de la demo de gestión generados en", D, "·", len(PRESUPUESTOS), "presupuestos,", len(FACTURAS), "facturas,", len(CLIENTES), "clientes,", len(PEDIDOS_PROVEEDORES), "pedidos a", len(PROVEEDORES), "proveedores")


if __name__ == "__main__":
    main()
