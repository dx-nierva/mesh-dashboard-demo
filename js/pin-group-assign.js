// pin-group-assign.js
// Job: when the user changes a pin's own "assign to group" <select>, write
// that choice onto the pin's data-group attribute. Does not decide
// highlighting (group-select.js reads data-group for that) and does not
// touch the <select>'s available options (group-options-sync.js owns those).

(function () {
  document.querySelector('#pins-layer').addEventListener('change', (e) => {
    if (!e.target.matches('.pin-group-select')) return;
    const pin = e.target.closest('.pin');
    pin.dataset.group = e.target.value;
    document.dispatchEvent(new CustomEvent('app:changed', { detail: { reason: 'pin-group-assigned' } }));
  });
})();
