// pin-lifecycle.js
// Job: create a device pin when the canvas's empty area is clicked while a
// device type is armed, and destroy a pin when its own remove button is
// clicked. Does NOT decide pin color, does NOT decide what's selected or
// highlighted, and does NOT touch the palette's own highlight state --
// CSS handles all of that from data-type / data-selected / :checked.

(function () {
  let nextId = 1;

  const canvas = document.querySelector('#floorplan-canvas');
  const catcher = document.querySelector('.mode-catcher');
  const pinsLayer = document.querySelector('#pins-layer');

  catcher.addEventListener('click', (e) => {
    if (canvas.dataset.linking === 'true') return; // Linking Mode owns clicks then

    const armed = document.querySelector('input[name="place-mode"]:checked');
    if (!armed || !armed.value) return; // "None" is armed -- nothing to place

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left + canvas.scrollLeft;
    const y = e.clientY - rect.top + canvas.scrollTop;

    const pin = document.querySelector('#pin-template')
      .content.cloneNode(true).firstElementChild;

    pin.dataset.deviceId = 'dev-' + (nextId++);
    pin.dataset.type = armed.value;
    pin.dataset.group = '';
    pin.querySelector('.pin-label').textContent = armed.dataset.label || armed.value;
    pin.style.setProperty('--x', x + 'px');
    pin.style.setProperty('--y', y + 'px');

    pinsLayer.appendChild(pin);
    document.dispatchEvent(new CustomEvent('app:changed', { detail: { reason: 'pin-added' } }));
  });

  pinsLayer.addEventListener('click', (e) => {
    const remover = e.target.closest('.pin-remove');
    if (!remover) return;
    e.stopPropagation();
    const pin = remover.closest('.pin');
    pin.remove();
    document.dispatchEvent(new CustomEvent('app:changed', { detail: { reason: 'pin-removed' } }));
  });
})();
