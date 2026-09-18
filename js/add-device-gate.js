// add-device-gate.js
// Job: keep the "Add Device Into Network" button's disabled attribute in sync
// with the Mesh Network panel's data-status. Does nothing else -- it doesn't
// know how the dongle connects or what happens when the button is pressed.
//
// This one watches an attribute directly with a MutationObserver instead of
// listening for a custom event -- a second valid way for a small file to
// react to state it doesn't own, useful when the file that owns the state
// (dongle-connect.js) shouldn't need to know this button exists at all.

(function () {
  const panel = document.querySelector('.mesh-panel');
  const addBtn = document.querySelector('#add-device-btn');

  function sync() {
    addBtn.disabled = panel.dataset.status !== 'connected';
  }

  new MutationObserver(sync).observe(panel, { attributes: true, attributeFilter: ['data-status'] });
  sync();
})();
