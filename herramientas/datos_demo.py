#!/usr/bin/env python3
"""Genera los datos FICTICIOS de la demo del área de clientes (web/area-clientes/datos/*.json).

Cada fichero imita la respuesta de un futuro endpoint de la API del sistema de gestión de
Seppala (ver web/area-clientes/datos/LEEME.md). Todos los nombres de clientes, obras, personas
y direcciones son inventados; los productos son los que fabrica e instala Seppala.
Uso: .venv/bin/python herramientas/datos_demo.py
"""
import json
from pathlib import Path

D = Path(__file__).resolve().parent.parent / "web/area-clientes/datos"
IVA = 0.21
HOY = "2026-10-07"


def linea(pos, familia, sistema, desc, apertura, ancho, alto, uds, color_ext, color_int, vidrio, persiana, precio):
    return {"posicion": pos, "familia": familia, "sistema": sistema, "descripcion": desc, "apertura": apertura, "anchoMm": ancho, "altoMm": alto,
            "unidades": uds, "color": {"exterior": color_ext, "interior": color_int}, "vidrio": vidrio, "persiana": persiana,
            "precioUnitario": precio, "importe": round(precio * uds, 2)}


def totales(lineas, dto=0):
    bruto = round(sum(l["importe"] for l in lineas), 2); d = round(bruto * dto / 100, 2)
    base = round(bruto - d, 2); iva = round(base * IVA, 2)
    return {"bruto": bruto, "descuentoPct": dto, "descuento": d, "baseImponible": base, "ivaPct": 21, "iva": iva, "total": round(base + iva, 2)}


OBRAS = {
    "reforma": {"nombre": "Reforma vivienda C/ Inventada, 12 (obra ficticia)", "localidad": "Villaejemplo"},
    "chalet": {"nombre": "Chalet Los Cerros de Prueba (obra ficticia)", "localidad": "Aldea Simulada"},
    "oficinas": {"nombre": "Oficinas Nave Imaginaria (obra ficticia)", "localidad": "Polígono Ficticio"},
    "residencial": {"nombre": "Residencial Las Encinas Demo, bloque B (obra ficticia)", "localidad": "Villaejemplo"},
    "local": {"nombre": "Local comercial Avenida de Ejemplo (obra ficticia)", "localidad": "Pueblo Demo"},
}
ALU, PVC, COMP = "Aluminio", "PVC", "Complementos"
L_REFORMA = [linea(1, PVC, "PVC abisagrada 70 mm", "Ventana 2 hojas oscilobatiente con persiana", "Oscilobatiente + practicable", 1400, 1200, 4, "Blanco", "Blanco", "4/16/4 bajo emisivo", "Compacto con lama térmica, motor Somfy", 612.00),
             linea(2, PVC, "PVC abisagrada 70 mm", "Balconera 1 hoja oscilobatiente", "Oscilobatiente", 900, 2150, 2, "Blanco", "Blanco", "3+3/14/4 bajo emisivo", "Compacto con lama térmica, cinta", 585.00),
             linea(3, COMP, "Mosquitera enrollable vertical", "Mosquitera enrollable para ventana", "Enrollable", 1400, 1200, 4, "Blanco", "Blanco", None, None, 96.00)]
L_CHALET = [linea(1, ALU, "Aluminio corredera RPT", "Corredera 2 hojas de salón a terraza", "Corredera", 3200, 2300, 1, "Gris antracita RAL 7016", "Gris antracita RAL 7016", "4+4/16/6 Guardian Sun", None, 2890.00),
            linea(2, ALU, "Aluminio abisagrada RPT", "Ventana 1 hoja oscilobatiente", "Oscilobatiente", 800, 1100, 5, "Gris antracita RAL 7016", "Gris antracita RAL 7016", "4/16/4 bajo emisivo", "Compacto con persiana de seguridad autoblocante, motor", 1120.00),
            linea(3, ALU, "Aluminio abisagrada RPT", "Fijo lateral de escalera", "Fijo", 600, 2200, 2, "Gris antracita RAL 7016", "Gris antracita RAL 7016", "4+4/16/6 Guardian Sun", None, 640.00)]
L_OFICINAS = [linea(1, ALU, "Muro cortina", "Fachada de muro cortina, módulo de 1,20 × 3,00 m", "Fijo", 1200, 3000, 18, "Negro RAL 9005", "Negro RAL 9005", "6/16/4+4 control solar", None, 1480.00),
              linea(2, ALU, "Aluminio abisagrada RPT", "Ventana proyectante de ventilación", "Proyectante", 1200, 600, 6, "Negro RAL 9005", "Negro RAL 9005", "6/16/4+4 control solar", None, 720.00)]
L_RESIDENCIAL = [linea(1, PVC, "PVC abisagrada 84 mm", "Ventana 2 hojas oscilobatiente con persiana", "Oscilobatiente + practicable", 1200, 1200, 24, "Nogal", "Blanco", "4/16/4 bajo emisivo", "Compacto RolaPlus, lama térmica, cinta", 598.00),
                 linea(2, PVC, "PVC abisagrada 84 mm", "Balconera 2 hojas con persiana", "Practicable", 1500, 2100, 12, "Nogal", "Blanco", "3+3/14/4 bajo emisivo", "Compacto RolaPlus, lama térmica, motor Nice", 1045.00),
                 linea(3, PVC, "PVC corredera", "Corredera 2 hojas de cocina", "Corredera", 1400, 1000, 12, "Nogal", "Blanco", "4/12/4", None, 410.00)]
L_LOCAL = [linea(1, ALU, "Aluminio abisagrada RPT", "Puerta de entrada 1 hoja con fijo superior", "Practicable", 1000, 2600, 1, "Plata anodizado", "Plata anodizado", "5+5/12/4+4 seguridad", None, 1980.00),
           linea(2, COMP, "Cierre enrollable de alta seguridad", "Cierre enrollable de aluminio para escaparate", "Enrollable motorizado", 3600, 2800, 1, "Plata anodizado", "Plata anodizado", None, "Lama extrusionada autoblocante, motor Gaviota", 2650.00)]
L_PERSIANAS = [linea(1, COMP, "Motorización Somfy io", "Motorización de persianas existentes con mando", "Motor + mando 5 canales", None, None, 6, None, None, None, "Motor Somfy io con receptor de radio", 215.00),
               linea(2, COMP, "Mosquitera enrollable lateral doble", "Mosquitera para puerta de terraza de 2 hojas", "Enrollable lateral", 1800, 2200, 1, "Blanco", "Blanco", None, None, 240.00)]


def presupuesto(id_, fecha, valido, estado, obra, ref, lineas, dto, plazo, obs="", pedido=None):
    return {"id": id_, "fecha": fecha, "validoHasta": valido, "estado": estado, "obra": OBRAS[obra], "referenciaCliente": ref,
            "lineas": lineas, "unidades": sum(l["unidades"] for l in lineas), "importes": totales(lineas, dto),
            "plazoEstimadoDias": plazo, "observaciones": obs, "pedidoId": pedido,
            "pdf": "/area-clientes/docs-demo/presupuesto-demo.pdf"}


PRESUPUESTOS = [
    presupuesto("PR-2026-0412", "2026-09-29", "2026-10-29", "pendiente", "residencial", "ENCINAS-B", L_RESIDENCIAL, 12, 35, "Precios con vidrio, persiana y motor incluidos. Instalación en obra incluida; medición definitiva antes de fabricar."),
    presupuesto("PR-2026-0405", "2026-09-22", "2026-10-22", "pendiente", "local", "LOCAL-AVDA", L_LOCAL, 5, 30, "Cierre enrollable con motor y mando; pendiente de confirmar el color del cajón."),
    presupuesto("PR-2026-0398", "2026-09-15", "2026-10-15", "en_revision", "reforma", "REF-INV-12-PERS", L_PERSIANAS, 0, 10, "Pendiente de confirmar el número de persianas a motorizar."),
    presupuesto("PR-2026-0381", "2026-08-25", "2026-09-24", "aceptado", "chalet", "CERROS-SALON", L_CHALET, 8, 30, pedido="PE-2026-0587"),
    presupuesto("PR-2026-0362", "2026-07-30", "2026-08-29", "aceptado", "oficinas", "NAVE-FACHADA", L_OFICINAS, 10, 45, pedido="PE-2026-0561"),
    presupuesto("PR-2026-0340", "2026-06-24", "2026-07-24", "aceptado", "reforma", "REF-INV-12", L_REFORMA, 8, 20, pedido="PE-2026-0534"),
    presupuesto("PR-2026-0319", "2026-06-02", "2026-07-02", "caducado", "reforma", "REF-INV-12-B", L_REFORMA, 5, 20),
    presupuesto("PR-2026-0287", "2026-04-21", "2026-05-21", "aceptado", "chalet", "CERROS-PLANTA-1", L_CHALET[1:], 8, 25, pedido="PE-2026-0498"),
]
PR = {p["id"]: p for p in PRESUPUESTOS}

FASES = ["aceptado", "medicion", "en_fabricacion", "instalacion_programada", "instalado"]


def pedido(id_, pr, fecha, estado, fechas, prevista, instalacion, albaranes=(), facturas=()):
    p = PR[pr]
    return {"id": id_, "presupuestoId": pr, "fechaPedido": fecha, "estado": estado, "obra": p["obra"], "referenciaCliente": p["referenciaCliente"],
            "fases": [{"clave": f, "fecha": fechas[i] if i < len(fechas) else None} for i, f in enumerate(FASES)],
            "fechaPrevistaInstalacion": prevista, "instalacion": instalacion, "unidades": p["unidades"], "importes": p["importes"],
            "lineas": p["lineas"], "albaranIds": list(albaranes), "facturaIds": list(facturas)}


INST_CHALET = {"tipo": "Instalación en obra por nuestro equipo", "direccion": "Camino de los Cerros, s/n · Aldea Simulada", "contacto": "Propietario Demo · 600 000 001"}
INST_OFICINAS = {"tipo": "Instalación en obra por nuestro equipo", "direccion": "Pol. Ind. Ficticio, nave 7 · Polígono Ficticio", "contacto": "Jefe de obra Demo · 600 000 002"}
INST_REFORMA = {"tipo": "Instalación en vivienda habitada (retirada de la carpintería antigua incluida)", "direccion": "C/ Inventada, 12 · Villaejemplo", "contacto": "Inquilino Demo · 600 000 003"}
PEDIDOS = [
    pedido("PE-2026-0587", "PR-2026-0381", "2026-09-01", "en_fabricacion", ["2026-09-01", "2026-09-08", "2026-09-22"], "2026-10-20", INST_CHALET),
    pedido("PE-2026-0561", "PR-2026-0362", "2026-08-04", "instalacion_programada", ["2026-08-04", "2026-08-11", "2026-08-25", "2026-10-13"], "2026-10-13", INST_OFICINAS),
    pedido("PE-2026-0534", "PR-2026-0340", "2026-06-30", "instalado", ["2026-06-30", "2026-07-03", "2026-07-08", "2026-07-22", "2026-07-23"], "2026-07-22", INST_REFORMA, ["AL-2026-0611"], ["FV-2026-0598"]),
    pedido("PE-2026-0498", "PR-2026-0287", "2026-04-28", "instalado", ["2026-04-28", "2026-05-05", "2026-05-12", "2026-06-02", "2026-06-02"], "2026-06-02", INST_CHALET, ["AL-2026-0540"], ["FV-2026-0512"]),
]
PE = {p["id"]: p for p in PEDIDOS}


def factura(id_, fecha, pedido_id, venc, estado):
    i = PE[pedido_id]["importes"]
    return {"id": id_, "fecha": fecha, "pedidoId": pedido_id, "obra": PE[pedido_id]["obra"], "baseImponible": i["baseImponible"], "iva": i["iva"], "total": i["total"],
            "vencimiento": venc, "formaPago": "Transferencia 30 días", "estado": estado, "pdf": "/area-clientes/docs-demo/factura-demo.pdf"}


FACTURAS = [factura("FV-2026-0598", "2026-07-23", "PE-2026-0534", "2026-08-22", "pagada"),
            factura("FV-2026-0512", "2026-06-02", "PE-2026-0498", "2026-07-02", "pagada")]
# Anticipo del pedido en fabricación: factura pendiente de pago
i587 = PE["PE-2026-0587"]["importes"]
FACTURAS.insert(0, {"id": "FV-2026-0661", "fecha": "2026-09-22", "pedidoId": "PE-2026-0587", "obra": PE["PE-2026-0587"]["obra"], "concepto": "Anticipo 40 % a inicio de fabricación",
                    "baseImponible": round(i587["baseImponible"] * .4, 2), "iva": round(i587["iva"] * .4, 2), "total": round(i587["total"] * .4, 2),
                    "vencimiento": "2026-10-22", "formaPago": "Transferencia 30 días", "estado": "pendiente", "pdf": "/area-clientes/docs-demo/factura-demo.pdf"})
PE["PE-2026-0587"]["facturaIds"].append("FV-2026-0661")

ALBARANES = [
    {"id": "AL-2026-0611", "fecha": "2026-07-23", "pedidoId": "PE-2026-0534", "obra": PE["PE-2026-0534"]["obra"], "tipo": "Acta de instalación", "bultos": 4, "unidades": 10, "estado": "instalado", "recibidoPor": "Inquilino Demo", "pdf": "/area-clientes/docs-demo/albaran-demo.pdf"},
    {"id": "AL-2026-0540", "fecha": "2026-06-02", "pedidoId": "PE-2026-0498", "obra": PE["PE-2026-0498"]["obra"], "tipo": "Acta de instalación", "bultos": 3, "unidades": 7, "estado": "instalado", "recibidoPor": "Propietario Demo", "pdf": "/area-clientes/docs-demo/albaran-demo.pdf"},
]

INCIDENCIAS = [
    {"id": "IN-2026-0044", "fechaApertura": "2026-07-28", "pedidoId": "PE-2026-0534", "tipo": "Persiana o motor", "asunto": "La persiana motorizada del dormitorio no sube del todo",
     "descripcion": "La persiana de la ventana del dormitorio principal (posición 1, tercera unidad) se detiene unos 10 cm antes de llegar arriba. El motor suena pero no completa el recorrido.", "estado": "en_curso", "fotos": 2,
     "historial": [{"fecha": "2026-07-28", "autor": "Usuario Demo", "texto": "Incidencia abierta desde el portal con 2 fotos."},
                   {"fecha": "2026-07-29", "autor": "Posventa Seppala (ficticio)", "texto": "Recibido. Parece un ajuste de los finales de carrera del motor. Os llamamos para concertar visita."},
                   {"fecha": "2026-10-02", "autor": "Posventa Seppala (ficticio)", "texto": "Visita programada para la semana que viene; se ajustará el final de carrera en la propia vivienda."}]},
    {"id": "IN-2026-0031", "fechaApertura": "2026-06-05", "pedidoId": "PE-2026-0498", "tipo": "Vidrio", "asunto": "Vidrio con arañazo en el fijo de la escalera",
     "descripcion": "Al retirar el film de protección hemos visto un arañazo de unos 8 cm en la cara exterior del fijo de la escalera.", "estado": "resuelta", "fotos": 1,
     "historial": [{"fecha": "2026-06-05", "autor": "Usuario Demo", "texto": "Incidencia abierta desde el portal."},
                   {"fecha": "2026-06-06", "autor": "Posventa Seppala (ficticio)", "texto": "Pedido el vidrio de reposición al fabricante."},
                   {"fecha": "2026-06-19", "autor": "Posventa Seppala (ficticio)", "texto": "Vidrio sustituido en obra. Incidencia resuelta."}]},
]

DOCUMENTOS = [
    {"id": "DOC-001", "categoria": "ficha_tecnica", "titulo": "Ficha técnica cajón de persiana RolaPlus (Kömmerling)", "url": "/docs/ficha-tecnica-rolaplus-kommerling.pdf", "pesoMB": 1.1},
    {"id": "DOC-002", "categoria": "catalogo", "titulo": "Folleto RolaPlus (Kömmerling)", "url": "/docs/folleto-rolaplus-kommerling.pdf", "pesoMB": 1.9},
    {"id": "DOC-003", "categoria": "catalogo", "titulo": "Folleto Climalit (Saint-Gobain Glass)", "url": "/docs/folleto-climalit-saint-gobain.pdf", "pesoMB": 1.8},
    {"id": "GUIA-1", "categoria": "guia", "titulo": "¿Aluminio o PVC? Comparativa", "url": "/productos/#aluminio-o-pvc", "pesoMB": None},
    {"id": "GUIA-2", "categoria": "guia", "titulo": "Tipos de vidrio y cuándo usar cada uno", "url": "/vidrio/", "pesoMB": None},
    {"id": "GUIA-3", "categoria": "guia", "titulo": "Cajones de persiana y persianas de aluminio", "url": "/persianas/", "pesoMB": None},
    {"id": "GUIA-4", "categoria": "guia", "titulo": "Motorización y domótica", "url": "/motorizacion/", "pesoMB": None},
]

CLIENTE = {
    "id": 2087, "codigo": "C-02087", "razonSocial": "Reformas Ejemplo Alcalá, S.L. (cliente ficticio)", "nif": "B00000000", "tipo": "Empresa de reformas / profesional",
    "direccionFiscal": {"linea": "C/ de la Muestra, 4, oficina 2", "cp": "00000", "localidad": "Villaejemplo", "provincia": "Provincia Inventada"},
    "direccionesEntrega": [{"alias": "Almacén", "linea": "Pol. Ind. Ficticio, nave 3 · 00000 Pueblo Demo", "horario": "L–V 8:00–14:00"},
                           {"alias": "Obra Los Cerros", "linea": "Camino de los Cerros, s/n · Aldea Simulada", "horario": "Avisar 24 h antes de instalar"}],
    "usuarios": [{"nombre": "Usuario Demo", "email": "usuario@cliente-demo.example", "rol": "Administrador", "ultimoAcceso": HOY},
                 {"nombre": "Oficina Técnica Demo", "email": "tecnica@cliente-demo.example", "rol": "Solo consulta", "ultimoAcceso": "2026-10-03"}],
    "comercial": {"nombre": "Comercial Demo (persona ficticia)", "telefono": "91 830 05 43", "email": "administracion@aluminioseppala.com"},
    "condiciones": {"formaPago": "Transferencia 30 días", "tarifa": "Profesional", "descuentoHabitualPct": 8},
    "avisos": {"pedidoCambiaDeFase": True, "instalacionProgramada": True, "presupuestoPorCaducar": True, "facturaNueva": True, "incidenciaActualizada": True},
}


def main():
    D.mkdir(parents=True, exist_ok=True)
    for nombre, datos in [("cliente", CLIENTE), ("presupuestos", PRESUPUESTOS), ("pedidos", PEDIDOS), ("facturas", FACTURAS),
                          ("albaranes", ALBARANES), ("incidencias", INCIDENCIAS), ("documentos", DOCUMENTOS)]:
        cuerpo = {"meta": {"demo": True, "aviso": "Datos ficticios", "generado": HOY}, "datos": datos}
        (D / f"{nombre}.json").write_text(json.dumps(cuerpo, ensure_ascii=False, indent=1), encoding="utf-8")
    print("datos de la demo generados en", D)


if __name__ == "__main__":
    main()
