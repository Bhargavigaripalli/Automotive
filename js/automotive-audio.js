/**
 * Automotive Audio Engine
 * Pure Web Audio API Synthesizer for high-tech supercar acoustics
 * Zero dependencies, zero lag, works offline.
 */

class AutomotiveAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
    this.currentRevNode = null;
    this.initDone = false;

    // Check stored mute preference
    if (localStorage.getItem('apex_audio_muted') === 'true') {
      this.isMuted = true;
    }
  }

  init() {
    if (this.initDone) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.initDone = true;
    } catch (e) {
      console.warn("Web Audio not available:", e);
    }
  }

  ensureContext() {
    if (!this.initDone) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.ensureContext();
    this.isMuted = !this.isMuted;
    localStorage.setItem('apex_audio_muted', this.isMuted ? 'true' : 'false');
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
    }
    return !this.isMuted;
  }

  // Futuristic HUD Click / Ping
  playClick() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Laser Scanner / Diagnostic Sweep Frequency
  playScannerSweep() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(950, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  // Twin-Turbo V8 Engine Rev Synthesis
  revEngine(intensity = 1.0, duration = 1.2) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Sub-bass oscillator (engine low-end rumble)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noise = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Harmonic engine pitch envelope
    const baseFreq = 55 + (intensity * 20);
    const peakFreq = 220 + (intensity * 120);

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(peakFreq, now + duration * 0.4);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + duration);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(baseFreq * 0.5, now);
    osc2.frequency.exponentialRampToValueAtTime(peakFreq * 0.5, now + duration * 0.4);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 0.45, now + duration);

    // Distortion/Overdrive filter for throaty exhaust sound
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + duration * 0.4);
    filter.frequency.exponentialRampToValueAtTime(250, now + duration);

    // Gain envelope
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.28 * intensity, now + 0.1);
    gain.gain.linearRampToValueAtTime(0.35 * intensity, now + duration * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);

    // Turbo blow-off flutter (pshhh sound) at the end of rev
    setTimeout(() => {
      this.playTurboFlutter();
    }, (duration * 0.45) * 1000);
  }

  // Turbocharger Spool & Blow-Off Valve flutter
  playTurboFlutter() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2500, now);
    filter.Q.setValueAtTime(4.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.28);
  }

  // Ignition sequence roar
  playIgnition() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    // Starter crank pulses
    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const crankOsc = this.ctx.createOscillator();
      const crankGain = this.ctx.createGain();
      crankOsc.type = 'sawtooth';
      crankOsc.frequency.setValueAtTime(90, now + (i * 0.12));
      crankGain.gain.setValueAtTime(0.15, now + (i * 0.12));
      crankGain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.12) + 0.08);

      crankOsc.connect(crankGain);
      crankGain.connect(this.masterGain);
      crankOsc.start(now + (i * 0.12));
      crankOsc.stop(now + (i * 0.12) + 0.08);
    }

    // Engine catching fire & high rev surge
    setTimeout(() => {
      this.revEngine(1.2, 1.8);
    }, 380);
  }

  // Booking Success Confetti Chord
  playSuccessChord() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + (idx * 0.08));

      gain.gain.setValueAtTime(0.12, now + (idx * 0.08));
      gain.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.08) + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + (idx * 0.08));
      osc.stop(now + (idx * 0.08) + 0.65);
    });
  }
}

// Global singleton instance
window.apexAudio = new AutomotiveAudio();
