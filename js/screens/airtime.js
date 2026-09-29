import { screen, nav, action, ico, esc, on, toast, wireKeypad } from '../ui.js';
import { store, money, normPhone } from '../store.js';
import { ADS, AIRTIME, PACKAGES } from '../data.js';
import { topbar, carousel, wireCarousel, amountPageHTML, startPay, notReady, busy } from './common.js';

let state = { recipient: 'Self', mode: 'Airtime', amount: null, pkg: null, phone: '' };

function pkgList(filter) {
  const f = (filter || '').toLowerCase();
  return PACKAGES.filter(p => !f || (p.name + ' ' + p.desc).toLowerCase().includes(f));
}

function pkgRows(filter) {
  const rows = pkgList(filter);
  if (!rows.length) return `<div class="center muted small" style="padding:26px">No packages found</div>`;
  return rows.map(p => `<button class="it" type="button" data-act="airtime.pkg" data-name="${esc(p.name)}" data-price="${p.price}" data-desc="${esc(p.desc)}">
      <span class="grow" style="text-align:left">
        <span class="t" style="display:block">${esc(p.name)}</span>
        <span class="s" style="display:block">${esc(p.desc)}</span>
      </span>
      <span class="bold">${p.price}ETB</span>
    </button>`).join('');
}

screen('airtime', {
  view() {
    const isPkg = state.mode === 'Package';
    return `${topbar('Airtime/Package')}
    <div class="body">
      ${carousel(ADS)}
      <div class="card" style="margin:12px;padding:14px">
        <div class="row" style="margin-bottom:12px">
          <button type="button" class="btn sm ${state.recipient === 'Self' ? '' : 'grey'}" style="width:76px" data-act="airtime.self">Self</button>
          <button type="button" class="btn sm ${state.recipient === 'Other' ? '' : 'grey'}" style="width:86px" data-act="airtime.other">Other</button>
          <button type="button" data-act="airtime.contacts" style="color:var(--green-2);margin-left:4px">${ico('userO', 'ico')}</button>
        </div>
        <div class="field">
          <div class="in">
            <span class="pre">+251</span>
            <input id="airPhone" type="tel" inputmode="numeric" maxlength="10" value="${esc(state.recipient === 'Self' ? normPhone(store.profile.phone) : state.phone)}">
          </div>
        </div>
        <div class="row" style="margin-top:14px;gap:0">
          <button type="button" class="btn ${!isPkg ? '' : 'grey'}" data-act="airtime.mode.airtime">Airtime</button>
          <button type="button" class="btn ${isPkg ? '' : 'grey'}" data-act="airtime.mode.package">Package</button>
        </div>
      </div>

      ${isPkg ? `
        <div class="card" style="margin:12px;padding:12px 0 4px">
          <div class="bold" style="padding:0 14px 6px">Select Package</div>
          <div class="tabs">
            <button class="on" type="button" data-act="airtime.soon">Recent</button>
            <button type="button" data-act="airtime.soon">New</button>
            <button type="button" data-act="airtime.soon">My Favourite Packages</button>
          </div>
          <div style="padding:12px 14px 4px">
            <div class="field"><div class="in">${ico('search', 'ico sm')}<input id="pkgSearch" placeholder="Search Packages"></div></div>
          </div>
          <div class="list" style="box-shadow:none;border-radius:0" id="pkgList">${pkgRows('')}</div>
        </div>` : `
        <div class="chips">
          ${AIRTIME.map(v => `<button class="chip ${state.amount === v ? 'on' : ''}" type="button" data-act="airtime.amt" data-amt="${v}">
            ${v}<span class="s">frequency1</span>${v === 250 ? '<span class="badge2">Left</span>' : (v === 100 ? '<span class="badge2">Left</span>' : '')}</button>`).join('')}
        </div>
        <div class="card" style="margin:12px;padding:14px">
          <div class="row between">
            <div>
              <div class="bold">Other Amount</div>
              <div class="small muted" style="margin-top:2px">Enter Amount</div>
            </div>
            <div class="field" style="min-width:120px">
              <div class="in"><input id="otherAmt" inputmode="decimal" placeholder="Enter Amount"><span class="suffix">ETB</span></div>
            </div>
          </div>
          <button class="btn" type="button" style="margin-top:16px" data-act="airtime.next">Next</button>
        </div>`}
      <div style="height:16px"></div>
    </div>`;
  },
  mount(root) {
    wireCarousel(root);
    const next = root.querySelector('[data-act="airtime.next"]');
    if (next) next.addEventListener('click', () => {});
    const search = root.querySelector('#pkgSearch');
    if (search) {
      search.addEventListener('input', () => {
        const l = root.querySelector('#pkgList');
        l.innerHTML = pkgRows(search.value);
      });
    }
    const other = root.querySelector('#otherAmt');
    if (other) other.addEventListener('input', () => {
      other.value = other.value.replace(/[^\d.]/g, '');
      state.amount = parseFloat(other.value) || null;
    });
  }
});

screen('airtimeAmount', {
  view({ name, phone }) {
    return amountPageHTML({ title: 'Airtime', head: { name: name || 'Ethio telecom', sub: phone || '' }, notes: true });
  },
  mount(root, params) {
    const amountEl = root.querySelector('[data-amount]');
    if (params && params.amount) { amountEl.textContent = String(params.amount); }
    wireKeypad(root, {
      onValue: v => { amountEl.textContent = v; },
      onOk: v => {
        const amount = parseFloat(v);
        if (!amount || amount <= 0) { toast('Please enter a valid amount'); return; }
        startPay({
          amount,
          toName: params.name || 'Ethio telecom',
          toPhone: params.phone,
          kind: 'airtime',
          kindLabel: 'የአየር ሰዓት / ፓኬጅ ግዢ',
          heading: 'Pay to Ethio telecom'
        });
      }
    });
  }
});

/* ---------------------------------------------------------------- actions */
action('airtime.self', () => { state.recipient = 'Self'; nav.replace('airtime'); });
action('airtime.other', () => { state.recipient = 'Other'; nav.replace('airtime'); });
action('airtime.mode.airtime', () => { state.mode = 'Airtime'; nav.replace('airtime'); });
action('airtime.mode.package', () => { state.mode = 'Package'; nav.replace('airtime'); });
action('airtime.contacts', () => notReady('Phone contacts'));
action('airtime.soon', () => notReady('Packages'));
action('airtime.amt', (el) => { state.amount = Number(el.dataset.amt); nav.replace('airtime'); });

action('airtime.next', () => {
  const phoneEl = document.querySelector('#airPhone');
  const phone = normPhone(phoneEl ? phoneEl.value : '');
  if (state.recipient === 'Other' && phone.length < 9) { toast('Please enter a valid mobile number'); return; }
  if (!state.amount || state.amount <= 0) { toast('Please choose or enter an amount'); return; }
  nav.go('airtimeAmount', { name: 'Ethio telecom', phone, amount: state.amount });
});

action('airtime.pkg', (el) => {
  const price = Number(el.dataset.price);
  const name = el.dataset.name;
  startPay({
    amount: price,
    toName: 'Ethio telecom',
    kind: 'airtime',
    kindLabel: 'ፓኬጅ ግዢ',
    heading: 'Pay to Ethio telecom',
    note: name
  });
});
