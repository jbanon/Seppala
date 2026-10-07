#!/usr/bin/env python3
"""Genera los datos FICTICIOS de la demo del panel de gestión interna (web/gestion/datos/*.json).

Hermano de datos_demo.py (que genera los del área de clientes). Cada fichero imita la respuesta
de un futuro endpoint del sistema de gestión de Seppala (ver web/gestion/datos/LEEME.md). Todos
los clientes, obras, personas, importes y pedidos son inventados; los proveedores serán las marcas
reales que trabaja Seppala (INVESTIGACION.md §5) con artículos descritos de forma genérica.
Uso: .venv/bin/python herramientas/datos_gestion.py
"""
import json
from pathlib import Path

D = Path(__file__).resolve().parent.parent / "web/gestion/datos"
HOY = "2026-10-07"

# Quién ha entrado en la demo (persona ficticia) y datos de la empresa que usa el marco del panel
USUARIO = {
    "nombre": "Usuario Demo", "rol": "Administración", "email": "usuario@seppala-demo.example", "ultimoAcceso": HOY,
    "empresa": {"nombre": "Aluminios Seppala, S.A.", "telefono": "91 830 05 43", "email": "administracion@aluminioseppala.com"},
}


def main():
    D.mkdir(parents=True, exist_ok=True)
    for nombre, datos in [("usuario", USUARIO)]:
        cuerpo = {"meta": {"demo": True, "aviso": "Datos ficticios", "generado": HOY}, "datos": datos}
        (D / f"{nombre}.json").write_text(json.dumps(cuerpo, ensure_ascii=False, indent=1), encoding="utf-8")
    print("datos de la demo de gestión generados en", D)


if __name__ == "__main__":
    main()
