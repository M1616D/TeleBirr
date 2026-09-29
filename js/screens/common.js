/* Building blocks shared by every screen. */

import { I, ico, esc, node, on, toast, sheet, dialog, closeOverlay, keypadHTML, pinpadHTML, pinDotsHTML, wireKeypad, wirePin, fail, paintQR, action } from '../ui.js';
import { store, money, refCode, stamp, normPhone } from '../store.js';
import { ADS, COLORS } from '../data.js';
import { nav } from '../ui.js';

const B = 'assets/brands/';

export function busy(on) {
  const b = document.getElementById('boot');
  if (b) b.hidden = !on;
}

export function brandbar() {
  return `<div class="brandbar">
    <img src="${B}ethio-telecom-name.png" alt="ethio telecom">
    <img class="r" src="${B}telebirr-text.png" alt="telebirr">
  </div>`;
}

export function topbar(title, opts = {}) {
  const right = opts.right || '';
  return `<div class="topbar ${opts.green ? 'head-green' : ''}">
    ${opts.noback ? '' : `<button class="back" type="button" data-act="${opts.backAct || 'nav.back'}" aria-label="Back">${ico('back', 'ico')}</button>`}
    <h1>${esc(title)}</h1>
    ${right}
  </div>`;
}

export function initials(name) {
  const parts = String(name || '?').replace(/[^A-Za-z0-9 ]/g, ' ').trim().split(/\s+/);
  const a = (parts[0] || '?')[0] || '?';
  const b = parts.length > 1 ? parts[1][0] : (parts[0] || '')[1] || '';
  return (a + b).toUpperCase();
}

export function hashColor(name) {
  let h = 0;
  const s = String(name || '');
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997;
  return COLORS[h % COLORS.length];
}

/** Brand-ish icon for a catalogue entry: image when we have one, else a colour badge. */
export function catalogIcon(item, size = 30) {
  if (item.img) {
    return `<img src="${B}${esc(item.img)}" alt="" style="width:${size}px;height:${size}px;object-fit:contain"
      onerror="this.onerror=null;this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${esc(initials(item.name))}',className:'fallback'}))">`;
  }
  return ico(item.icon || 'grid', 'ico');
}

export function carousel(ads = ADS, tall) {
  const items = ads.map(a => `<div class="ad ${tall ? 'tall' : ''}"><img src="${a.img}" alt="${esc(a.label || '')}"></div>`).join('');
  const dots = ads.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('');
  return `<div class="carousel" data-carousel>${items}</div><div class="dots" data-dots>${dots}</div>`;
}

export function wireCarousel(root) {
  const c = root.querySelector('[data-carousel]');
  if (!c) return;
  const dots = Array.from(root.querySelectorAll('[data-dots] i'));
  if (!dots.length) return;
  const upd = () => {
    const w = c.clientWidth || 1;
    const idx = Math.min(dots.length - 1, Math.round(c.scrollLeft / (c.scrollWidth / dots.length)));
    dots.forEach((d, i) => d.classList.toggle('on', i === idx));
  };
  c.addEventListener('scroll', () => { clearTimeout(c.__t); c.__t = setTimeout(upd, 90); }, { passive: true });
  let auto = setInterval(() => {
    if (!document.body.contains(c)) { clearInterval(auto); return; }
    const near = c.scrollLeft + c.clientWidth >= c.scrollWidth - 8;
    c.scrollTo({ left: near ? 0 : c.scrollLeft + c.clientWidth, behavior: 'smooth' });
  }, 4600);
  upd();
}

/* ------------------------------------------------------------- amount screen */
export function amountPageHTML({ title, head, notes = true, okLabel = 'OK', backAct }) {
  return `${topbar(title, { backAct })}
  <div class="body" style="display:flex;flex-direction:column;min-height:calc(100% - 54px)">
    ${head ? `<div class="amt-hero">
      ${head.img ? `<div class="avatar lg"><img src="${B}${esc(head.img)}" alt=""></div>`
        : head.photo ? `<div class="avatar lg"><img src="${esc(head.photo)}" alt=""></div>`
          : `<div class="avatar lg ${head.dark ? 'dark' : ''}">${ico('user', 'ico')}</div>`}
      <div class="grow">
        <div class="nm">${esc(head.name || '')}</div>
        ${head.sub ? `<div class="small muted" style="margin-top:3px">${esc(head.sub)}</div>` : ''}
      </div>
    </div>` : ''}
    <div class="amt-row">
      <div class="l">${esc(title === 'Send Money' ? 'Amount' : 'Amount')}</div>
      <div class="line"><div class="val" data-amount></div><div class="cur">(ETB)</div></div>
    </div>
    ${notes ? `<div class="notes"><div class="l">Add notes(optional)</div><input data-note maxlength="60" placeholder=""></div>` : ''}
    <div class="grow"></div>
    ${keypadHTML(okLabel)}
  </div>`;
}

/* --------------------------------------------------------------- PIN prompt */
export function pinPrompt({ amount, title, onOk }) {
  const label = amount == null ? '' : `${money(amount)}<span class="cur">ETB</span>`;
  const el = sheet(`
    <div style="position:relative">
      <button class="cancel" data-act="overlay.close" aria-label="Close">${ico('close', 'ico sm')}</button>
      <div style="text-align:center;padding:22px 20px 6px" class="pinmodal">
        <div class="bold" style="font-size:16px">${esc(title || 'Enter PIN')}</div>
        <div class="amt">${label}</div>
        ${pinDotsHTML(4, 0)}
        <div style="margin-top:6px">${''}</div>
      </div>
      <div style="padding:0 14px">
        <div class="pinpad2">
          ${[1,2,3,4,5,6,7,8,9].map(n => `<button type="button" data-pk="${n}">${n}</button>`).join('')}
          <span></span><button type="button" data-pk="0">0</button>
          <button type="button" data-pk="bs">${ico('back', 'ico')}</button>
        </div>
      </div>
      <div style="height:10px"></div>
    </div>`, { locked: false, dismiss: true });

  let tries = 0;
  const pad = wirePin(el, 4, (v) => {
    if (v === String(store.prefs.pin || '1234')) {
      closeOverlay();
      onOk && onOk();
    } else {
      tries++;
      const dots = el.querySelectorAll('.pindots');
      dots.forEach(d => { d.style.animation = 'none'; void d.offsetWidth; });
      toast('Incorrect PIN. Please try again.', 'err');
      pad.reset();
      if (tries >= 3) { closeOverlay(); }
    }
  });
  return pad;
}

/* --------------------------------------------------------------- confirm sheet */
export function confirmSheet({ heading, toName, total, fee = 1, original, method = true, actionLabel = 'Send', fingerprint = true, onSend }) {
  const bal = store.profile.balance;
  return sheet(`
    <div class="grab"></div>
    <div class="sheet-head" style="padding-bottom:0">
      <button type="button" data-act="overlay.close" aria-label="Close">${ico('close', 'ico')}</button>
      ${fingerprint ? `<button type="button" class="grow" style="text-align:right;color:var(--green-2);font-weight:600;font-size:14px" data-act="fp.verify">Fingerprint</button>` : '<span class="grow"></span>'}
    </div>
    <div class="sheet-body">
      <div style="text-align:center;font-size:15px;font-weight:600;margin:6px 0 10px">${esc(heading)}</div>
      <div class="confirm-total">${money(total)}<small>ETB</small></div>
      <div class="box">
        ${original != null ? `<div class="kv"><span class="k">Original Amount</span><span class="v">${money(original)}ETB</span></div>` : ''}
        <div class="kv"><span class="k">Service fee</span><span class="v">${money(fee)}ETB</span></div>
      </div>
      ${method ? `<div class="box">
        <div class="bt">Payment Method</div>
        <div class="pay-method">
          <div class="ic">${ico('bankCard', 'ico')}</div>
          <div>
            <div class="nm">Balance</div>
            <div class="sub">(Available Balance:${money(bal)}ETB)</div>
          </div>
          <div class="ck">${ico('check', 'ico sm')}</div>
        </div>
      </div>` : ''}
      <div style="height:16px"></div>
      <button class="btn" type="button" data-act="confirm.send" data-label="${esc(actionLabel)}">${esc(actionLabel)}</button>
      <div style="height:8px"></div>
    </div>`);
}

/* ---------------------------------------------------------------- pay flow */
let pending = null;

export function initCommon() {
  action('overlay.close', () => closeOverlay());
  action('nav.back', () => nav.back());
  action('nav.tab', (el) => nav.tab(el.dataset.to));
  action('fp.verify', () => {
    toast('Fingerprint verified', 'ok');
    setTimeout(() => { const b = document.querySelector('[data-act="confirm.send"]'); if (b) b.click(); }, 500);
  });
  action('confirm.send', () => {
    const p = pending; pending = null;
    closeOverlay();
    if (!p) { fail(); return; }
    busy(true);
    setTimeout(() => { busy(false); p.commit(); }, 1150);
  });
}

/**
 * Shared money movement: PIN -> loading -> confirmation -> receipt.
 * `toName` is the payee shown on the receipt (comes from saved receivers so the
 * private settings panel controls what the receipt says).
 */
export function startPay({ amount, toName, toPhone, kind, kindLabel, heading, fee = 1, merchant = false, note = '' }) {
  const total = Number(amount) + Number(fee);
  pending = {
    commit() {
      const txn = store.addTxn({
        ref: refCode(),
        time: stamp(),
        kind: kind || 'send',
        type: kindLabel || 'ወደ ሌላ ተጠቃሚ ዝዝብ ለመላክ',
        to: toName,
        phone: toPhone || '',
        amount: -total,
        original: Number(amount),
        fee: Number(fee),
        note
      });
      nav.go('receipt', { txn });
    }
  };
  pinPrompt({
    amount: total,
    onOk() {
      busy(true);
      setTimeout(() => {
        busy(false);
        confirmSheet({
          heading: heading || `Send Money to ${toName}`,
          total,
          fee,
          original: amount,
          actionLabel: merchant ? 'Pay' : (kind === 'bank' ? 'Transfer' : (kind === 'airtime' ? 'Pay' : 'Send'))
        });
      }, 1150);
    }
  });
}

/* ------------------------------------------------------------------ receipt */
export function receiptHTML(txn) {
  return `<div class="receipt">
    <div class="bar">
      <button type="button" data-act="receipt.download">${ico('download', 'ico')} Download</button>
      <button type="button" data-act="receipt.share">${ico('share', 'ico')} ማጋራት</button>
    </div>
    <div class="okwrap">
      <div class="okc">${ico('check', 'ico')}</div>
      <div class="status">ተሳክቷል</div>
    </div>
    <div class="amount">${txn.amount < 0 ? '-' : ''}${money(Math.abs(txn.amount))}<small>(ETB)</small></div>
    <div class="rsep"></div>
    <div class="rows">
      <div class="kv"><span class="k">የግብይት ጊዜ:</span><span class="v">${esc(txn.time)}</span></div>
      <div class="kv"><span class="k">የግብይት አይነት:</span><span class="v">${esc(txn.type)}</span></div>
      <div class="kv"><span class="k">ግብይት ወደ:</span><span class="v">${esc(txn.to)}</span></div>
      <div class="kv"><span class="k">የግብይት ቁጥር:</span><span class="v">${esc(txn.ref)}</span></div>
    </div>
    <div class="qr">${ico('qr', 'ico')} QR Code</div>
    ${carousel(ADS, true)}
    <button class="btn close" type="button" data-act="receipt.close">ለመዝጋት</button>
    <div style="height:10px"></div>
  </div>`;
}

/** Printable document. Deliberately marked as a demo - it is not a real receipt. */
export function receiptDocHTML(txn) {
  const p = store.profile;
  return `<div class="receipt-doc" id="printarea">
    <div class="hd">
      <div>
        <div style="font-weight:800;color:#0f7ab8;font-size:13px">telebirr</div>
        <div style="color:#888;font-size:10px">telebirr SuperApp — transaction summary</div>
      </div>
      <div style="text-align:right;font-size:10px;color:#555">
        <div style="font-weight:700">${esc(p.name)}</div>
        <div>+251${esc(normPhone(p.phone))}</div>
      </div>
    </div>
    <h4>Transaction information</h4>
    <table>
      <tr><td class="k">Transaction number</td><td class="v">${esc(txn.ref)}</td></tr>
      <tr><td class="k">Transaction date</td><td class="v">${esc(txn.time)}</td></tr>
      <tr><td class="k">Transaction type</td><td class="v">${esc(txn.type)}</td></tr>
      <tr><td class="k">Paid to</td><td class="v">${esc(txn.to)}</td></tr>
      ${txn.phone ? `<tr><td class="k">Payee number</td><td class="v">+251 ${esc(normPhone(txn.phone))}</td></tr>` : ''}
      <tr><td class="k">Payment mode</td><td class="v">telebirr balance</td></tr>
      <tr><td class="k">Status</td><td class="v">Completed</td></tr>
    </table>
    <h4>Amount details</h4>
    <table>
      <tr><td class="k">Amount</td><td class="v">${money(txn.original != null ? txn.original : Math.abs(txn.amount))} Birr</td></tr>
      <tr><td class="k">Service fee</td><td class="v">${money(txn.fee || 0)} Birr</td></tr>
      <tr><td class="k">Total</td><td class="v">${money(Math.abs(txn.amount))} Birr</td></tr>
    </table>
    <div class="demo">DEMO DOCUMENT — NOT A VALID PAYMENT RECEIPT</div>
    <div style="margin-top:8px;font-size:9.5px;color:#777;line-height:1.5">
      This summary was produced by a user-interface demo application. It cannot be used as proof of payment.
    </div>
  </div>`;
}

export function printDoc(txn) {
  const holder = document.createElement('div');
  holder.id = 'print-host';
  holder.innerHTML = receiptDocHTML(txn);
  document.body.appendChild(holder);
  const done = () => { holder.remove(); window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  setTimeout(() => { try { window.print(); } catch (e) { toast('Printing is not available on this device.', 'err'); } }, 60);
  setTimeout(done, 8000);
}

export function receiptCanvas(txn) {
  const c = document.getElementById('aboutQR');
  if (c) paintQR(c, txn.ref);
}

export function shareTxn(txn) {
  const text = `telebirr transaction ${txn.ref}\n${txn.type}\nTo: ${txn.to}\nAmount: ${money(Math.abs(txn.amount))} ETB\n${txn.time}`;
  if (navigator.share) {
    navigator.share({ title: 'telebirr receipt', text }).catch(() => {});
  } else {
    try { navigator.clipboard.writeText(text); toast('Receipt copied to clipboard', 'ok'); }
    catch (e) { toast('Sharing is not available on this device.', 'err'); }
  }
}

/** Generic "not uploaded yet" behaviour: never freeze, always say something. */
export function notReady(what) {
  toast(`${what ? what + ': ' : ''}Something went wrong. Please try again later.`, 'err');
}

export function soonPage({ title, body, icon = 'info', actionLabel, action }) {
  return `${topbar(title)}
   <div class="body center" style="justify-content:center;padding:40px 24px;gap:14px;text-align:center">
     <div class="fp-ring">${ico(icon, 'ico lg')}</div>
     <div style="font-size:15px;font-weight:600">${esc(title)}</div>
     <div class="small muted" style="line-height:1.6">${body || 'This page is not available right now.'}</div>
     ${actionLabel ? `<button class="btn" style="max-width:240px;margin-top:8px" data-act="${action}">${esc(actionLabel)}</button>` : ''}
   </div>`;
}
