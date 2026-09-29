import { screen, nav, action, ico, esc, toast } from '../ui.js';
import { store, money } from '../store.js';
import { topbar, notReady } from './common.js';

screen('financialCbe', {
  view() {
    const p = store.profile;
    return `${topbar('Financial Service')}
      <div class="body">
        <div class="row" style="padding:16px 14px 8px;gap:12px">
          <img src="assets/brands/cbe-coin.png" alt="" style="width:40px;height:40px;object-fit:contain">
          <div>
            <div class="bold" style="font-size:14.5px">Commercial Bank of Ethiopia</div>
          </div>
        </div>
        <div class="card" style="margin:0 12px;background:linear-gradient(160deg,#93cd46,#7cbb31);color:#fff;padding:14px 16px">
          <div class="between" style="padding:5px 0">
            <span class="small" style="opacity:.95">Max endekase limit</span>
            <span class="bold">****** ${ico('eye', 'ico sm')}</span>
          </div>
          <div class="between" style="padding:5px 0">
            <span class="small" style="opacity:.95">Available endekase limit</span>
            <span class="bold">****** ${ico('eye', 'ico sm')}</span>
          </div>
          <div class="between" style="padding:5px 0">
            <span class="small" style="opacity:.95">Siinq balance</span>
            <span class="bold">******* ${ico('eye', 'ico sm')}</span>
          </div>
        </div>
        <div class="row" style="justify-content:space-around;padding:22px 14px 8px">
          <button type="button" class="roundbtn" data-act="fin.endekas">
            <span class="ring">${ico('percent', 'ico lg')}</span>
            <span>Endekas</span>
          </button>
          <button type="button" class="roundbtn" data-act="fin.siinq">
            <span class="ring">${ico('percent', 'ico lg')}</span>
            <span>Siinq<sup>c</sup></span>
          </button>
        </div>
        <div style="padding:8px 14px">
          <div class="note-box">This credit service is provided to telebirr users to get credit digitally based on credit score considering telebirr transactions and telecom usage.</div>
          <div class="small muted" style="margin-top:10px">Micro Siving</div>
        </div>
        <div style="padding:14px">
          <button class="btn" type="button" data-act="fin.activate">Activate</button>
        </div>
      </div>`;
  }
});

action('fin.activate', () => notReady('Financial Service activation'));
action('fin.endekas', () => notReady('Endekas'));
action('fin.siinq', () => notReady('Siinq'));
