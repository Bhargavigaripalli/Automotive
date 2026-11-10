/**
 * Automotive Visual Effects Engine
 * Cinematic Ignition Preloader, Custom HUD Cursor, 3D Tilt Cards, Scroll Velocity Speedometer
 */

(function () {

    /* ==========================================================================
     1. INSTANT PAGE INITIALIZATION & PERFORMANCE ENGINE
     ========================================================================== */
  // Remove any legacy preloader element if present
  const anyPreloader = document.getElementById('preloader') || document.getElementById('cinematicPreloader');
  if (anyPreloader) {
    anyPreloader.remove();
  }
  document.body.style.overflow = '';
  document.dispatchEvent(new Event('preloaderDone'));

/* ==========================================================================
     2. CUSTOM AUTOMOTIVE HUD CURSOR WITH CLICK SPARKS
     ========================================================================== */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const ring = document.createElement('div');
    ring.className = 'hud-cursor-ring';
    const dot = document.createElement('div');
    dot.className = 'hud-cursor-dot';
    document.body.appendChild(ring);
    document.body.appendChild(dot);

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;

    let cursorMoving = false;
    let cursorRaf = null;

    // Spring Lerp for ring (only updates while mouse is in motion to save GPU/CPU cycles)
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.25;
      ringY += (mouseY - ringY) * 0.25;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';

      if (Math.abs(mouseX - ringX) > 0.25 || Math.abs(mouseY - ringY) > 0.25) {
        cursorRaf = requestAnimationFrame(renderCursor);
      } else {
        cursorMoving = false;
      }
    }

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';

      if (!cursorMoving) {
        cursorMoving = true;
        cancelAnimationFrame(cursorRaf);
        cursorRaf = requestAnimationFrame(renderCursor);
      }
    }, { passive: true });

    // Hover state expansion on interactive elements
    const interactiveSelectors = 'a, button, input, select, textarea, .brand-select-card, .diagnostic-pin, .color-swatch-ring, .service-card-hover';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        document.body.classList.add('hud-cursor-active');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        document.body.classList.remove('hud-cursor-active');
      }
    });

    // Neon click spark dispersion
    window.addEventListener('click', (e) => {
      for (let i = 0; i < 6; i++) {
        const spark = document.createElement('div');
        spark.className = 'cursor-spark';
        const angle = (Math.PI * 2 / 6) * i + (Math.random() * 0.5);
        const dist = 25 + Math.random() * 25;
        spark.style.left = e.clientX + 'px';
        spark.style.top = e.clientY + 'px';
        spark.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
        spark.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 600);
      }
    });
  }


  /* ==========================================================================
     3. 3D PERSPECTIVE TILT CARDS WITH SPECULAR SHINE
     ========================================================================== */
  function init3DTiltCards() {
    const tiltCards = document.querySelectorAll('.card-3d-tilt, .service-card-hover');

    tiltCards.forEach(card => {
      // Add specular shine element if not present
      if (!card.querySelector('.card-specular-shine')) {
        const shine = document.createElement('div');
        shine.className = 'card-specular-shine';
        card.appendChild(shine);
      }

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg tilt
        const rotateY = ((x - centerX) / centerX) * 9;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        card.style.setProperty('--shine-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--shine-y', `${(y / rect.height) * 100}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
      });
    });
  }


  /* ==========================================================================
     4. FLOATING SCROLL VELOCITY SPEEDOMETER BADGE
     ========================================================================== */
  const hudSpeedBadge = document.getElementById('floatingHudSpeed');
  const hudScrollSpeedVal = document.getElementById('hudScrollSpeedVal');
  let lastScrollY = window.scrollY;
  let lastScrollTime = performance.now();
  let scrollSpeedTimer = null;

  window.addEventListener('scroll', () => {
    const now = performance.now();
    const currentScrollY = window.scrollY;
    const dt = Math.max(now - lastScrollTime, 1);
    const dy = Math.abs(currentScrollY - lastScrollY);
    const velocity = (dy / dt) * 45; // Simulated MPH scale
    const simulatedMph = Math.min(Math.round(velocity), 185);

    if (hudSpeedBadge) {
      if (currentScrollY > 350) {
        hudSpeedBadge.classList.add('show');
      } else {
        hudSpeedBadge.classList.remove('show');
      }
    }

    if (hudScrollSpeedVal) {
      hudScrollSpeedVal.textContent = simulatedMph;
    }

    lastScrollY = currentScrollY;
    lastScrollTime = now;

    clearTimeout(scrollSpeedTimer);
    scrollSpeedTimer = setTimeout(() => {
      if (hudScrollSpeedVal) hudScrollSpeedVal.textContent = '0';
    }, 250);
  }, { passive: true });


  /* ==========================================================================
     5. BACK TO TOP ROCKET CAR
     ========================================================================== */
  const btnBackToTop = document.getElementById('btnBackToTop');
  if (btnBackToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btnBackToTop.classList.add('show');
      } else {
        btnBackToTop.classList.remove('show');
      }
    });

    btnBackToTop.addEventListener('click', () => {
      if (window.apexAudio) window.apexAudio.revEngine(1.2, 1.0);
      btnBackToTop.classList.add('launching');

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      setTimeout(() => {
        btnBackToTop.classList.remove('launching');
      }, 900);
    });
  }

  // Audio mute/unmute navbar toggle listener
  const audioToggleBtn = document.getElementById('audioTelemetryToggle');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      if (window.apexAudio) {
        const isAudioOn = window.apexAudio.toggleMute();
        audioToggleBtn.classList.toggle('audio-active', isAudioOn);
        const label = audioToggleBtn.querySelector('.audio-label');
        if (label) label.textContent = isAudioOn ? 'AUDIO ON' : 'MUTED';
      }
    });
  }

  // Run tilt cards initialization when preloader finishes or DOM is ready
  document.addEventListener('preloaderDone', init3DTiltCards);
  document.addEventListener('DOMContentLoaded', init3DTiltCards);

})();
