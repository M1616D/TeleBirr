import { screen, nav, action, ico, esc, on, toast, sheet, closeOverlay, dialog, wirePin, pinDotsHTML } from '../ui.js';
import { store, money, normPhone } from '../store.js';
import { topbar, notReady } from './common.js';

let tab = 'account';
let editing = null; // receiver id being edited

/** PIN gate: opened from the version number on the About screen. */
export function openSecret() {
  const el = sheet(`
    <div style="text-align:center;padding:20px 20px 6px" class="pinmodal">
      <div class="tiny muted" style="letter-spacing:.5px">PRIVATE SETTINGS</div>
      <div class="bold" style="font-size:16px;margin-top:6px">Enter access PIN</div>
      ${pinDotsHTML(4, 0)}
    </div>
    <div style="padding:0 14px">
      <div class="pinpad2">
        ${[1,2,3,4,5,6,7,8,9].map(n => `<button type="button" data-pk="${n}">${n}</button>`).join('')}
        <span></span><button type="button" data-pk="0">0</button>
        <button type="button" data-pk="bs">${ico('back', 'ico')}</button>
      </div>
    </div>
    <div style="height:12px"></div>`);
  const pad = wirePin(el, 4, (v) => {
    if (v === String(store.prefs.secretPin)) {
      closeOverlay();
      nav.go('secret');
    } else {
      toast('Incorrect PIN', 'err');
      pad.reset();
    }
  });
}

function field(id, label, value, type = 'text', extra = '') {
  return `<div class="field" style="margin-bottom:12px">
    <label>${esc(label)}</label>
    <div class="in"><input id="${id}" type="${type}" value="${esc(value)}" ${extra}></div>
  </div>`;
}

function accountTab() {
  const p = store.profile;
  return `<div class="card" style="margin:12px;padding:14px">
    <div class="row" style="gap:14px;margin-bottom:14px">
      <div class="avatar lg" style="width:64px;height:64px;background:${p.photo ? '#eee' : 'var(--gold)'}">
        ${p.photo ? `<img src="${esc(p.photo)}" alt="">` : ico('user', 'ico lg')}
      </div>
      <div class="grow">
        <div class="small muted">Profile picture</div>
        <div class="row" style="gap:8px;margin-top:8px">
          <button class="btn sm outline" type="button" data-act="secret.photo">Upload</button>
          <button class="btn sm outline" type="button" data-act="secret.photo.clear">Remove</button>
        </div>
        <input id="secretPhoto" type="file" accept="image/*" hidden>
      </div>
    </div>
    ${field('sName', 'Account holder name', p.name)}
    ${field('sPhone', 'Phone number', normPhone(p.phone), 'tel', 'inputmode="numeric" maxlength="10"')}
    ${field('sBalance', 'Balance (ETB)', p.balance, 'text', 'inputmode="decimal"')}
    ${field('sEndekise', 'Endekise (ETB)', p.endekise, 'text', 'inputmode="decimal"')}
    ${field('sReward', 'Reward (ETB)', p.reward, 'text', 'inputmode="decimal"')}
    ${field('sLevel', 'Account level', p.level, 'text', 'inputmode="numeric" maxlength="2"')}
    <button class="btn" type="button" data-act="secret.saveAccount">Save account info</button>
  </div>
  <div class="small muted" style="padding:0 18px 8px;line-height:1.6">These details drive the Home screen, the Account tab and every receipt the app generates.</div>`;
}

function receiversTab() {
  const rs = store.receivers;
  return `<div class="card" style="margin:12px;padding:14px">
    <div class="bold" style="margin-bottom:12px">${editing ? 'Edit receiver' : 'Add receiver'}</div>
    ${field('rName', 'Receiver name', editing ? (rs.find(r => r.id === editing) || {}).name || '' : '')}
    ${field('rPhone', 'Receiver phone number', editing ? (rs.find(r => r.id === editing) || {}).phone || '' : '', 'tel', 'inputmode="numeric" maxlength="10"')}
    <div class="row" style="gap:10px">
      <button class="btn" type="button" data-act="secret.saveReceiver">${editing ? 'Update receiver' : 'Save receiver'}</button>
      ${editing ? `<button class="btn outline" type="button" data-act="secret.cancelReceiver" style="max-width:110px">Cancel</button>` : ''}
    </div>
  </div>
  <div class="sec-title">Saved receivers (${rs.length})</div>
  <div class="list" style="margin:0 12px">
    ${rs.length ? rs.map(r => `<div class="it">
      <span class="avatar">${ico('user', 'ico')}</span>
      <span class="grow">
        <span class="t" style="display:block">${esc(r.name)}</span>
        <span class="s" style="display:block">+251 ${esc(normPhone(r.phone))}</span>
      </span>
      <button type="button" data-act="secret.editReceiver" data-id="${esc(r.id)}" style="color:var(--green-2);padding:6px">${ico('pencil', 'ico sm')}</button>
      <button type="button" data-act="secret.delReceiver" data-id="${esc(r.id)}" style="color:#c95a5a;padding:6px">${ico('trash', 'ico sm')}</button>
    </div>`).join('') : '<div class="center muted small" style="padding:22px">No receivers saved</div>'}
  </div>
  <div class="small muted" style="padding:12px 18px;line-height:1.6">Saved receivers appear under Send Money → Recent, and the name here is the name printed on the generated receipt.</div>`;
}

function appTab() {
  return `<div class="card" style="margin:12px;padding:14px">
    ${field('sPin', 'Login / payment PIN', store.prefs.pin, 'text', 'inputmode="numeric" maxlength="6"')}
    ${field('sSecretPin', 'Private settings PIN', store.prefs.secretPin, 'text', 'inputmode="numeric" maxlength="6"')}
    ${field('sLang', 'Default language', store.prefs.language)}
    <div class="row between" style="padding:12px 0">
      <div>
        <div style="font-weight:600;font-size:14px">Show Fayda popup again</div>
        <div class="tiny muted">Shows the first-login promo next time Home opens</div>
      </div>
      <button class="btn sm outline" type="button" data-act="secret.popup" style="width:auto;padding:8px 14px">Reset</button>
    </div>
    <button class="btn" type="button" data-act="secret.saveApp">Save app settings</button>
  </div>
  <div class="card" style="margin:12px;padding:14px">
    <div class="bold" style="margin-bottom:10px">Danger zone</div>
    <button class="btn outline" type="button" data-act="secret.resetTxns" style="margin-bottom:10px">Clear transaction history</button>
    <button class="btn" type="button" data-act="secret.resetAll" style="background:#d64545">Reset everything to defaults</button>
  </div>`;
}

screen('secret', {
  view() {
    return `${topbar('Private settings', { backAct: 'nav.tab.home' })}
      <div class="tabs">
        ${[['account', 'Account'], ['receivers', 'Receivers'], ['app', 'App']].map(([k, l]) =>
          `<button type="button" class="${tab === k ? 'on' : ''}" data-act="secret.tab" data-tab="${k}">${l}</button>`).join('')}
      </div>
      <div class="body">
        ${tab === 'account' ? accountTab() : tab === 'receivers' ? receiversTab() : appTab()}
      </div>`;
  },
  mount(root) {
    const f = root.querySelector('#secretPhoto');
    if (f) f.addEventListener('change', () => {
      const file = f.files && f.files[0];
      if (!file) return;
      const r = new FileReader();
      r.onload = () => { store.setProfile({ photo: r.result }); nav.replace('secret'); toast('Photo updated', 'ok'); };
      r.readAsDataURL(file);
    });
  }
});

/* --------------------------------------------------------------- actions */
action('secret.tab', (el) => { tab = el.dataset.tab; editing = null; nav.replace('secret'); });

action('secret.saveAccount', () => {
  const num = (id, f) => { const e = document.querySelector('#' + id); const v = e ? parseFloat(e.value) : NaN; return isFinite(v) ? v : f; };
  const txt = (id, f) => { const e = document.querySelector('#' + id); return e && e.value.trim() ? e.value.trim() : f; };
  const phone = normPhone(txt('sPhone', store.profile.phone));
  if (phone.length < 9) { toast('Please enter a valid phone number', 'err'); return; }
  store.setProfile({
    name: txt('sName', store.profile.name),
    phone,
    balance: num('sBalance', store.profile.balance),
    endekise: num('sEndekise', store.profile.endekise),
    reward: num('sReward', store.profile.reward),
    level: Math.max(1, Math.min(9, Math.round(num('sLevel', store.profile.level))))
  });
  toast('Account information updated', 'ok');
});

action('secret.photo', () => {
  const f = document.querySelector('#secretPhoto');
  if (f) f.click(); else notReady('Photo');
});
action('secret.photo.clear', () => { store.setProfile({ photo: '' }); nav.replace('secret'); });

action('secret.saveReceiver', () => {
  const name = (document.querySelector('#rName') || {}).value || '';
  const phone = (document.querySelector('#rPhone') || {}).value || '';
  if (!name.trim()) { toast('Please enter the receiver name'); return; }
  if (normPhone(phone).length < 9) { toast('Please enter a valid phone number'); return; }
  if (editing) {
    store.updateReceiver(editing, { name: name.trim(), phone });
    editing = null;
    toast('Receiver updated', 'ok');
  } else {
    store.addReceiver(name.trim(), phone);
    toast('Receiver saved', 'ok');
  }
  nav.replace('secret');
});

action('secret.editReceiver', (el) => { editing = el.dataset.id; nav.replace('secret'); });
action('secret.cancelReceiver', () => { editing = null; nav.replace('secret'); });

action('secret.delReceiver', (el) => {
  const r = store.receivers.find(x => x.id === el.dataset.id);
  if (!r) { toast('Something went wrong. Please try again later.', 'err'); return; }
  dialog({
    title: 'Delete receiver',
    text: `Remove ${r.name} from your saved receivers?`,
    okText: 'Delete',
    onOk() { store.deleteReceiver(r.id); nav.replace('secret'); toast('Receiver deleted', 'ok'); }
  });
});

action('secret.saveApp', () => {
  const pin = (document.querySelector('#sPin') || {}).value || '';
  const spin = (document.querySelector('#sSecretPin') || {}).value || '';
  const lang = (document.querySelector('#sLang') || {}).value || 'English';
  if (!/^\d{4,6}$/.test(pin)) { toast('PIN must be 4-6 digits', 'err'); return; }
  if (!/^\d{4,6}$/.test(spin)) { toast('Private PIN must be 4-6 digits', 'err'); return; }
  store.setPref('pin', pin);
  store.setPref('secretPin', spin);
  store.setPref('language', lang);
  toast('App settings saved', 'ok');
});

action('secret.popup', () => { store.setPref('popupSeen', false); toast('Fayda popup will show again', 'ok'); });

action('secret.resetTxns', () => {
  dialog({
    title: 'Clear history',
    text: 'Delete all saved transactions? Receipts will no longer verify.',
    okText: 'Clear',
    onOk() { store.clearHistory(); nav.replace('secret'); toast('Transaction history cleared', 'ok'); }
  });
});

action('secret.resetAll', () => {
  dialog({
    title: 'Reset everything',
    text: 'Restore the app to its original demo data? Saved receivers, profile photo and history will be lost.',
    okText: 'Reset',
    onOk() { store.resetAll(); tab = 'account'; editing = null; nav.tab('home'); toast('App reset to defaults', 'ok'); }
  });
});
