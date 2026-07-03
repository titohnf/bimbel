  function toggleBaMore(btn){
    const card = btn.closest('.ba-card');
    const wasOpen = card.classList.contains('open');
    document.querySelectorAll('.ba-card.open').forEach(el => {
      el.classList.remove('open');
      const span = el.querySelector('.ba-more-text');
      if (span) span.textContent = 'Baca kisahnya';
    });
    if (!wasOpen) {
      card.classList.add('open');
      btn.querySelector('.ba-more-text').textContent = 'Tutup';
    }
  }

  function toggleFaq(btn){
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    item.closest('.faq-list').querySelectorAll('.faq-item.open').forEach(el => {
      const body = el.querySelector('.faq-body');
      if (body) { body.style.transition = 'none'; body.style.maxHeight = '0'; }
      el.classList.remove('open');
      requestAnimationFrame(() => {
        if (body) { body.style.transition = ''; body.style.maxHeight = ''; }
      });
    });
    if (!wasOpen) item.classList.add('open');
  }

  const words = [
    "lemah matematika",
    "mau ujian TKA",
    "mau ujian UTBK",
    "udah les, tetap remed",
    "jago, mau lebih tajam"
  ];
  let wordIdx = 0;
  let charIdx = words[0].length; // mulai dari kata pertama sudah penuh terketik
  let isDeleting = false;
  const el = document.getElementById('dynamicWord');

  const TYPE_SPEED = 55;       // ms per huruf saat mengetik
  const DELETE_SPEED = 32;     // ms per huruf saat menghapus
  const HOLD_TIME = 1800;      // ms diam setelah selesai mengetik
  const PAUSE_BEFORE_TYPE = 300; // ms diam setelah selesai menghapus

  function tick(){
    const currentWord = words[wordIdx];
    el.classList.remove('blinking');

    if(!isDeleting){
      el.textContent = currentWord.substring(0, charIdx);
      if(charIdx < currentWord.length){
        charIdx++;
        setTimeout(tick, TYPE_SPEED);
      } else {
        el.classList.add('blinking');
        setTimeout(() => { isDeleting = true; tick(); }, HOLD_TIME);
      }
    } else {
      el.textContent = currentWord.substring(0, charIdx);
      if(charIdx > 0){
        charIdx--;
        setTimeout(tick, DELETE_SPEED);
      } else {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        setTimeout(tick, PAUSE_BEFORE_TYPE);
      }
    }
  }

  // mulai: tahan sebentar di kata pertama yang sudah penuh, lalu mulai cycle normal
  el.textContent = words[0];
  el.classList.add('blinking');
  setTimeout(() => { isDeleting = true; tick(); }, HOLD_TIME);

  // ===== Port persis dari logic React useAnimCycle, supaya timing identik =====
  function animCycle(steps, restMs, onPhase) {
    let timeouts = [];
    function runCycle() {
      let acc = 0;
      steps.forEach((step, i) => {
        acc += step;
        timeouts.push(setTimeout(() => onPhase(i + 1), acc));
      });
      timeouts.push(setTimeout(() => onPhase(0), acc + restMs));
      timeouts.push(setTimeout(runCycle, acc + restMs + 50));
    }
    timeouts.push(setTimeout(runCycle, 1000));
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    // ---- BOOK: checklist tergambar lalu bertahan ----
    const checkBg = document.querySelector('.ckm-check-bg');
    const checkFg = document.querySelector('.ckm-check-fg');
    if (checkBg && checkFg) {
      animCycle([150, 350, 900], 1800, (phase) => {
        const dashoffset = phase === 0 ? 21 : 0;
        const opacity = phase === 0 ? 0 : 1;
        const transition = phase === 0 ? 'none' : 'stroke-dashoffset .35s linear';
        [checkBg, checkFg].forEach(el => {
          el.style.transition = transition;
          el.style.strokeDashoffset = dashoffset;
          el.style.opacity = opacity;
        });
      });
    }

    // ---- BRAIN: getaran lalu petir muncul & bertahan ----
    const brainIcon = document.querySelector('.ckm-shake');
    const boltWrap = document.querySelector('.ckm-bolt');
    if (brainIcon) {
      const shakeStyles = {
        0: 'translateX(0) rotate(0deg)',
        1: 'translateX(-2px) rotate(-2deg)',
        2: 'translateX(2px) rotate(2deg)',
        3: 'translateX(-1.5px) rotate(-1deg)',
        4: 'translateX(0) rotate(0deg)',
        5: 'translateX(0) rotate(0deg)',
      };
      const boltStyles = {
        0: { opacity: 0, transform: 'scale(0.4) rotate(-10deg)' },
        1: { opacity: 0, transform: 'scale(0.4) rotate(-10deg)' },
        2: { opacity: 0, transform: 'scale(0.4) rotate(-10deg)' },
        3: { opacity: 0, transform: 'scale(0.4) rotate(-10deg)' },
        4: { opacity: 1, transform: 'scale(1.1) rotate(0deg)' },
        5: { opacity: 1, transform: 'scale(1.1) rotate(0deg)' },
      };
      animCycle([60, 60, 60, 60, 900], 1800, (phase) => {
        brainIcon.style.transition = 'transform .07s ease';
        brainIcon.style.transform = shakeStyles[phase];
        if (boltWrap) {
          const bs = boltStyles[phase];
          boltWrap.style.transition = 'all .35s cubic-bezier(.34,1.56,.64,1)';
          boltWrap.style.opacity = bs.opacity;
          boltWrap.style.transform = bs.transform;
        }
      });
    }

    // ---- HEART: naik-turun beberapa kali, lalu sparkle muncul & bertahan ----
    const heartIcon = document.querySelector('.ckm-bounce');
    const sparkWrap = document.querySelector('.ckm-sparkle');
    if (heartIcon) {
      const bounceStyles = {
        0: 'translateY(0)', 1: 'translateY(-5px)', 2: 'translateY(0)',
        3: 'translateY(-5px)', 4: 'translateY(0)', 5: 'translateY(-3px)',
        6: 'translateY(0)', 7: 'translateY(0)',
      };
      animCycle([280, 280, 280, 280, 280, 280, 700], 2500, (phase) => {
        heartIcon.style.transition = 'transform .28s cubic-bezier(.45,0,.55,1)';
        heartIcon.style.transform = bounceStyles[phase];
        if (sparkWrap) {
          const sparkleOpacity = phase === 7 ? 1 : 0;
          const sparkleTransform = sparkleOpacity ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-15deg)';
          sparkWrap.style.transition = 'all .3s cubic-bezier(.34,1.56,.64,1)';
          sparkWrap.style.opacity = sparkleOpacity;
          sparkWrap.style.transform = sparkleTransform;
        }
      });
    }
  } else {
    // reduced motion: tampilkan semua state akhir secara statis
    const checkBg = document.querySelector('.ckm-check-bg');
    const checkFg = document.querySelector('.ckm-check-fg');
    [checkBg, checkFg].forEach(el => { if (el) { el.style.strokeDashoffset = 0; el.style.opacity = 1; } });
    const boltWrap = document.querySelector('.ckm-bolt');
    if (boltWrap) { boltWrap.style.opacity = 1; boltWrap.style.transform = 'scale(1) rotate(0deg)'; }
    const sparkWrap = document.querySelector('.ckm-sparkle');
    if (sparkWrap) { sparkWrap.style.opacity = 1; sparkWrap.style.transform = 'scale(1) rotate(0deg)'; }
  }

  // Sticky WA muncul setelah pengunjung scroll melewati area Hero
  (function(){
    const stickyBtn = document.getElementById('stickyWa');
    if (!stickyBtn) return;
    const heroEl = document.querySelector('.hero');
    function checkScroll(){
      const triggerY = heroEl ? heroEl.offsetTop + heroEl.offsetHeight : 400;
      if (window.scrollY > triggerY) {
        stickyBtn.classList.add('visible');
      } else {
        stickyBtn.classList.remove('visible');
      }
    }
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  })();

  // CTA animated grid cells
  (function(){
    const canvas = document.getElementById('ctaCanvas');
    if (!canvas) return;
    const colors = ['rgba(255,255,255,0.12)','rgba(32,197,181,0.35)','rgba(255,255,255,0.2)','rgba(32,197,181,0.2)','rgba(255,255,255,0.08)'];
    const cellSize = 48;
    const count = 10;
    function rand(min, max){ return Math.random() * (max - min) + min; }
    for (let i = 0; i < count; i++){
      const el = document.createElement('div');
      el.className = 'cta-cell';
      const col = Math.floor(rand(0, 18));
      const row = Math.floor(rand(0, 5));
      el.style.left = (col * cellSize) + 'px';
      el.style.top = (row * cellSize) + 'px';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDuration = rand(2.5, 5.5).toFixed(2) + 's';
      el.style.animationDelay = rand(0, 6).toFixed(2) + 's';
      canvas.appendChild(el);
    }
  })();
