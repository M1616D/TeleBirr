import { screen, nav, action, ico, esc, toast } from '../ui.js';
import { ADS } from '../data.js';
import { topbar, carousel, wireCarousel, startPay, notReady } from './common.js';

screen('zemenLoading', {
  view() {
    return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:#fff">
      <div style="position:relative;width:56px;height:56px">
        <img src="assets/brands/zemen-gebeya.png" alt="Zemen GEBEYA" style="width:56px;height:56px;border-radius:50%">
        <span class="arc"></span>
      </div>
      <div style="font-size:13px;color:#444;font-weight:600">Zemen GEBEYA</div>
    </div>`;
  },
  mount() {
    setTimeout(() => nav.replace('merchant'), 1500);
  }
});

screen('merchant', {
  view() {
    return `${topbar('Pay for Merchant')}
      <div class="body">
        <div class="tabs" style="margin-top:2px">
          <button class="on" type="button" data-act="merchant.tab" data-tab="pay">Pay for Merchant</button>
          <button type="button" data-act="merchant.tab" data-tab="voucher">Apply Voucher</button>
        </div>
        ${carousel(ADS)}
        <div class="card" style="margin:12px;padding:14px">
          <div class="field" style="margin-bottom:12px">
            <label><span class="req">*</span> Merchant ID</label>
            <div class="in">
              <input id="mchId" inputmode="numeric" placeholder="Enter Merchant ID" maxlength="12">
              <button type="button" data-act="merchant.scan" style="color:var(--green-2)">${ico('scan', 'ico')}</button>
            </div>
          </div>
          <div class="field" style="margin-bottom:12px">
            <label>Operator ID</label>
            <div class="in"><input id="mchOp" inputmode="numeric" placeholder="Enter Operator ID" maxlength="12"></div>
          </div>
          <div class="field" style="margin-bottom:12px">
            <label><span class="req">*</span> Set Amount</label>
            <div class="in"><input id="mchAmt" inputmode="decimal" placeholder="Enter Amount"><span class="suffix">ETB</span></div>
          </div>
          <div class="field">
            <label>Add Note</label>
            <div class="in"><input id="mchNote" placeholder="Enter Note" maxlength="60"></div>
          </div>
          <button class="btn" type="button" style="margin-top:16px" data-act="merchant.next">Next</button>
        </div>
        <div class="sec-title">Recent</div>
        <div style="height:16px"></div>
      </div>`;
  },
  mount(root) {
    wireCarousel(root);
    ['#mchId', '#mchOp', '#mchAmt', '#mchNote'].forEach(sel => {
      const el = root.querySelector(sel);
      el.addEventListener('input', () => {
        if (el.inputMode === 'numeric') el.value = el.value.replace(/[^\d]/g, '');
        if (el.inputMode === 'decimal') el.value = el.value.replace(/[^\d.]/g, '');
        const f = el.closest('.field');
        if (f) f.classList.toggle('focus', !!el.value);
      });
    });
  }
});

action('merchant.tab', (el) => {
  el.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === el));
  if (el.dataset.tab === 'voucher') {
    const id = document.querySelector('#mchId');
    if (id) { id.placeholder = 'Enter Voucher Code'; id.inputMode = 'text'; }
  }
});

action('merchant.scan', () => notReady('QR scanner'));

action('merchant.next', () => {
  const id = document.querySelector('#mchId');
  const amt = document.querySelector('#mchAmt');
  const note = document.querySelector('#mchNote');
  const mid = id ? id.value.trim() : '';
  const amount = amt ? parseFloat(amt.value) : 0;
  if (!mid) { toast('Please enter Merchant ID'); return; }
  if (!amount || amount <= 0) { toast('Please enter a valid amount'); return; }
  startPay({
    amount,
    toName: 'Merchant ' + mid,
    kind: 'merchant',
    kindLabel: 'የነጋዴ ክፍያ',
    heading: 'Pay for Merchant',
    merchant: true,
    note: note ? note.value : ''
  });
});
