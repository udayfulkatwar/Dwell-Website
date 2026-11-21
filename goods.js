/*
 * Goods design homepage effects (src/components/goods/GoodsHome.tsx), plain script, loaded after
 * the page is interactive. The page reads fine without it.
 * - Tone: the section in the middle of the screen sets <html data-tone> (beige / grey / brown).
 * - Mask: [data-mask] sections get --m from 0 to 1 as they scroll through (the render grows).
 * - Float: [data-speed] renders drift against the scroll inside their [data-scatter] box.
 */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var toned = document.querySelectorAll('[data-tone]');
  if (toned.length && 'IntersectionObserver' in window) {
    var tio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) root.setAttribute('data-tone', e.target.getAttribute('data-tone'));
        });
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    toned.forEach(function (el) {
      tio.observe(el);
    });
  }

  var masks = Array.prototype.slice.call(document.querySelectorAll('[data-mask]'));
  var boxes = Array.prototype.slice.call(document.querySelectorAll('[data-scatter]')).map(function (box) {
    return { box: box, items: Array.prototype.slice.call(box.querySelectorAll('[data-speed]')) };
  });
  var raf = 0;

  function update() {
    raf = 0;
    var vh = window.innerHeight;
    masks.forEach(function (m) {
      var r = m.getBoundingClientRect();
      var span = r.height - vh;
      var p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      m.style.setProperty('--m', p.toFixed(4));
    });
    if (reduce) return;
    boxes.forEach(function (b) {
      var r = b.box.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) return;
      var offset = r.top + r.height / 2 - vh / 2;
      b.items.forEach(function (el) {
        el.style.transform = 'translate3d(0,' + (offset * parseFloat(el.getAttribute('data-speed'))).toFixed(1) + 'px,0)';
      });
    });
  }

  function request() {
    if (!raf) raf = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  update();
})();
