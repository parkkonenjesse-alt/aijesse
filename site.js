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

  /* ---- Ajanvaraus: glass-modaali + oma kalenteripicker ----
     BOOKING_EMBED_URL tyhjä = oma kalenteri; aseta Appointment schedule -linkki jos haluat Googlen sivun. */
  const BOOKING_EMBED_URL = "";
  const HOST_EMAIL = "parkkonen.jesse@gmail.com";
  (function setupBooking() {
    const m = document.createElement('div');
    m.className = 'book-modal'; m.id = 'bookmodal';
    m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-label', 'Varaa keskustelu'); m.setAttribute('aria-hidden', 'true');
    m.innerHTML = '<div class="book-modal__scrim" data-book-close></div>' +
      '<div class="book-modal__panel">' +
        '<div class="book-modal__head"><div><span class="book-modal__eyebrow">Ajanvaraus</span><h2 class="book-modal__title">Varaa 30 min keskustelu</h2></div>' +
        '<button class="book-modal__close" type="button" data-book-close aria-label="Sulje">✕</button></div>' +
        '<div class="book-modal__body"></div></div>';
    document.body.appendChild(m);
    const bodyEl = m.querySelector('.book-modal__body');
    if (BOOKING_EMBED_URL) bodyEl.innerHTML = '<iframe class="book-modal__frame" src="' + BOOKING_EMBED_URL + '" title="Google-ajanvaraus" loading="lazy"></iframe>';
    else renderCalendar(bodyEl);
    let lastFocus = null;
    const openBook = () => { lastFocus = document.activeElement; m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; if (lenis) lenis.stop(); const c = m.querySelector('.book-modal__close'); c && c.focus(); };
    const closeBook = () => { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; if (lenis) lenis.start(); lastFocus && lastFocus.focus && lastFocus.focus(); };
    document.querySelectorAll('[data-book]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); openBook(); }));
    m.querySelectorAll('[data-book-close]').forEach(el => el.addEventListener('click', closeBook));
    window.addEventListener('keydown', e => { if (e.key === 'Escape' && m.classList.contains('open')) closeBook(); });

    function renderCalendar(root) {
      const MONTHS = ['tammikuu','helmikuu','maaliskuu','huhtikuu','toukokuu','kesäkuu','heinäkuu','elokuu','syyskuu','lokakuu','marraskuu','joulukuu'];
      const WD = ['Ma','Ti','Ke','To','Pe','La','Su'];
      const SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00'];
      const today = new Date(); today.setHours(0,0,0,0);
      let vy = today.getFullYear(), vm = today.getMonth(), sel = null, time = null;
      const two = n => String(n).padStart(2,'0');
      const dstr = d => d.getDate() + '. ' + MONTHS[d.getMonth()];
      const gfmt = d => d.getFullYear() + two(d.getMonth()+1) + two(d.getDate()) + 'T' + two(d.getHours()) + two(d.getMinutes()) + '00';
      function calStep() {
        const first = new Date(vy,vm,1); const lead = (first.getDay()+6)%7; const dim = new Date(vy,vm+1,0).getDate();
        const curMonth = vy===today.getFullYear() && vm===today.getMonth();
        let cells = ''; for (let i=0;i<lead;i++) cells += '<span class="bk-cal__day -empty"></span>';
        for (let d=1;d<=dim;d++) { const date = new Date(vy,vm,d); const dow = date.getDay(); const dis = date<today||dow===0||dow===6; cells += '<button class="bk-cal__day" data-day="'+d+'"'+(dis?' disabled':'')+'>'+d+'</button>'; }
        root.innerHTML = '<div class="bk-cal"><span class="bk-sel-label">Valitse päivä</span>' +
          '<div class="bk-cal__nav"><button class="bk-cal__navbtn" data-mv="-1"'+(curMonth?' disabled':'')+' aria-label="Edellinen kuukausi">‹</button>' +
          '<span class="bk-cal__month">'+MONTHS[vm]+' '+vy+'</span>' +
          '<button class="bk-cal__navbtn" data-mv="1" aria-label="Seuraava kuukausi">›</button></div>' +
          '<div class="bk-cal__grid">'+WD.map(w=>'<span class="bk-cal__wd">'+w+'</span>').join('')+cells+'</div></div>';
        root.querySelectorAll('[data-mv]').forEach(b => b.addEventListener('click', () => { if (b.disabled) return; vm += +b.dataset.mv; if (vm<0){vm=11;vy--;} if (vm>11){vm=0;vy++;} calStep(); }));
        root.querySelectorAll('.bk-cal__day[data-day]').forEach(b => { if (b.disabled) return; b.addEventListener('click', () => { sel = new Date(vy,vm,+b.dataset.day); timeStep(); }); });
      }
      function timeStep() {
        root.innerHTML = '<button class="bk-back" data-back>‹ Takaisin</button><span class="bk-sel-label">'+dstr(sel)+' · valitse aika</span>' +
          '<div class="bk-slots">'+SLOTS.map(s=>'<button class="bk-slot" data-t="'+s+'">'+s+'</button>').join('')+'</div>';
        root.querySelector('[data-back]').addEventListener('click', calStep);
        root.querySelectorAll('.bk-slot').forEach(b => b.addEventListener('click', () => { time = b.dataset.t; formStep(); }));
      }
      function formStep() {
        root.innerHTML = '<button class="bk-back" data-back>‹ Takaisin</button><span class="bk-sel-label">'+dstr(sel)+' klo '+time+'</span>' +
          '<label class="bk-field"><span>Nimi</span><input type="text" data-name placeholder="Etunimi Sukunimi"></label>' +
          '<label class="bk-field"><span>Sähköposti</span><input type="email" data-email placeholder="sinä@yritys.fi"></label>' +
          '<label class="bk-field"><span>Lyhyt viesti (vapaaehtoinen)</span><textarea data-note rows="2" placeholder="Mitä haluaisit ratkaista?"></textarea></label>' +
          '<button type="button" class="c-button -white -small bk-confirm" data-confirm><div class="c-button_bg"></div><div class="c-button_inner"><span class="c-button_icon" aria-hidden="true">→</span><span class="c-button_label">Vahvista varaus</span><span class="c-button_icon" aria-hidden="true">→</span></div></button>';
        root.querySelector('[data-back]').addEventListener('click', timeStep);
        root.querySelector('[data-confirm]').addEventListener('click', () => {
          const ni = root.querySelector('[data-name]'), ei = root.querySelector('[data-email]');
          const name = (ni.value||'').trim(), email = (ei.value||'').trim(), note = (root.querySelector('[data-note]').value||'').trim();
          [ni,ei].forEach(x => x.style.outline = ''); let bad = false;
          if (!name) { ni.style.outline = '2px solid #ff6b6b'; bad = true; }
          if (!email || !/.+@.+\..+/.test(email)) { ei.style.outline = '2px solid #ff6b6b'; bad = true; }
          if (bad) return;
          const subject = 'Ajanvaraus: ' + dstr(sel) + ' klo ' + time;
          const lines = ['Nimi: '+name, 'Sähköposti: '+email, 'Aika: '+dstr(sel)+' klo '+time]; if (note) lines.push('Viesti: '+note);
          const mail = 'mailto:' + HOST_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
          const start = new Date(sel); const tp = time.split(':'); start.setHours(+tp[0],+tp[1],0,0); const end = new Date(start.getTime()+30*60000);
          const g = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('Tekoälykoulutus, keskustelu') + '&dates=' + gfmt(start) + '/' + gfmt(end) + '&add=' + encodeURIComponent(HOST_EMAIL) + '&details=' + encodeURIComponent('Varaaja: '+name+' ('+email+')'+(note?'\n'+note:''));
          window.location.href = mail; doneStep(g);
        });
      }
      function doneStep(gLink) {
        root.innerHTML = '<div class="bk-success"><div class="bk-success__check">✓</div>' +
          '<p style="font-weight:600;font-size:1.05rem;margin-bottom:.5rem">Varauspyyntö valmis</p>' +
          '<p style="opacity:.82;font-size:.9rem;line-height:1.6;margin-bottom:1.2rem">Sähköpostiohjelmasi avautui valmiilla viestillä, '+dstr(sel)+' klo '+time+'. Lähetä se, niin vahvistan ajan pian.</p>' +
          '<a class="c-button -white -small" href="'+gLink+'" target="_blank" rel="noopener"><div class="c-button_bg"></div><div class="c-button_inner"><span class="c-button_label">Lisää Google-kalenteriin</span><span class="c-button_icon" aria-hidden="true">↗</span></div></a></div>';
      }
      calStep();
    }
  })();
})();
