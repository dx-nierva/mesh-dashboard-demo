// save-revert.js
// Job: the Save and Revert buttons. Save writes the durable copy (to this
// browser's storage AND as a downloadable .json file); Revert rebuilds the
// canvas and groups from that last-saved copy, discarding anything done
// since. Does not run on its own -- only these two buttons trigger it.

(function () {
  const KEY = 'mesh-dashboard-saved';

  document.querySelector('#save-btn').addEventListener('click', () => {
    const data = MeshState.serialize();
    const json = JSON.stringify(data, null, 2);
    localStorage.setItem(KEY, json);

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mesh-dashboard-project.json';
    link.click();
    URL.revokeObjectURL(url);
  });

  document.querySelector('#revert-btn').addEventListener('click', () => {
    const saved = localStorage.getItem(KEY);
    if (!saved) {
      alert('Nothing has been saved yet in this browser.');
      return;
    }
    MeshState.render(JSON.parse(saved));
    document.dispatchEvent(new CustomEvent('app:changed', { detail: { reason: 'reverted' } }));
  });
})();
