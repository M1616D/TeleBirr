import { screen, nav, action, ico, esc, toast } from '../ui.js';
import { APPS } from '../data.js';
import { topbar, notReady, initials, hashColor } from './common.js';
import { store } from '../store.js';

const B = 'assets/brands/';

function appTile(a) {
  const inner = a.img
    ? `<img src="${B}${esc(a.img)}" alt="" onerror="this.style.display='none';this.parentElement.style.background='${hashColor(a.name)}';this.parentElement.innerHTML='<span>${esc(initials(a.name))}</span>'">`
    : `<span style="background:${hashColor(a.name)}">${esc(initials(a.name))}</span>`;
  return `<button class="appc" type="button" data-act="apps.open" data-name="${esc(a.name)}">
    <span class="ic">${inner}</span>
    <span class="nm">${esc(a.name)}</span>
  </button>`;
}

screen('apps', {
  tab: true,
  view() {
    return `${topbar('Apps', { noback: true, right: `<button type="button" data-act="apps.search" style="color:#666">${ico('search', 'ico')}</button>` })}
      <div class="body"><div class="appsgrid">${APPS.map(appTile).join('')}</div></div>`;
  }
});

screen('engage', {
  tab: true,
  view() {
    return `<div style="flex:0 0 auto"><div class="brandbar" style="visibility:hidden;height:0"></div></div>
      ${topbar('Engage', { noback: true })}
      <div class="body center" style="justify-content:center;text-align:center;padding:40px 26px;gap:16px">
        <div class="engage-logo">
          <svg viewBox="0 0 120 80" style="width:150px;height:100px">
            <circle cx="44" cy="40" r="30" fill="none" stroke="#cfe0f0" stroke-width="2.5"/>
            <path d="M28 26h34a8 8 0 0 1 8 8v14a8 8 0 0 1-8 8H42l-11 8v-8h-3a8 8 0 0 1-8-8V34a8 8 0 0 1 8-8z" fill="#f0a41e"/>
            <circle cx="36" cy="41" r="2.6" fill="#fff"/><circle cx="45" cy="41" r="2.6" fill="#fff"/><circle cx="54" cy="41" r="2.6" fill="#fff"/>
            <path d="M62 34h26a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8h-2v7l-9-7H62a8 8 0 0 1-8-8V42a8 8 0 0 1 8-8z" fill="#1379b9" opacity=".92"/>
            <circle cx="66" cy="48" r="2.4" fill="#fff"/><circle cx="74" cy="48" r="2.4" fill="#fff"/><circle cx="82" cy="48" r="2.4" fill="#fff"/>
          </svg>
          <div class="engage-word">Engage</div>
        </div>
        <div style="font-size:19px;font-weight:700;line-height:1.45;color:#222">Welcome to telebirr Engage</div>
        <div class="small" style="color:#555;line-height:1.65">Engage with your friends and family and experience the power of telebirr!</div>
        <button class="btn" type="button" style="max-width:180px;margin-top:10px" data-act="engage.start">Start Engaging</button>
      </div>`;
  }
});

screen('connect', {
  view() {
    return `${topbar('Connect', { right: `<span></span>` })}
      <div class="body">
        <div style="margin:12px 14px">
          <div class="field"><div class="in">${ico('search', 'ico')}<input placeholder="Search Phone Number"></div></div>
        </div>
        <div class="list" style="margin:0 14px">
          <button class="it" type="button" data-act="connect.qr">
            <span class="avatar" style="background:#1976d2">${ico('qr', 'ico')}</span>
            <span class="grow" style="text-align:left">
              <span class="t" style="display:block">QR Code</span>
              <span class="s" style="display:block">Scan the QR code to add friend</span>
            </span>
          </button>
          <button class="it" type="button" data-act="connect.scan">
            <span class="avatar" style="background:#43a047">${ico('scan', 'ico')}</span>
            <span class="grow" style="text-align:left">
              <span class="t" style="display:block">Scan</span>
              <span class="s" style="display:block">Scan QR Code to connect with each other in telebirr</span>
            </span>
          </button>
          <button class="it" type="button" data-act="connect.contacts">
            <span class="avatar" style="background:#5cb85c">${ico('phone', 'ico')}</span>
            <span class="grow" style="text-align:left">
              <span class="t" style="display:block">Mobile Contact</span>
              <span class="s" style="display:block">Add From Mobile Address Book</span>
            </span>
          </button>
        </div>
      </div>`;
  }
});

/* --------------------------------------------------------------- actions */
action('apps.open', (el) => {
  const name = el.dataset.name;
  if (!name) { notReady('App'); return; }
  toast(`${name} is not available right now.`, 'err');
});

action('apps.search', () => nav.go('search'));
action('engage.start', () => nav.go('connect'));
action('connect.qr', () => notReady('QR code'));
action('connect.scan', () => notReady('Scanner'));
action('connect.contacts', () => notReady('Phone contacts'));
