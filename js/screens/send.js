/* js/screens/send.js - classic script (no module loader / works offline from file://). */
(function () {
  'use strict';
  var TB = window.TB || (window.TB = {});
  var NS = TB.mod || (TB.mod = {});
  NS = NS.send || (NS.send = {});
  var { screen, nav, action, ico, esc, on, toast, dialog, closeOverlay, wireKeypad } = TB.ui;
  var { store, normPhone } = TB.store;
  var { ADS } = TB.data;
  var { topbar, carousel, wireCarousel, amountPageHTML, startPay, notReady } = TB.common;


const recentHTML = () => {
  const rs = store.receivers;
  if (!rs.length) return `<div class="card pad center" style="margin:0 14px;color:var(--muted);font-size:13px">No recent contacts</div>`;
  return `<div class="list">${rs.map(r => `<button class="it" type="button" data-act="send.pick" data-id="${esc(r.id)}">
      <span class="avatar ${r.name === 'MULUKEN' ? 'dark' : ''}">${ico('user', 'ico')}</span>
      <span class="t">${esc(r.name)}</span>
      <span class="muted">${ico('chevR', 'ico sm')}</span>
    </button>`).join('')}</div>`;
};

screen('sendIndividual', {
  view() {
    return `${topbar('Send Money to Individual')}
      <div class="body">
        ${carousel(ADS)}
        <div class="card" style="margin:12px;padding:14px">
          <div style="font-weight:600;font-size:14.5px;margin-bottom:12px">Please Enter Mobile Number</div>
          <div class="field">
            <div class="in">
              <span class="pre">+251</span>
              <input id="sndPhone" type="tel" inputmode="numeric" maxlength="10" placeholder="">
              <button type="button" data-act="send.scan" style="color:var(--green-2)">${ico('scan', 'ico')}</button>
              <button type="button" data-act="send.contacts" style="color:var(--green-2)">${ico('userO', 'ico')}</button>
            </div>
          </div>
          <button class="btn disabled" type="button" id="sndNext" data-act="send.next" style="margin-top:14px">Next</button>
        </div>
        <div class="between" style="padding:16px 16px 8px">
          <div class="bold">Recent</div>
          <button type="button" data-act="send.clear" style="color:#8a8a8a">${ico('trash', 'ico')}</button>
        </div>
        ${recentHTML()}
        <div style="height:16px"></div>
      </div>`;
  },
  mount(root) {
    wireCarousel(root);
    const inp = root.querySelector('#sndPhone');
    const next = root.querySelector('#sndNext');
    inp.addEventListener('input', () => {
      inp.value = inp.value.replace(/\D/g, '');
      const ok = normPhone(inp.value).length >= 9;
      next.classList.toggle('disabled', !ok);
      const f = inp.closest('.field');
      if (f) f.classList.toggle('focus', !!inp.value);
    });
    inp.focus({ preventScroll: true });
  }
});

function displayPhone(p) {
  const n = normPhone(p);
  return n ? '251' + n : '';
}

screen('sendAmount', {
  view({ name, phone }) {
    return amountPageHTML({
      title: 'Send Money',
      head: {
        name: name || 'Unknown',
        sub: displayPhone(phone),
        dark: /^[A-Z0-9 ]+$/.test(name || '') && (name || '').length > 5
      }
    });
  },
  mount(root, params) {
    const amountEl = root.querySelector('[data-amount]');
    const noteEl = root.querySelector('[data-note]');
    wireKeypad(root, {
      onValue: v => { amountEl.textContent = v; },
      onOk: v => {
        const amount = Math.round(parseFloat(v) * 100) / 100;
        if (!amount || amount <= 0) { toast('Please enter a valid amount'); return; }
        if (amount + 1 > store.profile.balance) { toast('Insufficient balance for this transaction', 'err'); return; }
        startPay({
          amount,
          toName: params.name,
          toPhone: params.phone,
          kind: 'send',
          kindLabel: 'ወደ ሌላ ተጠቃሚ ዝዝብ ለመላክ',
          heading: `Send Money to ${params.name}`,
          note: noteEl ? noteEl.value : ''
        });
      }
    });
  }
});

/* ---------------------------------------------------------------- actions */
action('send.next', () => {
  const inp = document.querySelector('#sndPhone');
  const v = normPhone(inp ? inp.value : '');
  if (v.length < 9) { toast('Please enter a valid mobile number'); return; }
  const rec = store.findReceiver(v);
  nav.go('sendAmount', { name: rec ? rec.name : '+' + v, phone: v });
});

action('send.pick', (el) => {
  const r = store.receivers.find(x => x.id === el.dataset.id);
  if (!r) { toast('Something went wrong. Please try again later.', 'err'); return; }
  nav.go('sendAmount', { name: r.name, phone: r.phone });
});

action('send.clear', () => {
  if (!store.receivers.length) { toast('No recent contacts'); return; }
  dialog({
    title: 'Clear recent',
    text: 'Remove all recent contacts?',
    okText: 'Clear',
    onOk() { store.clearReceivers(); nav.replace('sendIndividual'); }
  });
});

action('send.scan', () => notReady('QR scanner'));
action('send.contacts', () => notReady('Phone contacts'));


})();
