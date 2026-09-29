/* js/screens/account.js - classic script (no module loader / works offline from file://). */
(function () {
  'use strict';
  var TB = window.TB || (window.TB = {});
  var NS = TB.mod || (TB.mod = {});
  NS = NS.account || (NS.account = {});
  var { screen, nav, action, ico, esc, on, toast, dialog, closeOverlay, paintQR, wirePin, pinpadHTML, pinDotsHTML, FAIL_MSG } = TB.ui;
  var { store, money, normPhone } = TB.store;
  var { FAQ, LANGS, NOTIF, COUPON_TABS } = TB.data;
  var { topbar, notReady, brandbar } = TB.common;


const VERSION = 'V1.2.3';

/* ------------------------------------------------------------------ account */
function menuRow(act, icon, title, sub) {
  return `<button class="it" type="button" data-act="${act}">
    <span class="mi">${ico(icon)}</span>
    <span class="t">${esc(title)}</span>
    ${sub ? `<span class="s">${esc(sub)}</span>` : ''}
    <span class="chev">${ico('chevR', 'ico sm')}</span>
  </button>`;
}

screen('account', {
  tab: true,
  view() {
    const p = store.profile;
    return `${topbar('Account', { noback: true })}
      <div class="body">
        <div class="acct-card">
          <div class="avatar lg" style="background:${p.photo ? '#eee' : 'var(--gold)'};width:58px;height:58px">
            ${p.photo ? `<img src="${esc(p.photo)}" alt="">` : ico('user', 'ico lg')}
          </div>
          <div class="grow">
            <div class="lvl">${ico('star', 'ico sm')} Level ${esc(p.level)}</div>
            <div class="bold" style="font-size:16px">${esc(p.name)}</div>
            <div class="small muted" style="margin-top:2px">+251${esc(normPhone(p.phone))}</div>
          </div>
          <button type="button" data-act="account.qr" style="color:var(--green-2)">${ico('qr', 'ico')}</button>
        </div>
        <div class="menu">
          ${menuRow('acc.fayda', 'shield', 'Verify/Upgrade with Fayda (NID)')}
          ${menuRow('acc.changePin', 'lock', 'Change PIN')}
          ${menuRow('acc.language', 'globe', 'Change Language', store.prefs.language)}
          ${menuRow('acc.security', 'question', 'Security Question')}
          ${menuRow('acc.biometric', 'finger', 'Biometric Authentication')}
          ${menuRow('acc.faq', 'smile', 'FAQ')}
          ${menuRow('acc.feedback', 'chat', 'Feedback')}
          ${menuRow('acc.contact', 'headset', 'Contact Us')}
          ${menuRow('acc.about', 'info', 'About')}
          ${menuRow('acc.share', 'share', 'Share')}
          ${menuRow('acc.coupon', 'coupon', 'My Coupon')}
          ${menuRow('acc.billshare', 'doc', 'Bill Share History')}
          ${menuRow('acc.verify', 'shield', 'Verify Payment')}
        </div>
        <div style="height:16px"></div>
      </div>`;
  }
});

/* -------------------------------------------------------------------- about */
screen('about', {
  view() {
    return `${topbar('About')}
      <div class="body center" style="padding:26px 20px;gap:16px">
        <div class="qrbox"><canvas id="aboutQR"></canvas></div>
        <div class="row" style="gap:10px">
          <img src="assets/brands/telebirr-text.png" alt="telebirr" style="height:34px">
        </div>
        <button type="button" id="versionTap" data-act="secret.tap" class="muted" style="font-size:12.5px;letter-spacing:.6px;padding:8px 14px">${VERSION}</button>
        <button class="btn" type="button" style="max-width:250px" data-act="about.update">Check for update</button>
        <div class="small muted" style="text-align:center;line-height:1.6">telebirr SuperApp<br>@2026 Ethio telecom. All rights reserved</div>
      </div>`;
  },
  mount(root) {
    const c = root.querySelector('#aboutQR');
    if (c) paintQR(c, 'telebirr|' + normPhone(store.profile.phone) + '|' + store.profile.name);
  }
});

/* --------------------------------------------------------------- change PIN */
screen('changePin', {
  view() {
    return `${topbar('Change PIN')}
      <div class="body" style="display:flex;flex-direction:column">
        <div class="form">
          <div class="field"><label><span class="req">*</span> Current PIN</label><div class="in"><input id="pinCur" type="password" inputmode="numeric" maxlength="6" placeholder="Enter"></div></div>
          <div class="field"><label><span class="req">*</span> New PIN</label><div class="in"><input id="pinNew" type="password" inputmode="numeric" maxlength="6" placeholder="Enter"></div></div>
          <div class="field"><label><span class="req">*</span> Confirm New PIN</label><div class="in"><input id="pinCon" type="password" inputmode="numeric" maxlength="6" placeholder="Enter"></div></div>
          <button class="btn" type="button" data-act="pin.save">Save</button>
        </div>
        ${pinpadHTML()}
      </div>`;
  },
  mount(root) {
    let focused = 'pinCur';
    const inputs = ['pinCur', 'pinNew', 'pinCon'].map(id => root.querySelector('#' + id));
    const focusNext = () => {
      const empty = inputs.find(i => !i.value);
      if (empty) empty.focus({ preventScroll: true });
    };
    inputs.forEach(i => i.addEventListener('focus', () => { focused = i.id; }));
    on(root, 'click', '[data-pk]', (e, btn) => {
      const k = btn.dataset.pk;
      let idx = inputs.findIndex(i => i.id === focused);
      if (idx < 0) idx = 0;
      const cur = inputs[idx];
      if (k === 'bs') { cur.value = cur.value.slice(0, -1); return; }
      if (cur.value.length >= 6) { focusNext(); return; }
      cur.value += k;
      if (cur.value.length === 6) focusNext();
    });
  }
});

/* ---------------------------------------------------------------- language */
screen('language', {
  view() {
    return `${topbar('Language')}
      <div class="body">
        <div class="menu" style="margin-top:8px">
          ${LANGS.map(l => `<button class="it" type="button" data-act="lang.pick" data-lang="${esc(l)}">
            <span class="t" ${l === store.prefs.language ? 'style="color:var(--green-2)"' : ''}>${esc(l)}</span>
            ${l === store.prefs.language ? `<span class="green">${ico('check', 'ico')}</span>` : ''}
          </button>`).join('')}
        </div>
      </div>`;
  }
});

/* -------------------------------------------------------- security question */
screen('securityQuestion', {
  view() {
    return `${topbar('Security Question')}
      <div class="body center" style="justify-content:center;gap:18px;padding:40px 24px;text-align:center">
        <div class="fp-ring">${ico('question', 'ico lg')}</div>
        <div class="small" style="color:#555">Do you need to change security question?</div>
        <button class="btn blue" type="button" style="max-width:200px" data-act="acc.security.next">Next</button>
      </div>`;
  }
});

/* ---------------------------------------------------------------- biometric */
screen('biometric', {
  view() {
    const { fpLogin, fpPay } = store.prefs;
    return `${topbar('Biometric Authentication')}
      <div class="body">
        <div class="menu" style="margin-top:8px">
          <button class="it" type="button" data-act="bio.login">
            <span class="t">Set Fingerprint For Login</span>
            <span class="switch ${fpLogin ? 'on' : ''}"><i></i></span>
          </button>
          <button class="it" type="button" data-act="bio.pay">
            <span class="t">Set Fingerprint For Payment</span>
            <span class="switch ${fpPay ? 'on' : ''}"><i></i></span>
          </button>
        </div>
        <div class="small muted" style="padding:14px 16px">Fingerprint is stored on your device only and is never uploaded.</div>
      </div>`;
  }
});

/* ---------------------------------------------------------------------- FAQ */
screen('faq', {
  view() {
    return `${topbar('FAQ')}
      <div class="body faq">
        ${FAQ.map((f, i) => `<div class="it" data-faq="${i}">
          <span class="n">${i + 1}</span>
          <div class="grow" data-act="faq.toggle" data-i="${i}">
            <div class="q">${esc(f.q)}</div>
            <div class="a">${esc(f.a)}</div>
          </div>
        </div>`).join('')}
      </div>`;
  }
});

/* ----------------------------------------------------------------- feedback */
screen('feedback', {
  view() {
    return `${topbar('Feedback')}
      <div class="body">
        <div style="padding:20px 16px 0;text-align:center" class="small">Please rate your satisfaction or this transaction</div>
        <div class="stars" data-stars>
          ${[1,2,3,4,5].map(n => `<button type="button" data-act="fb.star" data-n="${n}">${ico('star')}</button>`).join('')}
        </div>
        <div style="padding:6px 16px 0">
          <div class="bold small" style="margin-bottom:8px">Comment</div>
          <div class="field"><div class="in"><textarea id="fbText" maxlength="200" placeholder="Provide us your Feedback"></textarea></div></div>
          <div class="tiny muted" style="text-align:right;margin-top:6px"><span id="fbCount">0</span>/200</div>
        </div>
        <div class="row" style="gap:12px;padding:16px">
          <button class="btn outline" type="button" data-act="fb.skip">Skip</button>
          <button class="btn" type="button" data-act="fb.send">Send</button>
        </div>
      </div>`;
  },
  mount(root) {
    const t = root.querySelector('#fbText');
    t.addEventListener('input', () => { root.querySelector('#fbCount').textContent = t.value.length; });
  }
});

/* ---------------------------------------------------------------- contact us */
screen('contact', {
  view() {
    return `${topbar('Contact Us')}
      <div class="body">
        <div class="menu" style="margin-top:8px">
          <button class="it" type="button" data-act="contact.call">
            <span class="mi">${ico('phone')}</span>
            <span class="grow" style="text-align:left">
              <span class="t" style="display:block">telebirr Contact Center</span>
              <span class="s" style="display:block">127</span>
            </span>
          </button>
          <button class="it" type="button" data-act="contact.web">
            <span class="mi">${ico('globe')}</span>
            <span class="grow" style="text-align:left">
              <span class="t" style="display:block">Ethio telecom Web Site</span>
              <span class="s" style="display:block">https://www.ethiotelecom.et/telebirr/</span>
            </span>
          </button>
        </div>
        <div class="sec-title">Social Media</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;padding:0 16px">
          ${[['facebook','Facebook'],['twitter','X'],['telegram','Telegram'],['linkedin','LinkedIn'],['youtube','YouTube'],['instagram',''],['tiktok',''],['sms','SMS']]
            .map(([k, label]) => `<button type="button" data-act="contact.social" data-k="${k}" style="display:flex;flex-direction:column;align-items:center;gap:6px">
                <span class="avatar round" style="width:44px;height:44px;background:#eef3e8">
                  ${['facebook','twitter','telegram','linkedin','youtube'].includes(k)
                    ? `<img src="assets/brands/${k}.png" alt="" style="object-fit:contain;padding:8px">`
                    : ico(k === 'sms' ? 'chat' : 'grid', 'ico')}
                </span>
              </button>`).join('')}
        </div>
        <div style="height:20px"></div>
      </div>`;
  }
});

/* --------------------------------------------------------------------- share */
screen('share', {
  view() {
    return `${topbar('Share')}
      <div class="body">
        <div class="menu" style="margin-top:8px">
          <button class="it" type="button" data-act="share.msg"><span class="t">Message</span><span class="chev">${ico('chevR', 'ico sm')}</span></button>
          <button class="it" type="button" data-act="share.social"><span class="t">Social Network</span><span class="chev">${ico('chevR', 'ico sm')}</span></button>
        </div>
      </div>`;
  }
});

/* ------------------------------------------------------------------ coupons */
screen('coupons', {
  view() {
    return `${topbar('My Coupons')}
      <div class="body">
        <div class="tabs">
          ${COUPON_TABS.map((t, i) => `<button type="button" class="${i === 0 ? 'on' : ''}" data-act="coupon.tab" data-i="${i}">${esc(t)}</button>`).join('')}
        </div>
        <div class="center muted small" style="padding:60px 20px">No more data</div>
      </div>`;
  }
});

/* ----------------------------------------------------------- verify payment */
screen('verifyPayment', {
  view() {
    return `${topbar('Verify Payment')}
      <div class="body">
        <div class="form">
          <div class="field">
            <label>Transaction Number</label>
            <div class="in"><input id="txnNo" placeholder="Transaction Number" maxlength="20">
              <button type="button" data-act="verify.scan" style="color:var(--green-2)">${ico('scan', 'ico')}</button></div>
          </div>
          <button class="btn" type="button" data-act="verify.next">Next</button>
        </div>
      </div>`;
  }
});

/* ----------------------------------------------------------------- setPhoto */
screen('setPhoto', {
  view() {
    const p = store.profile;
    return `${topbar('Set Photo')}
      <div class="body">
        <div class="photo-pick">
          <div class="bigavatar">
            ${p.photo ? `<img src="${esc(p.photo)}" alt="">` : ico('user', 'ico')}
          </div>
          <div class="upload-row">
            <button class="btn" type="button" data-act="photo.take">Take Photo</button>
            <button class="btn outline" type="button" data-act="photo.gallery">Choose From Gallery</button>
          </div>
          <input id="photoFile" type="file" accept="image/*" hidden>
          <input id="photoCam" type="file" accept="image/*" capture="user" hidden>
        </div>
      </div>`;
  },
  mount(root) {
    const file = root.querySelector('#photoFile');
    const cam = root.querySelector('#photoCam');
    const handle = (input) => input.addEventListener('change', () => {
      const f = input.files && input.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => { store.setProfile({ photo: r.result }); nav.replace('setPhoto'); toast('Photo updated', 'ok'); };
      r.onerror = () => toast('Something went wrong. Please try again later.', 'err');
      r.readAsDataURL(f);
    });
    handle(file); handle(cam);
    root.__pickGallery = () => file.click();
    root.__pickCamera = () => cam.click();
  }
});

/* ------------------------------------------------------- search/notifications */
screen('search', {
  view() {
    return `${topbar('Search', { right: '' })}
      <div class="body">
        <div style="padding:12px 14px">
          <div class="field"><div class="in">${ico('search', 'ico')}<input id="searchInput" placeholder="Enter Keyword to Search" autofocus></div></div>
        </div>
        <div id="searchResults"></div>
      </div>`;
  },
  mount(root) {
    const input = root.querySelector('#searchInput');
    const out = root.querySelector('#searchResults');
    const all = [
      ['Send Money', 'sendIndividual'], ['Cash In/Out', null], ['Airtime/Package', 'airtime'],
      ['Zemen GEBEYA', 'zemenLoading'], ['Financial Service with CBE', 'financialCbe'],
      ['Transfer to Bank', 'bankTransfer'], ['My Coupons', 'coupons'], ['About', 'about'],
      ['Change PIN', 'changePin'], ['Language', 'language'], ['FAQ', 'faq'], ['Feedback', 'feedback']
    ];
    input.focus({ preventScroll: true });
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase().trim();
      if (!q) { out.innerHTML = ''; return; }
      const hits = all.filter(a => a[0].toLowerCase().includes(q));
      out.innerHTML = hits.length
        ? `<div class="list" style="margin:0 14px">${hits.map(h => `<button class="it" type="button" data-act="search.go" data-to="${h[1] || ''}" data-name="${esc(h[0])}">
            <span class="t">${esc(h[0])}</span><span class="chev">${ico('chevR', 'ico sm')}</span></button>`).join('')}</div>`
        : `<div class="center muted small" style="padding:30px">No results found</div>`;
    });
  }
});

screen('notifications', {
  view() {
    return `${topbar('Notification')}
      <div class="body">
        <div class="menu" style="margin-top:8px">
          ${NOTIF.map(n => `<button class="it" type="button" data-act="notif.open" data-name="${esc(n.name)}">
            <span class="avatar round" style="background:${n.color}">${ico(n.icon, 'ico')}</span>
            <span class="t">${esc(n.name)}</span>
            <span class="chev">${ico('chevR', 'ico sm')}</span>
          </button>`).join('')}
        </div>
      </div>`;
  }
});

/* --------------------------------------------------------------- actions */
action('acc.fayda', () => notReady('Fayda verification'));
action('acc.changePin', () => nav.go('changePin'));
action('acc.language', () => nav.go('language'));
action('acc.security', () => nav.go('securityQuestion'));
action('acc.biometric', () => nav.go('biometric'));
action('acc.faq', () => nav.go('faq'));
action('acc.feedback', () => nav.go('feedback'));
action('acc.contact', () => nav.go('contact'));
action('acc.about', () => nav.go('about'));
action('acc.share', () => nav.go('share'));
action('acc.coupon', () => nav.go('coupons'));
action('acc.billshare', () => notReady('Bill share history'));
action('acc.verify', () => nav.go('verifyPayment'));
action('account.qr', () => notReady('My QR code'));

action('acc.security.next', () => notReady('Security question'));

action('pin.save', () => {
  const cur = document.querySelector('#pinCur').value;
  const nw = document.querySelector('#pinNew').value;
  const con = document.querySelector('#pinCon').value;
  if (cur !== String(store.prefs.pin)) { toast('Current PIN is incorrect', 'err'); return; }
  if (nw.length < 4) { toast('New PIN must be at least 4 digits'); return; }
  if (nw !== con) { toast('New PIN and confirmation do not match', 'err'); return; }
  store.setPref('pin', nw);
  toast('PIN changed successfully', 'ok');
  nav.back();
});

action('lang.pick', (el) => {
  store.setPref('language', el.dataset.lang);
  toast('Language updated', 'ok');
  nav.back();
});

action('bio.login', (el) => {
  const sw = el.querySelector('.switch');
  const on = !sw.classList.contains('on');
  sw.classList.toggle('on', on);
  store.setPref('fpLogin', on);
});
action('bio.pay', (el) => {
  const sw = el.querySelector('.switch');
  const on = !sw.classList.contains('on');
  sw.classList.toggle('on', on);
  store.setPref('fpPay', on);
});

action('faq.toggle', (el) => {
  const it = el.closest('.it');
  it.classList.toggle('open');
});

action('fb.star', (el) => {
  const n = Number(el.dataset.n);
  el.closest('[data-stars]').querySelectorAll('button').forEach(b => {
    b.classList.toggle('on', Number(b.dataset.n) <= n);
  });
});
action('fb.skip', () => nav.back());
action('fb.send', () => {
  const v = document.querySelector('#fbText').value.trim();
  if (!v) { toast('Please write your feedback'); return; }
  toast('Thank you for your feedback', 'ok');
  nav.back();
});

action('contact.call', () => { window.location.href = 'tel:127'; });
action('contact.web', () => { window.open('https://www.ethiotelecom.et/telebirr/', '_blank', 'noopener'); });
action('contact.social', () => notReady('Social media'));

action('share.msg', () => {
  if (navigator.share) navigator.share({ title: 'telebirr', text: 'Join me on telebirr SuperApp' }).catch(() => {});
  else notReady('Sharing');
});
action('share.social', () => notReady('Social network'));

action('coupon.tab', (el) => {
  el.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === el));
});

action('verify.scan', () => notReady('QR scanner'));
action('verify.next', () => {
  const el = document.querySelector('#txnNo');
  const code = el ? el.value.trim() : '';
  if (!code) { toast('Please enter a transaction number'); return; }
  const txn = store.findTxn(code);
  if (!txn) { toast('Transaction number not found', 'err'); return; }
  nav.go('receipt', { txn });
});

action('photo.take', () => {
  const c = document.querySelector('#photoCam');
  if (c) c.click(); else notReady('Camera');
});
action('photo.gallery', () => {
  const f = document.querySelector('#photoFile');
  if (f) f.click(); else notReady('Gallery');
});

action('search.go', (el) => {
  const to = el.dataset.to;
  if (!to) { notReady(el.dataset.name); return; }
  nav.go(to);
});

action('notif.open', (el) => toast(`${el.dataset.name}: no new messages`));

action('about.update', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (!reg) { toast('App is up to date', 'ok'); return; }
      reg.update().then(() => toast('Checking for updates…'));
      setTimeout(() => {
        const waiting = reg.waiting || reg.installing;
        if (waiting) { toast('Update found. Applying…', 'ok'); waiting.postMessage({ type: 'SKIP_WAITING' }); }
        else toast('You are on the latest version', 'ok');
      }, 1500);
    }).catch(() => toast('Something went wrong. Please try again later.', 'err'));
  } else {
    toast('You are on the latest version', 'ok');
  }
});

/* -------------------------------------------------- hidden version trigger */
let taps = 0, tapTimer = null;
action('secret.tap', () => {
  taps++;
  clearTimeout(tapTimer);
  tapTimer = setTimeout(() => { taps = 0; }, 2600);
  if (taps >= 5) {
    taps = 0;
    // classic script bundle: the secret screen exports itself on TB.mod.secret
    const s = (window.TB.mod || {}).secret;
    if (s && s.openSecret) s.openSecret();
    else toast(FAIL_MSG, 'err');
  } else if (taps >= 3) {
    toast(`${5 - taps} more…`, '', 700);
  }
});


})();
