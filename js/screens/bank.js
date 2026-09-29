/* js/screens/bank.js - classic script (no module loader / works offline from file://). */
(function () {
  'use strict';
  var TB = window.TB || (window.TB = {});
  var NS = TB.mod || (TB.mod = {});
  NS = NS.bank || (NS.bank = {});
  var { screen, nav, action, ico, esc, on, toast, wireKeypad } = TB.ui;
  var { store } = TB.store;
  var { ADS, BANKS } = TB.data;
  var { topbar, carousel, wireCarousel, amountPageHTML, startPay, notReady, catalogIcon } = TB.common;


let picked = null;

function bankRows(filter) {
  const f = (filter || '').toLowerCase();
  const rows = BANKS.filter(b => !f || b.name.toLowerCase().includes(f));
  if (!rows.length) return `<div class="center muted small" style="padding:26px;grid-column:1/-1">No bank found</div>`;
  return rows.map(b => `<button class="gi" type="button" data-act="bank.pick" data-name="${esc(b.name)}" data-img="${esc(b.img || '')}">
      <span class="ic">${b.img ? `<img src="assets/brands/${esc(b.img)}" alt="">` : ico(b.icon || 'bank', 'ico')}</span>
      <span>${esc(b.name)}</span>
      ${picked === b.name ? `<span style="color:var(--green-2)">${ico('check', 'ico sm')}</span>` : ''}
    </button>`).join('');
}

function recentBanks() {
  const rs = store.recentBanks;
  if (!rs.length) return '';
  return `<div class="sec-title" style="margin-top:18px">Recent</div>
    <div class="list" style="margin:0 14px">${rs.map(r => `<button class="it" type="button" data-act="bank.recent" data-id="${esc(r.id)}">
      <span class="grow" style="text-align:left">
        <span class="t" style="display:block">${esc(r.holder)}</span>
        <span class="s" style="display:block">${esc(r.bank)} (${esc(r.account)})</span>
      </span>
      <span class="muted">${ico('chevR', 'ico sm')}</span>
    </button>`).join('')}</div>`;
}

screen('bankTransfer', {
  view() {
    return `${topbar('Transfer to Bank')}
    <div class="body">
      ${carousel(ADS)}
      <div class="card" style="margin:12px;padding:14px">
        <div class="field" style="margin-bottom:12px">
          <label>Select Bank</label>
          <div class="in">
            <button type="button" data-act="bank.choose" style="flex:1;text-align:left;font-weight:600;padding:4px 0;${picked ? '' : 'color:#9a9a9a'}">${esc(picked || 'Please Choose')}</button>
            <span class="muted">${ico('chevD', 'ico')}</span>
          </div>
        </div>
        <div class="field">
          <label>Account No</label>
          <div class="in"><input id="bankAcc" inputmode="numeric" placeholder="Enter Account Number" maxlength="20"></div>
        </div>
        <button class="btn" type="button" style="margin-top:16px" data-act="bank.next">Next</button>
      </div>
      ${recentBanks()}
      <div style="height:16px"></div>
    </div>`;
  },
  mount(root) {
    wireCarousel(root);
    const acc = root.querySelector('#bankAcc');
    acc.addEventListener('input', () => {
      acc.value = acc.value.replace(/\D/g, '');
      const f = acc.closest('.field');
      if (f) f.classList.toggle('focus', !!acc.value);
    });
  }
});

screen('bankList', {
  view() {
    return `${topbar('Choose Bank', { right: `<button type="button" data-act="bank.search" style="color:#666">${ico('search', 'ico')}</button>` })}
      <div class="body">
        <div class="bold" style="padding:12px 14px 4px">Choose Bank</div>
        <div class="acc open" style="margin:0 12px 12px">
          <div class="bd" style="padding-top:4px"><div class="grid3" id="bankGrid">${bankRows('')}</div></div>
        </div>
        <div style="height:12px"></div>
      </div>`;
  },
  mount(root) {
    const grid = root.querySelector('#bankGrid');
    root.querySelector('[data-act="bank.search"]').addEventListener('click', () => { /* re-render */ });
  }
});

screen('bankAmount', {
  view({ holder, bank, account }) {
    return amountPageHTML({
      title: 'Transfer to Bank',
      head: { name: holder || account, sub: `${bank} (${account})` }
    });
  },
  mount(root, params) {
    const amountEl = root.querySelector('[data-amount]');
    wireKeypad(root, {
      onValue: v => { amountEl.textContent = v; },
      onOk: v => {
        const amount = parseFloat(v);
        if (!amount || amount <= 0) { toast('Please enter a valid amount'); return; }
        startPay({
          amount,
          toName: params.holder || params.account,
          toPhone: params.account,
          kind: 'bank',
          kindLabel: 'ወደ ባንክ ማስተላለፍ',
          heading: `Transfer to ${params.bank}`
        });
      }
    });
  }
});

/* ---------------------------------------------------------------- actions */
action('bank.choose', () => nav.go('bankList'));

action('bank.search', () => notReady('Bank search'));

action('bank.pick', (el) => {
  picked = el.dataset.name;
  nav.back();
  toast(picked + ' selected', 'ok');
});

action('bank.next', () => {
  if (!picked) { toast('Please choose a bank'); return; }
  const acc = document.querySelector('#bankAcc');
  const account = acc ? acc.value.replace(/\D/g, '') : '';
  if (account.length < 6) { toast('Please enter a valid account number'); return; }
  nav.go('bankAmount', { bank: picked, account });
});

action('bank.recent', (el) => {
  const r = store.recentBanks.find(x => x.id === el.dataset.id);
  if (!r) { toast('Something went wrong. Please try again later.', 'err'); return; }
  picked = r.bank;
  nav.go('bankAmount', { bank: r.bank, account: r.account, holder: r.holder });
});


})();
