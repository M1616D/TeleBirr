# telebirr SuperApp (UI replica / PWA)

A pixel-focused, installable web replica of the telebirr SuperApp interface, built from the
screen-by-screen screenshots in `ui/`. It runs entirely in the browser, works offline once
installed, and adapts from small phones (320 px) up to desktop.

> **Demo only.** No real money, no network calls, no real accounts. All balances, names and
> transaction numbers are local demo data stored on the device.

---

## Run it

No build step, no dependencies, no module loader. Any static server works:

```bash
python -m http.server 8123
# then open http://127.0.0.1:8123/index.html
```

Opening `index.html` directly from disk also works — the app is plain classic scripts, so
`file://` is fine (only the service worker / installability need HTTP(S)).

## Install on a phone

1. Open the deployed URL in Chrome (Android) or Safari (iOS).
2. Chrome: menu → **Add to Home screen / Install app**. Safari: Share → **Add to Home Screen**.
3. It launches full-screen, standalone, and works offline.

## Deploy to GitHub Pages

```bash
git remote add origin https://github.com/M1616D/TeleBirr.git   # if not set yet
git push -u origin main
```

Then **Settings → Pages → Source: Deploy from a branch → `main` / `root`**.
The app is served from `https://m1616d.github.io/TeleBirr/`.

### Updating without reinstalling

`sw.js` uses network-first for HTML/JS/CSS and `skipWaiting` + `clients.claim`. When you push
new code, the installed app picks it up on the next open (and reloads itself once). The
**About → Check for update** button forces an update check.

---

## Offline screens (all built)

| Area | Screens |
| --- | --- |
| Launch | green splash → spinner → login |
| Login | mobile number → 6-digit PIN → fingerprint verification |
| Home | balance + endekise + reward (each hideable, masked by default), marquee, 8 quick tiles, ad carousel, Transaction Details, 8 more tiles, Scan QR, first-login Fayda popup |
| Send Money | To Individual / To Group menu, mobile entry with recents, amount keypad, PIN, confirmation sheet, receipt |
| Airtime/Package | Self/Other, phone entry, Airtime denominations or Package list with search, confirmation, receipt |
| Transfer to Bank | bank chooser (36 banks + search), account number, amount, receipt, recents |
| Zemen GEBEYA | branded loading screen → Pay for Merchant / Apply Voucher form |
| Financial Service | CBE endekase / Siinq balance card, Endekas + Siinq tiles, Activate |
| Payment | 14 expandable categories and their provider grids |
| Apps | 83 app tiles |
| Engage | welcome screen → Connect (QR / Scan / Mobile Contact) |
| Account | profile, Fayda, Change PIN, Language, Security Question, Biometric toggles, FAQ, Feedback, Contact Us, About, Share, My Coupon, Bill Share History, Verify Payment |
| Notifications, Search, Set Photo | included |
| Receipt | success receipt (Amharic labels, QR, ad carousel, ለመዝጋት) + printable transaction document |

## Buttons with no screen uploaded

`Cash In/Out`, `Financial Service with Dashen`, `Financial Service with Siinqee`, QR scanner,
phone contacts, coupon tabs, app tiles and other surfaces that have no screenshots (or need a
real camera / server) never freeze. They raise a toast:

> Something went wrong. Please try again later.

The same guard applies globally: any `data-act` without a registered handler shows that toast
instead of failing silently.

## Updating the app without reinstalling

Nothing to reinstall. Push to `main`; the service worker refreshes the shell on the next open.

---

## Private settings (hidden panel)

Default access code: **`1234`** (changeable inside the panel — `App` tab).

**How to open it:** Account → **About** → tap the version number (`V1.2.3`) **5 times quickly**.

What you can change:

- **Account** — account holder name, phone number, balance, endekise, reward, account level, and
  the profile picture (upload / remove). These drive the Home header, the Account card and every
  receipt.
- **Receivers** — add, edit and delete saved receivers (name + phone number). Saved receivers
  appear under **Send Money → Recent**, and the **name saved here is the name printed on the
  generated receipt** (`ግብይት ወደ:`).
- **App** — login/payment PIN, private-settings PIN, default language, re-show the Fayda popup,
  clear transaction history, reset everything.

### Notes on the printable document

`Receipt → Download → Download PDF` produces a transaction summary through the browser's print
dialog (choose *Save as PDF*). It is clearly marked **DEMO DOCUMENT — NOT A VALID PAYMENT
RECEIPT**; it is not a telebirr / ethio telecom document and has no official letterhead,
stamp or seal.

---

## How the replica stays size-accurate

Every measurement in `css/app.css` was taken from the supplied screenshots (which are a
360 CSS px wide phone) and is expressed as a multiple of one design unit:

```css
--u: <min(viewport, 430px) / 360>   /* set by js/ui.js, refreshed on resize */
width: calc(90px * var(--u));       /* 90 px on a 360 px screen, scaled elsewhere */
```

So the brand bar (36 px), hero (197 px), tile grid (74 px cards, 11 px gaps), banner (302×92),
Scan QR (276×30), tab bar (52 px) and the floating pin button (45 px) keep their exact
proportions from a 320 px phone up to the 430 px desktop frame.

## Project layout

```
index.html                 app shell, splash, tab bar, overlays
manifest.webmanifest       installable PWA metadata
sw.js                      service worker (auto-update + offline)
css/app.css                all styling, phone-first and fluid
js/app.js                  boot, splash, tab bar, history, service worker wiring
js/ui.js                   icons, design unit, router, toasts, sheets, keypads, QR painting
js/store.js                localStorage state (profile, prefs, receivers, history)
js/data.js                 payment catalogue, apps, banks, packages, FAQ
js/screens/*.js            one classic script per area
assets/brands              logos supplied in ui/logos (+ tile icons cropped from screenshots)
assets/ads                 banner images supplied in ui/ads
assets/ui                  splash + balance-header backgrounds derived from the screenshots
assets/icons               app icon
ui/                        the original screenshots this replica was built from (not committed)
```

## Tests performed

- Full login → home → send money → PIN → confirmation → receipt chain.
- Saved receiver added in the private panel appears in Recents and on the receipt.
- Bank chooser → account number → amount → receipt.
- Airtime and merchant flows, Payment accordions, Apps/Engage tabs, Account sub-pages.
- Layout verified at 320 px, 390 px and 1280 px wide; console free of errors.
