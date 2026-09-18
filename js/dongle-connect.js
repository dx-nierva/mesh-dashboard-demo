// dongle-connect.js
// Job: drive the Connect/Disconnect button and write data-status on the Mesh
// Network panel as the (simulated) connection progresses. Does NOT touch the
// device list or the status wording -- style.css prints "Disconnected" /
// "Connecting…" / "Connected" straight from data-status.
//
// A real build would swap the setTimeout below for the Web Serial / Web
// Bluetooth handshake -- the rest of the app would not need to change,
// because every other file only ever reads data-status, never how it got set.

(function () {
  const panel = document.querySelector('.mesh-panel');
  const btn = document.querySelector('#connect-btn');

  btn.addEventListener('click', () => {
    if (panel.dataset.status === 'connected') {
      panel.dataset.status = 'disconnected';
      document.dispatchEvent(new CustomEvent('app:mesh-status', { detail: 'disconnected' }));
      return;
    }
    if (panel.dataset.status === 'connecting') return; // already in progress

    panel.dataset.status = 'connecting';
    setTimeout(() => {
      panel.dataset.status = 'connected';
      document.dispatchEvent(new CustomEvent('app:mesh-status', { detail: 'connected' }));
    }, 900);
  });
})();
