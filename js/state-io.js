// state-io.js
// Job: convert the floorplan's DOM state to a plain JS object, and back again.
// Does NOT decide when to save, autosave, or restore -- other files call these
// two functions; this file only knows how to read the DOM and how to rebuild it.
// Rebuilding is done exclusively by cloning <template> content (never innerHTML
// or a template-literal string), per the "clone, don't conjure" rule.

window.MeshState = (function () {

  function serialize() {
    const pins = [...document.querySelectorAll('.pin')].map(pin => ({
      id: pin.dataset.deviceId,
      type: pin.dataset.type,
      group: pin.dataset.group || '',
      label: pin.querySelector('.pin-label').textContent,
      x: pin.style.getPropertyValue('--x'),
      y: pin.style.getPropertyValue('--y'),
    }));
    const groups = [...document.querySelectorAll('.group-row')].map(row => ({
      id: row.dataset.groupId,
      name: row.querySelector('.group-name').textContent,
    }));
    return { pins, groups, savedAt: new Date().toISOString() };
  }

  function renderPin(data) {
    const pin = document.querySelector('#pin-template')
      .content.cloneNode(true).firstElementChild;
    pin.dataset.deviceId = data.id;
    pin.dataset.type = data.type;
    pin.dataset.group = data.group || '';
    pin.querySelector('.pin-label').textContent = data.label;
    pin.style.setProperty('--x', data.x);
    pin.style.setProperty('--y', data.y);
    return pin;
  }

  function renderGroup(data) {
    const row = document.querySelector('#group-row-template')
      .content.cloneNode(true).firstElementChild;
    row.dataset.groupId = data.id;
    row.querySelector('.group-name').textContent = data.name;
    return row;
  }

  function render(data) {
    const pinsLayer = document.querySelector('#pins-layer');
    const groupsList = document.querySelector('#groups-list');
    pinsLayer.replaceChildren(...data.pins.map(renderPin));
    groupsList.replaceChildren(...data.groups.map(renderGroup));
  }

  return { serialize, render };
})();
