/* ============================================================
   Summit Senior Services — shared interior-page behaviour
   Nav scroll · mobile menu · scroll slide-ins · stat counters
   · FAQ accordion · Formspree submit
   ============================================================ */
(function () {
  var docEl = document.documentElement;
  docEl.classList.add('js');

  /* ---- Nav: transparent over hero → solid on scroll ---- */
  var nav = document.getElementById('siteNav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 60); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile menu ---- */
  window.summitMenu = function (open) {
    var m = document.getElementById('mobileMenu');
    if (m) m.classList.toggle('open', open);
  };

  /* ---- FAQ accordion ---- */
  window.summitFaq = function (btn) {
    var item = btn.closest('.faq-item');
    var a = item.querySelector('.faq-a');
    var isOpen = btn.classList.contains('open');
    // close siblings within same list
    var list = btn.closest('.faq-list');
    if (list) {
      list.querySelectorAll('.faq-q.open').forEach(function (b) {
        b.classList.remove('open');
        var bi = b.closest('.faq-item').querySelector('.faq-a');
        if (bi) bi.style.maxHeight = null;
      });
    }
    if (!isOpen) {
      btn.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  };

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Stat counters ---- */
  function animateCount(el) {
    var to = parseFloat(el.getAttribute('data-to'));
    if (isNaN(to)) return;
    var dur = 1400;
    var dec = (el.getAttribute('data-dec') ? parseInt(el.getAttribute('data-dec'), 10) : 0);
    var start = null;
    function frame(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = to * eased;
      el.textContent = dec ? val.toFixed(dec) : Math.round(val).toLocaleString();
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = dec ? to.toFixed(dec) : Math.round(to).toLocaleString();
    }
    requestAnimationFrame(frame);
  }

  /* ---- Scroll slide-ins + counters via IntersectionObserver ---- */
  var slEls = Array.prototype.slice.call(document.querySelectorAll('[data-sl]'));
  var countEls = Array.prototype.slice.call(document.querySelectorAll('[data-to]'));

  if (reduce || !('IntersectionObserver' in window)) {
    slEls.forEach(function (el) { el.classList.add('in'); });
    countEls.forEach(function (el) {
      var to = parseFloat(el.getAttribute('data-to'));
      var dec = (el.getAttribute('data-dec') ? parseInt(el.getAttribute('data-dec'), 10) : 0);
      if (!isNaN(to)) el.textContent = dec ? to.toFixed(dec) : Math.round(to).toLocaleString();
    });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -7% 0px' });

  // Reveal anything already in view at load immediately (no wait for the
  // observer callback) so above-the-fold content never flashes hidden; observe
  // the rest for the scroll-triggered slide-in.
  var vh = window.innerHeight || document.documentElement.clientHeight;
  slEls.forEach(function (el) {
    var top = el.getBoundingClientRect().top;
    if (top < vh * 0.92) el.classList.add('in');
    else io.observe(el);
  });

  // Safety net: nothing may stay permanently hidden in any context.
  setTimeout(function () {
    slEls.forEach(function (el) { el.classList.add('in'); });
  }, 4000);

  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        animateCount(e.target);
        cio.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  countEls.forEach(function (el) { cio.observe(el); });

  /* ---- Auto-stagger groups: any element with data-sl-stagger ---- */
  document.querySelectorAll('[data-sl-stagger]').forEach(function (group) {
    var step = parseInt(group.getAttribute('data-sl-stagger'), 10) || 90;
    var kids = group.querySelectorAll(':scope > [data-sl]');
    kids.forEach(function (k, i) { k.style.setProperty('--sl-d', (i * step) + 'ms'); });
  });

  /* ---- Formspree submit ---- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var btn = form.querySelector('.submit-btn');
      var original = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';
      var data = new FormData(form);
      fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (res.ok) {
            var content = document.getElementById('formContent');
            var success = document.getElementById('successMsg');
            if (content) content.style.display = 'none';
            if (success) success.style.display = 'block';
            form.reset();
          } else {
            alert('Something went wrong. Please try again or call us directly at (216) 236-3966.');
            btn.disabled = false; btn.textContent = original;
          }
        })
        .catch(function () {
          alert('Something went wrong. Please try again or call us directly at (216) 236-3966.');
          btn.disabled = false; btn.textContent = original;
        });
    });
  }
})();
