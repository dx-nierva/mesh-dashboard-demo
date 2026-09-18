// mesh-link.js
// Job: run Linking Mode -- mirror its checkbox onto the canvas's
// data-linking attribute (so CSS elsewhere can react to it), and record a
// link line between two pins clicked in sequence. Does NOT style the line or
// the armed cursor -- CSS reads data-linking / data-link-anchor for that.

(function () {
  const canvas = document.querySelector('#floorplan-canvas');
  const linkingCheckbox = document.querySelector('#linking-mode');
  const linkLayer = document.querySelector('#link-layer');
  let anchorPin = null;

  function clearAnchor() {
    if (anchorPin) anchorPin.dataset.linkAnchor = 'false';
    anchorPin = null;
  }

  linkingCheckbox.addEventListener('change', () => {
    canvas.dataset.linking = linkingCheckbox.checked ? 'true' : 'false';
    clearAnchor();
  });

  document.querySelector('#pins-layer').addEventListener('click', (e) => {
    if (canvas.dataset.linking !== 'true') return;
    if (e.target.closest('.pin-remove')) return; // not this file's concern
    const body = e.target.closest('.pin-body');
    if (!body) return;
    const pin = body.closest('.pin');

    if (!anchorPin) {
      anchorPin = pin;
      pin.dataset.linkAnchor = 'true';
      return;
    }
    if (anchorPin === pin) { // clicked the same pin again: cancel
      clearAnchor();
      return;
    }

    drawLink(anchorPin, pin);
    clearAnchor();
    document.dispatchEvent(new CustomEvent('app:changed', { detail: { reason: 'link-added' } }));
  });

  function centerOf(pin) {
    return {
      x: parseFloat(pin.style.getPropertyValue('--x')),
      y: parseFloat(pin.style.getPropertyValue('--y')),
    };
  }

  const SVG_NS = 'http://www.w3.org/2000/svg';

  function drawLink(a, b) {
    // The one deliberate exception to "clone from a <template>" in this app:
    // an HTML <template>'s content can't reliably hold a real,
    // correctly-namespaced SVG element across browsers, so this one leaf
    // node is created directly with createElementNS. It still isn't
    // "building a subtree from a string" -- one element, known attributes,
    // nothing invented beyond what a cloned node would also get.
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('class', 'link-line');
    const pa = centerOf(a), pb = centerOf(b);
    line.dataset.from = a.dataset.deviceId;
    line.dataset.to = b.dataset.deviceId;
    line.setAttribute('x1', pa.x); line.setAttribute('y1', pa.y);
    line.setAttribute('x2', pb.x); line.setAttribute('y2', pb.y);
    linkLayer.appendChild(line);
  }

  // if a linked pin was removed, its line has nothing left to point at --
  // drop it too, so the canvas never shows a link to a device that's gone.
  function pruneOrphanLinks() {
    const liveIds = new Set([...document.querySelectorAll('.pin')].map(p => p.dataset.deviceId));
    linkLayer.querySelectorAll('.link-line').forEach(line => {
      if (!liveIds.has(line.dataset.from) || !liveIds.has(line.dataset.to)) line.remove();
    });
  }
  document.addEventListener('app:changed', pruneOrphanLinks);
})();
