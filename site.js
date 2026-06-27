/* ============================================================
   site.js — jaettu motion/UI alasivuille (sama mekanismi kuin
   index.html:n inline-JS, irrotettuna alasivujen käyttöön).
   ============================================================ */
(function () {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* page-load-peite (entrance) */
  const pc = document.getElementById('pagecover');
  if (pc) {
    requestAnimationFrame(() => {
      setTimeout(() => pc.classList.add('lifted'), 60);
      setTimeout(() => { pc.style.display = 'none'; }, 800);
    });
  }

  /* Lenis smooth scroll (sama moottori kuin Wolverine) */
  let lenis;
  if (!RM && window.Lenis) {
    lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const sel = a.getAttribute('href');
      if (sel.length < 2) return;
      const el = document.querySelector(sel);
      if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: 0 }); }
    }));
  }

  /* rivijako .anim-text[data-animation=split] -> .anim-text-item per rivi */
  function splitLines(el) {
    const txt = el.textContent.trim();
    const explicit = [...el.querySelectorAll(':scope > span')];
    let lines;
    if (explicit.length) { lines = explicit.map(s => s.textContent.trim()); }
    else {
      const words = txt.split(/\s+/);
      el.textContent = '';
      const spans = words.map(w => { const s = document.createElement('span'); s.textContent = w + ' '; s.style.display = 'inline-block'; el.append(s); return s; });
      const map = []; let curTop = null, cur = [];
      spans.forEach(s => { const t = s.offsetTop; if (curTop === null || Math.abs(t - curTop) < 2) { cur.push(s.textContent); curTop = (curTop === null ? t : curTop); } else { map.push(cur.join('')); cur = [s.textContent]; curTop = t; } });
      if (cur.length) map.push(cur.join(''));
      lines = map.map(l => l.trim());
    }
    el.textContent = '';
    el.style.display = el.style.display || 'block';
    lines.forEach((ln, i) => { const wrap = document.createElement('span'); wrap.style.display = 'block'; wrap.style.overflow = 'hidden'; const item = document.createElement('span'); item.className = 'anim-text-item'; item.style.display = 'block'; item.style.setProperty('--index', i); item.textContent = ln; wrap.appendChild(item); el.appendChild(wrap); });
  }
  document.querySelectorAll('.anim-text[data-animation="split"]').forEach(splitLines);

  /* is-inview-trigger (Locomotive data-scroll -korvike) */
  const io = new IntersectionObserver((es) => { es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-inview'); io.unobserve(e.target); } }); }, { threshold: 0, rootMargin: '0px 0px -15% 0px' });
  document.querySelectorAll('[data-scroll]').forEach(el => io.observe(el));
  document.querySelectorAll('.c-image').forEach(el => el.classList.add('is-loaded'));

  const root = document.documentElement;

  /* header-tilakone: has-scrolled = pilleri, has-passed-fold + is-scrolling-down = piiloon */
  let lastY = window.scrollY;
  function headerState() {
    const y = window.scrollY;
    root.classList.toggle('has-scrolled', y > 10);
    root.classList.toggle('has-passed-fold', y > window.innerHeight * 0.85);
    if (Math.abs(y - lastY) > 5) {
      const down = y > lastY;
      root.classList.toggle('is-scrolling-down', down);
      root.classList.toggle('is-scrolling-up', !down);
      lastY = y;
    }
  }
  headerState(); window.addEventListener('scroll', headerState, { passive: true });

  /* --progress parallax [data-scroll-css-progress] (push-CTA) */
  const prog = [...document.querySelectorAll('[data-scroll-css-progress]')];
  function updProg() {
    const vh = window.innerHeight;
    prog.forEach(el => { const r = el.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (vh - r.top) / Math.max(r.height, 1))); el.style.setProperty('--progress', p.toFixed(4)); });
  }
  updProg(); window.addEventListener('scroll', updProg, { passive: true });

  /* karuselli (drag + edellinen/seuraava) */
  document.querySelectorAll('c-carousel').forEach(root => {
    const track = root.querySelector('[data-carousel="track"]');
    if (!track) return;
    const cards = [...track.querySelectorAll('[data-carousel="slide"]')];
    const prev = root.querySelector('[data-carousel="prev"]'); const next = root.querySelector('[data-carousel="next"]');
    const step = () => (cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : (cards[0] ? cards[0].offsetWidth : 300));
    const sync = () => { const max = track.scrollWidth - track.clientWidth; if (prev) prev.disabled = track.scrollLeft <= 1; if (next) next.disabled = track.scrollLeft >= max - 1; };
    const go = dir => { track.scrollBy({ left: dir * step(), behavior: RM ? 'auto' : 'smooth' }); };
    track.addEventListener('scroll', sync, { passive: true });
    prev && prev.addEventListener('click', () => go(-1)); next && next.addEventListener('click', () => go(1));
    let down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', e => { down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; track.classList.add('is-dragging'); track.setPointerCapture(e.pointerId); });
    track.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; track.scrollLeft = sl - dx; });
    const end = e => { if (!down) return; down = false; track.classList.remove('is-dragging'); try { track.releasePointerCapture(e.pointerId); } catch (_) {} };
    track.addEventListener('pointerup', end); track.addEventListener('pointercancel', end);
    track.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    sync();
  });

  /* mobiilivalikko */
  const mm = document.getElementById('mobilemenu');
  const mmToggle = document.querySelector('[data-mm-open]');
  if (mm && mmToggle) {
    const setMM = (open) => { mm.classList.toggle('open', open); mm.setAttribute('aria-hidden', String(!open)); mmToggle.setAttribute('aria-expanded', String(open)); document.body.style.overflow = open ? 'hidden' : ''; if (lenis) { open ? lenis.stop() : lenis.start(); } };
    mmToggle.addEventListener('click', () => setMM(!mm.classList.contains('open')));
    const c = mm.querySelector('[data-mm-close]'); c && c.addEventListener('click', () => setMM(false));
    mm.querySelectorAll('[data-mm-link]').forEach(a => a.addEventListener('click', () => setMM(false)));
    window.addEventListener('keydown', e => { if (e.key === 'Escape') setMM(false); });
  }

  /* Varaus: Google Calendar -ajanvarauslinkki. Tyhjä = pidä href (yhteystiedot/mailto). */
  const BOOKING_URL = "";
  if (BOOKING_URL) document.querySelectorAll('[data-book]').forEach(a => { a.href = BOOKING_URL; a.target = '_blank'; a.rel = 'noopener'; });
})();
