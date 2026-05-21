/* ══════════════════════════════════════
   SHARED JAVASCRIPT — Våge Diving
══════════════════════════════════════ */

// ── Navbar scroll effect ──
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ── Hamburger menu ──
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
})();

// ── Scroll reveal ──
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

// ── Animated counter ──
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const isFloat = String(target).includes('.');
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = eased * target;
    el.textContent = isFloat ? value.toFixed(1) : Math.round(value).toLocaleString('no-NO');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target, parseFloat(e.target.dataset.count));
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
})();

// ── Bubble generator (hero) ──
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const count = window.innerWidth < 768 ? 12 : 22;
  for (let i = 0; i < count; i++) {
    const b = document.createElement('div');
    b.classList.add('bubble');
    const size = Math.random() * 18 + 5;
    b.style.cssText = [
      `left: ${Math.random() * 100}%`,
      `bottom: ${Math.random() * 30}%`,
      `width: ${size}px`,
      `height: ${size}px`,
      `animation-delay: ${(Math.random() * 10).toFixed(2)}s`,
      `animation-duration: ${(Math.random() * 8 + 8).toFixed(2)}s`
    ].join(';');
    hero.appendChild(b);
  }
  // Horizontal depth lines
  for (let i = 0; i < 3; i++) {
    const line = document.createElement('div');
    line.classList.add('hero-depth-line');
    line.style.cssText = `top: ${20 + i * 28}%; opacity: ${0.06 + i * 0.03}`;
    hero.appendChild(line);
  }
})();

// ── Gallery filter + lightbox ──
(function () {
  // Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        items.forEach(item => {
          const show = cat === 'all' || item.dataset.cat === cat;
          item.classList.toggle('hidden', !show);
        });
      });
    });
  }

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lbInner = document.getElementById('lightbox-inner');
  if (!lightbox) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      lbInner.className = 'lightbox-inner ' + (item.querySelector('.gallery-item-inner').className.replace('gallery-item-inner', ''));
      lbInner.innerHTML = item.querySelector('.gallery-item-inner').innerHTML +
        `<button class="lightbox-close" id="lb-close">✕</button>`;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      document.getElementById('lb-close').addEventListener('click', closeLb);
    });
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLb();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLb();
  });

  function closeLb() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
})();

// ── Contact form (Formspree) ──
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    btn.textContent = 'Sender…';
    btn.disabled = true;
    fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
    .then(res => {
      if (res.ok) {
        btn.textContent = '✓ Sendt! Vi tar kontakt snart.';
        btn.style.background = '#1A8A6A';
        form.reset();
      } else {
        btn.textContent = 'Noe gikk galt – prøv igjen';
        btn.style.background = '#c0392b';
        btn.disabled = false;
      }
    })
    .catch(() => {
      btn.textContent = 'Noe gikk galt – prøv igjen';
      btn.style.background = '#c0392b';
      btn.disabled = false;
    });
  });
})();
