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
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
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
    root.classList.toggle('has-scrolled', y > 40);
    root.classList.toggle('has-passed-fold', y > window.innerHeight);
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

  /* ---- Ajanvaraus: glass-modaali + Google Calendar -taustajärjestelmä ----
     Aseta BOOKING_EMBED_URL Google Calendar "Appointment schedule" -upotuslinkkiin. */
  const BOOKING_EMBED_URL = "";
  const BOOKING_EMAIL = "mailto:parkkonen.jesse@gmail.com?subject=Tekoälykoulutus%2C%20keskustelu";
  (function setupBooking() {
    const body = BOOKING_EMBED_URL
      ? '<iframe class="book-modal__frame" src="' + BOOKING_EMBED_URL + '" title="Google-ajanvaraus" loading="lazy"></iframe>'
      : '<div class="book-modal__fallback">' +
          '<p>Ajanvarauskalenteri kytketään käyttöön pian. Sillä välin varaa aika sähköpostitse, niin vahvistan ajan saman päivän aikana.</p>' +
          '<a class="c-button -white -small" href="' + BOOKING_EMAIL + '"><div class="c-button_bg"></div><div class="c-button_inner"><span class="c-button_icon" aria-hidden="true">→</span><span class="c-button_label">Lähetä sähköpostia</span><span class="c-button_icon" aria-hidden="true">→</span></div></a>' +
          '<p class="book-modal__steps"><b>Käyttöönotto:</b> Google Kalenteri → uusi → <b>Ajanvaraus</b> → julkaise → kopioi varaussivun linkki → liitä <b>BOOKING_EMBED_URL</b>-vakioon. Varaukset tulevat suoraan kalenteriisi.</p>' +
        '</div>';
    const m = document.createElement('div');
    m.className = 'book-modal'; m.id = 'bookmodal';
    m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-label', 'Varaa keskustelu'); m.setAttribute('aria-hidden', 'true');
    m.innerHTML = '<div class="book-modal__scrim" data-book-close></div>' +
      '<div class="book-modal__panel">' +
        '<div class="book-modal__head"><div><span class="book-modal__eyebrow">Ajanvaraus</span><h2 class="book-modal__title">Varaa 30 min keskustelu</h2></div>' +
        '<button class="book-modal__close" type="button" data-book-close aria-label="Sulje">✕</button></div>' +
        '<div class="book-modal__body">' + body + '</div></div>';
    document.body.appendChild(m);
    let lastFocus = null;
    const openBook = () => { lastFocus = document.activeElement; m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; if (lenis) lenis.stop(); const c = m.querySelector('.book-modal__close'); c && c.focus(); };
    const closeBook = () => { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; if (lenis) lenis.start(); lastFocus && lastFocus.focus && lastFocus.focus(); };
    document.querySelectorAll('[data-book]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); openBook(); }));
    m.querySelectorAll('[data-book-close]').forEach(el => el.addEventListener('click', closeBook));
    window.addEventListener('keydown', e => { if (e.key === 'Escape' && m.classList.contains('open')) closeBook(); });
  })();
})();
