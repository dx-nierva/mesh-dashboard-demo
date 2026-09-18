// group-select.js
// Job: decide which pins carry data-selected="true", based purely on which
// Group checkboxes are checked and each pin's own data-group. Does NOT decide
// what "selected" looks like -- style.css draws the outline from
// [data-selected="true"].

(function () {
  function recompute() {
    const checkedGroupIds = new Set(
      [...document.querySelectorAll('.group-checkbox:checked')]
        .map(cb => cb.closest('.group-row').dataset.groupId)
    );

    document.querySelectorAll('.pin').forEach(pin => {
      const isSelected = checkedGroupIds.size > 0 && checkedGroupIds.has(pin.dataset.group);
      pin.dataset.selected = isSelected ? 'true' : 'false';
    });
  }

  document.querySelector('#groups-list').addEventListener('change', (e) => {
    if (e.target.matches('.group-checkbox')) recompute();
  });
  document.addEventListener('app:changed', recompute);
  recompute();
})();
