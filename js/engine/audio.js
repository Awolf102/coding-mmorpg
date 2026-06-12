/* ============================================================
   Audio — tiny WebAudio chiptune SFX, no external assets
   ============================================================ */
window.AudioFX = (function () {
  let ctx = null;
  let enabled = true;

  function ac() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { return null; }
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, vol, when, slideTo) {
    const a = ac(); if (!a || !enabled) return;
    const t0 = a.currentTime + (when || 0);
    const osc = a.createOscillator();
    const g = a.createGain();
    osc.type = type || "square";
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.08, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(a.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  }

  function noise(dur, vol, when) {
    const a = ac(); if (!a || !enabled) return;
    const t0 = a.currentTime + (when || 0);
    const len = Math.floor(a.sampleRate * dur);
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = a.createBufferSource(); src.buffer = buf;
    const g = a.createGain(); g.gain.value = vol || 0.06;
    src.connect(g); g.connect(a.destination);
    src.start(t0);
  }

  return {
    setEnabled(v) { enabled = v; },
    isEnabled() { return enabled; },
    click()    { tone(620, 0.05, "square", 0.04); },
    step()     { tone(190, 0.03, "triangle", 0.015); },
    correct()  { tone(523, 0.09, "square", 0.05); tone(659, 0.09, "square", 0.05, 0.08); tone(784, 0.16, "square", 0.06, 0.16); },
    wrong()    { tone(220, 0.18, "sawtooth", 0.05); tone(150, 0.25, "sawtooth", 0.05, 0.1); },
    hit()      { noise(0.12, 0.07); tone(140, 0.1, "square", 0.04); },
    hurt()     { tone(110, 0.2, "sawtooth", 0.06, 0, 60); },
    coin()     { tone(988, 0.06, "square", 0.045); tone(1319, 0.12, "square", 0.045, 0.06); },
    levelup()  { [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, "square", 0.06, i * 0.09)); },
    quest()    { [523, 659, 784, 659, 1047].forEach((f, i) => tone(f, 0.14, "triangle", 0.07, i * 0.1)); },
    boss()     { tone(98, 0.5, "sawtooth", 0.07, 0, 65); tone(82, 0.6, "sawtooth", 0.07, 0.3, 50); noise(0.4, 0.05, 0.1); },
    victory()  { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, 0.18, "square", 0.06, i * 0.11)); },
    death()    { [330, 262, 220, 165, 110].forEach((f, i) => tone(f, 0.25, "sawtooth", 0.05, i * 0.18)); },
    teleport() { tone(300, 0.3, "sine", 0.06, 0, 900); },
    open()     { tone(440, 0.05, "triangle", 0.04); tone(587, 0.07, "triangle", 0.04, 0.04); }
  };
})();
