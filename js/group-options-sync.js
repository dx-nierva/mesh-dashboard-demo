// group-options-sync.js
// Job: keep every pin's "assign to group" <select> in sync with the current
// Groups list -- rebuilds its <option>s from #group-option-template whenever
// groups change, and clears a pin's assignment if its group no longer exists.
// Does NOT create, delete, or highlight groups or pins -- it only keeps one
// list of options matching another.

(function () {
  function currentGroups() {
    return [...document.querySelectorAll('.group-row')].map(row => ({
      id: row.dataset.groupId,
      name: row.querySelector('.group-name').textContent,
    }));
  }

  function sync() {
    const groups = currentGroups();
    const validIds = new Set(groups.map(g => g.id));

    document.querySelectorAll('.pin-group-select').forEach(select => {
      const pin = select.closest('.pin');
      const currentValue = select.value;

      // keep the built-in "No group" option, replace every option after it
      while (select.options.length > 1) select.remove(1);

      groups.forEach(g => {
        const option = document.querySelector('#group-option-template')
          .content.cloneNode(true).firstElementChild;
        option.value = g.id;
        option.textContent = g.name;
        select.appendChild(option);
      });

      if (validIds.has(currentValue)) {
        select.value = currentValue;
      } else {
        select.value = '';
        pin.dataset.group = '';
      }
    });
  }

  document.addEventListener('app:changed', sync);
  sync();
})();
