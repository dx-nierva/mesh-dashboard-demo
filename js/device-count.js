// device-count.js
// Job: whenever the set of pins changes, count how many pins exist of each
// device type and write that number onto the matching palette button's
// data-count attribute. Does NOT touch any element's text directly --
// style.css prints the number itself with content: attr(data-count).

(function () {
  function recount() {
    const counts = {};
    document.querySelectorAll('.pin').forEach(pin => {
      counts[pin.dataset.type] = (counts[pin.dataset.type] || 0) + 1;
    });

    document.querySelectorAll('input[name="place-mode"]').forEach(radio => {
      if (!radio.value) return; // the "None" option has nothing to count
      const countEl = radio.closest('.device-btn').querySelector('.count');
      countEl.setAttribute('data-count', String(counts[radio.value] || 0));
    });
  }

  document.addEventListener('app:changed', recount);
  recount(); // reflect whatever state loaded in (e.g. from autosave)
})();
