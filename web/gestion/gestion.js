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
    }
    // La siguiente entrega de la demo añade aquí los pedidos a proveedores.
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
  function suma(l, f) { return l.reduce(function (s, x) { return s + f(x); }, 0); }
  function unicos(l) { return l.filter(function (x, i) { return l.indexOf(x) === i; }); }
  function normalizar(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  var ESTADOS = {
    redactado: ['Sin enviar', 'aviso'], enviado: ['Enviado', 'curso'], revision: ['En revisión', 'curso'], aceptado: ['Aceptado', 'ok'], rechazado: ['Rechazado', 'neutro'], caducado: ['Caducado', 'neutro'],
    pendiente: ['Pendiente de cobro', 'aviso'], pagada: ['Pagada', 'ok'], vencida: ['Vencida', 'alerta']
  };
  function pastilla(estado) { var e = ESTADOS[estado] || [estado, 'neutro']; return '<span class="pastilla pastilla--' + e[1] + '">' + esc(e[0]) + '</span>'; }

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
  // Secciones del panel: [clave, título, qué se ve, construida ya en la demo]
  var SECCIONES = [
    ['presupuestos', 'Presupuestos', 'Presupuestos de todos los clientes, con el envío por correo del PDF a cada uno y el registro de cuándo se envió.', true],
    ['facturas', 'Facturas', 'Facturas emitidas, vencimientos y envío por correo, una a una o varias del mismo cliente a la vez.', true],
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
