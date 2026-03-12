// X-Files Theme Synthesizer (Web Audio API)
export class XFilesTheme {
  constructor() {
    this.ctx = null;
    this.gainNode = null;
    this.muted = false;
    this.playing = false;
    this._loopTimeout = null;
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.25, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);
    this._startDrone();
    this._loop();
    this.playing = true;
  }

  _startDrone() {
    // Low E drone — eerie background hum
    for (const freq of [41.2, 82.4]) {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      g.gain.setValueAtTime(0.06, this.ctx.currentTime);
      osc.connect(g);
      g.connect(this.gainNode);
      osc.start();
    }

    // Subtle tremolo pad
    const pad = this.ctx.createOscillator();
    const padGain = this.ctx.createGain();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    pad.type = 'triangle';
    pad.frequency.setValueAtTime(164.8, this.ctx.currentTime); // E3
    padGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    lfo.frequency.setValueAtTime(0.4, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(padGain.gain);
    pad.connect(padGain);
    padGain.connect(this.gainNode);
    lfo.start();
    pad.start();
  }

  _playNote(freq, startTime, duration, volume = 0.14) {
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    env.gain.setValueAtTime(0, startTime);
    env.gain.linearRampToValueAtTime(volume, startTime + 0.06);
    env.gain.setValueAtTime(volume * 0.85, startTime + duration * 0.6);
    env.gain.linearRampToValueAtTime(0, startTime + duration);
    osc.connect(env);
    env.connect(this.gainNode);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  _loop() {
    if (this.muted || !this.playing) return;

    // X-Files main theme melody approximation
    // E4, G4, A4, B4, A4, G4, E4, D4, E4 → rest → repeat
    const melody = [
      [329.63, 0.75],  // E4
      [392.00, 0.38],  // G4
      [440.00, 0.38],  // A4
      [493.88, 0.75],  // B4
      [440.00, 0.38],  // A4
      [392.00, 0.38],  // G4
      [329.63, 0.75],  // E4
      [293.66, 0.55],  // D4
      [329.63, 0.75],  // E4
    ];

    let t = this.ctx.currentTime + 0.5;
    let total = 0;
    for (const [freq, dur] of melody) {
      this._playNote(freq, t, dur * 0.88);
      t += dur;
      total += dur;
    }
    total += 1.5; // rest before next loop

    this._loopTimeout = setTimeout(() => this._loop(), total * 1000);
  }

  toggle() {
    if (!this.ctx) this.init();
    this.muted = !this.muted;
    const target = this.muted ? 0 : 0.25;
    this.gainNode.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.4);
    if (!this.muted && !this.playing) {
      this.playing = true;
      this._loop();
    }
    return this.muted;
  }
}
