/**
 * Automotive HUD & Interactive Modules Engine
 * Cockpit Cluster, Holographic Scanner, Paint Studio, Before/After Slider, Live Booking Wizard
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. COCKPIT INSTRUMENT CLUSTER (HERO GAUGE HUD)
     ========================================================================== */
  const hudPanel = document.getElementById('cockpitHudPanel');
  const speedValEl = document.getElementById('hudSpeedVal');
  const rpmValEl = document.getElementById('hudRpmVal');
  const boostValEl = document.getElementById('hudBoostVal');
  const speedProgress = document.getElementById('hudSpeedProgress');
  const rpmProgress = document.getElementById('hudRpmProgress');
  const boostProgress = document.getElementById('hudBoostProgress');
  const btnRevPedal = document.getElementById('btnRevPedal');
  const modeTabBtns = document.querySelectorAll('.mode-tab-btn');

  let currentSpeed = 0;
  let currentRpm = 1100; // Idle RPM
  let currentBoost = 0.2; // Idle PSI
  let isRevving = false;
  let revInterval = null;

  function updateGauges(speed, rpm, boost) {
    if (speedValEl) speedValEl.textContent = Math.round(speed);
    if (rpmValEl) rpmValEl.textContent = (rpm / 1000).toFixed(1);
    if (boostValEl) boostValEl.textContent = boost.toFixed(1);

    // SVG arc stroke offsets (circumference: ~251)
    if (speedProgress) {
      const speedPct = Math.min(speed / 200, 1);
      speedProgress.style.strokeDashoffset = 251 - (251 * speedPct * 0.75);
    }
    if (rpmProgress) {
      const rpmPct = Math.min(rpm / 8000, 1);
      rpmProgress.style.strokeDashoffset = 251 - (251 * rpmPct * 0.75);
      rpmProgress.style.stroke = rpm > 6500 ? '#f43f5e' : (rpm > 4500 ? '#f59e0b' : '#38bdf8');
    }
    if (boostProgress) {
      const boostPct = Math.min(boost / 28, 1);
      boostProgress.style.strokeDashoffset = 251 - (251 * boostPct * 0.75);
    }
  }

  // Initial render at idle
  updateGauges(currentSpeed, currentRpm, currentBoost);

  // Rev Button interaction
  if (btnRevPedal) {
    const startRev = (e) => {
      e.preventDefault();
      if (isRevving) return;
      isRevving = true;
      btnRevPedal.classList.add('revving');
      if (window.setAutomotiveSpeedBoost) window.setAutomotiveSpeedBoost(true);
      if (window.apexAudio) window.apexAudio.revEngine(1.0, 1.8);

      clearInterval(revInterval);
      revInterval = setInterval(() => {
        if (currentRpm < 7400) currentRpm += 380;
        if (currentSpeed < 125) currentSpeed += 7;
        if (currentBoost < 22.4) currentBoost += 1.4;
        updateGauges(currentSpeed, currentRpm, currentBoost);
      }, 35);
    };

    const stopRev = (e) => {
      if (!isRevving) return;
      isRevving = false;
      btnRevPedal.classList.remove('revving');
      if (window.setAutomotiveSpeedBoost) window.setAutomotiveSpeedBoost(false);

      clearInterval(revInterval);
      revInterval = setInterval(() => {
        let changed = false;
        if (currentRpm > 1100) { currentRpm -= 250; changed = true; } else { currentRpm = 1100; }
        if (currentSpeed > 0) { currentSpeed -= 4; changed = true; } else { currentSpeed = 0; }
        if (currentBoost > 0.2) { currentBoost -= 0.9; changed = true; } else { currentBoost = 0.2; }
        updateGauges(currentSpeed, currentRpm, currentBoost);
        if (!changed) clearInterval(revInterval);
      }, 35);
    };

    btnRevPedal.addEventListener('mousedown', startRev);
    window.addEventListener('mouseup', stopRev);
    btnRevPedal.addEventListener('touchstart', startRev, { passive: false });
    window.addEventListener('touchend', stopRev);
  }

  // Drive Mode Tabs
  modeTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-mode');
      if (window.apexAudio) window.apexAudio.playClick();

      if (hudPanel) {
        hudPanel.classList.remove('mode-comfort', 'mode-eco', 'mode-sport', 'mode-track');
        hudPanel.classList.add('mode-' + mode);
      }
    });
  });


  /* ==========================================================================
     2. HOLOGRAPHIC 360° VEHICLE DIAGNOSTIC HUD SCANNER
     ========================================================================== */
  const pins = document.querySelectorAll('.diagnostic-pin');
  const compNameEl = document.getElementById('diagCompName');
  const compStatusEl = document.getElementById('diagCompStatus');
  const compSpecEl = document.getElementById('diagCompSpec');
  const compHealthBar = document.getElementById('diagCompHealthBar');
  const compHealthVal = document.getElementById('diagCompHealthVal');
  const btnRunFullScan = document.getElementById('btnRunFullScan');
  const scannerBar = document.getElementById('hudScannerBar');

  const componentData = {
    engine: {
      name: "Twin-Turbo 4.0L V8 Engine",
      status: "OPTIMAL PERFORMANCE",
      statusClass: "text-success",
      spec: "620 HP / 850 Nm | Operating Temp: 92°C | Oil Life: 96%",
      health: 98
    },
    brakes: {
      name: "Carbon-Ceramic Braking Matrix",
      status: "EXCELLENT CONDITION",
      statusClass: "text-success",
      spec: "6-Piston Front Calipers | Rotor Wear: 8% | Fluid Boiling Pt: 310°C",
      health: 95
    },
    transmission: {
      name: "8-Speed Dual-Clutch Transmission",
      status: "OPTIMAL SYNC",
      statusClass: "text-success",
      spec: "Shift Latency: 0.08s | Fluid Pressure: 34 PSI | Temp: 82°C",
      health: 97
    },
    battery: {
      name: "800V High-Voltage Battery Pack",
      status: "BALANCED CELLS",
      statusClass: "text-success",
      spec: "State of Charge: 94% | Cell Health: 99.8% | Cooling Active",
      health: 99
    },
    suspension: {
      name: "Active Magnetic Dampers",
      status: "DYNAMIC CALIBRATED",
      statusClass: "text-success",
      spec: "Response Time: 2ms | Ride Height: -15mm Track | Nitrogen: 100%",
      health: 96
    },
    turbo: {
      name: "Twin Variable-Geometry Turbochargers",
      status: "PEAK BOOST READY",
      statusClass: "text-success",
      spec: "Spool Speed: 180,000 RPM | Peak Boost: 24.5 PSI | Wastegate Normal",
      health: 99
    },
    ecu: {
      name: "AI OBD-II Telemetry Core",
      status: "ZERO FAULT CODES",
      statusClass: "text-success",
      spec: "CAN-Bus Frequency: 1 Mbps | DTC Codes: 0 | Firmware: v5.2 Up-to-date",
      health: 100
    }
  };

  pins.forEach(pin => {
    pin.addEventListener('click', () => {
      pins.forEach(p => p.classList.remove('active'));
      pin.classList.add('active');
      const compKey = pin.getAttribute('data-component');
      const data = componentData[compKey];
      if (data) {
        if (compNameEl) compNameEl.textContent = data.name;
        if (compStatusEl) {
          compStatusEl.textContent = data.status;
          compStatusEl.className = 'badge bg-success-subtle text-success border border-success-subtle px-3 py-1';
        }
        if (compSpecEl) compSpecEl.textContent = data.spec;
        if (compHealthBar) compHealthBar.style.width = data.health + '%';
        if (compHealthVal) compHealthVal.textContent = data.health + '%';
        if (window.apexAudio) window.apexAudio.playScannerSweep();
      }
    });
  });

  // Run Full AI Diagnostic Scan Button
  if (btnRunFullScan) {
    btnRunFullScan.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.apexAudio) window.apexAudio.playClick();
      window.location.href = '404.html';
    });
  }


  /* ==========================================================================
     3. INTERACTIVE 3D VEHICLE COLOR STUDIO & CUSTOMIZER
     ========================================================================== */
  const colorSwatches = document.querySelectorAll('.color-swatch-ring');
  const carStudioPreview = document.getElementById('carStudioPreview');
  const carStudioImg = document.getElementById('carStudioImg');
  const colorNameLabel = document.getElementById('currentColorName');

  const carColorImages = {
    crimson: { name: 'Apex Crimson Red', img: 'assets/images/img_25.webp', tint: '#e11d48' },
    blue: { name: 'Hyper Sonic Blue', img: 'assets/images/img_24.webp', tint: '#2563eb' },
    black: { name: 'Stealth Satin Obsidian', img: 'assets/images/img_36.webp', tint: '#0f172a' },
    silver: { name: 'Nardo Matte Silver', img: 'assets/images/img_34.webp', tint: '#64748b' },
    green: { name: 'British Racing Green', img: 'assets/images/img_35.webp', tint: '#059669' }
  };

  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      const colorKey = swatch.getAttribute('data-color');
      const colorData = carColorImages[colorKey];

      if (colorData && carStudioImg) {
        // Trigger metallic sheen animation
        if (carStudioPreview) {
          carStudioPreview.classList.remove('sheen-active');
          void carStudioPreview.offsetWidth; // trigger reflow
          carStudioPreview.classList.add('sheen-active');
        }
        carStudioImg.style.opacity = '0.4';
        setTimeout(() => {
          carStudioImg.src = colorData.img;
          carStudioImg.style.opacity = '1';
        }, 180);

        if (colorNameLabel) colorNameLabel.textContent = colorData.name;
        if (window.apexAudio) window.apexAudio.playClick();
      }
    });
  });


  /* ==========================================================================
     4. BEFORE / AFTER VEHICLE RESTORATION DRAG SLIDER
     ========================================================================== */
  const baWrapper = document.getElementById('beforeAfterWrapper');
  const baAfter = document.getElementById('baAfterImg');
  const baHandle = document.getElementById('baSliderHandle');

  if (baWrapper && baAfter && baHandle) {
    let isDraggingBA = false;

    const setSliderPos = (clientX) => {
      const rect = baWrapper.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;
      const pct = (offsetX / rect.width) * 100;
      baAfter.style.width = pct + '%';
      baHandle.style.left = pct + '%';
    };

    baWrapper.addEventListener('mousedown', (e) => {
      isDraggingBA = true;
      setSliderPos(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingBA) return;
      setSliderPos(e.clientX);
    });

    window.addEventListener('mouseup', () => { isDraggingBA = false; });

    // Touch events for mobile
    baWrapper.addEventListener('touchstart', (e) => {
      isDraggingBA = true;
      if (e.touches[0]) setSliderPos(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDraggingBA || !e.touches[0]) return;
      setSliderPos(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => { isDraggingBA = false; });
  }


  /* ==========================================================================
     5. STEP-BY-STEP LIVE BOOKING WIZARD WITH DYNAMIC PRICE COUNTER
     ========================================================================== */
  const wizardNodes = document.querySelectorAll('.wizard-step-node');
  const wizardSteps = document.querySelectorAll('.wizard-step-content');
  const wizardLineFill = document.getElementById('wizardLineFill');
  const brandCards = document.querySelectorAll('.brand-select-card');
  const serviceCheckboxes = document.querySelectorAll('.service-calc-checkbox');
  const rollingPriceEl = document.getElementById('wizardRollingPrice');
  const btnNextStep = document.getElementById('btnWizardNext');
  const btnPrevStep = document.getElementById('btnWizardPrev');
  const bookingSummaryBox = document.getElementById('bookingSummaryBox');

  let currentWizardStep = 1;
  let selectedBrand = 'Porsche';
  let selectedVehicleModel = '911 Carrera S';
  let selectedBasePrice = 199; // Standard package base
  let addOnsTotal = 0;

  function recalculatePrice() {
    addOnsTotal = 0;
    serviceCheckboxes.forEach(cb => {
      if (cb.checked) {
        addOnsTotal += parseInt(cb.getAttribute('data-price') || '0', 10);
      }
    });
    const total = selectedBasePrice + addOnsTotal;

    // Rolling counter animation
    if (rollingPriceEl) {
      const startVal = parseInt(rollingPriceEl.textContent.replace('$', '') || '0', 10);
      animateNumberRoll(rollingPriceEl, startVal, total, '$');
    }
  }

  function animateNumberRoll(el, start, end, prefix = '') {
    const duration = 400;
    const startTime = performance.now();
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const val = Math.floor(start + (end - start) * progress);
      el.textContent = prefix + val;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Brand selection
  brandCards.forEach(card => {
    card.addEventListener('click', () => {
      brandCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedBrand = card.getAttribute('data-brand') || 'Vehicle';
      if (window.apexAudio) window.apexAudio.playClick();
    });
  });

  // Checkbox price listeners
  serviceCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      recalculatePrice();
      if (window.apexAudio) window.apexAudio.playClick();
    });
  });

  // Step navigation
  function goToWizardStep(stepNum) {
    currentWizardStep = stepNum;

    // Update nodes
    wizardNodes.forEach((node, idx) => {
      const nStep = idx + 1;
      node.classList.remove('active', 'completed');
      if (nStep < currentWizardStep) node.classList.add('completed');
      if (nStep === currentWizardStep) node.classList.add('active');
    });

    // Update progress bar line
    if (wizardLineFill) {
      const pct = ((currentWizardStep - 1) / (wizardNodes.length - 1)) * 100;
      wizardLineFill.style.width = pct + '%';
    }

    // Toggle step contents
    wizardSteps.forEach((sContent, idx) => {
      sContent.classList.toggle('d-none', (idx + 1) !== currentWizardStep);
    });

    // Toggle Previous button
    if (btnPrevStep) {
      btnPrevStep.classList.toggle('d-none', currentWizardStep === 1);
    }

    // Update Next/Finish button label
    // Update Next/Finish button label
    if (btnNextStep) {
      btnNextStep.innerHTML = `Continue <i class="fas fa-arrow-right ms-2"></i>`;
    }
  }

  if (btnNextStep) {
    btnNextStep.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.apexAudio) window.apexAudio.playClick();
      window.location.href = '404.html';
    });
  }

  if (btnPrevStep) {
    btnPrevStep.addEventListener('click', () => {
      if (window.apexAudio) window.apexAudio.playClick();
      if (currentWizardStep > 1) {
        goToWizardStep(currentWizardStep - 1);
      }
    });
  }

  recalculatePrice();
});
