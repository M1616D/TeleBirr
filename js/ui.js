/* UI toolkit: icons, tiny DOM helpers, router, toast, sheets, keypads. */

/* ------------------------------------------------------------------ icons */
const S = (d, extra = '') => `<svg viewBox="0 0 24 24" class="ico" aria-hidden="true">${d}${extra}</svg>`;
const P = (d) => `<path d="${d}"/>`;

export const I = {
  user: `<svg viewBox="0 0 24 24" class="ico fill"><circle cx="12" cy="8" r="4.2"/><path d="M3.6 21c.6-4.3 4-7 8.4-7s7.8 2.7 8.4 7z"/></svg>`,
  userO: S(P('M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z') + P('M4.5 20.5c.8-3.4 3.9-5.5 7.5-5.5s6.7 2.1 7.5 5.5')),
  userPlus: S(P('M10 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z') + P('M3 20.5c.7-3.3 3.5-5.5 7-5.5 1.1 0 2.2.2 3.1.7') + P('M17.5 14v6M14.5 17h6')),
  eye: S(P('M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z') + '<circle cx="12" cy="12" r="3"/>'),
  eyeOff: S(P('M4 4l16 16') + P('M9.5 6.4A9.6 9.6 0 0 1 12 5.8c6 0 9.5 6.2 9.5 6.2a17 17 0 0 1-2.6 3.3') + P('M6.3 8.2A17 17 0 0 0 2.5 12S6 18.2 12 18.2c1.4 0 2.6-.3 3.7-.8')),
  search: S('<circle cx="11" cy="11" r="6.2"/><path d="M15.6 15.6 20 20"/>'),
  bell: S(P('M6.5 10a5.5 5.5 0 0 1 11 0c0 4 1.5 5.5 1.5 5.5H5S6.5 14 6.5 10Z') + P('M10 18.5a2 2 0 0 0 4 0')),
  chevR: S(P('M9.5 5.5 16 12l-6.5 6.5')),
  chevD: S(P('M6 9.5 12 16l6-6.5')),
  chevU: S(P('M6 14.5 12 8l6 6.5')),
  back: S(P('M20 12H4') + P('M10.5 5.5 4 12l6.5 6.5')),
  close: S(P('M6 6l12 12M18 6 6 18')),
  check: S(P('M5 12.8 9.6 17.4 19 8')),
  plus: S(P('M12 5v14M5 12h14')),
  minus: S(P('M5 12h14')),
  trash: S(P('M4.5 7h15') + P('M9.5 7V5.2c0-.7.5-1.2 1.2-1.2h2.6c.7 0 1.2.5 1.2 1.2V7') + P('M6.6 7l.9 12c0 .8.7 1.4 1.5 1.4h6c.8 0 1.5-.6 1.5-1.4l.9-12')),
  scan: S(P('M4 8.5V6a2 2 0 0 1 2-2h2.5M15.5 4H18a2 2 0 0 1 2 2v2.5M20 15.5V18a2 2 0 0 1-2 2h-2.5M8.5 20H6a2 2 0 0 1-2-2v-2.5') + P('M4 12h16')),
  qr: S('<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z"/>'),
  download: S(P('M12 4v11') + P('M7.5 10.5 12 15l4.5-4.5') + P('M5 19.5h14')),
  share: S(P('M8 17.5 18.5 12 8 6.5v4.2C5 10.7 3.6 12 3 15c1.4-1.5 3-2.2 5-2.2v4.7Z')),
  finger: S(P('M12 3.5c-2 0-3.8.8-5.1 2.1') + P('M4.5 8.4A9.5 9.5 0 0 0 3.6 13c0 1.4-.2 2.7-.6 3.9') + P('M7.5 20.2A11 11 0 0 1 6.4 13a5.6 5.6 0 0 1 11.2 0c0 2.3-.2 4.5-.7 6.6') + P('M9.6 20.4c-.5-1.9-.7-3.9-.7-5.9a3.1 3.1 0 0 1 6.2 0c0 1.5-.1 3-.4 4.4')),
  home: S(P('M4 10.6 12 4l8 6.6V19a1.4 1.4 0 0 1-1.4 1.4H5.4A1.4 1.4 0 0 1 4 19v-8.4Z')),
  card: S('<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 10h18"/>'),
  grid: S('<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>'),
  chat: S(P('M20.5 12.2c0 4-3.8 7.2-8.5 7.2-1 0-2-.2-2.9-.5L4 20.5l1.4-3.3A7 7 0 0 1 3.5 12.2C3.5 8.2 7.3 5 12 5s8.5 3.2 8.5 7.2Z')),
  pin: S(P('M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z') + '<circle cx="12" cy="10" r="2.6"/>'),
  send: `<svg viewBox="0 0 24 24" class="ico"><rect x="3" y="9" width="18" height="11.5" rx="2"/><path d="M8 9V7a2 2 0 0 1 2-2h1.2"/><path d="M12 8.6V3.4M9.6 5.4 12 3l2.4 2.4"/></svg>`,
  cash: `<svg viewBox="0 0 24 24" class="ico"><rect x="3" y="8.5" width="18" height="12" rx="2"/><path d="M3 13h18"/><path d="M18.5 6.2v-2M17.2 5h2.6"/></svg>`,
  airtime: `<svg viewBox="0 0 24 24" class="ico"><path d="M4 11h16v9H4z"/><path d="M3 8.2h18V11H3z"/><path d="M12 8.2v11.6"/><path d="M12 8.2C10.2 5.6 8.6 4.6 7.6 5.2c-1 .6-.4 2.2 1.3 3M12 8.2c1.8-2.6 3.4-3.6 4.4-3 .9.6.3 2.2-1.4 3"/><path d="M17.6 3.4l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5z"/><path d="M5.6 4.4l.4 1 1 .4-1 .4-.4 1-.4-1-1-.4 1-.4z"/></svg>`,
  bank: S(P('M3.5 9.6 12 4.5l8.5 5.1') + P('M5.8 11.6v6.2M10 11.6v6.2M14 11.6v6.2M18.2 11.6v6.2') + P('M4 20.5h16')),
  doc: S(P('M6.5 3.5h7L18.5 8v12.5h-12z') + P('M13.5 3.5V8h5') + P('M9 12.5h6M9 16h6')),
  lock: S('<rect x="4.8" y="10.3" width="14.4" height="10" rx="2"/><path d="M8.4 10.3V7.6a3.6 3.6 0 0 1 7.2 0v2.7"/>'),
  key: S('<circle cx="8.4" cy="15.6" r="3.6"/><path d="M10.9 13.1 20 4M17 7l2.2 2.2M14.6 9.4l2 2"/>'),
  shield: S(P('M12 3.5 5 6v6c0 4 3 7 7 8.5 4-1.5 7-4.5 7-8.5V6l-7-2.5Z')),
  question: S('<circle cx="12" cy="12" r="8.5"/><path d="M9.7 9.6a2.4 2.4 0 1 1 3.2 2.3c-.7.3-.9.8-.9 1.5"/><path d="M12 16.6h.01"/>'),
  info: S('<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.4M12 7.9h.01"/>'),
  globe: S('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.3 3.5 8.5S14.4 18.1 12 20.5c-2.4-2.4-3.5-5.3-3.5-8.5S9.6 5.9 12 3.5Z"/>'),
  phone: S(P('M5.5 4.5h3l1.6 4-2 1.3a11 11 0 0 0 5.2 5.2l1.3-2 4 1.6v3a1.8 1.8 0 0 1-2 1.8C10.6 18.7 5.3 13.4 3.7 6.4a1.8 1.8 0 0 1 1.8-1.9Z')),
  star: S(P('M12 4.2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4L4.2 9.9l5.4-.8L12 4.2Z')),
  camera: S(P('M4 8.5h3l1.4-2h7.2l1.4 2h3v11H4z') + '<circle cx="12" cy="13.6" r="3.4"/>'),
  image: S('<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M4 16.5 9 12l5 4.5 2.5-2 3.5 3"/><path d="M15.6 8.6h.01"/>'),
  calendar: S('<rect x="3.8" y="5.5" width="16.4" height="14.5" rx="2"/><path d="M3.8 10h16.4M8.5 3.8v3.4M15.5 3.8v3.4"/>'),
  refresh: S(P('M19.5 12a7.5 7.5 0 1 1-2.2-5.3') + P('M19.6 4.5V9h-4.4')),
  sliders: S(P('M4 7h9M17 7h3M4 12h3M11 12h9M4 17h7M15 17h5') + '<circle cx="15" cy="7" r="1.8"/><circle cx="9" cy="12" r="1.8"/><circle cx="13" cy="17" r="1.8"/>'),
  coupon: S(P('M4 8.5V6.5h16v2a2.2 2.2 0 0 0 0 4.4v4.6H4v-4.6a2.2 2.2 0 0 0 0-4.4Z')),
  smile: S('<circle cx="12" cy="12" r="8.5"/><path d="M8.8 14.2a4 4 0 0 0 6.4 0"/><path d="M9.4 9.6h.01M14.6 9.6h.01"/>'),
  headset: S(P('M4.5 14v-2.2a7.5 7.5 0 0 1 15 0V14') + P('M4.5 13.5h2.2v4H4.5zM17.3 13.5h2.2v4h-2.2z')),
  percent: S('<circle cx="8" cy="8" r="3"/><circle cx="16" cy="16" r="3"/><path d="M5 19 19 5"/>'),
  car: S(P('M4.5 15.5v-2.2l1.6-4.3h11.8l1.6 4.3v2.2') + P('M4.5 13.3h15') + '<circle cx="8" cy="16.4" r="1.6"/><circle cx="16" cy="16.4" r="1.6"/>'),
  sim: S('<rect x="6" y="3.5" width="12" height="17" rx="2"/><path d="M9.5 7.5h5v4.5h-5z"/>'),
  wifi: S(P('M3.5 9.5a13 13 0 0 1 17 0M6.5 12.8a8.6 8.6 0 0 1 11 0M9.4 16a4.2 4.2 0 0 1 5.2 0') + P('M12 19.2h.01')),
  box: S('<rect x="3.6" y="6.5" width="16.8" height="13" rx="2"/><path d="M3.6 11.5h16.8M8 15.5h4"/>'),
  pencil: S(P('M4.5 19.5h3.2L19 8.2a1.7 1.7 0 0 0 0-2.4l-.8-.8a1.7 1.7 0 0 0-2.4 0L4.5 16.3v3.2Z')),
  ext: S(P('M14 4.5h5.5V10') + P('M19.5 4.5 11 13') + P('M18 14.5v4a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6h4')),
  clock: S('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.4V12l3.2 2"/>'),
  gift: S('<rect x="3.8" y="8.6" width="16.4" height="4.4" rx="1"/><path d="M5.4 13v7.5h13.2V13"/><path d="M12 8.6v11.9"/><path d="M12 8.6C10.2 6 8.6 5 7.6 5.6c-1 .6-.4 2.2 1.3 3M12 8.6c1.8-2.6 3.4-3.6 4.4-3 .9.6.3 2.2-1.4 3"/>'),
  bankCard: S('<rect x="3" y="5.8" width="18" height="12.4" rx="2"/><path d="M3 10.2h18M6.5 14h4"/>')
};

export function ico(name, cls = 'ico') {
  const s = I[name] || I.info;
  return s.replace('class="ico"', `class="${cls}"`);
}

/* ------------------------------------------------------------------ helpers */
export function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export function node(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function on(root, event, sel, fn) {
  root.addEventListener(event, e => {
    const t = e.target.closest(sel);
    if (t && root.contains(t)) fn(e, t);
  });
}

/* ------------------------------------------------------------------ router */
export const screens = {};
const stack = [];

export function screen(name, def) { screens[name] = def; }

export const nav = {
  go(name, params = {}, opts = {}) {
    const def = screens[name];
    if (!def) { toast('Something went wrong. Please try again later.', 'err'); return; }
    if (opts.tab) stack.length = 0;
    stack.push({ name, params });
    render(opts.replace ? 'fade' : 'push');
    return this;
  },
  replace(name, params = {}) {
    stack.pop();
    return this.go(name, params, { replace: true });
  },
  tab(name, params = {}) {
    if (stack.length === 1 && stack[0].name === name) return this;
    stack.length = 0;
    return this.go(name, params, { tab: true, replace: true });
  },
  back(fallback) {
    if (stack.length <= 1) {
      if (fallback) { stack.length = 0; return this.go(fallback, {}, { tab: true, replace: true }); }
      return this;
    }
    stack.pop();
    render('pop');
    return this;
  },
  reset(name, params = {}) {
    stack.length = 0;
    return this.go(name, params, { tab: true, replace: true });
  },
  current() { return stack[stack.length - 1]; },
  depth() { return stack.length; }
};

let view, tabbar, fab, overlay;

function render(anim) {
  const cur = stack[stack.length - 1];
  if (!cur) return;
  const def = screens[cur.name];
  closeOverlay(true);

  closeSheet(true);

  const old = view.firstElementChild;
  let el;
  const html = def.view(cur.params) || '';
  el = node(`<section class="screen ${def.tab ? 'has-tab' : ''}">${html}</section>`);
  el.className += ' anim-' + (anim || 'push');
  if (def.keepScroll && old && old.dataset.screen === cur.name) {
    el.scrollTop = old.scrollTop;
  }
  el.dataset.screen = cur.name;
  view.innerHTML = '';
  view.appendChild(el);

  if (typeof def.mount === 'function') {
    try { def.mount(el, cur.params); } catch (err) { console.error(err); }
  }
  el.scrollTop = def.keepScroll && window.__lastScroll ? window.__lastScroll : 0;

  // tab bar
  const isTab = !!def.tab;
  tabbar.classList.toggle('on', isTab);
  fab.classList.toggle('on', isTab && cur.name === 'home');
  if (isTab) {
    $$('#tabbar button').forEach(b => b.classList.toggle('on', b.dataset.tab === cur.name));
  }
  document.getElementById('phone').dataset.screen = cur.name;
  if (hooks.afterRender) hooks.afterRender();
}

/** Hooks the host app can install (used for history integration). */
export const hooks = {};

/* Global action delegation: anything with data-act is handled; unknown actions
   fail loudly (toast) instead of doing nothing. */
const actions = {};
export function action(name, fn) { actions[name] = fn; }

export function bindActions(root) {
  on(root, 'click', '[data-act]', (e, el) => {
    const n = el.dataset.act;
    const fn = actions[n];
    if (!fn) { toast('Something went wrong. Please try again later.', 'err'); return; }
    try { fn(el, el.dataset, e); }
    catch (err) {
      console.error('action failed:', n, err);
      toast('Something went wrong. Please try again later.', 'err');
    }
  });
  // visual feedback for taps
  on(root, 'pointerdown', '[data-act],.tap', (e, el) => el.classList.add('tapped'));
  on(root, 'pointerup', '[data-act],.tap', (e, el) => el.classList.remove('tapped'));
}

export const FAIL_MSG = 'Something went wrong. Please try again later.';
export function fail() { toast(FAIL_MSG, 'err'); }

/* ------------------------------------------------------------------ toast */
export function toast(msg, kind = '', ms) {
  const wrap = document.getElementById('toastwrap');
  const t = node(`<div class="toast ${kind}">${esc(msg)}</div>`);
  wrap.appendChild(t);
  const life = ms || (kind === 'err' ? 2600 : 1900);
  setTimeout(() => {
    t.style.transition = 'opacity .25s';
    t.style.opacity = '0';
    setTimeout(() => t.remove(), 260);
  }, life);
  return t;
}

/* ------------------------------------------------------------------ overlay */
export function closeOverlay(force) {
  if (!overlay) return;
  if (overlay.dataset.locked === '1' && !force) return;
  overlay.hidden = true;
  overlay.innerHTML = '';
  overlay.dataset.locked = '';
  overlay.onclick = null;
}

export function sheet(html, opts = {}) {
  if (!overlay) return null;
  overlay.hidden = false;
  overlay.dataset.locked = opts.locked ? '1' : '';
  overlay.innerHTML = `<div class="scrim"></div><div class="sheet">${html}</div>`;
  const scrim = overlay.querySelector('.scrim');
  scrim.onclick = () => { if (!opts.locked && opts.dismiss !== false) closeOverlay(); };
  if (opts.onClose) overlay.__onClose = opts.onClose;
  return overlay.querySelector('.sheet');
}

export function closeSheet(force) {
  if (!overlay) return;
  const h = overlay.__onClose;
  overlay.__onClose = null;
  if (!overlay.hidden && h && !force) h();
  if (force) { overlay.hidden = true; overlay.innerHTML = ''; overlay.dataset.locked = ''; }
}

export function dialog(opts) {
  if (!overlay) return;
  overlay.hidden = false;
  overlay.innerHTML = `<div class="scrim"></div>
    <div class="dialog">
      ${opts.title ? `<h3>${esc(opts.title)}</h3>` : ''}
      <p>${opts.html || esc(opts.text || '')}</p>
      <div class="acts">
        ${opts.cancel === false ? '' : `<button class="btn grey sm" data-dlg="cancel">${esc(opts.cancelText || 'Cancel')}</button>`}
        <button class="btn sm" data-dlg="ok">${esc(opts.okText || 'OK')}</button>
      </div>
    </div>`;
  const ok = () => { const fn = opts.onOk; closeOverlay(); if (fn) fn(); };
  overlay.querySelector('[data-dlg="ok"]').onclick = ok;
  const c = overlay.querySelector('[data-dlg="cancel"]');
  if (c) c.onclick = () => { const fn = opts.onCancel; closeOverlay(); if (fn) fn(); };
  const scrim = overlay.querySelector('.scrim');
  scrim.onclick = () => { if (opts.dismiss !== false) closeOverlay(); };
}

/* ------------------------------------------------------------------ inputs */
export function digitsOnly(el, max) {
  el.addEventListener('input', () => {
    const v = el.value.replace(/\D/g, '').slice(0, max || 20);
    if (v !== el.value) el.value = v;
    const f = el.closest('.field');
    if (f) f.classList.toggle('focus', !!el.value);
  });
}

/* ------------------------------------------------------------------ keypad */
/** Amount keypad (1..9, backspace, 0, ., OK) — matches the telebirr layout. */
export function keypadHTML(okLabel = 'OK') {
  const k = (n, cls = '') => `<button type="button" class="${cls}" data-key="${n}">${n}</button>`;
  return `<div class="keypad">
    ${k(1)}${k(2)}${k(3)}<button type="button" data-key="bs">${ico('back', 'ico')}</button>
    ${k(4)}${k(5)}${k(6)}<button type="button" class="ok" data-key="ok">${okLabel}</button>
    ${k(7)}${k(8)}${k(9)}
    <button type="button" class="z" data-key="0">0</button>
    <button type="button" class="dt" data-key=".">.</button>
  </div>`;
}

/** PIN pad (1..9, blank, 0, backspace). */
export function pinpadHTML() {
  const k = (n) => `<button type="button" data-pk="${n}">${n}</button>`;
  return `<div class="pinpad">
    ${k(1)}${k(2)}${k(3)}${k(4)}${k(5)}${k(6)}${k(7)}${k(8)}${k(9)}
    <span></span><button type="button" data-pk="0">0</button>
    <button type="button" data-pk="bs">${ico('back', 'ico')}</button>
  </div>`;
}

export function pinDotsHTML(n, filled) {
  let s = '<div class="pindots">';
  for (let i = 0; i < n; i++) s += `<i class="${i < filled ? 'on' : ''}"></i>`;
  return s + '</div>';
}

/** Attach keypad behaviour to a value string. */
export function wireKeypad(root, { onValue, onOk, max = 12 }) {
  let value = '';
  const set = (v) => { value = v; const ok = root.querySelector('.keypad .ok'); if (ok) ok.classList.toggle('ready', v !== '' && v !== '.'); onValue && onValue(v); };
  on(root, 'click', '.keypad button', (e, btn) => {
    const key = btn.dataset.key;
    if (key === 'bs') { set(value.slice(0, -1)); return; }
    if (key === 'ok') { if (value === '' || value === '.') { toast('Please enter an amount'); return; } onOk && onOk(value); return; }
    if (key === '.') { if (value.includes('.')) return; if (!value) value = '0'; set(value + '.'); return; }
    const parts = value.split('.');
    if (parts[1] && parts[1].length >= 2) return;
    if (value.length >= max) return;
    set(value === '0' ? String(key) : value + key);
  });
  return { get value() { return value; }, set };
}

/** Attach PIN pad behaviour. */
export function wirePin(root, len, onComplete) {
  let value = '';
  const dotsWrap = root.querySelector('.pinpad2, .pindots')?.parentElement;
  const paint = () => {
    const d = root.querySelectorAll('.pindots');
    d.forEach(w => {
      Array.from(w.children).forEach((el, i) => el.classList.toggle('on', i < value.length));
    });
  };
  on(root, 'click', '[data-pk]', (e, btn) => {
    const k = btn.dataset.pk;
    if (k === 'bs') { value = value.slice(0, -1); paint(); return; }
    if (value.length >= len) return;
    value += k;
    paint();
    if (value.length === len) setTimeout(() => onComplete(value), 130);
  });
  paint();
  return { get value() { return value; }, reset() { value = ''; paint(); } };
}

/* ------------------------------------------------------------------ QR art */
/** Deterministic pseudo-QR so the About/Verify screens look right offline. */
export function paintQR(canvas, seed) {
  const N = 25, cells = [];
  let h = 2166136261;
  const s = String(seed || 'telebirr');
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  const rnd = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 1000) / 1000; };
  for (let y = 0; y < N; y++) { cells[y] = []; for (let x = 0; x < N; x++) cells[y][x] = rnd() > .52; }
  const finder = (ox, oy) => {
    for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
      const edge = x === 0 || y === 0 || x === 6 || y === 6;
      const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
      cells[oy + y][ox + x] = edge || core;
    }
    for (let y = -1; y < 8; y++) for (let x = -1; x < 8; x++) {
      const yy = oy + y, xx = ox + x;
      if (yy < 0 || xx < 0 || yy >= N || xx >= N) continue;
      if ((x === -1 || x === 7 || y === -1 || y === 7)) cells[yy][xx] = false;
    }
  };
  finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
  const size = N + 2;
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#111';
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (cells[y][x]) ctx.fillRect(x + 1, y + 1, 1, 1);
}

/* ------------------------------------------------------------------ export */
export function initUI() {
  view = document.getElementById('view');
  tabbar = document.getElementById('tabbar');
  fab = document.getElementById('fab');
  overlay = document.getElementById('overlay');
  overlay.addEventListener('click', e => { if (e.target === overlay) closeOverlay(); });
  bindActions(document);
}

/** True while an overlay (sheet/dialog) is showing. */
export function overlayOpen() { return overlay ? !overlay.hidden : false; }

export function phoneEl() { return document.getElementById('phone'); }

/* text wrapping label helper for tiles */
export function twoLine(s) { return esc(s); }
