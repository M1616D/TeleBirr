/* State store: everything the app remembers lives here (localStorage). */

const KEY = 'telebirr.state.v1';

const DEFAULTS = {
  profile: {
    name: 'Bereket',
    phone: '902468625',
    balance: 8.51,
    endekise: 0,
    reward: 0.0,
    level: 3,
    photo: ''            // data-url set from the private settings panel
  },
  prefs: {
    language: 'English',
    popupSeen: false,
    fpLogin: true,
    fpPay: true,
    pin: '1234',          // app / login PIN
    secretPin: '1234',    // gate for the private settings panel
    agentLimitMax: 5000
  },
  receivers: [
    { id: 'r1', name: 'WENDIMAGEGNHU', phone: '251937671388' },
    { id: 'r2', name: 'Bereket', phone: '251902468625' },
    { id: 'r3', name: 'getu', phone: '251911223344' },
    { id: 'r4', name: 'MULUKEN', phone: '251922334455' },
    { id: 'r5', name: 'Mamuye', phone: '251933445566' }
  ],
  recentBanks: [
    { id: 'b1', holder: 'Mr Millon Adugna Kitabu', bank: 'Commercial Bank of Ethiopia', account: '10006815632' },
    { id: 'b2', holder: 'Mr Bereket Manuye Beyene', bank: 'Commercial Bank of Ethiopia', account: '10004075324' }
  ],
  history: []   // finished transactions (newest first)
};

function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return deepClone(DEFAULTS);
    const parsed = JSON.parse(raw);
    const base = deepClone(DEFAULTS);
    return {
      profile: Object.assign(base.profile, parsed.profile || {}),
      prefs: Object.assign(base.prefs, parsed.prefs || {}),
      receivers: Array.isArray(parsed.receivers) ? parsed.receivers : base.receivers,
      recentBanks: Array.isArray(parsed.recentBanks) ? parsed.recentBanks : base.recentBanks,
      history: Array.isArray(parsed.history) ? parsed.history : []
    };
  } catch (e) {
    return deepClone(DEFAULTS);
  }
}

let state = load();
const listeners = new Set();

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* quota - ignore */ }
}

export const store = {
  get profile() { return state.profile; },
  get prefs() { return state.prefs; },
  get receivers() { return state.receivers; },
  get recentBanks() { return state.recentBanks; },
  get history() { return state.history; },

  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  emit() { persist(); listeners.forEach(fn => { try { fn(); } catch (e) {} }); },
  save() { this.emit(); },

  setProfile(patch) { Object.assign(state.profile, patch); this.emit(); },
  setPref(key, value) { state.prefs[key] = value; this.emit(); },

  addReceiver(name, phone) {
    const clean = String(phone || '').replace(/\D/g, '');
    const id = 'r' + Date.now().toString(36);
    state.receivers.unshift({ id, name: name || 'Unknown', phone: clean });
    this.emit();
    return id;
  },
  updateReceiver(id, patch) {
    const r = state.receivers.find(x => x.id === id);
    if (!r) return false;
    Object.assign(r, patch);
    if (patch.phone) r.phone = String(patch.phone).replace(/\D/g, '');
    this.emit();
    return true;
  },
  deleteReceiver(id) {
    const i = state.receivers.findIndex(x => x.id === id);
    if (i < 0) return false;
    state.receivers.splice(i, 1);
    this.emit();
    return true;
  },
  clearReceivers() { state.receivers = []; this.emit(); },

  findReceiver(phone) {
    const p = normPhone(phone);
    if (!p) return null;
    return state.receivers.find(r => normPhone(r.phone) === p ||
      normPhone(r.phone).slice(-9) === p.slice(-9)) || null;
  },

  addTxn(txn) {
    state.history.unshift(Object.assign({ id: 'T' + Date.now().toString(36), ts: Date.now() }, txn));
    if (state.history.length > 100) state.history.length = 100;
    this.emit();
    return state.history[0];
  },
  findTxn(code) {
    const c = String(code || '').trim().toUpperCase();
    return state.history.find(t => t.ref === c) || null;
  },

  clearHistory() { state.history = []; this.emit(); },

  resetAll() { state = deepClone(DEFAULTS); this.emit(); },
  DEFAULTS
};

export function normPhone(p) {
  return String(p || '').replace(/\D/g, '').replace(/^251/, '').replace(/^0/, '');
}

export function maskPhone(p) {
  const n = normPhone(p);
  if (n.length < 4) return '+251';
  return '+251****' + n.slice(-2);
}

export function money(n) {
  const v = Number(n || 0);
  return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function maskAmount(hidden) {
  return hidden ? '******' : money(store.profile.balance);
}

export function refCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  let s = 'DIL';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export function stamp(d = new Date()) {
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
