# Despliegue en seppala.winsoft.es

Subdominio de pruebas/revisión en el mismo servidor compartido que otras webs (`clientesmarchante.winsoft.es`,
`gd.winsoft.es`, etc.). El DNS ya apunta aquí. No es el dominio final: la web real sigue siendo
`www.aluminioseppala.com` (WordPress) hasta que se decida la migración.

## Alta del sitio (una sola vez, necesita sudo con contraseña)

```bash
sudo mkdir -p /var/www/seppala && sudo chown "$USER":"$USER" /var/www/seppala
sudo cp despliegue/seppala.winsoft.es.nginx.conf /etc/nginx/sites-available/seppala.winsoft.es
sudo ln -s /etc/nginx/sites-available/seppala.winsoft.es /etc/nginx/sites-enabled/seppala.winsoft.es
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d seppala.winsoft.es
```

`certbot` añade HTTPS y el redirect 80→443 automáticamente (igual que en `clientesmarchante.conf` o
`gd.winsoft.es`). Como ya hay cuenta de Let's Encrypt en este servidor, no debería volver a pedir el email;
si lo pide, cualquier dirección del responsable sirve.

Después de esto, `/etc/nginx/sites-available/seppala.winsoft.es` ya no coincidirá exactamente con
`despliegue/seppala.winsoft.es.nginx.conf` (certbot le añade los bloques SSL). Eso es normal: no
sobrescribir el de `/etc/nginx` con el del repo sin fijarse, o se perdería el HTTPS. Si cambia algo de las
reglas de este fichero (redirecciones, caché), aplicar el cambio a mano en ambos sitios.

## Publicar cambios (cada vez, sin sudo una vez dado de alta)

```bash
herramientas/publicar.sh
```

Hace `rsync` de `web/` a `/var/www/seppala/` (tras pasar `comunes.py` para sincronizar cabecera/pie).

## Verificación

```bash
curl -I http://seppala.winsoft.es/      # antes de certbot: 200
curl -Ik https://seppala.winsoft.es/    # después de certbot: 200
```
