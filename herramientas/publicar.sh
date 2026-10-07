#!/usr/bin/env bash
# Publica web/ en seppala.winsoft.es (subdominio de pruebas/revisión, servidor compartido). No toca el
# dominio real (www.aluminioseppala.com, sigue siendo WordPress hasta que se decida la migración).
set -euo pipefail
cd "$(dirname "$0")/.."
DESTINO="${1:-/var/www/seppala}"
if [ ! -d "$DESTINO" ]; then
  echo "No existe $DESTINO. Créala (sudo mkdir -p $DESTINO && sudo chown $USER $DESTINO) y configura el bloque"
  echo "server de nginx con despliegue/seppala.winsoft.es.nginx.conf antes de publicar (ver despliegue/LEEME-despliegue.md)."; exit 1
fi
.venv/bin/python herramientas/comunes.py >/dev/null
rsync -a --delete --chmod=D755,F644 --exclude '.htaccess' web/ "$DESTINO/"
echo "Publicado en $DESTINO ($(find "$DESTINO" -type f | wc -l) ficheros)"
