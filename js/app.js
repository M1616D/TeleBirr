/* js/app.js - classic script (no module loader / works offline from file://). */
(function () {
  'use strict';
  var TB = window.TB || (window.TB = {});
  var NS = TB.boot || (TB.boot = {});
  var { initUI, nav, action, esc, ico, hooks, overlayOpen, closeOverlay } = TB.ui;
  var { store } = TB.store;
  var { initCommon } = TB.common;

  /* ------------------------------------------------------------ fatal screen */
  // Anything that goes wrong is surfaced to the user instead of a frozen splash.
  function showFatal(err) {
    try { console.error('[telebirr]', err); } catch (e) {}
    var box = document.getElementById('fatal');
    if (!box) return;
    var msg = err && err.message ? err.message : String(err || 'Unknown error');
    box.querySelector('.fatal-msg').textContent = msg;
    box.hidden = false;
  }
  window.TB.showFatal = showFatal;

  function hideSplash() {
    var splash = document.getElementById('splash');
    var spin = document.getElementById('splashSpin');
    if (spin) spin.hidden = true;
    if (splash) {
      splash.classList.add('hide');
      splash.hidden = true;
    }
    document.documentElement.classList.add('booted');
  }
  window.TB.hideSplash = hideSplash;

  window.addEventListener('error', function (e) {
    if (e && e.target && e.target.tagName === 'IMG') return; // broken optional image
    showFatal(e && (e.error || e.message));
  });
  window.addEventListener('unhandledrejection', function (e) {
    showFatal(e && e.reason);
  });

  /* ---------------------------------------------------------------- tab bar */
  var TABS = [
    ['home', 'Home', 'home'],
    ['payment', 'Payment', 'card'],
    ['apps', 'Apps', 'grid'],
    ['engage', 'Engage', 'chat'],
    ['account', 'Account', 'userO']
  ];

  function buildTabbar() {
    var bar = document.getElementById('tabbar');
    bar.innerHTML = TABS.map(function (t) {
      var key = t[0], label = t[1], icon = t[2];
      return '<button type="button" data-tab="' + key + '" data-act="tab.go" data-to="' + key +
        '" aria-label="' + esc(label) + '">' + ico(icon) + '<span>' + esc(label) + '</span></button>';
    }).join('');
  }

  /* ---------------------------------------------------------------- history */
  var popping = false;
  hooks.afterRender = function () {
    if (popping) { popping = false; return; }
    try { history.pushState({ d: nav.depth() }, ''); } catch (e) {}
  };

  window.addEventListener('popstate', function () {
    if (overlayOpen()) {
      closeOverlay();
      try { history.pushState({ d: nav.depth() }, ''); } catch (e) {}
      return;
    }
    if (nav.depth() > 1) {
      popping = true;
      nav.back();
    } else {
      try { history.pushState({ d: nav.depth() }, ''); } catch (e) {}
    }
  });

  action('tab.go', function (el) { nav.tab(el.dataset.to); });

  function origin() {
    try {
      var seen = sessionStorage.getItem('tb.session') === '1';
      sessionStorage.setItem('tb.session', '1');
      if (seen) return 'home';
      return store.prefs.logged ? 'fingerprint' : 'login';
    } catch (e) {
      return store.prefs.logged ? 'fingerprint' : 'login';
    }
  }

  /* ------------------------------------------------------------------- boot */
  function boot() {
    // 1. splash spinner + dismissal are scheduled FIRST, and the watchdog below
    //    guarantees the splash can never be left on screen.
    setTimeout(function () {
      var spin = document.getElementById('splashSpin');
      if (spin) spin.hidden = false;
    }, 900);

    setTimeout(function () {
      try {
        var target = origin();
        if (nav.current() !== target) nav.reset(target, {}, { tab: true });
      } catch (err) {
        showFatal(err);
      }
      hideSplash();
    }, 2100);

    // last-resort watchdog
    setTimeout(hideSplash, 5500);

    // 2. initialise the shell
    try {
      initUI();
      initCommon();
      buildTabbar();
    } catch (err) {
      showFatal(err);
      hideSplash();
    }

    setTimeout(function () {
      try { document.getElementById('view').style.willChange = 'transform'; } catch (e) {}
    }, 2600);
  }

  function start() {
    try { boot(); }
    catch (err) { showFatal(err); hideSplash(); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  /* -------------------------------------------------------- service worker */
  // Only over http(s): file:// and some embedded viewers have no SW support.
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').then(function (reg) {
        reg.addEventListener('updatefound', function () {
          var nw = reg.installing;
          if (!nw) return;
          nw.addEventListener('statechange', function () {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) {
              nw.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
        try { reg.update(); } catch (e) {}          // check for new code on every launch
      }).catch(function () { /* offline-first is optional */ });

      // Reload only when an *update* takes over (not on the very first install),
      // so pushing new code updates the installed app without reinstalling.
      var hadController = !!navigator.serviceWorker.controller;
      var refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (!hadController) { hadController = true; return; }
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    });
  }
})();
