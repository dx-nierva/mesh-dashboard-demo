// toolbar-area.js
// Job: New Area / Open Last Area / Update Floorplan / the Origin-Dimension-
// GridSize readouts. Does NOT touch the canvas, palette, or mesh panel --
// this file only owns the toolbar's own text and the Area dropdown.
//
// Real geometry (measuring an uploaded floorplan image, computing its scale)
// is exactly the kind of "compute once, write as state" fact described in
// §3 of the guide. This demo stands in a plausible fixed value for that
// computation -- swap measureFloorplan() for the real thing later; nothing
// else in the app needs to know that happened, because it only reads the
// three readouts below.

(function () {
  const areaSelect = document.querySelector('#area-select');
  const origin = document.querySelector('#origin-readout');
  const dimension = document.querySelector('#dimension-readout');
  const gridSize = document.querySelector('#gridsize-readout');

  function measureFloorplan() {
    origin.textContent = '(0, 0)';
    dimension.textContent = '960 x 640';
    gridSize.textContent = '24px/cm x 24px/cm';
  }

  document.querySelector('#new-area-btn').addEventListener('click', () => {
    const name = prompt('Name this area:', 'Area ' + (areaSelect.options.length));
    if (!name) return;

    const option = document.querySelector('#area-option-template')
      .content.cloneNode(true).firstElementChild;
    option.value = name;
    option.textContent = name;
    areaSelect.appendChild(option);
    areaSelect.value = name;
    localStorage.setItem('mesh-dashboard-last-area', name);
    measureFloorplan();
  });

  document.querySelector('#open-last-area-btn').addEventListener('click', () => {
    const last = localStorage.getItem('mesh-dashboard-last-area');
    if (last && [...areaSelect.options].some(o => o.value === last)) {
      areaSelect.value = last;
      measureFloorplan();
    }
  });

  document.querySelector('#update-floorplan-btn').addEventListener('click', measureFloorplan);

  areaSelect.addEventListener('change', () => {
    if (areaSelect.value) localStorage.setItem('mesh-dashboard-last-area', areaSelect.value);
  });
})();
