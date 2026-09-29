/* js/data.js - classic script (no module loader / works offline from file://). */
(function () {
  'use strict';
  var TB = window.TB || (window.TB = {});
  var NS = TB.data || (TB.data = {});

/* Static content: menus, catalogues and lists that mirror the real app. */

const B = 'assets/brands/';
const A = 'assets/ads/';

const ADS = [
  { img: A + 'teleplay.jpg', label: 'TelePlay' },
  { img: A + 'zemen.jpg', label: 'Zemen GEBEYA' },
  { img: A + 'dstv.jpg', label: 'DSTv' }
];

const HOME_TILES = [
  { key: 'send', label: 'Send Money', icon: 'send', act: 'tile.send' },
  { key: 'cash', label: 'Cash In/ Out', icon: 'cash', act: 'tile.cash' },
  { key: 'airtime', label: 'Airtime/ Buy Package', icon: 'airtime', act: 'tile.airtime', badge: 'Up to 35%' },
  { key: 'zemen', label: 'Zemen GEBEYA', img: B + 'zemen-gebeya.png', act: 'tile.zemen' },
  { key: 'dashen', label: 'Financial Service With Dashen', img: B + 'dashen.jpg', act: 'tile.dashen' },
  { key: 'cbe', label: 'Financial Service With CBE', img: B + 'cbe-coin.png', act: 'tile.cbe' },
  { key: 'siinqee', label: 'Financial Service with Siinqee', img: B + 'siinqee-text.png', act: 'tile.siinqee' },
  { key: 'bank', label: 'Transfer to Bank', icon: 'bank', act: 'tile.bank' }
];

/* second tile group, shown under "Transaction Details" (right from the design) */
const HOME_TILES2 = [
  { key: 'awash', label: 'Financial Service with Awash', img: B + 'awash.png', act: 'tile.awash' },
  { key: 'merchant', label: 'Pay for Merchant', icon: 'store', act: 'tile.merchant' },
  { key: 'teleev', label: 'teleEV Charging', img: B + 'tile-teleev.png', act: 'tile.teleev' },
  { key: 'tolo', label: 'TOLO Payment', img: B + 'tile-tolo.png', act: 'tile.tolo' },
  { key: 'aatraffic', label: 'AA Traffic Penalty Payment', img: B + 'aatma.png', act: 'tile.aatraffic' },
  { key: 'aatma', label: 'AATMA Parking Payment', img: B + 'aatma.png', act: 'tile.aatma' },
  { key: 'teledevice', label: 'tele Device Financing', img: B + 'tile-tele-device.png', act: 'tile.teledevice' },
  { key: 'more', label: 'More', icon: 'circlePlus', act: 'tile.more' }
];

/* ------------------------------------------------------------- payment page */
const PAYMENT = [
  { key: 'utility', title: 'Utility', items: [
    { name: 'Pay Ethio telecom Bill', img: 'ethio-telecom-name.png' },
    { name: 'Electric utility', img: 'eeu.png' },
    { name: 'Addis Ababa Wa. water utility', img: 'aawsa.png' },
    { name: 'Water utility by Besha', img: 'binget.jpg' },
    { name: 'Water utility by Unicash', img: 'starpay.png' },
    { name: 'Ethioppian Electric util.', img: 'eeu.png' },
    { name: 'W M GENERAL T', img: 'mpasa.png' },
    { name: 'Water utility by pakoa', img: 'yagoutpay.png' },
    { name: 'Water utility by Websprix', img: 'websprix.png' }
  ] },
  { key: 'tax', title: 'Tax and Government Service', items: [
    { name: 'Ethiopian Customs', img: 'fcsc.png' },
    { name: 'Government Pay- ment Pay-', img: 'mor.png' },
    { name: 'Third Party Insurance', img: 'awash.png' },
    { name: 'Tax Payment', img: 'addis-revenue.png' },
    { name: 'Building Permit', img: 'addis-land.png' },
    { name: 'E-Land By Derash', img: 'ebirr.png' },
    { name: 'Somali Regional S...', img: 'somali-revenue.png' },
    { name: 'Ministry of Trade', img: 'motri.png' },
    { name: 'Amhara National R...', img: 'amhara.png' },
    { name: 'Benishangul-Gumuz ...', img: 'diredewa.png' },
    { name: 'Immigration and Citi...', img: 'dars.png' }
  ] },
  { key: 'mesob', title: 'MESOB One-stop Service Center', items: [
    { name: 'FIRE MESOB SERVICE', icon: 'shield' }
  ] },
  { key: 'transport', title: 'Transport Service', items: [
    { name: 'Transport Payment by Ethio...', img: 'ethio-travel.png' },
    { name: 'Oromia transport...', icon: 'car' },
    { name: 'AATMA Parking Pa...', img: 'aatma.png' },
    { name: 'AA Drivers Vehicles Li...', icon: 'car' }
  ] },
  { key: 'entertainment', title: 'Entertainment Service', items: [
    { name: 'DSTV', img: 'dstv.png' },
    { name: 'TeleTV', icon: 'grid' },
    { name: 'TeleWin', icon: 'gift' }
  ] },
  { key: 'ecommerce', title: 'E-commerce', items: [
    { name: 'Zimall', icon: 'box' },
    { name: 'Agegih', icon: 'box' },
    { name: 'Powered by WeBirr', img: 'webirr.png' }
  ] },
  { key: 'event', title: 'Event and Ticketing', items: [
    { name: 'Unity Park', img: 'vite.png' },
    { name: 'Adwa Victory Mu...', img: 'ethio-travel.png' },
    { name: 'Friendship Square PH●', img: 'ethio-travel.png' },
    { name: 'AAEIS Museum', img: 'booking.png' },
    { name: 'Abacab Lig...', img: 'seregela.png' },
    { name: 'Addis MUSEUM', icon: 'grid' },
    { name: 'FALACE', icon: 'grid' },
    { name: 'Buna supporters', img: 'buna.png' },
    { name: 'Hawire hwot bed...', img: 'zagol.png' },
    { name: 'Erecha festival 202...', icon: 'calendar' },
    { name: 'Irecha Great Con...', icon: 'calendar' },
    { name: 'Ethiopian National T...', icon: 'coupon' },
    { name: 'Admas lottery', img: 'starpay.png' },
    { name: 'Kuriftu Waterparks', img: 'booking.png' }
  ] },
  { key: 'education', title: 'Education fee', items: [
    { name: 'Powered by WeBirr', img: 'webirr.png' },
    { name: 'Educational Assessment...', img: 'zagol.png' },
    { name: 'E-School P...', img: 'vite.png' },
    { name: 'Awash School', img: 'awash.png' },
    { name: 'Gibson Schools', img: 'booking.png' },
    { name: 'Berhan SchoolPay', img: 'berhan.jpg' },
    { name: 'Ethiopian Aviation U...', img: 'ethiopian.png' },
    { name: 'Addis Ababa univ...', img: 'addis.png' },
    { name: 'telebirr school pay...', img: 'telebirr.png' },
    { name: 'Rosyenergy', img: 'chapa.png' },
    { name: 'Education Management...', img: 'kaafi.png' },
    { name: 'AA City Admin lab...', img: 'addis.png' },
    { name: 'Jimma University', img: 'booking.png' },
    { name: 'Adey Fee', img: 'yaya.png' }
  ] },
  { key: 'fundraising', title: 'Fundraising', items: [
    { name: 'Werdem Kolid Foun... Charity As...', img: 'seregela.png' },
    { name: 'Mekedonia', img: 'emyc.png' },
    { name: 'Addisun Ament Behe...', icon: 'gift' },
    { name: 'Yeaddis Kelan Koh...', icon: 'gift' },
    { name: 'EXCELENT YOUTH PER...', icon: 'gift' }
  ] },
  { key: 'traffic', title: 'Traffic Penalty', items: [
    { name: 'Oromia Transport... Penalty Pa...', icon: 'doc' },
    { name: 'AA Traffic Penalty Pa...', img: 'aatma.png' },
    { name: 'Adama Traffic Poll...', icon: 'doc' },
    { name: 'National Traffic Pen...', img: 'era.png' }
  ] },
  { key: 'insurance', title: 'Insurance', items: [
    { name: 'Third Party Insurance', img: 'awash.png' },
    { name: 'Awash Insurance...', img: 'awash.png' }
  ] },
  { key: 'nongov', title: 'Non Government Service', items: [
    { name: 'Boost Software D...', icon: 'grid' },
    { name: 'Menlo eship Pay- Communi...', img: 'mpasa.png' },
    { name: 'Link Net Communi...', img: 'birrlink.png' }
  ] },
  { key: 'agri', title: 'Agriculture & Livestock', items: [
    { name: 'Agricultural inputs sup...', icon: 'gift' }
  ] },
  { key: 'health', title: 'Medical and Health Services', items: [
    { name: 'Non Gover nment Me...', img: 'emyc.png' }
  ] }
];

/* ------------------------------------------------------------------ apps page */
const APPS = [
  { name: 'My EthioNet', img: 'ethio-telecom.png' },
  { name: 'telebirrremit', img: 'telebirr.png' },
  { name: 'tele-online fixed service', img: 'telebirr.png' },
  { name: 'Ethiopian Airlines', img: 'ethiopian.png' },
  { name: 'EthioDigital ID', img: 'fcsc.png' },
  { name: 'Ethiopian Shipping and logistics', img: 'ethio-travel.png' },
  { name: 'Terminate', icon: 'grid' },
  { name: 'NID (fayda) printing', img: 'fcsc.png' },
  { name: 'MYDSTv', img: 'dstv.png' },
  { name: 'HOWLOW', img: 'vite.png' },
  { name: 'NID (fayda) Digital ID', img: 'fcsc.png' },
  { name: 'E-Services', icon: 'grid' },
  { name: 'Mechlin Link', img: 'kaafi.png' },
  { name: 'STOTA', icon: 'grid' },
  { name: 'Public Transport', icon: 'car' },
  { name: 'Hulu beye', img: 'binget.jpg' },
  { name: 'RIDE', img: 'guzogo.png' },
  { name: 'Zimall', icon: 'box' },
  { name: 'WebSpinx', img: 'websprix.png' },
  { name: 'Digital Equb', img: 'digital-equb.png' },
  { name: 'ACT American', icon: 'globe' },
  { name: 'EDIR Ticket Booking', img: 'ebirr.png' },
  { name: 'Qetero', icon: 'gift' },
  { name: 'Ashawa', img: 'yaya.png' },
  { name: 'Afrosheed', icon: 'userO' },
  { name: 'telefive', img: 'telebirr.png' },
  { name: 'Guzo Go', img: 'guzogo.png' },
  { name: 'SHOFER', icon: 'car' },
  { name: 'Zemen GEBEYA Dispatcher', img: 'zemen-gebeya.png' },
  { name: 'Awa Store', img: 'binget.jpg' },
  { name: 'Kuroztech', img: 'vite.png' },
  { name: 'eQUB', icon: 'grid' },
  { name: 'Choose Number', icon: 'sim' },
  { name: 'Ebana Pay', img: 'chapa.png' },
  { name: 'ACT Academy', img: 'kaafi.png' },
  { name: 'Safa Transport', icon: 'car' },
  { name: 'AddisGebeya', img: 'seregela.png' },
  { name: 'SEWASEW Payment', img: 'emyc.png' },
  { name: 'Harambee', img: 'binget.jpg' },    { name: 'Addis sport fields booking', img: 'booking.png' },
  { name: 'Finistone Homes', img: 'fhc.png' },
  { name: 'Feran Gift', img: 'yagoutpay.png' },
  { name: 'teleBirr', img: 'telebirr.png' },
  { name: 'MoveIt', img: 'guzogo.png' },
  { name: 'Muyaology', icon: 'globe' },
  { name: 'Virtual Equb', img: 'digital-equb.png' },
  { name: 'Online Employment', img: 'zagol.png' },
  { name: 'Mekina', img: 'moenco.png' },
  { name: 'HUWAA', img: 'santim.png' },
  { name: 'Marl Spare Parts', img: 'moenco.png' },
  { name: 'Seregela', img: 'seregela.png' },
  { name: 'Awud', img: 'chapa.png' },    { name: 'Suqe Store', img: 'chapa.png' },
  { name: 'Gazette Plus', img: 'zagol.png' },
  { name: 'Hello Beg', img: 'binget.jpg' },
  { name: 'Shaggar City Transport Office', icon: 'car' },
  { name: 'School Payment', img: 'webirr.png' },
  { name: 'ABC CAR RENTAL', icon: 'car' },
  { name: 'Tefetef', img: 'seregela.png' },
  { name: 'EtoyPlus', img: 'booking.png' },
  { name: 'Get Rest', img: 'booking.png' },
  { name: 'CommercePal', img: 'chapa.png' },
  { name: 'eLearning Platform', img: 'vite.png' },
  { name: 'Zimall', icon: 'box' },
  { name: 'teleforum', img: 'telebirr.png' },
  { name: 'Cheche', img: 'websprix.png' },
  { name: 'Kangetelegna', img: 'telebirr.png' },
  { name: 'telebirr Charging', img: 'telebirr.png' },
  { name: 'Ethio Telecom e-Count', img: 'ethio-telecom.png' },    { name: 'Digital Kircha', img: 'zemen-bank.jpg' },
  { name: 'Merged', img: 'chapa.png' },
  { name: 'Football Club Membership', img: 'kaafi.png' },
  { name: 'TESBINN', icon: 'grid' },
  { name: 'AYRAB', icon: 'grid' },
  { name: 'DERASH EQUB', img: 'digital-equb.png' },
  { name: 'Sinet Anbessa Bank', img: 'abyssinia.png' },
  { name: 'Hibret Magazine', img: 'nib.png' },
  { name: 'Anbessa...', img: 'ahadu.png' },    { name: 'Chase County B... us Tickets', icon: 'coupon' },
  { name: 'Be-Piwo Properties', img: 'booking.png' },
  { name: 'BS Transit', icon: 'car' },
  { name: 'Virtual Post', img: 'ethio-telecom.png' },
  { name: 'EY DMC Roha Power', img: 'vite.png' }
];

/* -------------------------------------------------------------------- banks */
const BANKS = [
  { name: 'Abay Bank', img: 'abay.png' },
  { name: 'Amhara Bank', img: 'amhara.png' },
  { name: 'Abyssinia Bank', img: 'abyssinia.png' },
  { name: 'Addis Bank S.C.', img: 'addis.png' },
  { name: 'Awash Bank', img: 'awash.png' },
  { name: 'Ahadu Bank', img: 'ahadu.png' },
  { name: 'Berhan Bank', img: 'berhan.jpg' },
  { name: 'Buna Bank', img: 'buna.png' },
  { name: 'Commercial Bank of Ethiopia', img: 'cbe-coin.png' },
  { name: 'Cooperative Bank of Oromia', icon: 'bank' },
  { name: 'Dashen Bank', img: 'dashen.jpg' },
  { name: 'Enat Bank', icon: 'bank' },
  { name: 'Gadfa Bank', icon: 'bank' },
  { name: 'Goh Betoch Bank', icon: 'bank' },
  { name: 'Global Bank Ethiopia', icon: 'bank' },
  { name: 'Hibret Bank', icon: 'bank' },
  { name: 'Hijra Bank', icon: 'bank' },
  { name: 'Lion International Bank', icon: 'bank' },
  { name: 'Nib International Bank', img: 'nib.png' },
  { name: 'Oromia Bank', icon: 'bank' },
  { name: 'Ramnis Bank', icon: 'bank' },
  { name: 'Sidama Bank', icon: 'bank' },
  { name: 'Siinqee Bank', img: 'siinqee-text.png' },
  { name: 'Siket Bank', icon: 'bank' },
  { name: 'Tsehay Bank', img: 'tsehay.png' },
  { name: 'Tsedey Bank', icon: 'bank' },
  { name: 'Wegagen Bank', icon: 'bank' },
  { name: 'Zemen Bank', img: 'zemen-bank.jpg' },
  { name: 'ZamZam Bank', img: 'binget.jpg' },
  { name: 'Omo Bank', img: 'binget.jpg' },
  { name: 'Shabelle Bank', icon: 'bank' },
  { name: 'VisionFund Microfinance', img: 'visionfund.png' },
  { name: 'Nisir Microfinance', img: 'kaafi.png' },
  { name: 'Ketemihill Microfinance S.C.', icon: 'bank' },
  { name: 'KAAFI Microfinance', img: 'kaafi.png' },
  { name: 'RAYS Microfinance', img: 'rays.png' }
];

/* ----------------------------------------------------------------- packages */
const AIRTIME = [5, 10, 15, 25, 50, 100, 250, 500, 1000];

const PACKAGES = [
  { name: 'Daily Holiday', desc: 'Daily Holiday 79Min and 23SMS', price: 13 },
  { name: 'Daily Holiday', desc: 'Daily Holiday 4Min,50MB and 23 SMS', price: 26 },
  { name: 'Daily Holiday', desc: 'Daily Holiday 372MB and 23 SMS', price: 13 },
  { name: 'Weekly Holiday', desc: 'Weekly Holiday 210Min and 23 SMS', price: 36 },
  { name: 'Weekly Holiday', desc: 'Weekly Holiday 1020MB and 23 SMS', price: 48 },
  { name: 'Weekly Holiday', desc: 'Weekly Holiday 5Min, 1.2GB and 23 SMS', price: 75 },
  { name: 'Weekly Holiday', desc: 'Weekly Holiday 24.3MB and 23 SMS', price: 88 },
  { name: 'Be-Kirmit Enchilalen Package', desc: 'Monthly Telegram 12GB', price: 99 },
  { name: 'Meskel / Gaze Meskala / Mashkaro B...', desc: 'Gafir Wore Package', price: 13 },
  { name: 'Meskel / Gaze Meskala / Mashkaro B...', desc: 'Daily Holiday 372MB and 23 SMS', price: 13 },
  { name: 'Be-Kirmit Enchilalen Package', desc: 'Meskel / Gaze Me... P', price: 99 }
];

/* ---------------------------------------------------------------------- FAQ */
const FAQ = [
  { q: 'What is telebirr service?', a: 'telebirr is a mobile money service that lets you send and receive money, pay bills, buy airtime and packages and shop, all from your phone.' },
  { q: 'What makes telebirr different from Airtime top-up', a: 'Airtime top-up only adds call credit to your SIM. telebirr is a full mobile wallet: you can store money, transfer it to any person or bank, and pay merchants.' },
  { q: 'What can I do with telebirr?', a: 'Send and receive money, cash in and cash out, buy airtime and packages, transfer to banks, pay utility and government bills, pay merchants with QR and shop online.' },
  { q: 'Who is eligible to use telebirr service?', a: 'Any Ethio telecom subscriber with a valid ID can register and use telebirr.' },
  { q: 'How do I sign up/register for telebirr service?', a: 'Open the app, choose Create New Account, enter your mobile number and follow the verification steps using your ID.' },
  { q: 'Do I need to pay while registering for telebirr service?', a: 'No. Registration is free of charge.' },
  { q: 'Can I have multiple telebirr accounts?', a: 'No. One telebirr wallet is allowed per person and per mobile number.' },
  { q: 'What are the options to deposit or withdraw cash using my telebirr?', a: 'You can deposit and withdraw cash through any telebirr agent, or transfer between your wallet and a linked bank account.' },
  { q: 'Do I get Informed when my telebirr account gets credited or debited?', a: 'Yes. Every credit and debit generates an SMS confirmation and an in-app notification with a transaction number.' },
  { q: 'Who are telebirr agents?', a: 'telebirr agents are authorised individuals and businesses that help you deposit and withdraw cash from your wallet.' },
  { q: 'How do I find the authorized telebirr agents?', a: 'From the Home screen open the location button, or select cash in/out to see nearby agents on the map.' }
];

/* ------------------------------------------------------------------ misc */
const LANGS = ['English', 'አማርኛ', 'Afaan Oromoo', 'አረብኛ', 'Al Somali'];

const NOTIF = [
  { name: 'System Information', color: '#3d8fd6', icon: 'info' },
  { name: 'Transaction Message', color: '#43a047', icon: 'doc' },
  { name: 'Promotion News', color: '#e9a13b', icon: 'percent' },
  { name: 'E-commerce Message', color: '#5cb85c', icon: 'box' },
  { name: 'Driver Message', color: '#1fae9c', icon: 'car' }
];

const COUPON_TABS = ['Available (0)', 'Used', 'Expired', 'All', 'Expires Soon', 'Platform Coupons', 'More'];

const COLORS = ['#f0b323', '#43a047', '#e57373', '#1e88e5', '#8e24aa', '#00897b', '#f4511e', '#5e35b1'];


  Object.assign(NS, { ADS, HOME_TILES, HOME_TILES2, PAYMENT, APPS, BANKS, AIRTIME, PACKAGES, FAQ, LANGS, NOTIF, COUPON_TABS, COLORS });
})();
