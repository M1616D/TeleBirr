import { screen, nav, action, ico, esc, on, toast, sheet, closeOverlay, fail } from '../ui.js';
import { store, money } from '../store.js';
import { HOME_TILES, ADS } from '../data.js';
import { brandbar, carousel, wireCarousel, notReady } from './common.js';

const hidden = { bal: false, end: true, reward: false };

function tileHTML(t) {
  const inner = t.img
    ? `<img src="${t.img}" alt="">`
    : ico(t.icon, 'ico');
  return `<button class="tile" type="button" data-act="${t.act}" data-key="${t.key}">
    ${t.badge ? `<span class="badge">${esc(t.badge)}</span>` : ''}
    <span class="ti">${inner}</span>
    <span class="tl">${esc(t.label)}</span>
  </button>`;
}

function valueHTML(which) {
  if (which === 'bal') return hidden.bal ? '******' : money(store.profile.balance);
  if (which === 'end') return hidden.end ? '******' : money(store.profile.endekise);
  return hidden.reward ? '******' : money(store.profile.reward);
}

function heroHTML() {
  const p = store.profile;
  return `<div class="home-hero">
    <div class="hero-top">
      <button class="avatar round" type="button" data-act="home.photo" style="width:38px;height:38px;background:${p.photo ? '#eee' : 'var(--gold)'};box-shadow:0 0 0 1.5px rgba(255,255,255,.7)">
        ${p.photo ? `<img src="${esc(p.photo)}" alt="">` : ico('user', 'ico')}
      </button>
      <div class="hi">Selam, ${esc(p.name)}</div>
      <div class="acts">
        <button type="button" data-act="home.search" aria-label="Search">${ico('search', 'ico')}</button>
        <button type="button" data-act="home.notif" aria-label="Notifications">${ico('bell', 'ico')}</button>
        <button type="button" class="lang" data-act="home.lang">${esc((store.prefs.language || 'English').slice(0, 5))} <b>▼</b></button>
      </div>
    </div>
    <div class="balance">
      <div class="lbl">Balance (ETB)
        <button type="button" data-eye="bal" aria-label="Toggle balance">${ico(hidden.bal ? 'eyeOff' : 'eye', 'ico sm')}</button>
      </div>
      <div class="amt" data-val="bal">${valueHTML('bal')}</div>
    </div>
    <div class="sub-bal">
      <div>
        <div class="k">Endekise (ETB)
          <button type="button" data-eye="end" aria-label="Toggle endekise">${ico(hidden.end ? 'eyeOff' : 'eye', 'ico sm')}</button>
        </div>
        <div class="v" data-val="end">${valueHTML('end')}</div>
      </div>
      <div>
        <div class="k">Reward (ETB)
          <button type="button" data-eye="reward" aria-label="Toggle reward">${ico(hidden.reward ? 'eyeOff' : 'eye', 'ico sm')}</button>
        </div>
        <div class="v" data-val="reward">${valueHTML('reward')}</div>
      </div>
    </div>
  </div>`;
}

const POPUP = () => `<div class="promo-scrim" data-act="home.popup.close"></div>
  <div class="promo">
    <div class="promo-card">
      <div class="promo-hero">
        <div class="promo-phone">
          <div class="pbar"><span>2:31</span><span>▮▮</span></div>
          <div class="ptitle">Account <span>▢</span></div>
          <ul>
            <li>Change PIN <b>›</b></li>
            <li>Change Language <b>›</b></li>
            <li>Security Question <i>English</i><b>›</b></li>
            <li>Biometric Authentication <b>›</b></li>
            <li>FAQ <b>›</b></li>
            <li>About <b>›</b></li>
            <li>Share <b>›</b></li>
          </ul>
        </div>
        <div class="promo-pill">${ico('shield', 'ico sm')} Verify/Upgrade with Fayda (NID) <b>›</b></div>
      </div>
      <div class="promo-body">
        <p>If you haven't linked your telebirr account with your Fayda ID,</p>
        <button class="btn blue sm" type="button" data-act="home.fayda">click here to link it now!</button>
      </div>
    </div>
    <button class="promo-x" type="button" data-act="home.popup.close" aria-label="Close">${ico('close', 'ico sm')}</button>
    <label class="promo-chk"><input type="checkbox" id="noPopup"> do not popup again</label>
  </div>`;

screen('home', {
  tab: true,
  view() {
    return `${brandbar()}
      ${heroHTML()}
      <div class="marquee"><span>ONE APP FOR ALL YOUR NEEDS! &nbsp;•&nbsp; ONE APP FOR ALL YOUR NEEDS! &nbsp;•&nbsp; ONE APP FOR ALL YOUR NEEDS!</span></div>
      <div class="body">
        <div class="tiles">${HOME_TILES.map(tileHTML).join('')}</div>
        <div class="home-rest">
          ${carousel(ADS)}
          <button class="btn scanbtn" type="button" data-act="home.scan">${ico('scan', 'ico')} Scan QR</button>
        </div>
      </div>
      ${store.prefs.popupSeen ? '' : POPUP()}`;
  },
  mount(root) {
    wireCarousel(root);
    on(root, 'click', '[data-eye]', (e, el) => {
      const k = el.dataset.eye;
      hidden[k] = !hidden[k];
      el.innerHTML = ico(hidden[k] ? 'eyeOff' : 'eye', 'ico sm');
      const v = root.querySelector(`[data-val="${k}"]`);
      if (v) v.textContent = valueHTML(k);
    });
    const cb = root.querySelector('#noPopup');
    if (cb) cb.addEventListener('change', () => { if (cb.checked) store.setPref('popupSeen', true); });
  }
});

/* --------------------------------------------------------------- actions */
action('home.photo', () => nav.go('setPhoto'));

action('home.search', () => nav.go('search'));

action('home.notif', () => nav.go('notifications'));

action('home.lang', () => nav.go('language'));

action('home.scan', () => notReady('QR scanner'));

action('home.fayda', () => notReady('Fayda'));

action('home.popup.close', () => {
  store.setPref('popupSeen', true);
  const p = document.querySelector('.promo');
  const s = document.querySelector('.promo-scrim');
  if (p) p.remove();
  if (s) s.remove();
});

action('fab.agents', () => notReady('Nearby agents'));

/* ------------------------------------------------------------- home tiles */
action('tile.send', (el) => {
  const t = el.getBoundingClientRect();
  const host = document.getElementById('overlay');
  host.hidden = false;
  host.innerHTML = `<div class="scrim" data-act="overlay.close"></div>
    <div class="popmenu" style="left:${Math.max(8, Math.min(t.left, 150))}px;top:${t.bottom + 6}px">
      <button type="button" data-act="tile.send.individual">${ico('userPlus', 'ico lg')} To Individual</button>
      <button type="button" data-act="tile.send.group">${ico('send', 'ico lg')} To Group</button>
    </div>`;
  const scrim = host.querySelector('.scrim');
  scrim.onclick = () => closeOverlay();
  host.querySelectorAll('.popmenu button').forEach(b => {
    b.addEventListener('click', () => {
      closeOverlay();
      if (b.dataset.act === 'tile.send.individual') nav.go('sendIndividual');
      else notReady('Group transfer');
    });
  });
});

action('tile.airtime', () => nav.go('airtime'));
action('tile.bank', () => nav.go('bankTransfer'));
action('tile.cbe', () => nav.go('financialCbe'));
action('tile.zemen', () => nav.go('zemenLoading'));
action('tile.cash', () => notReady('Cash in / Cash out'));
action('tile.dashen', () => notReady('Financial Service with Dashen'));
action('tile.siinqee', () => notReady('Financial Service with Siinqee'));
