# Redirecciones de la web antigua a la nueva

Las URL que se mantienen no necesitan redirección: `/`, `/productos/`, `/aluminios/`, `/pvc/`, `/vidrio/`,
`/persianas/`, `/mosquiteras/`, `/asesoramiento/`, `/trabajos-realizados/`, `/contacto/`.

| URL antigua | URL nueva | Motivo |
|---|---|---|
| `/automatismo/` | `/motorizacion/` | Nombre que entiende cualquiera |
| `/componentes/` | `/complementos/` | Índice de vidrio, persianas, motorización y mosquiteras |
| `/aviso-legal-politica-privacidad/` | `/privacidad/` | La página antigua solo contenía la política de privacidad; el aviso legal nuevo está en `/aviso-legal/` |
| `/politica-de-cookies/` | `/cookies/` | |
| `/mas-informacion-sobre-las-cookies/` | `/cookies/#navegadores` | Fusionada en la política de cookies |
| `/noticias/`, `/hola-mundo/`, `/category/…`, `/author/…`, `/2019/…` | `/` | Sección de noticias suprimida (solo tenía la entrada de ejemplo de WordPress) |
| `/wp-admin`, `/wp-login.php`, `/wp-content/…`, `/wp-includes/…`, `/wp-json/…`, `/xmlrpc.php`, `/feed`, `/comments` | `/` | Restos de WordPress |

Implementación: `web/.htaccess` (Apache) y `despliegue/aluminioseppala-pruebas.nginx.conf` (nginx). Mantener los
dos a la par. No había PDF en la web antigua, así que no hay redirecciones de documentos.
