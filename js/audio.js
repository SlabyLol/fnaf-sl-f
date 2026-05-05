/* ═══════════════════════════════════════════
   FNAF: SISTER LOCATION — FANMADE
   Audio System (Web Audio API — procedural)
═══════════════════════════════════════════ */

const Audio = (() => {
  let ctx = null;
  let masterGain = null;
  let ambientNode = null;
  let ambientGain = null;

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.7;
    masterGain.connect(ctx.destination);
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  // ── AMBIENT DRONE ──
  function startAmbient(type = 'default') {
    stopAmbient();
    init();
    ambientGain = ctx.createGain();
    ambientGain.gain.value = 0;
    ambientGain.connect(masterGain);

    const freqs = type === 'ballora' ? [55, 82, 110] :
                  type === 'danger'  ? [40, 60, 80]  :
                                       [60, 90, 120];

    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      g.gain.value = 0.08 - i * 0.02;
      osc.connect(g);
      g.connect(ambientGain);
      osc.start();

      // Slow LFO modulation
      const lfo = ctx.createOscillator();
      const lfoG = ctx.createGain();
      lfo.frequency.value = 0.1 + i * 0.07;
      lfoG.gain.value = f * 0.04;
      lfo.connect(lfoG);
      lfoG.connect(osc.frequency);
      lfo.start();
    });

    // Fade in
    ambientGain.gain.setTargetAtTime(1, ctx.currentTime, 1.5);
    ambientNode = ambientGain;
  }

  function stopAmbient() {
    if (ambientNode) {
      ambientNode.gain.setTargetAtTime(0, ctx ? ctx.currentTime : 0, 0.5);
      setTimeout(() => { try { ambientNode.disconnect(); } catch(e){} }, 2000);
      ambientNode = null;
    }
  }

  // ── SHOCK SOUND ──
  function playShock() {
    init(); resume();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
    }
    const src = ctx.createBufferSource();
    const g   = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3000;
    filter.Q.value = 0.5;
    src.buffer = buf;
    g.gain.value = 0.6;
    src.connect(filter);
    filter.connect(g);
    g.connect(masterGain);
    src.start();
  }

  // ── BUTTON CLICK ──
  function playClick() {
    init(); resume();
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 800;
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.connect(g);
    g.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  }

  // ── JUMPSCARE STING ──
  function playJumpscare() {
    init(); resume();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / ctx.sampleRate;
      data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 4) * 1.5;
    }
    const src  = ctx.createBufferSource();
    const dist = ctx.createWaveShaper();
    const g    = ctx.createGain();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = (Math.PI + 400) * x / (Math.PI + 400 * Math.abs(x));
    }
    dist.curve = curve;
    src.buffer = buf;
    g.gain.value = 1.0;
    src.connect(dist);
    dist.connect(g);
    g.connect(masterGain);
    src.start();
  }

  // ── BON-BON AUDIO (calming tone) ──
  function playBonBon() {
    init(); resume();
    const notes = [523, 659, 784, 659, 523];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.18;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.25, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  // ── BALLORA MUSIC BOX (faint distant music) ──
  function playBalloraMusic(volume = 0.3) {
    init(); resume();
    const notes = [392, 440, 494, 523, 494, 440, 392, 349];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.3;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(volume * 0.15, t + 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(t);
      osc.stop(t + 0.5);
    });
  }

  // ── SUCCESS CHIME ──
  function playSuccess() {
    init(); resume();
    const notes = [523, 659, 784];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.12;
      g.gain.setValueAtTime(0.2, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(t);
      osc.stop(t + 0.35);
    });
  }

  // ── POWER LOW BEEP ──
  function playPowerLow() {
    init(); resume();
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 220;
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(g);
    g.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  // ── SWITCH FLIP ──
  function playSwitch() {
    init(); resume();
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    g.gain.setValueAtTime(0.2, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(g);
    g.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  return { init, resume, startAmbient, stopAmbient, playShock, playClick, playJumpscare, playBonBon, playBalloraMusic, playSuccess, playPowerLow, playSwitch };
})();
