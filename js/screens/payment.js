import { screen, nav, action, ico, esc, on, toast, wireKeypad } from '../ui.js';
import { PAYMENT, ADS } from '../data.js';
import { topbar, carousel, wireCarousel, catalogIcon, amountPageHTML, startPay, notReady, initials, hashColor } from './common.js';

let open = null;

function catHTML(c) {
  const isOpen = open === c.key;
  return `<div class="acc ${isOpen ? 'open' : ''}" data-cat="${esc(c.key)}">
    <button class="hd" type="button" data-act="pay.toggle" data-key="${esc(c.key)}">
      <span>${esc(c.title)}</span>
      <span class="chev">${ico('chevD', 'ico')}</span>
    </button>
    <div class="bd">
      <div class="grid3">
        ${c.items.map(it => `<button class="gi" type="button" data-act="pay.item" data-name="${esc(it.name)}" data-cat="${esc(c.title)}">
          <span class="ic">${it.img
            ? `<img src="assets/brands/${esc(it.img)}" alt="">`
            : ico(it.icon || 'grid', 'ico')}</span>
          <span>${esc(it.name)}</span>
        </button>`).join('')}
      </div>
      ${carousel(ADS, true)}
    </div>
  </div>`;
}

screen('payment', {
  tab: true,
  view() {
    return `${topbar('Payment', { noback: true, right: `<button type="button" data-act="pay.search" style="color:#666">${ico('search', 'ico')}</button>` })}
      <div class="body" style="padding-top:10px">
        ${PAYMENT.map(catHTML).join('')}
        <div style="height:14px"></div>
      </div>`;
  },
  mount(root) {
    wireCarousel(root);
  }
});

screen('billPay', {
  view({ name, cat }) {
    return `${topbar(name || 'Payment')}
      <div class="body">
        <div class="card" style="margin:12px;padding:14px">
          <div class="field" style="margin-bottom:12px">
            <label>Customer / Account number</label>
            <div class="in"><input id="billAcc" inputmode="numeric" placeholder="Enter number" maxlength="20">
              <button type="button" data-act="bill.scan" style="color:var(--green-2)">${ico('scan', 'ico')}</button></div>
          </div>
          <div class="field">
            <label>Amount</label>
            <div class="in"><input id="billAmt" inputmode="decimal" placeholder="Enter Amount"><span class="suffix">ETB</span></div>
          </div>
          <button class="btn" type="button" style="margin-top:16px" data-act="bill.next">Next</button>
        </div>
        <div class="small muted" style="padding:0 16px">${esc(cat || '')}</div>
        <div style="height:16px"></div>
      </div>`;
  },
  mount(root) {
    ['#billAcc', '#billAmt'].forEach((s, i) => {
      const el = root.querySelector(s);
      el.addEventListener('input', () => {
        el.value = el.value.replace(i === 0 ? /[^\d]/g : /[^\d.]/g, '');
        const f = el.closest('.field');
        if (f) f.classList.toggle('focus', !!el.value);
      });
    });
  }
});

/* --------------------------------------------------------------- actions */
action('pay.toggle', (el) => {
  const k = el.dataset.key;
  open = open === k ? null : k;
  const page = document.querySelector('.screen');
  const cats = page.querySelectorAll('.acc');
  cats.forEach(c => c.classList.toggle('open', c.dataset.cat === open));
});

action('pay.search', () => nav.go('search'));

action('pay.item', (el) => {
  nav.go('billPay', { name: el.dataset.name, cat: el.dataset.cat });
});

action('bill.scan', () => notReady('QR scanner'));

action('bill.next', () => {
  const acc = document.querySelector('#billAcc');
  const amt = document.querySelector('#billAmt');
  const account = acc ? acc.value.replace(/\D/g, '') : '';
  const amount = amt ? parseFloat(amt.value) : 0;
  if (account.length < 4) { toast('Please enter a valid account number'); return; }
  if (!amount || amount <= 0) { toast('Please enter a valid amount'); return; }
  const title = nav.current().params.name;
  startPay({
    amount,
    toName: title,
    toPhone: account,
    kind: 'bill',
    kindLabel: 'የአገልግሎት ክፍያ',
    heading: `Pay to ${title}`
  });
});
