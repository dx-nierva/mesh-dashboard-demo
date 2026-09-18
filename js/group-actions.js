// group-actions.js
// Job: create, merge, delete, and erase Group rows -- only in direct response
// to this panel's own four buttons. Does NOT decide which pins highlight
// (group-select.js does that) and does NOT touch each pin's <select> options
// (group-options-sync.js does that). This file only owns the groups list itself.

(function () {
  let nextGroupId = 1;

  const list = document.querySelector('#groups-list');

  function checkedRows() {
    return [...list.querySelectorAll('.group-row')]
      .filter(row => row.querySelector('.group-checkbox').checked);
  }

  function changed(reason) {
    document.dispatchEvent(new CustomEvent('app:changed', { detail: { reason } }));
  }

  document.querySelector('#create-group-btn').addEventListener('click', () => {
    const row = document.querySelector('#group-row-template')
      .content.cloneNode(true).firstElementChild;
    const id = 'group-' + (nextGroupId++);
    row.dataset.groupId = id;
    row.querySelector('.group-name').textContent = 'Group #' + id.split('-')[1];
    list.appendChild(row);
    changed('group-created');
  });

  document.querySelector('#merge-groups-btn').addEventListener('click', () => {
    const rows = checkedRows();
    if (rows.length < 2) return; // nothing to merge
    const [target, ...rest] = rows;
    const targetId = target.dataset.groupId;
    const mergedIds = new Set(rest.map(r => r.dataset.groupId));

    document.querySelectorAll('.pin').forEach(pin => {
      if (mergedIds.has(pin.dataset.group)) {
        pin.dataset.group = targetId;
        pin.querySelector('.pin-group-select').value = targetId;
      }
    });
    rest.forEach(row => row.remove());
    changed('groups-merged');
  });

  document.querySelector('#delete-groups-btn').addEventListener('click', () => {
    const rows = checkedRows();
    if (!rows.length) return;
    rows.forEach(row => row.remove()); // their pins simply become ungrouped
    changed('groups-deleted');
  });

  document.querySelector('#erase-groups-btn').addEventListener('click', () => {
    const rows = checkedRows();
    if (!rows.length) return;
    const erasedIds = new Set(rows.map(r => r.dataset.groupId));

    document.querySelectorAll('.pin').forEach(pin => {
      if (erasedIds.has(pin.dataset.group)) pin.remove();
    });
    rows.forEach(row => row.remove());
    changed('groups-erased');
  });
})();
