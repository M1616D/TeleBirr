import { screen, nav, ico, esc, on, toast, dialog, closeOverlay, pinpadHTML, pinDotsHTML, wirePin } from '../ui.js';
import { store, maskPhone, normPhone } from '../store.js';
import { brandbar, busy } from './common.js';

/* ------------------------------------------------------------------- login */
function loginHTML() {
  const phone = normPhone(store.profile.phone);
  return `<div class="login">
    <div class="lang">English <b>▼</b></div>
    <div class="mid">
      <div class="welcome">Welcome to telebirr SuperApp!</div>
      <div class="allinone">All-in-One</div>
      <div class="bigtitle">Login</div>
      <div class="uline"></div>
      <div class="lbl">Mobile Number</div>
      <div class="mob">
        <span class="pre">+251</span>
        <input id="loginPhone" type="tel" inputmode="numeric" autocomplete="tel" placeholder="Enter Mobile Number" value="${esc(phone)}" maxlength="10">
      </div>
      <button class="btn next" type="button" data-act="login.next">Next</button>
      <div class="foot">
        <div class="create">Don't have an account? <b data-act="auth.soon">Create New Account</b></div>
        <div class="links">
          <span data-act="auth.soon">teleHub</span>
          <span data-act="auth.soon">Help</span>
        </div>
        <div class="terms" data-act="auth.soon">Terms and Conditions</div>
        <div class="copy">@2026 Ethio telecom.All rights reserved 1.2.9 version</div>
      </div>
    </div>
  </div>`;
}

screen('login', {
  view() {
    return `${brandbar()}<div class="body" style="padding:0;display:flex;flex-direction:column">${loginHTML()}</div>`;
  },
  mount(root) {
    const input = root.querySelector('#loginPhone');
    const len = input.value.length;
    input.focus({ preventScroll: true });
    try { input.setSelectionRange(len, len); } catch (e) {}
    input.addEventListener('keydown', e => { if (e.key === 'Enter') root.querySelector('[data-act="login.next"]').click(); });
  }
});

/* --------------------------------------------------------------- PIN entry */
screen('loginPin', {
  view() {
    return `<div class="pinpage">
      <div class="top">
        <button class="back" type="button" data-act="login.back" aria-label="Close">${ico('back', 'ico')}</button>
        <span class="grow"></span>
      </div>
      <div class="mid">
        <div class="title">Enter PIN</div>
        ${pinDotsHTML(6, 0)}
        <div class="forgot" data-act="auth.soon">Forgot PIN</div>
      </div>
      ${pinpadHTML()}
    </div>`;
  },
  mount(root) {
    const pad = wirePin(root, 6, () => {
      busy(true);
      setTimeout(() => { busy(false); nav.reset('fingerprint', {}, { tab: true }); }, 650);
    });
  }
});

/* ----------------------------------------------------------- fingerprint */
screen('fingerprint', {
  view() {
    return `<div class="fp-hero">
      <button class="back" type="button" data-act="nav.back" aria-label="Back" style="position:absolute;left:8px;top:calc(10px + var(--safe-t))">${ico('back', 'ico')}</button>
      <div class="av">${ico('user', 'ico lg')}</div>
      <div class="ph">${esc(maskPhone(store.profile.phone))}</div>
    </div>
    <div class="fp-body">
      <div class="fp-ring" data-act="fp.login">${ico('finger', 'ico lg')}</div>
      <div class="fp-label">Login With Fingerprint</div>
    </div>
    <div class="fp-alt" data-act="fp.other">Log in with another option ${ico('chevR', 'ico sm')}</div>`;
  },
  mount(root) {
    if (!store.prefs.fpLogin) { finish(); return; }
    setTimeout(() => {
      dialog({
        title: 'Please verify your fingerprint',
        html: '<b>telebirr</b><br>Scan your fingerprint.',
        okText: 'Continue',
        cancelText: 'Cancel',
        onOk: finish
      });
    }, 250);
    setTimeout(() => { closeOverlay(); finish(); }, 2600);
    let done = false;
    function finish() {
      if (done) return;
      done = true;
      nav.reset('home', {}, { tab: true });
    }
  }
});

let fpDone = false;

/* ------------------------------------------------------------------ actions */
import { action } from '../ui.js';

action('login.next', () => {
  const input = document.querySelector('#loginPhone');
  const v = normPhone(input ? input.value : '');
  if (v.length < 9) { toast('Please enter a valid mobile number'); return; }
  store.setProfile({ phone: v });
  store.setPref('logged', true);
  nav.go('loginPin', {}, { tab: true });
});

action('login.back', () => nav.reset('login', {}, { tab: true }));

action('fp.login', () => {
  toast('Fingerprint verified', 'ok');
  setTimeout(() => nav.reset('home', {}, { tab: true }), 420);
});

action('fp.other', () => nav.reset('login', {}, { tab: true }));

action('auth.soon', () => toast('Something went wrong. Please try again later.', 'err'));
