/**
 * Audio procedurale (WebAudio, nessun asset): drone di fondo, pioggia e piccoli
 * effetti UI. Parte solo dopo un gesto dell'utente (policy autoplay dei browser).
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = true;

function tone(freq: number, dur: number, type: OscillatorType, vol: number, slideTo?: number) {
  if (!ctx || !master || muted) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

export function startAudio() {
  if (ctx) {
    void ctx.resume();
    return;
  }
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // Drone: due saw leggermente scordate + filtro con LFO lento
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 220;
  filter.Q.value = 4;
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.06;
  filter.connect(droneGain).connect(master);
  for (const f of [55, 55.4, 82.5]) {
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = f;
    o.connect(filter);
    o.start();
  }
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.07;
  lfoGain.gain.value = 120;
  lfo.connect(lfoGain).connect(filter.frequency);
  lfo.start();

  // Pioggia: rumore filtrato in loop
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 3800;
  band.Q.value = 0.4;
  const rainGain = ctx.createGain();
  rainGain.gain.value = 0.05;
  noise.connect(band).connect(rainGain).connect(master);
  noise.start();

  // Beep lontani dal rack
  window.setInterval(() => {
    if (Math.random() < 0.5) tone(1400 + Math.random() * 900, 0.06, 'square', 0.008);
  }, 2600);
}

export function setMuted(m: boolean) {
  muted = m;
  if (!ctx || !master) return;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.linearRampToValueAtTime(m ? 0 : 0.9, ctx.currentTime + 0.6);
}

export const sfx = {
  hover: () => tone(880, 0.07, 'sine', 0.05, 1320),
  select: () => {
    tone(220, 0.35, 'sawtooth', 0.05, 880);
    tone(660, 0.18, 'square', 0.02, 1320);
  },
  back: () => tone(660, 0.25, 'sawtooth', 0.04, 160),
  boot: () => {
    tone(110, 0.9, 'sawtooth', 0.06, 440);
    tone(1760, 0.2, 'square', 0.02);
  },
};
