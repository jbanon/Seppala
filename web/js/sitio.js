/* Aluminios Seppala — comportamiento mínimo: menú móvil, consentimiento de cookies
   (solo gobierna el mapa de Google de Contacto), mapa bajo consentimiento y vídeos
   locales que se cargan al pulsar. Sin terceros, sin cookies propias (localStorage). */
(function () {
  var boton = document.querySelector('.menu-boton');
  var nav = document.getElementById('nav');
  if (boton && nav) {
    var cerrar = function () {
      nav.classList.remove('abierta');
      document.body.classList.remove('menu-abierto');
      boton.setAttribute('aria-expanded', 'false');
      boton.querySelector('.menu-boton__texto').textContent = 'Menú';
    };
    boton.addEventListener('click', function () {
      if (nav.classList.contains('abierta')) { cerrar(); return; }
      nav.classList.add('abierta');
      document.body.classList.add('menu-abierto');
      boton.setAttribute('aria-expanded', 'true');
      boton.querySelector('.menu-boton__texto').textContent = 'Cerrar';
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('abierta')) { cerrar(); boton.focus(); }
    });
    window.matchMedia('(min-width: 68em)').addEventListener('change', cerrar);
  }
})();

/* Consentimiento: aceptar y rechazar tienen el mismo peso; la decisión se guarda en
   localStorage (no es una cookie) y se puede cambiar desde el pie. */
var cookiesSeppala = (function () {
  var CLAVE = 'seppala-cookies-terceros';
  var banner = document.getElementById('cookies');
  function estado() { try { return localStorage.getItem(CLAVE); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem(CLAVE, v); } catch (e) {} }
  var oyentes = [];
  function avisar() { oyentes.forEach(function (f) { f(estado()); }); }
  function mostrar() { if (banner) { banner.hidden = false; banner.querySelector('[data-acepta]').focus(); } }
  function ocultar() { if (banner) banner.hidden = true; }
  function aceptar() { guardar('si'); ocultar(); avisar(); }
  function rechazar() { guardar('no'); ocultar(); avisar(); }
  if (banner) {
    banner.querySelector('[data-acepta]').addEventListener('click', aceptar);
    banner.querySelector('[data-rechaza]').addEventListener('click', rechazar);
    Array.prototype.forEach.call(document.querySelectorAll('.cookies__abrir'), function (b) { b.addEventListener('click', mostrar); });
    if (estado() !== 'si' && estado() !== 'no') banner.hidden = false;
  }
  return { estado: estado, aceptar: aceptar, alCambiar: function (f) { oyentes.push(f); } };
})();

/* Mapa de Google (Contacto): el iframe solo se crea con consentimiento */
(function () {
  var mapa = document.querySelector('.mapa[data-mapa]');
  if (!mapa) return;
  var src = mapa.getAttribute('data-mapa');
  var original = mapa.innerHTML;
  function pintar(estado) {
    if (estado === 'si') {
      if (mapa.querySelector('iframe')) return;
      var i = document.createElement('iframe');
      i.src = src; i.title = 'Mapa de Google con la ubicación de Aluminios Seppala'; i.loading = 'lazy'; i.referrerPolicy = 'no-referrer-when-downgrade'; i.allowFullscreen = true;
      mapa.innerHTML = ''; mapa.appendChild(i);
    } else if (mapa.querySelector('iframe')) {
      mapa.innerHTML = original; enganchar();
    }
  }
  function enganchar() {
    var b = mapa.querySelector('[data-ver-mapa]');
    if (b) b.addEventListener('click', function () { cookiesSeppala.aceptar(); });
  }
  enganchar();
  cookiesSeppala.alCambiar(pintar);
  pintar(cookiesSeppala.estado());
})();

/* Vídeo local: el fichero MP4 solo se descarga al pulsar el póster */
(function () {
  Array.prototype.forEach.call(document.querySelectorAll('.video__marco[data-video]'), function (marco) {
    var boton = marco.querySelector('.video__boton');
    if (!boton) return;
    boton.addEventListener('click', function () {
      var v = document.createElement('video');
      v.src = marco.getAttribute('data-video'); v.controls = true; v.autoplay = true; v.playsInline = true; v.preload = 'auto';
      v.setAttribute('aria-label', boton.getAttribute('aria-label') || 'Vídeo');
      marco.innerHTML = ''; marco.appendChild(v); v.focus();
      v.play().catch(function () {});
    });
  });
})();
