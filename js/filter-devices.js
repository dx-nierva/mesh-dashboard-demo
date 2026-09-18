// filter-devices.js
// Job: test the filter box against each device row's name and write
// data-match on the row. Does NOT hide anything itself -- style.css hides
// [data-match="false"].

(function () {
  const input = document.querySelector('#device-filter');
  const list = document.querySelector('#mesh-device-list');

  input.addEventListener('input', () => {
    const needle = input.value.trim().toLowerCase();
    list.querySelectorAll('.device-row').forEach(row => {
      const name = row.querySelector('.device-row-name').textContent.toLowerCase();
      row.dataset.match = name.includes(needle) ? 'true' : 'false';
    });
  });
})();
