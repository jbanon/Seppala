#!/usr/bin/env bash
# Publica web/ en la ruta local de PRUEBAS del servidor (nginx). No toca el dominio real.
# El subdominio público de pruebas está PENDIENTE de confirmar con el responsable (ver CHECKLIST.md):
# hasta entonces este script solo copia ficheros a la carpeta indicada, que debe existir.
set -euo pipefail
cd "$(dirname "$0")/.."
DESTINO="${1:-/var/www/aluminioseppala-pruebas}"
if [ ! -d "$DESTINO" ]; then
  echo "No existe $DESTINO. Créala (sudo mkdir -p $DESTINO && sudo chown $USER $DESTINO) y configura el bloque"
  echo "server de nginx con despliegue/aluminioseppala-pruebas.nginx.conf antes de publicar."; exit 1
fi
.venv/bin/python herramientas/comunes.py >/dev/null
rsync -a --delete --chmod=D755,F644 --exclude '.htaccess' web/ "$DESTINO/"
echo "Publicado en $DESTINO ($(find "$DESTINO" -type f | wc -l) ficheros)"
