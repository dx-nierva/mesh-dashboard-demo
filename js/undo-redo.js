// undo-redo.js
// Job: Ctrl+Z / Ctrl+Y and their toolbar buttons, for edits to the floorplan
// (pins + links) and the groups list. Does not know what a "device" or
// "group" is -- it snapshots two containers generically by cloning them, and
// restores by cloning the snapshot back in. Depth is bounded only by memory.
//
// It never restores with innerHTML or a markup string -- only cloneNode --
// so undo/redo follows the exact same "clone, don't conjure" rule as every
// other file in this app.

(function () {
  const pinsLayer = document.querySelector('#pins-layer');
  const linkLayer = document.querySelector('#link-layer');
  const groupsList = document.querySelector('#groups-list');

  const undoStack = [];
  const redoStack = [];
  let restoring = false;
  let lastSnapshot = snapshot();

  function snapshot() {
    return {
      pins: pinsLayer.cloneNode(true),
      links: linkLayer.cloneNode(true),
      groups: groupsList.cloneNode(true),
    };
  }

  function restore(snap) {
    restoring = true;
    pinsLayer.replaceChildren(...Array.from(snap.pins.cloneNode(true).children));
    linkLayer.replaceChildren(...Array.from(snap.links.cloneNode(true).children));
    groupsList.replaceChildren(...Array.from(snap.groups.cloneNode(true).children));
    document.dispatchEvent(new CustomEvent('app:changed', { detail: { reason: 'history-restored' } }));
    restoring = false;
  }

  document.addEventListener('app:changed', () => {
    if (restoring) return;
    undoStack.push(lastSnapshot);
    redoStack.length = 0;
    lastSnapshot = snapshot();
  });

  function undo() {
    if (!undoStack.length) return;
    redoStack.push(lastSnapshot);
    const prev = undoStack.pop();
    restore(prev);
    lastSnapshot = prev;
  }

  function redo() {
    if (!redoStack.length) return;
    undoStack.push(lastSnapshot);
    const next = redoStack.pop();
    restore(next);
    lastSnapshot = next;
  }

  document.querySelector('#undo-btn').addEventListener('click', undo);
  document.querySelector('#redo-btn').addEventListener('click', redo);

  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, select, textarea')) return;
    const key = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
    if ((e.ctrlKey || e.metaKey) && (key === 'y' || (key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
  });
})();
