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
   Cualquier usuario y contraseña entra. NO envía correos ni pedidos de verdad:
   «Confirmar y enviar» solo registra el envío en sessionStorage.
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
  // Añade a cada documento los envíos registrados en esta sesión de demo y deriva el estado
  function conEnvios(tipo) {
    var c = (cambios().envios || {})[tipo] || {};
    return function (x) {
      var envios = (x.envios || []).concat(c[x.id] || []);
      return Object.assign({}, x, { envios: envios, estado: (x.estado === 'redactado' && envios.length) ? 'enviado' : x.estado, ultimoEnvio: envios.length ? envios[envios.length - 1] : null });
    };
  }
  var api = {
    usuario: function () { return pedir('usuario'); },                                                  // quién ha entrado y datos de la empresa
    presupuestos: function () { return pedir('presupuestos').then(function (l) { return l.map(conEnvios('presupuestos')); }); }, // futuro: GET /presupuestos (todos los clientes)
    facturas: function () { return pedir('facturas').then(function (l) { return l.map(conEnvios('facturas')); }); },             // futuro: GET /facturas
    enviar: function (tipo, ids, d) {        // futuro: POST /{tipo}/enviar {ids, destinatario, asunto, texto}; el servidor adjunta los PDF y manda el correo
      var c = cambios(); c.envios = c.envios || {}; c.envios[tipo] = c.envios[tipo] || {};
      ids.forEach(function (id) { (c.envios[tipo][id] = c.envios[tipo][id] || []).push({ fecha: hoy(), destinatario: d.destinatario, asunto: d.asunto, enDemo: true }); });
      guardarCambios(c); return Promise.resolve(true);
    },
    proveedores: function () { return pedir('proveedores'); },
    pedidosProveedores: function () { return pedir('pedidos-proveedores').then(function (l) { return l.map(conRecepciones); }); },   // futuro: GET /pedidos-proveedores
    pedidoProveedor: function (id) { return api.pedidosProveedores().then(function (l) { return l.filter(function (p) { return p.id === id; })[0]; }); },
    recibir: function (id, cantidades) {    // futuro: POST /pedidos-proveedores/{id}/recepcion {codigo: cantidad}
      var c = cambios(); c.recepciones = c.recepciones || {};
      (c.recepciones[id] = c.recepciones[id] || []).push({ fecha: hoy(), cantidades: cantidades, enDemo: true });
      guardarCambios(c); return Promise.resolve(true);
    }
  };
  // Suma a cada pedido las recepciones registradas en esta sesión y recalcula líneas, totales y estado
  function conRecepciones(p) {
    var rec = (cambios().recepciones || {})[p.id] || [];
    var lineas = p.lineas.map(function (l) {
      var extra = rec.reduce(function (s, r) { return s + (Number(r.cantidades[l.codigo]) || 0); }, 0);
      var recibidas = Math.min(l.pedidas, l.recibidas + extra);
      return Object.assign({}, l, { recibidas: recibidas, restantes: l.pedidas - recibidas });
    });
    var pedidas = lineas.reduce(function (s, l) { return s + l.pedidas; }, 0), recibidas = lineas.reduce(function (s, l) { return s + l.recibidas; }, 0);
    var historial = p.historial.concat(rec.map(function (r) {
      var uds = Object.keys(r.cantidades).reduce(function (s, k) { return s + (Number(r.cantidades[k]) || 0); }, 0);
      return { fecha: r.fecha, texto: 'Recepción registrada desde el panel: ' + unidades(uds) + '.', enDemo: true };
    }));
    var estado = p.estado === 'cancelado' ? 'cancelado' : recibidas === 0 ? 'pendiente' : recibidas < pedidas ? 'parcial' : 'completado';
    var ultima = historial.length ? historial[historial.length - 1].fecha : null;
    return Object.assign({}, p, { lineas: lineas, historial: historial, estado: estado, unidadesPedidas: pedidas, unidadesRecibidas: recibidas, fechaRecepcion: estado === 'completado' ? ultima : null, recibidoEnDemo: rec.length > 0 });
  }

  /* ---------------- utilidades ---------------- */
  function hoy() { return '2026-10-07'; }          // fecha fija de la demo, coherente con los datos
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fecha(iso) { if (!iso) return '—'; var p = iso.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
  function euros(n) {                               // 12.709,45 €
    var p = Number(n).toFixed(2).split('.');
    return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + p[1] + ' €';
  }
  function eurosEnteros(n) { return Math.round(Number(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €'; }   // 49.661 €
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  function fechaLarga(iso) { var p = iso.split('-'); return parseInt(p[2], 10) + ' de ' + MESES[parseInt(p[1], 10) - 1] + ' de ' + p[0]; }
  function dias(a, b) { return Math.round((new Date(b) - new Date(a)) / 864e5); }
  function param(n) { return new URLSearchParams(location.search).get(n); }
  function suma(l, f) { return l.reduce(function (s, x) { return s + f(x); }, 0); }
  function unicos(l) { return l.filter(function (x, i) { return l.indexOf(x) === i; }); }
  function unidades(n) { return n + (n === 1 ? ' unidad' : ' unidades'); }
  function normalizar(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  var ESTADOS = {
    redactado: ['Sin enviar', 'aviso'], enviado: ['Enviado', 'curso'], revision: ['En revisión', 'curso'], aceptado: ['Aceptado', 'ok'], rechazado: ['Rechazado', 'neutro'], caducado: ['Caducado', 'neutro'],
    pendiente: ['Pendiente de cobro', 'aviso'], pagada: ['Pagada', 'ok'], vencida: ['Vencida', 'alerta']
  };
  var ESTADOS_PEDIDO = { pendiente: ['Pendiente', 'aviso'], parcial: ['Parcial', 'curso'], completado: ['Completado', 'ok'], cancelado: ['Cancelado', 'neutro'] };
  var FAMILIAS = { perfil: 'Perfil', persiana: 'Persianas', vidrio: 'Vidrio', motorizacion: 'Motorización' };
  function pastilla(estado, contexto) { var e = (contexto === 'pedido' ? ESTADOS_PEDIDO : ESTADOS)[estado] || [estado, 'neutro']; return '<span class="pastilla pastilla--' + e[1] + '">' + esc(e[0]) + '</span>'; }

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

  /* ---------------- componentes de listado ---------------- */
  function filtros(opciones, alCambiar) {
    var html = '<div class="p-filtros" role="group" aria-label="Filtrar por estado">' + opciones.map(function (o, i) { return '<button type="button" data-f="' + o[0] + '" aria-pressed="' + (i === 0) + '">' + o[1] + '</button>'; }).join('') + '</div>';
    return { html: html, activar: function (raiz) {
      raiz.querySelectorAll('.p-filtros button').forEach(function (b) {
        b.addEventListener('click', function () {
          raiz.querySelectorAll('.p-filtros button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
          alCambiar(b.getAttribute('data-f'));
        });
      });
    } };
  }
  function buscador(id, texto) {
    return '<label class="g-buscar"><span class="solo-lectores">' + texto + '</span><input type="search" id="' + id + '" placeholder="' + texto + '" autocomplete="off"></label>';
  }
  function coincide(x, q) { return !q || normalizar(x.id + ' ' + x.cliente.nombre + ' ' + x.obra.nombre + ' ' + (x.concepto || '')).indexOf(normalizar(q)) !== -1; }
  function avisoDemo(raiz, texto) {
    var a = raiz.querySelector('#aviso');
    a.innerHTML = '<div class="p-aviso" role="status">' + texto + ' <span>Demo: no se ha enviado ningún correo de verdad; el envío queda registrado solo en esta sesión.</span></div>';
    a.scrollIntoView({ block: 'nearest' });
  }
  function botonEnvio(tipo, x) {
    var u = x.ultimoEnvio;
    return '<div class="g-envio"><button type="button" class="p-boton' + (u ? '' : ' p-boton--primario') + '" data-enviar="' + x.id + '">' + (u ? 'Reenviar' : 'Enviar') + '<span class="solo-lectores"> ' + tipo + ' ' + x.id + '</span></button>' +
      (u ? '<small>Enviado el ' + fecha(u.fecha) + '</small>' : '') + '</div>';
  }
  function celdaCliente(x, linea2) {
    return '<td class="g-ancho" data-label="Cliente"><b>' + esc(x.cliente.nombre) + '</b><small>' + esc(linea2) + '</small><small>' + esc(x.cliente.email) + '</small></td>';
  }
  function tabla(cabeceras, filas, vacio) {
    if (!filas.length) return '<p class="p-vacio">' + vacio + '</p>';
    return '<div class="g-tabla-envoltura"><table class="g-tabla"><thead><tr>' + cabeceras.map(function (c) { return '<th' + (c[1] ? ' class="' + c[1] + '"' : '') + '>' + c[0] + '</th>'; }).join('') + '</tr></thead><tbody>' + filas.join('') + '</tbody></table></div>';
  }

  /* ---------------- diálogo de envío por correo (simulado) ---------------- */
  function dialogoEnvio(o, alConfirmar) {
    // o: { titulo, destinatario, asunto, texto, adjuntos: [nombre…], nota, boton (que abrió el diálogo, para devolverle el foco) }
    var d = document.getElementById('g-dialogo');
    if (!d) { d = document.createElement('dialog'); d.id = 'g-dialogo'; d.className = 'g-dialogo'; d.setAttribute('aria-labelledby', 'g-dialogo-titulo'); document.body.appendChild(d); }
    d.innerHTML = '<form method="dialog" class="formulario" novalidate>' +
      '<div class="g-dialogo__cab"><h2 id="g-dialogo-titulo">' + o.titulo + '</h2><button type="button" class="g-dialogo__cerrar" aria-label="Cerrar sin enviar" data-cerrar>×</button></div>' +
      '<div class="campo"><label for="e-para">Destinatario</label><input id="e-para" name="para" type="email" value="' + esc(o.destinatario) + '" required></div>' +
      '<div class="campo"><label for="e-asunto">Asunto</label><input id="e-asunto" name="asunto" type="text" value="' + esc(o.asunto) + '" required maxlength="140"></div>' +
      '<div class="campo"><label for="e-texto">Texto del correo <span class="opcional">(puedes editarlo)</span></label><textarea id="e-texto" name="texto" rows="9">' + esc(o.texto) + '</textarea></div>' +
      '<div class="g-adjuntos"><span>Se adjunta:</span>' + o.adjuntos.map(function (a) { return '<span class="g-adjunto">' + esc(a) + '</span>'; }).join('') + '</div>' +
      '<p class="formulario__nota">' + o.nota + ' Demo: no se envía ningún correo; «Confirmar» solo registra el envío en esta sesión.</p>' +
      '<div class="p-acciones"><button class="p-boton p-boton--primario" type="submit">Confirmar y enviar</button><button class="p-boton" type="button" data-cerrar>Cancelar</button></div></form>';
    d.querySelectorAll('[data-cerrar]').forEach(function (b) { b.addEventListener('click', function () { d.close(); }); });
    d.querySelector('form').addEventListener('submit', function (e) {
      var f = e.target;
      if (!f.checkValidity()) { e.preventDefault(); f.reportValidity(); return; }
      alConfirmar({ destinatario: f.para.value.trim(), asunto: f.asunto.value.trim(), texto: f.texto.value.trim() });
    });
    if (o.boton) d.addEventListener('close', function () { o.boton.focus(); }, { once: true });
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    return d;
  }
  function firma(u) { return '\n\nUn saludo,\n' + u.nombre + ' · ' + u.empresa.nombre + '\n' + u.empresa.telefono + ' · ' + u.empresa.email; }
  function plantillaPresupuesto(p, u) {
    return 'Estimado/a ' + p.cliente.contacto + ':\n\nLe adjuntamos el presupuesto ' + p.id + ' para «' + p.obra.nombre + '», por ' + euros(p.importes.total) + ' (IVA incluido), válido hasta el ' + fecha(p.validoHasta) + '.\n\n' +
      'Quedamos a su disposición para cualquier aclaración o ajuste de medidas, colores o vidrios.' + firma(u);
  }
  function plantillaFacturas(fs, u) {
    var una = fs.length === 1;
    return 'Estimado/a ' + fs[0].cliente.contacto + ':\n\nLe adjuntamos ' + (una ? 'la factura ' + fs[0].id + ' (' + fs[0].concepto + ')' : 'las facturas ' + fs.map(function (f) { return f.id; }).join(', ')) +
      ' correspondiente' + (una ? '' : 's') + ' a «' + fs[0].obra.nombre + '».\n\n' +
      fs.map(function (f) { return '· ' + f.id + ': ' + euros(f.total) + ', vencimiento ' + fecha(f.vencimiento) + ' (' + f.formaPago.toLowerCase() + ').'; }).join('\n') +
      '\n\nGracias por su confianza.' + firma(u);
  }

  /* ---------------- pantallas ---------------- */
  var pantallas = {
    // Panel de mando: indicadores sencillos calculados sobre los datos de presupuestos, facturas y pedidos a proveedores
    inicio: function (u) {
      return Promise.all([api.presupuestos(), api.facturas(), api.pedidosProveedores()]).then(function (r) {
        var pres = r[0], fact = r[1], peds = r[2], PP = BASE + 'pedidos-proveedores/', mes = hoy().slice(0, 7);
        var total = function (l, campo) { return suma(l, function (x) { return campo ? x[campo] : x.importes.total; }); };
        var sinEnviar = pres.filter(function (p) { return p.estado === 'redactado'; });
        var porCaducar = pres.filter(function (p) { return (p.estado === 'enviado' || p.estado === 'revision') && dias(hoy(), p.validoHasta) <= 10; });
        var enCurso = peds.filter(function (p) { return p.estado === 'pendiente' || p.estado === 'parcial'; }).sort(function (a, b) { return a.entregaPrevista < b.entregaPrevista ? -1 : 1; });
        var parciales = enCurso.filter(function (p) { return p.estado === 'parcial'; }), retrasados = enCurso.filter(function (p) { return p.entregaPrevista < hoy(); });
        var facMes = fact.filter(function (f) { return f.fecha.slice(0, 7) === mes; }), facSinEnviar = fact.filter(function (f) { return !f.ultimoEnvio; });
        var porCobrar = fact.filter(function (f) { return f.estado !== 'pagada'; }), vencidas = fact.filter(function (f) { return f.estado === 'vencida'; });
        var n = function (k, sing, plur) { return k + ' ' + (k === 1 ? sing : plur); };

        var atencion = [];
        if (sinEnviar.length) atencion.push(['<b>' + n(sinEnviar.length, 'presupuesto', 'presupuestos') + ' sin enviar</b> al cliente<small>' + sinEnviar.map(function (p) { return p.id; }).join(', ') + ' · ' + euros(total(sinEnviar)) + '</small>', BASE + 'presupuestos/', 'Enviar']);
        if (facSinEnviar.length) atencion.push(['<b>' + n(facSinEnviar.length, 'factura', 'facturas') + ' sin enviar</b><small>' + facSinEnviar.map(function (f) { return f.id; }).join(', ') + ' · ' + euros(total(facSinEnviar, 'total')) + '</small>', BASE + 'facturas/', 'Enviar']);
        if (vencidas.length) atencion.push(['<b>' + n(vencidas.length, 'factura vencida', 'facturas vencidas') + '</b> sin cobrar<small>' + vencidas.map(function (f) { return f.id + ' · ' + esc(f.cliente.nombre); }).join(', ') + ' · ' + euros(total(vencidas, 'total')) + '</small>', BASE + 'facturas/', 'Ver']);
        porCaducar.forEach(function (p) { atencion.push(['<b>' + p.id + '</b> caduca el ' + fecha(p.validoHasta) + ' sin respuesta<small>' + esc(p.cliente.nombre) + ' · ' + euros(p.importes.total) + '</small>', BASE + 'presupuestos/', 'Ver']); });
        retrasados.forEach(function (p) { atencion.push(['<b>' + p.id + '</b> (' + esc(p.proveedor.nombre) + ') con la entrega retrasada<small>Prevista el ' + fecha(p.entregaPrevista) + '</small>', PP + 'detalle/?id=' + p.id, 'Ver']); });
        parciales.forEach(function (p) { atencion.push(['<b>' + p.id + '</b> (' + esc(p.proveedor.nombre) + ') con recepción parcial<small>' + p.unidadesRecibidas + ' de ' + p.unidadesPedidas + ' uds. recibidas · resto previsto el ' + fecha(p.entregaPrevista) + '</small>', PP + 'detalle/?id=' + p.id, 'Recibir']); });

        var movimientos = [];
        pres.forEach(function (p) { p.envios.forEach(function (e) { movimientos.push({ fecha: e.fecha, texto: 'Presupuesto <b>' + p.id + '</b> enviado a ' + esc(p.cliente.nombre), demo: e.enDemo }); }); });
        fact.forEach(function (f) { f.envios.forEach(function (e) { movimientos.push({ fecha: e.fecha, texto: 'Factura <b>' + f.id + '</b> enviada a ' + esc(f.cliente.nombre), demo: e.enDemo }); }); });
        peds.forEach(function (p) { p.historial.forEach(function (h) { movimientos.push({ fecha: h.fecha, texto: 'Pedido <b>' + p.id + '</b> (' + esc(p.proveedor.nombre) + '): ' + esc(h.texto), demo: h.enDemo }); }); });
        movimientos.sort(function (a, b) { return a.fecha > b.fecha ? -1 : a.fecha < b.fecha ? 1 : (a.demo ? -1 : 0); }); movimientos = movimientos.slice(0, 6);

        pintar(titulo('Hola, <em>' + esc(u.nombre) + '</em>', esc(u.rol) + ' · ' + esc(u.empresa.nombre) + ' · ' + fechaLarga(hoy())) +
          '<div class="p-aviso p-aviso--info" role="note"><span><strong>Panel de uso interno.</strong> Demo con datos ficticios: nada de lo que hagas aquí se envía a nadie.</span></div>' +
          '<div class="p-resumen">' +
          '<a href="' + BASE + 'presupuestos/"><span>Presupuestos sin enviar</span><strong>' + sinEnviar.length + '</strong><em>' + (sinEnviar.length ? euros(total(sinEnviar)) + ' pendientes de salir' : 'Todo enviado') + '</em></a>' +
          '<a href="' + PP + '"><span>Pedidos a proveedores en curso</span><strong>' + enCurso.length + '</strong><em>' + (parciales.length ? n(parciales.length, 'con recepción parcial', 'con recepción parcial') : enCurso.length ? 'Próxima entrega: ' + fecha(enCurso[0].entregaPrevista) : 'Ninguno en curso') + '</em></a>' +
          '<a class="g-kpi--euros" href="' + BASE + 'facturas/"><span>Facturación de ' + MESES[parseInt(mes.slice(5), 10) - 1] + '</span><strong>' + eurosEnteros(total(facMes, 'total')) + '</strong><em>' + n(facMes.length, 'factura emitida', 'facturas emitidas') + (facSinEnviar.length ? ', ' + facSinEnviar.length + ' sin enviar' : '') + '</em></a>' +
          '<a class="g-kpi--euros" href="' + BASE + 'facturas/"><span>Pendiente de cobro</span><strong>' + eurosEnteros(total(porCobrar, 'total')) + '</strong><em>' + (vencidas.length ? n(vencidas.length, 'factura vencida', 'facturas vencidas') + ' (' + eurosEnteros(total(vencidas, 'total')) + ')' : 'Ninguna vencida') + '</em></a></div>' +
          '<div class="p-rejilla p-rejilla--2" style="margin-top:1rem">' +
          '<div class="p-panel"><h2>Necesita atención</h2>' + (atencion.length ? '<ul class="g-cortas">' + atencion.map(function (a) { return '<li><span>' + a[0] + '</span><a href="' + a[1] + '">' + a[2] + '</a></li>'; }).join('') + '</ul>' : '<p class="g-ok">Todo al día.</p>') + '</div>' +
          '<div class="p-panel"><h2>Próximas entregas de material</h2>' + (enCurso.length ? '<ul class="g-cortas">' + enCurso.slice(0, 5).map(function (p) {
            var pct = p.unidadesPedidas ? Math.round(p.unidadesRecibidas * 100 / p.unidadesPedidas) : 0;
            return '<li><span><b>' + fecha(p.entregaPrevista) + '</b> · ' + esc(p.proveedor.nombre) + '<small>' + p.id + ' · ' + esc(p.destino.nombre) + '</small></span><a href="' + PP + 'detalle/?id=' + p.id + '">' + p.id + '</a>' +
              '<div class="g-progreso" role="img" aria-label="Recibidas ' + p.unidadesRecibidas + ' de ' + p.unidadesPedidas + ' unidades"><span><i style="width:' + pct + '%"></i></span><span>' + p.unidadesRecibidas + ' / ' + p.unidadesPedidas + ' uds.</span></div></li>';
          }).join('') + '</ul>' : '<p class="g-ok">No hay pedidos de material en curso.</p>') + '</div></div>' +
          '<div class="p-panel" style="margin-top:1rem"><h2>Últimos movimientos</h2><ol class="p-historial">' + movimientos.map(function (x) { return '<li><time datetime="' + x.fecha + '">' + fecha(x.fecha) + (x.demo ? ' · en esta sesión' : '') + '</time>' + x.texto + '</li>'; }).join('') + '</ol></div>' +
          '<p class="p-propuesta">en el panel real estos indicadores saldrían del sistema de gestión (presupuestos, contabilidad y compras) y podrían añadirse la carga de fabricación por semana y las instalaciones programadas.</p>');
      });
    },

    presupuestos: function (u) {
      return api.presupuestos().then(function (lista) {
        var filtro = 'todos', busca = '';
        function visibles() {
          return lista.filter(function (p) {
            var e = p.estado;
            return (filtro === 'todos' || (filtro === 'enviado' ? (e === 'enviado' || e === 'revision') : filtro === 'cerrados' ? (e === 'rechazado' || e === 'caducado') : e === filtro)) && coincide(p, busca);
          });
        }
        function fila(p) {
          return '<tr><td class="g-id">' + p.id + '</td><td class="g-fecha" data-label="Fecha">' + fecha(p.fecha) + '<small>Válido hasta ' + fecha(p.validoHasta) + '</small></td>' +
            celdaCliente(p, p.obra.nombre + ' · ' + p.resumen) +
            '<td class="g-num" data-label="Importe"><b>' + euros(p.importes.total) + '</b><small>IVA incluido</small></td><td class="g-estado">' + pastilla(p.estado) + '</td><td class="g-accion">' + botonEnvio('presupuesto', p) + '</td></tr>';
        }
        function pintaLista() {
          var l = visibles();
          m.querySelector('#lista').innerHTML = tabla([['Nº'], ['Fecha'], ['Cliente y obra'], ['Importe', 'g-num'], ['Estado'], ['Correo']], l.map(fila), 'No hay presupuestos que coincidan con el filtro.');
          m.querySelectorAll('[data-enviar]').forEach(function (b) { b.addEventListener('click', function () { abrir(b.getAttribute('data-enviar'), b); }); });
        }
        function abrir(id, boton) {
          var p = lista.filter(function (x) { return x.id === id; })[0];
          dialogoEnvio({ titulo: (p.ultimoEnvio ? 'Reenviar' : 'Enviar') + ' el presupuesto <em>' + p.id + '</em>', destinatario: p.cliente.email, asunto: 'Presupuesto ' + p.id + ' — ' + u.empresa.nombre,
            texto: plantillaPresupuesto(p, u), adjuntos: [p.id + '.pdf'], nota: 'Se adjunta el PDF del presupuesto. Si no cambias el texto, se envía esta plantilla tal cual.', boton: boton },
            function (d) {
              api.enviar('presupuestos', [p.id], d).then(api.presupuestos).then(function (nueva) {
                lista = nueva; pintaLista();
                avisoDemo(m, 'Presupuesto <strong>' + p.id + '</strong> enviado a <strong>' + esc(d.destinatario) + '</strong>.');
              });
            });
        }
        var sinEnviar = lista.filter(function (p) { return p.estado === 'redactado'; }).length;
        var f = filtros([['todos', 'Todos (' + lista.length + ')'], ['redactado', 'Sin enviar (' + sinEnviar + ')'], ['enviado', 'Enviados'], ['aceptado', 'Aceptados'], ['cerrados', 'Rechazados y caducados']], function (v) { filtro = v; pintaLista(); });
        var m = pintar(titulo('Presupuestos', 'Todos los clientes. Envía cada presupuesto por correo con su PDF; si ya se envió, puedes reenviarlo y ves la fecha del último envío.') +
          '<div id="aviso"></div><div class="g-herramientas">' + f.html + buscador('buscar', 'Buscar cliente, obra o número') + '</div><div id="lista"></div>' +
          '<p class="p-propuesta">en el panel real, cada fila abriría el detalle del presupuesto (partidas, márgenes, histórico de versiones) y el envío quedaría registrado en la ficha del cliente.</p>');
        f.activar(m);
        m.querySelector('#buscar').addEventListener('input', function (e) { busca = e.target.value; pintaLista(); });
        pintaLista();
      });
    },

    facturas: function (u) {
      return api.facturas().then(function (lista) {
        var filtro = 'todas', busca = '', sel = {};
        function visibles() {
          return lista.filter(function (f) {
            return (filtro === 'todas' || (filtro === 'sin_enviar' ? !f.ultimoEnvio : f.estado === filtro)) && coincide(f, busca);
          });
        }
        function seleccionadas() { return lista.filter(function (f) { return sel[f.id]; }); }
        function fila(f) {
          return '<tr><td class="g-sel"><label class="g-marcar"><input type="checkbox" data-sel="' + f.id + '"' + (sel[f.id] ? ' checked' : '') + '><span class="solo-lectores">Seleccionar la factura ' + f.id + '</span></label></td>' +
            '<td class="g-id">' + f.id + '</td><td class="g-fecha" data-label="Fecha · vence">' + fecha(f.fecha) + '<small>Vence ' + fecha(f.vencimiento) + '</small></td>' +
            celdaCliente(f, f.concepto + ' · ' + f.obra.nombre) +
            '<td class="g-num" data-label="Total"><b>' + euros(f.total) + '</b><small>Base ' + euros(f.baseImponible) + '</small></td><td class="g-estado">' + pastilla(f.estado) + '</td><td class="g-accion">' + botonEnvio('factura', f) + '</td></tr>';
        }
        function pintaSeleccion() {
          var fs = seleccionadas(), clientes = unicos(fs.map(function (f) { return f.cliente.codigo; })), s = m.querySelector('#seleccion');
          if (!fs.length) s.innerHTML = '<span>Marca varias facturas de un mismo cliente para enviarlas juntas en un solo correo.</span>';
          else if (clientes.length > 1) s.innerHTML = '<span><b>' + fs.length + ' facturas</b> marcadas de ' + clientes.length + ' clientes distintos: para enviarlas juntas tienen que ser del mismo cliente.</span>';
          else s.innerHTML = '<span><b>' + fs.length + (fs.length === 1 ? ' factura' : ' facturas') + '</b> de ' + esc(fs[0].cliente.nombre) + '</span><button type="button" class="p-boton p-boton--primario" id="enviar-varias">' + (fs.length === 1 ? 'Enviar la factura' : 'Enviar las ' + fs.length + ' juntas') + '</button>';
          var b = s.querySelector('#enviar-varias');
          if (b) b.addEventListener('click', function () { abrir(fs, b); });
        }
        function pintaLista() {
          var l = visibles();
          m.querySelector('#lista').innerHTML = tabla([['<span class="solo-lectores">Seleccionar</span>'], ['Nº'], ['Fecha · vence'], ['Cliente y concepto'], ['Total', 'g-num'], ['Estado'], ['Correo']], l.map(fila), 'No hay facturas que coincidan con el filtro.');
          m.querySelectorAll('[data-enviar]').forEach(function (b) { b.addEventListener('click', function () { abrir(lista.filter(function (x) { return x.id === b.getAttribute('data-enviar'); }), b); }); });
          m.querySelectorAll('[data-sel]').forEach(function (c) { c.addEventListener('change', function () { sel[c.getAttribute('data-sel')] = c.checked; pintaSeleccion(); }); });
          pintaSeleccion();
        }
        function abrir(fs, boton) {
          var una = fs.length === 1, ids = fs.map(function (f) { return f.id; });
          dialogoEnvio({ titulo: (una ? (fs[0].ultimoEnvio ? 'Reenviar' : 'Enviar') + ' la factura <em>' + fs[0].id + '</em>' : 'Enviar <em>' + fs.length + ' facturas</em> a ' + esc(fs[0].cliente.nombre)),
            destinatario: fs[0].cliente.email, asunto: (una ? 'Factura ' + fs[0].id : 'Facturas ' + ids.join(', ')) + ' — ' + u.empresa.nombre, texto: plantillaFacturas(fs, u), adjuntos: ids.map(function (i) { return i + '.pdf'; }),
            nota: una ? 'Se adjunta el PDF de la factura. Si no cambias el texto, se envía esta plantilla tal cual.' : 'Se adjuntan los ' + fs.length + ' PDF en un solo correo. Si no cambias el texto, se envía esta plantilla tal cual.', boton: boton },
            function (d) {
              api.enviar('facturas', ids, d).then(api.facturas).then(function (nueva) {
                lista = nueva; sel = {}; pintaLista();
                avisoDemo(m, (una ? 'Factura <strong>' + ids[0] + '</strong> enviada' : 'Facturas <strong>' + ids.join(', ') + '</strong> enviadas en un solo correo') + ' a <strong>' + esc(d.destinatario) + '</strong>.');
              });
            });
        }
        var pte = lista.filter(function (f) { return f.estado !== 'pagada'; }), venc = lista.filter(function (f) { return f.estado === 'vencida'; }), sinEnviar = lista.filter(function (f) { return !f.ultimoEnvio; });
        var f = filtros([['todas', 'Todas (' + lista.length + ')'], ['sin_enviar', 'Sin enviar (' + sinEnviar.length + ')'], ['pendiente', 'Pendientes de cobro'], ['vencida', 'Vencidas'], ['pagada', 'Pagadas']], function (v) { filtro = v; pintaLista(); });
        var m = pintar(titulo('Facturas', 'Todos los clientes. Envía cada factura por correo con su PDF, o varias del mismo cliente en un solo correo.') +
          '<div id="aviso"></div>' +
          '<div class="p-aviso p-aviso--info" role="note"><span><strong>' + pte.length + ' facturas pendientes de cobro</strong> por ' + euros(suma(pte, function (x) { return x.total; })) + (venc.length ? ', de las que <strong>' + venc.length + (venc.length === 1 ? ' está vencida' : ' están vencidas') + '</strong> (' + euros(suma(venc, function (x) { return x.total; })) + ')' : '') + '. ' + (sinEnviar.length ? '<strong>' + sinEnviar.length + ' sin enviar</strong> todavía al cliente.' : 'Todas enviadas.') + '</span></div>' +
          '<div class="g-herramientas">' + f.html + buscador('buscar', 'Buscar cliente, obra o número') + '</div><div class="g-seleccion" id="seleccion" aria-live="polite"></div><div id="lista"></div>' +
          '<p class="p-propuesta">en el panel real, el estado de cobro vendría de la contabilidad y cada factura enlazaría con su pedido y su acta de instalación.</p>');
        f.activar(m);
        m.querySelector('#buscar').addEventListener('input', function (e) { busca = e.target.value; pintaLista(); });
        pintaLista();
      });
    },

    'pedidos-proveedores': function () {
      return api.pedidosProveedores().then(function (todos) {
        var PP = BASE + 'pedidos-proveedores/';
        var lista = todos.filter(function (p) { return p.estado === 'pendiente' || p.estado === 'parcial'; }).sort(function (a, b) { return a.entregaPrevista < b.entregaPrevista ? -1 : 1; });
        var familia = 'todas';
        function tarjeta(p) {
          var pct = p.unidadesPedidas ? Math.round(p.unidadesRecibidas * 100 / p.unidadesPedidas) : 0;
          return '<li><a class="p-item" href="' + PP + 'detalle/?id=' + p.id + '">' +
            '<div class="p-item__cab"><span class="p-item__id">' + p.id + '</span>' + pastilla(p.estado, 'pedido') + '</div>' +
            '<div class="g-pedido__prov">' + esc(p.proveedor.nombre) + '<small>' + esc(p.proveedor.suministra) + '</small></div>' +
            '<div class="p-item__meta"><span>' + (p.destino.tipo === 'stock' ? 'Para <b>stock de taller</b>' : 'Para <b>' + esc(p.destino.nombre) + '</b>' + (p.destino.pedidoClienteId ? ' · pedido ' + p.destino.pedidoClienteId : '')) + '</span></div>' +
            '<div class="g-progreso' + (pct === 100 ? ' g-progreso--ok' : '') + '" role="img" aria-label="Recibidas ' + p.unidadesRecibidas + ' de ' + p.unidadesPedidas + ' unidades"><span><i style="width:' + pct + '%"></i></span><span>' + p.unidadesRecibidas + ' / ' + p.unidadesPedidas + ' uds. recibidas</span></div>' +
            '<div class="p-item__meta"><span>Pedido el <b>' + fecha(p.fecha) + '</b></span><span>Entrega prevista <b>' + fecha(p.entregaPrevista) + '</b>' + (p.entregaPrevista < hoy() ? ' <span class="pastilla pastilla--alerta">Retrasada</span>' : '') + '</span><span><b>' + p.articulos + '</b> artículos</span></div>' +
            '<div class="p-item__pie"><span>' + esc(FAMILIAS[p.proveedor.familia]) + '</span><span class="tarjeta__mas" style="min-height:0">Ver y recibir material</span></div></a></li>';
        }
        function pintaLista() {
          var l = lista.filter(function (p) { return familia === 'todas' || p.proveedor.familia === familia; });
          m.querySelector('#lista').innerHTML = l.map(tarjeta).join('') || '<li class="p-vacio">No hay pedidos en curso de esta familia.</li>';
        }
        var cuenta = function (f) { return lista.filter(function (p) { return p.proveedor.familia === f; }).length; };
        var f = filtros([['todas', 'Todos (' + lista.length + ')']].concat(Object.keys(FAMILIAS).map(function (k) { return [k, FAMILIAS[k] + ' (' + cuenta(k) + ')']; })), function (v) { familia = v; pintaLista(); });
        var parciales = lista.filter(function (p) { return p.estado === 'parcial'; }).length;
        var m = pintar(titulo('Pedidos a <em>proveedores</em>', 'Pedidos de material en curso, ordenados por fecha de entrega prevista. Entra en un pedido para registrar la recepción del material.', '<a class="p-boton" href="' + PP + 'historial/">Historial</a>') +
          '<div class="p-aviso p-aviso--info" role="note"><span><strong>' + lista.length + ' pedidos en curso</strong>' + (parciales ? ', ' + parciales + ' con recepción parcial' : '') + '. Los completados y cancelados están en el historial.</span></div>' +
          '<div class="g-herramientas">' + f.html + '</div><ul class="g-pedidos" id="lista"></ul>' +
          '<p class="p-propuesta">en el panel real, el pedido se generaría desde las necesidades de material de los presupuestos aceptados y se enviaría al proveedor por correo o por su portal, con el albarán del proveedor adjunto a cada recepción.</p>');
        f.activar(m); pintaLista();
      });
    },

    'pedidos-proveedores/historial': function () {
      return api.pedidosProveedores().then(function (todos) {
        var PP = BASE + 'pedidos-proveedores/';
        var lista = todos.filter(function (p) { return p.estado === 'completado' || p.estado === 'cancelado'; });
        var estado = 'todos', prov = 'todos';
        var proveedores = unicos(lista.map(function (p) { return p.proveedor.codigo; })).map(function (c) { return lista.filter(function (p) { return p.proveedor.codigo === c; })[0].proveedor; });
        function fila(p) {
          return '<tr><td class="g-id">' + p.id + '</td><td class="g-fecha" data-label="Fecha">' + fecha(p.fecha) + '</td>' +
            '<td class="g-ancho" data-label="Proveedor y destino"><b>' + esc(p.proveedor.nombre) + '</b><small>' + esc(p.destino.nombre) + (p.destino.pedidoClienteId ? ' · pedido ' + p.destino.pedidoClienteId : '') + '</small></td>' +
            '<td class="g-num" data-label="Artículos"><b>' + p.articulos + '</b><small>' + p.unidadesRecibidas + ' / ' + p.unidadesPedidas + ' uds.</small></td>' +
            '<td class="g-fecha" data-label="' + (p.estado === 'cancelado' ? 'Cancelado el' : 'Recibido el') + '">' + fecha(p.historial[p.historial.length - 1].fecha) + '</td>' +
            '<td class="g-estado">' + pastilla(p.estado, 'pedido') + '</td><td class="g-accion"><a class="p-boton" href="' + PP + 'detalle/?id=' + p.id + '">Ver<span class="solo-lectores"> el pedido ' + p.id + '</span></a></td></tr>';
        }
        function pintaLista() {
          var l = lista.filter(function (p) { return (estado === 'todos' || p.estado === estado) && (prov === 'todos' || p.proveedor.codigo === prov); });
          m.querySelector('#lista').innerHTML = tabla([['Nº'], ['Fecha'], ['Proveedor y destino'], ['Artículos', 'g-num'], ['Recibido / cancelado'], ['Estado'], ['']], l.map(fila), 'No hay pedidos con ese filtro.');
        }
        var f = filtros([['todos', 'Todos (' + lista.length + ')'], ['completado', 'Completados'], ['cancelado', 'Cancelados']], function (v) { estado = v; pintaLista(); });
        var m = pintar(titulo('Historial de <em>pedidos</em>', 'Pedidos a proveedores ya completados o cancelados.', '', [PP, 'Pedidos en curso']) +
          '<div class="g-herramientas">' + f.html + '<label class="g-select"><span class="solo-lectores">Filtrar por proveedor</span><select id="prov"><option value="todos">Todos los proveedores</option>' +
          proveedores.map(function (x) { return '<option value="' + x.codigo + '">' + esc(x.nombre) + '</option>'; }).join('') + '</select></label></div><div id="lista"></div>');
        f.activar(m);
        m.querySelector('#prov').addEventListener('change', function (e) { prov = e.target.value; pintaLista(); });
        pintaLista();
      });
    },

    'pedidos-proveedores/detalle': function () {
      var PP = BASE + 'pedidos-proveedores/';
      function pintaPedido(p, recienRecibido) {
        var abierto = p.estado === 'pendiente' || p.estado === 'parcial';
        var m = pintar(titulo('Pedido <em>' + p.id + '</em>', esc(p.proveedor.nombre) + ' · ' + esc(p.destino.nombre), pastilla(p.estado, 'pedido'), [PP, 'Pedidos a proveedores']) +
          '<div id="aviso">' + (recienRecibido ? '<div class="p-aviso" role="status">Recepción registrada: ' + unidades(recienRecibido) + '. ' + (p.estado === 'completado' ? 'El pedido queda <strong>completado</strong>.' : 'El pedido queda en <strong>recepción parcial</strong>.') + ' <span>Demo: solo se guarda en esta sesión.</span></div>' : '') + '</div>' +
          '<div class="p-rejilla p-rejilla--detalle"><div><div class="p-panel"><h2>Artículos (' + p.articulos + ') · ' + p.unidadesRecibidas + ' de ' + p.unidadesPedidas + ' unidades recibidas</h2>' +
          '<form id="f-recepcion" novalidate><div class="g-lineas">' +
          tabla([['Código'], ['Descripción'], ['Pedidas', 'g-num'], ['Recibidas', 'g-num'], ['Restantes', 'g-num']].concat(abierto ? [['Recibir ahora']] : []), p.lineas.map(function (l) {
            return '<tr><td class="g-id">' + esc(l.codigo) + '</td><td class="g-ancho">' + esc(l.descripcion) + '<small>' + esc(l.unidad) + '</small></td>' +
              '<td class="g-num" data-label="Pedidas"><b>' + l.pedidas + '</b></td><td class="g-num" data-label="Recibidas"><b>' + l.recibidas + '</b></td><td class="g-num g-restan" data-label="Restantes"><b>' + l.restantes + '</b></td>' +
              (abierto ? '<td class="g-accion" data-label="Recibir ahora"><input class="g-cant" type="number" inputmode="numeric" min="0" max="' + l.restantes + '" value="0" name="' + esc(l.codigo) + '" aria-label="Recibir ahora de ' + esc(l.codigo) + '"' + (l.restantes ? '' : ' disabled') + '></td>' : '') + '</tr>';
          }), '') + '</div>' +
          (abierto ? '<div class="p-acciones" style="margin-top:1.25rem"><button class="p-boton p-boton--primario" type="submit">Confirmar recepción</button><button class="p-boton" type="button" id="todo">Rellenar pedido completo</button></div>' +
            '<p class="formulario__nota" id="nota">Indica cuántas unidades de cada artículo han llegado y confirma. Demo: la recepción se registra solo en esta sesión; en el panel real quedaría el albarán del proveedor adjunto.</p>' :
            '<p class="formulario__nota" style="margin-top:1rem">' + (p.estado === 'cancelado' ? 'Pedido cancelado: no se espera material.' : 'Pedido completado el ' + fecha(p.fechaRecepcion) + '.') + '</p>') +
          '</form></div></div>' +
          '<aside><div class="p-panel"><h2>Datos del pedido</h2><dl class="p-datos">' +
          '<div><dt>Proveedor</dt><dd>' + esc(p.proveedor.nombre) + '</dd></div><div><dt>Suministra</dt><dd>' + esc(p.proveedor.suministra) + '</dd></div>' +
          '<div><dt>Fecha de pedido</dt><dd>' + fecha(p.fecha) + '</dd></div><div><dt>Entrega prevista</dt><dd>' + fecha(p.entregaPrevista) + '</dd></div>' +
          '<div><dt>Destino</dt><dd>' + esc(p.destino.nombre) + '</dd></div>' +
          (p.destino.pedidoClienteId ? '<div><dt>Pedido de cliente</dt><dd>' + esc(p.destino.pedidoClienteId) + '</dd></div>' : '') + (p.destino.presupuestoId ? '<div><dt>Presupuesto</dt><dd>' + esc(p.destino.presupuestoId) + '</dd></div>' : '') +
          '<div><dt>Ref. del proveedor</dt><dd>' + (p.referenciaProveedor ? esc(p.referenciaProveedor) : '—') + '</dd></div>' +
          '<div class="total"><dt>Recibido</dt><dd>' + p.unidadesRecibidas + ' / ' + p.unidadesPedidas + ' uds.</dd></div></dl></div>' +
          '<div class="p-panel"><h2>Historial</h2><ol class="p-historial">' + p.historial.map(function (h) { return '<li><time datetime="' + h.fecha + '">' + fecha(h.fecha) + '</time>' + esc(h.texto) + '</li>'; }).join('') + '</ol></div></aside></div>');
        var f = m.querySelector('#f-recepcion'), todo = m.querySelector('#todo');
        if (todo) todo.addEventListener('click', function () { f.querySelectorAll('.g-cant:not(:disabled)').forEach(function (i) { i.value = i.max; }); });
        f.addEventListener('submit', function (e) {
          e.preventDefault(); if (!abierto) return;
          var cant = {}, total = 0, mal = false;
          f.querySelectorAll('.g-cant:not(:disabled)').forEach(function (i) {
            var n = Math.floor(Number(i.value) || 0); if (n < 0 || n > Number(i.max)) mal = true;
            if (n > 0) { cant[i.name] = n; total += n; }
          });
          var nota = m.querySelector('#nota');
          if (mal) { nota.textContent = 'Revisa las cantidades: no pueden ser negativas ni superar las restantes de cada artículo.'; return; }
          if (!total) { nota.textContent = 'Indica al menos una unidad recibida (o pulsa «Rellenar pedido completo»).'; return; }
          api.recibir(p.id, cant).then(function () { return api.pedidoProveedor(p.id); }).then(function (nuevo) { pintaPedido(nuevo, total); window.scrollTo(0, 0); });
        });
      }
      return api.pedidoProveedor(param('id')).then(function (p) {
        if (!p) { pintar(titulo('No encontrado', 'No existe ese pedido en los datos de la demo.') + '<a class="p-boton" href="' + PP + '">Volver a los pedidos</a>'); return; }
        pintaPedido(p, 0);
      });
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
