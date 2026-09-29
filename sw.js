/* telebirr SuperApp service worker.
   Strategy: fresh code always wins when online (network-first for the shell and
   scripts), so pushing new code updates the installed app without reinstalling.
   Images are cache-first with a background refresh. */

const VERSION = 'telebirr-v1';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './js/app.js',
  './js/ui.js',
  './js/store.js',
  './js/data.js',
  './js/screens/common.js',
  './js/screens/auth.js',
  './js/screens/home.js',
  './js/screens/receipt.js',
  './js/screens/send.js',
  './js/screens/airtime.js',
  './js/screens/bank.js',
  './js/screens/merchant.js',
  './js/screens/financial.js',
  './js/screens/payment.js',
  './js/screens/apps.js',
  './js/screens/account.js',
  './js/screens/secret.js',
  './assets/icons/icon-512.png',
  './assets/brands/ethio-telecom-name.png',
  './assets/brands/telebirr-text.png',
  './assets/brands/telebirr-mark.png',
  './assets/brands/telebirr.png',
  './assets/brands/zemen-gebeya.png',
  './assets/brands/cbe-coin.png',
  './assets/brands/siinqee-text.png',
  './assets/ads/teleplay.jpg',
  './assets/ads/zemen.jpg',
  './assets/ads/dstv.jpg'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await Promise.allSettled(CORE.map(u => cache.add(new Request(u, { cache: 'reload' }))));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

function isCode(url) {
  return /\.(?:js|css|json|webmanifest|html)$/.test(url.pathname) || url.pathname.endsWith('/');
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate' || isCode(url)) {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req, { cache: 'no-store' });
        const cache = await caches.open(VERSION);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (err) {
        const cached = await caches.match(req, { ignoreSearch: true });
        if (cached) return cached;
        const shell = await caches.match('./index.html');
        if (shell) return shell;
        return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      }
    })());
    return;
  }

  e.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) {
      fetch(req).then(fresh => {
        if (fresh && fresh.ok) caches.open(VERSION).then(c => c.put(req, fresh.clone()));
      }).catch(() => {});
      return cached;
    }
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.ok) {
        const cache = await caches.open(VERSION);
        cache.put(req, fresh.clone());
      }
      return fresh;
    } catch (err) {
      return new Response('', { status: 504 });
    }
  })());
});
