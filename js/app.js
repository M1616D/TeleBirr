/* Application boot: screens, tab bar, splash, history and service worker. */

import { initUI, nav, action, screen, ico, esc, toast, hooks, overlayOpen, closeOverlay, bindActions, phoneEl } from './ui.js';
import { store } from './store.js';
import { busy } from './screens/common.js';
import { initCommon } from './screens/common.js';

/* screens (import for side effects) */
import './screens/auth.js';
import './screens/home.js';
import './screens/receipt.js';
import './screens/send.js';
import './screens/airtime.js';
import './screens/bank.js';
import './screens/merchant.js';
import './screens/financial.js';
import './screens/payment.js';
import './screens/apps.js';
import './screens/account.js';
import './screens/secret.js';

const TABS = [
  ['home', 'Home', 'home'],
  ['payment', 'Payment', 'card'],
  ['apps', 'Apps', 'grid'],
  ['engage', 'Engage', 'chat'],
  ['account', 'Account', 'userO']
];

function buildTabbar() {
  const bar = document.getElementById('tabbar');
  bar.innerHTML = TABS.map(([key, label, icon]) =>
    `<button type="button" data-tab="${key}" data-act="tab.go" data-to="${key}" aria-label="${esc(label)}">
      ${ico(icon)}
      <span>${esc(label)}</span>
    </button>`).join('');
}

/* ------------------------------------------------------------------ history */
let popping = false;
hooks.afterRender = () => {
  if (popping) { popping = false; return; }
  try { history.pushState({ d: nav.depth() }, ''); } catch (e) {}
};

window.addEventListener('popstate', () => {
  if (overlayOpen()) { closeOverlay(); try { history.pushState({ d: nav.depth() }, ''); } catch (e) {} return; }
  if (nav.depth() > 1) {
    popping = true;
    nav.back();
  } else {
    // stay inside the app on the root screen
    try { history.pushState({ d: nav.depth() }, ''); } catch (e) {}
  }
});

action('tab.go', (el) => nav.tab(el.dataset.to));

/* ------------------------------------------------------------------- boot */
function boot() {
  initUI();
  initCommon();
  buildTabbar();

  const splash = document.getElementById('splash');
  const splashSpin = document.getElementById('splashSpin');

  setTimeout(() => { splashSpin.hidden = false; }, 900);
  setTimeout(() => {
    splash.classList.add('hide');
    splashSpin.hidden = true;
    // read the flags at navigation time: the page may have reloaded meanwhile
    const seen = sessionStorage.getItem('tb.session') === '1';
    sessionStorage.setItem('tb.session', '1');
    nav.reset(seen ? 'home' : (store.prefs.logged ? 'fingerprint' : 'login'), {}, { tab: true });
  }, 2100);

  // idle pre-warm of the most used screens keeps transitions instant
  setTimeout(() => { try { document.getElementById('view').style.willChange = 'transform'; } catch (e) {} }, 2600);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

/* ------------------------------------------------------------ service worker */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then((reg) => {
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            nw.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
    }).catch(() => { /* offline-first is optional */ });

    // Reload only when an *update* takes over (not on the very first install),
    // so pushing new code updates the installed app without reinstalling.
    let hadController = !!navigator.serviceWorker.controller;
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) { hadController = true; return; }
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}

/* keep the app usable if storage is unavailable */
window.addEventListener('error', (e) => {
  console.error(e.message);
});
