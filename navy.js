/*
 * Navy design homepage behaviour (src/components/navy/NavyHome.tsx), plain script loaded after the
 * page is interactive; the page works without it.
 * - Smooth wheel scrolling on desktop (inertia, like the reference); touch and keyboard stay native.
 * - Hero highlight cards rotate every 5 s.
 * - "Our work" list shows the hovered item's picture.
 * - Featured projects switch with the scroll behind the pinned card.
 * - Figures count up once; the about picture drifts; the capabilities row can be dragged.
 */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var raf = window.requestAnimationFrame.bind(window);

  /* ---------- Smooth wheel ---------- */
  if (finePointer && !reduce) {
    var target = window.scrollY;
    var current = window.scrollY;
    var running = false;
    var last = 0;
    var maxScroll = function () {
      return document.documentElement.scrollHeight - window.innerHeight;
    };
    var step = function (now) {
      var dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      current += (target - current) * (1 - Math.exp(-dt * 11));
      if (Math.abs(target - current) < 0.5) current = target;
      window.scrollTo({ top: current, behavior: 'instant' });
      if (current !== target) raf(step);
      else {
        running = false;
        last = 0;
      }
    };
    window.addEventListener(
      'wheel',
      function (e) {
        if (e.ctrlKey || e.defaultPrevented) return;
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // sideways gestures stay native
        if (document.querySelector('#site-menu[data-open="true"]')) return;
        e.preventDefault();
        if (!running) target = current = window.scrollY;
        var d = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
        target = Math.max(0, Math.min(maxScroll(), target + d));
        if (!running) {
          running = true;
          raf(step);
        }
      },
      { passive: false },
    );
    // Keyboard, scrollbar or links moved the page: follow it.
    window.addEventListener(
      'scroll',
      function () {
        if (!running) target = current = window.scrollY;
      },
      { passive: true },
    );
  }

  /* ---------- Hero cards ---------- */
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-rotate] > *'));
  if (cards.length > 1 && !reduce) {
    var ci = 0;
    setInterval(function () {
      if (document.hidden) return;
      cards[ci].removeAttribute('data-on');
      ci = (ci + 1) % cards.length;
      cards[ci].setAttribute('data-on', '');
    }, 5000);
  }

  /* ---------- Our work preview ---------- */
  var rows = Array.prototype.slice.call(document.querySelectorAll('[data-preview]'));
  var previews = Array.prototype.slice.call(document.querySelectorAll('[data-preview-img]'));
  rows.forEach(function (row) {
    var show = function () {
      var i = row.getAttribute('data-preview');
      previews.forEach(function (p) {
        if (p.getAttribute('data-preview-img') === i) p.setAttribute('data-on', '');
        else p.removeAttribute('data-on');
      });
      rows.forEach(function (r) {
        if (r === row) r.setAttribute('data-active', '');
        else r.removeAttribute('data-active');
      });
    };
    row.addEventListener('mouseenter', show);
    row.addEventListener('focus', show);
  });

  /* ---------- Figures count up ---------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  if ('IntersectionObserver' in window && !reduce) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          cio.unobserve(e.target);
          var el = e.target;
          var end = parseFloat(el.getAttribute('data-count'));
          if (!end) return;
          var t0 = performance.now();
          var tick = function (now) {
            var k = Math.min(1, (now - t0) / 1400);
            var eased = 1 - Math.pow(1 - k, 3);
            el.textContent = String(Math.round(end * eased));
            if (k < 1) raf(tick);
          };
          el.textContent = '0';
          raf(tick);
        });
      },
      { threshold: 0.6 },
    );
    counters.forEach(function (c) {
      cio.observe(c);
    });
  }

  /* ---------- Scroll-linked: featured, about picture, capabilities bar ---------- */
  var featured = document.querySelector('[data-featured]');
  var featBg = Array.prototype.slice.call(document.querySelectorAll('[data-feat-bg]'));
  var featSlides = Array.prototype.slice.call(document.querySelectorAll('[data-feat-slide]'));
  var parallax = document.querySelector('[data-parallax]');
  var featIndex = 0;
  var pending = 0;
  var update = function () {
    pending = 0;
    var vh = window.innerHeight;
    if (featured && featBg.length) {
      var r = featured.getBoundingClientRect();
      var span = r.height - vh;
      var p = span > 0 ? Math.min(0.999, Math.max(0, -r.top / span)) : 0;
      var i = Math.floor(p * featBg.length);
      if (i !== featIndex) {
        featIndex = i;
        featBg.forEach(function (el, n) {
          if (n === i) el.setAttribute('data-on', '');
          else el.removeAttribute('data-on');
        });
        featSlides.forEach(function (el, n) {
          if (n === i) el.setAttribute('data-on', '');
          else el.removeAttribute('data-on');
        });
      }
    }
    if (parallax && !reduce) {
      var pr = parallax.getBoundingClientRect();
      if (pr.bottom > 0 && pr.top < vh) parallax.style.setProperty('--py', ((pr.top + pr.height / 2 - vh / 2) * -0.15).toFixed(1) + 'px');
    }
  };
  var request = function () {
    if (!pending) pending = raf(update);
  };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  update();

  /* ---------- Capabilities row: progress and drag ---------- */
  var row = document.querySelector('[data-caps]');
  var bar = document.querySelector('[data-caps-progress]');
  if (row) {
    var setBar = function () {
      var max = row.scrollWidth - row.clientWidth;
      var p = max > 0 ? row.scrollLeft / max : 1;
      if (bar) bar.parentElement.style.setProperty('--cp', String(0.15 + p * 0.85));
    };
    row.addEventListener('scroll', setBar, { passive: true });
    setBar();
    if (finePointer) {
      var down = false;
      var startX = 0;
      var startLeft = 0;
      var moved = false;
      row.addEventListener('pointerdown', function (e) {
        down = true;
        moved = false;
        startX = e.clientX;
        startLeft = row.scrollLeft;
      });
      window.addEventListener('pointermove', function (e) {
        if (!down) return;
        var dx = e.clientX - startX;
        if (Math.abs(dx) > 4) {
          moved = true;
          row.setAttribute('data-dragging', '');
        }
        row.scrollLeft = startLeft - dx;
      });
      window.addEventListener('pointerup', function () {
        down = false;
        row.removeAttribute('data-dragging');
      });
      row.addEventListener(
        'click',
        function (e) {
          if (moved) {
            e.preventDefault();
            moved = false;
          }
        },
        true,
      );
    }
  }
})();
