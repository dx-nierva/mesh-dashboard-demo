// autosave.js
// Job: continuously save floorplan + group state to this browser's storage,
// debounced, so an accidental tab close never loses work. Restores that
// state once when the page first loads. Does NOT touch Save/Revert -- those
// write to a real file and are a separate, explicit, durable action
// (save-revert.js). This copy is explicitly non-durable: clearing browser
// data removes it.

(function () {
  const KEY = 'mesh-dashboard-autosave';
  let timer = null;

  document.addEventListener('app:changed', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      localStorage.setItem(KEY, JSON.stringify(MeshState.serialize()));
    }, 400);
  });

  const saved = localStorage.getItem(KEY);
  if (saved) {
    try {
      MeshState.render(JSON.parse(saved));
      document.dispatchEvent(new CustomEvent('app:changed', { detail: { reason: 'autosave-restored' } }));
    } catch (err) {
      console.warn('autosave.js: could not restore saved state', err);
    }
  }
})();
