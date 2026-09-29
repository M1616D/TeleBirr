/* js/screens/receipt.js - classic script (no module loader / works offline from file://). */
(function () {
  'use strict';
  var TB = window.TB || (window.TB = {});
  var NS = TB.mod || (TB.mod = {});
  NS = NS.receipt || (NS.receipt = {});
  var { screen, nav, action, ico, esc, toast } = TB.ui;
  var { receiptHTML, receiptDocHTML, printDoc, shareTxn, topbar } = TB.common;
  var { store } = TB.store;


let current = null;

screen('receipt', {
  view({ txn }) {
    current = txn;
    if (!txn) return topbar('Receipt') + '<div class="body center" style="padding:40px">No transaction found.</div>';
    return receiptHTML(txn);
  }
});

screen('receiptDoc', {
  view({ txn }) {
    current = txn || current;
    if (!current) return topbar('Receipt') + '<div class="body center" style="padding:40px">No transaction found.</div>';
    return `${topbar('Transaction details')}
      <div class="body">
        ${receiptDocHTML(current)}
        <div style="padding:14px">
          <button class="btn blue" type="button" data-act="doc.print">Download PDF</button>
        </div>
      </div>`;
  }
});

action('receipt.download', () => {
  if (!current) { toast('Something went wrong. Please try again later.', 'err'); return; }
  nav.go('receiptDoc', { txn: current });
});

action('doc.print', () => {
  if (!current) { toast('Something went wrong. Please try again later.', 'err'); return; }
  printDoc(current);
});

action('receipt.share', () => {
  if (!current) { toast('Something went wrong. Please try again later.', 'err'); return; }
  shareTxn(current);
});

action('receipt.close', () => {
  nav.tab('home');
});


})();
