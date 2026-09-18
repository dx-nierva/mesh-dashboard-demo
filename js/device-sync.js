// device-sync.js
// Job: populate the mesh device list -- a couple of devices "discover"
// themselves shortly after connecting, and the Add Device button clones one
// more on demand. Clears the list on disconnect. Updates the device-count
// number. Does NOT decide connection wording or the Add button's enabled
// state -- style.css and add-device-gate.js own those respectively.

(function () {
  const list = document.querySelector('#mesh-device-list');
  const countEl = document.querySelector('#device-count');
  const namePool = ['Hallway LED-04', 'Kitchen Dimmer-02', 'Porch LED-11', 'Bedroom LED-07', 'Garage Dimmer-01'];
  let nextName = 0;

  function addRow(name) {
    const row = document.querySelector('#mesh-device-row-template')
      .content.cloneNode(true).firstElementChild;
    row.querySelector('.device-row-name').textContent = name;
    list.appendChild(row);
    countEl.textContent = String(list.children.length);
  }

  function clearAll() {
    list.replaceChildren();
    countEl.textContent = '0';
  }

  document.addEventListener('app:mesh-status', (e) => {
    if (e.detail === 'connected') {
      setTimeout(() => addRow(namePool[nextName++ % namePool.length]), 300);
      setTimeout(() => addRow(namePool[nextName++ % namePool.length]), 700);
    } else {
      clearAll();
    }
  });

  document.querySelector('#add-device-btn').addEventListener('click', () => {
    addRow(namePool[nextName++ % namePool.length]);
  });
})();
