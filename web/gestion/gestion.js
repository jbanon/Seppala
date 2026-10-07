/* ==========================================================================
   Aluminios Seppala — DEMO del panel de gestión interna (uso del personal de
   Seppala; datos ficticios, sin servidor).

   Hermano de /area-clientes/portal.js, con el mismo planteamiento:
     · `api` es la única capa que sabe de dónde salen los datos. Hoy lee los JSON
       de /gestion/datos/ (generados por herramientas/datos_gestion.py) y guarda
       los cambios de la demo (envíos de correo, recepciones de pedidos…) en
       sessionStorage. El día que exista el sistema real basta con cambiar
       API_BASE y quitar la capa de sesión.
     · Las pantallas solo llaman a `api.*` y pintan.
   Es un fichero aparte, no una extensión de portal.js, porque son dos roles
   distintos (un cliente ve solo lo suyo; el personal ve a todos los clientes y a
   los proveedores) con sesión, navegación y datos propios: compartir el fichero
   obligaría a tocar el área de clientes cada vez que cambie esta demo. Las
   utilidades comunes (escape, fechas, importes) son pocas líneas y se repiten a
   propósito. El marco visual sí se reutiliza: estas páginas cargan
   /area-clientes/portal.css además de /gestion/gestion.css.
   Cualquier usuario y contraseña entra. NO envía correos ni pedidos de verdad.
   ========================================================================== */
(function () {
  'use strict';

  var BASE = '/gestion/';
  var API_BASE = BASE + 'datos/';            // futuro: '/api/v1/gestion/'
  var CLAVE_SESION = 'seppala-gestion-sesion';
  var CLAVE_CAMBIOS = 'seppala-gestion-cambios';

  /* ---------------- almacenamiento tolerante (modo privado, etc.) ---------------- */
  var memoria = {};
  function leer(k) { try { return sessionStorage.getItem(k) || localStorage.getItem(k); } catch (e) { return memoria[k] || null; } }
  function guardar(k, v) { memoria[k] = v; try { sessionStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  function borrar(k) { delete memoria[k]; try { sessionStorage.removeItem(k); localStorage.removeItem(k); } catch (e) { /* nada */ } }
  function cambios() { try { return JSON.parse(leer(CLAVE_CAMBIOS) || '{}'); } catch (e) { return {}; } }
  function guardarCambios(c) { guardar(CLAVE_CAMBIOS, JSON.stringify(c)); }

  /* ---------------- capa de datos (futura API) ---------------- */
  var cache = {};
  function pedir(recurso) {
    if (!cache[recurso]) {
      cache[recurso] = fetch(API_BASE + recurso + '.json').then(function (r) {
        if (!r.ok) throw new Error('No se pudo cargar ' + recurso);
        return r.json();
      }).then(function (j) { return j.datos; });
    }
    return cache[recurso];
  }
  var api = {
    usuario: function () { return pedir('usuario'); }   // quién ha entrado y datos de la empresa
    // Las siguientes entregas de la demo añaden aquí presupuestos, facturas y pedidos a proveedores.
  };

  /* ---------------- utilidades ---------------- */
  function hoy() { return '2026-10-07'; }          // fecha fija de la demo, coherente con los datos
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fecha(iso) { if (!iso) return '—'; var p = iso.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
  function euros(n) {                               // 12.709,45 €
    var p = Number(n).toFixed(2).split('.');
    return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + p[1] + ' €';
  }
  function param(n) { return new URLSearchParams(location.search).get(n); }

  /* ---------------- marco común: franja, cabecera, navegación, pie ---------------- */
  var ICONOS = {
    inicio: '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/>',
    presupuestos: '<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4M10 12h5M10 16h5"/>',
    facturas: '<path d="M6 21V3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5z"/><path d="M9 8h6M9 12h4"/>',
    'pedidos-proveedores': '<path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'
  };
  // [clave, texto, texto corto para la barra inferior del móvil]
  var NAV = [['inicio', 'Inicio'], ['presupuestos', 'Presupuestos'], ['facturas', 'Facturas'], ['pedidos-proveedores', 'Pedidos a proveedores', 'Proveedores']];

  function franja() { return '<div class="franja-demo" role="note">Demo de gestión interna · Datos ficticios</div>'; }
  function montarMarco(seccion, u) {
    var nav = NAV.map(function (n) {
      var texto = n[2] ? '<span class="g-nav__corto">' + n[2] + '</span><span class="g-nav__largo">' + n[1] + '</span>' : n[1];
      return '<li><a href="' + BASE + n[0] + '/"' + (n[0] === seccion ? ' aria-current="page"' : '') + '><svg viewBox="0 0 24 24" aria-hidden="true">' + ICONOS[n[0]] + '</svg><span>' + texto + '</span></a></li>';
    }).join('');
    var cab = franja() +
      '<header class="p-cabecera"><div class="contenedor p-cabecera__barra">' +
      '<a class="p-cabecera__logo" href="' + BASE + 'inicio/" aria-label="Gestión interna, inicio"><img src="/img/marca/logo-seppala.png" alt="Aluminios Seppala S.A." width="546" height="165"><span>Gestión<br>interna</span></a>' +
      '<div class="p-usuario"><span class="p-usuario__nombre">' + esc(u.nombre) + ' <span class="p-usuario__rol">· ' + esc(u.rol) + '</span></span>' +
      '<a href="/area-clientes/">Área clientes</a><button type="button" id="salir">Salir</button></div>' +
      '</div></header>' +
      '<nav class="p-nav" aria-label="Secciones del panel de gestión"><div class="contenedor"><ul>' + nav + '</ul></div></nav>';
    var pie = '<footer class="p-pie"><div class="contenedor"><span>© ' + esc(u.empresa.nombre) + ' · Demo del panel de gestión interna con datos ficticios</span>' +
      '<nav aria-label="Enlaces"><a href="/area-clientes/">Área de clientes (demo)</a><a href="/">Volver a la web</a></nav></div></footer>';
    document.body.insertAdjacentHTML('afterbegin', cab);
    document.body.insertAdjacentHTML('beforeend', pie);
    document.body.classList.add('portal--sesion');
    document.getElementById('salir').addEventListener('click', function () { borrar(CLAVE_SESION); location.href = BASE; });
  }
  function pintar(html) { var m = document.getElementById('app'); m.innerHTML = html; m.removeAttribute('aria-busy'); return m; }
  function titulo(h1, texto, extra, volver) {
    return (volver ? '<a class="p-volver" href="' + volver[0] + '">' + volver[1] + '</a>' : '') +
      '<div class="p-titulo"><div><h1>' + h1 + '</h1>' + (texto ? '<p>' + texto + '</p>' : '') + '</div>' + (extra || '') + '</div>';
  }
  function etiqueta(texto) { return '<span class="g-etiqueta">' + esc(texto) + '</span>'; }
  // Pantalla que la demo aún no tiene: estado explícito, sin contenido de relleno
  function enConstruccion(h1, texto, que) {
    pintar(titulo(h1, texto) +
      '<div class="g-construccion">' + etiqueta('En construcción') + '<p>' + que + '</p>' +
      '<a class="p-boton" href="' + BASE + 'inicio/">Volver al inicio</a></div>');
    return Promise.resolve();
  }

  /* ---------------- pantallas ---------------- */
  // Secciones del panel: [clave, título, qué se verá, construida ya en la demo]
  var SECCIONES = [
    ['presupuestos', 'Presupuestos', 'Presupuestos de todos los clientes, con el envío por correo del PDF a cada uno y el registro de cuándo se envió.', false],
    ['facturas', 'Facturas', 'Facturas emitidas, vencimientos y envío por correo, una a una o varias del mismo cliente a la vez.', false],
    ['pedidos-proveedores', 'Pedidos a proveedores', 'Pedidos de perfil, vidrio, persianas y motores: en curso, recepción de material e historial.', false]
  ];
  var pantallas = {
    inicio: function (u) {
      pintar(titulo('Hola, <em>' + esc(u.nombre) + '</em>', esc(u.rol) + ' · ' + esc(u.empresa.nombre)) +
        '<div class="p-aviso p-aviso--info" role="note"><span><strong>Panel de uso interno.</strong> Desde aquí el equipo envía presupuestos y facturas a los clientes, sigue los pedidos a los proveedores y ve el estado del trabajo. Demo: todos los clientes, importes y proveedores son ficticios y no se envía nada.</span></div>' +
        '<div class="g-accesos">' + SECCIONES.map(function (s) {
          return '<a class="g-acceso" href="' + BASE + s[0] + '/"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICONOS[s[0]] + '</svg><h2>' + s[1] + '</h2><p>' + s[2] + '</p>' +
            '<div class="g-acceso__pie">' + (s[3] ? '<span class="tarjeta__mas" style="min-height:0">Entrar</span>' : etiqueta('En construcción') + '<span class="tarjeta__mas" style="min-height:0">Ver</span>') + '</div></a>';
        }).join('') + '</div>' +
        '<div class="g-construccion">' + etiqueta('En construcción') + '<h2>Panel de mando</h2><p>Esta pantalla mostrará, de un vistazo, los presupuestos pendientes de enviar, los pedidos a proveedores por estado, la facturación del mes y las próximas recepciones de material, calculados sobre los datos de las tres secciones cuando estén construidas.</p></div>');
      return Promise.resolve();
    },
    presupuestos: function () {
      return enConstruccion('Presupuestos', 'Presupuestos de todos los clientes y envío por correo.', 'Esta pantalla llegará en la siguiente entrega de la demo: listado de presupuestos de varios clientes con la acción «Enviar» (y «Reenviar» con la fecha del último envío).');
    },
    facturas: function () {
      return enConstruccion('Facturas', 'Facturas emitidas y envío por correo.', 'Esta pantalla llegará en la siguiente entrega de la demo: listado de facturas con vencimientos y la acción «Enviar» por correo, una a una o varias del mismo cliente.');
    },
    'pedidos-proveedores': function () {
      return enConstruccion('Pedidos a <em>proveedores</em>', 'Pedidos de material en curso, recepción e historial.', 'Esta pantalla llegará en una entrega posterior de la demo: pedidos a los proveedores de perfil, vidrio, persianas y motorización, con ficha por pedido, recepción de material e historial.');
    }
  };

  /* ---------------- acceso (login simulado) ---------------- */
  function acceso() {
    document.body.insertAdjacentHTML('afterbegin', franja());
    var f = document.getElementById('f-acceso');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      guardar(CLAVE_SESION, '1');               // cualquier usuario y contraseña entra
      location.href = BASE + 'inicio/';
    });
  }

  /* ---------------- arranque ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
    var pagina = document.body.getAttribute('data-pagina');
    if (pagina === 'acceso') { acceso(); return; }
    if (!leer(CLAVE_SESION)) { location.replace(BASE); return; }
    api.usuario().then(function (u) {
      montarMarco(pagina.split('/')[0], u);
      return pantallas[pagina](u);
    }).catch(function (err) {
      pintar('<div class="p-vacio"><p>No se han podido cargar los datos de la demo.</p><p class="formulario__nota">' + esc(err.message) + '</p></div>');
    });
  });
})();
