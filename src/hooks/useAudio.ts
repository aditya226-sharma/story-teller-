"use client";

type OscillatorNode = globalThis.OscillatorNode;
type GainNode = globalThis.GainNode;
type BiquadFilterNode = globalThis.BiquadFilterNode;
type AudioBufferSourceNode = globalThis.AudioBufferSourceNode;

interface MusicLayer {
  oscillators: OscillatorNode[];
  gain: GainNode;
  filter: BiquadFilterNode;
  freq: number;
  type: OscillatorType;
}

interface ChapterMusic {
  notes: number[];
  chords: number[][];
  tempo: number;
  filterFreq: number;
  reverbMix: number;
  bassFreq: number;
  padVol: number;
  leadVol: number;
  bassVol: number;
  arpVol: number;
  ambience: "dark" | "cold" | "deep" | "airy" | "tense" | "bright" | "warm" | "ethereal";
}

const CHAPTER_MUSIC: ChapterMusic[] = [
  // Ch1: dark, cold, desolate — lofi dark ambient
  {
    notes: [110, 130.81, 146.83, 164.81, 174.61, 196, 220],
    chords: [[110, 130.81, 164.81], [130.81, 164.81, 196], [110, 146.83, 174.61]],
    tempo: 0.25,
    filterFreq: 300,
    reverbMix: 0.7,
    bassFreq: 55,
    padVol: 0.06,
    leadVol: 0.01,
    bassVol: 0.04,
    arpVol: 0.008,
    ambience: "dark",
  },
  // Ch2: mysterious, hopeful blue
  {
    notes: [130.81, 146.83, 164.81, 196, 220, 261.63, 293.66],
    chords: [[130.81, 164.81, 220], [146.81, 196, 261.63], [164.81, 220, 293.66]],
    tempo: 0.3,
    filterFreq: 450,
    reverbMix: 0.6,
    bassFreq: 65.41,
    padVol: 0.05,
    leadVol: 0.02,
    bassVol: 0.04,
    arpVol: 0.015,
    ambience: "cold",
  },
  // Ch3: deep, underwater
  {
    notes: [98, 110, 130.81, 146.83, 164.81, 174.61, 196],
    chords: [[98, 130.81, 164.81], [110, 146.83, 196], [98, 110, 164.81]],
    tempo: 0.2,
    filterFreq: 250,
    reverbMix: 0.8,
    bassFreq: 49,
    padVol: 0.07,
    leadVol: 0.01,
    bassVol: 0.05,
    arpVol: 0.005,
    ambience: "deep",
  },
  // Ch4: airy, floating
  {
    notes: [196, 220, 261.63, 293.66, 329.63, 392, 440],
    chords: [[196, 261.63, 329.63], [220, 293.66, 392], [261.63, 329.63, 440]],
    tempo: 0.35,
    filterFreq: 600,
    reverbMix: 0.5,
    bassFreq: 98,
    padVol: 0.04,
    leadVol: 0.02,
    bassVol: 0.03,
    arpVol: 0.012,
    ambience: "airy",
  },
  // Ch5: tense, dramatic
  {
    notes: [116.54, 130.81, 146.83, 155.56, 174.61, 196, 233.08],
    chords: [[116.54, 146.83, 174.61], [130.81, 155.56, 196], [116.54, 130.81, 174.61]],
    tempo: 0.28,
    filterFreq: 380,
    reverbMix: 0.6,
    bassFreq: 58.27,
    padVol: 0.07,
    leadVol: 0.015,
    bassVol: 0.06,
    arpVol: 0.01,
    ambience: "tense",
  },
  // Ch6: emotional, bright
  {
    notes: [220, 261.63, 293.66, 329.63, 392, 440, 523.25],
    chords: [[220, 261.63, 329.63], [261.63, 329.63, 392], [220, 293.66, 440]],
    tempo: 0.4,
    filterFreq: 700,
    reverbMix: 0.4,
    bassFreq: 110,
    padVol: 0.05,
    leadVol: 0.025,
    bassVol: 0.04,
    arpVol: 0.018,
    ambience: "bright",
  },
  // Ch7: warm, triumphant
  {
    notes: [196, 220, 261.63, 293.66, 329.63, 392, 440],
    chords: [[196, 261.63, 392], [220, 293.63, 440], [196, 329.63, 392]],
    tempo: 0.45,
    filterFreq: 800,
    reverbMix: 0.35,
    bassFreq: 98,
    padVol: 0.06,
    leadVol: 0.03,
    bassVol: 0.05,
    arpVol: 0.02,
    ambience: "warm",
  },
  // Ch8: ethereal, peaceful
  {
    notes: [164.81, 196, 220, 261.63, 293.66, 329.63, 392],
    chords: [[164.81, 220, 329.63], [196, 261.63, 392], [164.81, 293.66, 329.63]],
    tempo: 0.32,
    filterFreq: 550,
    reverbMix: 0.55,
    bassFreq: 82.41,
    padVol: 0.05,
    leadVol: 0.02,
    bassVol: 0.04,
    arpVol: 0.015,
    ambience: "ethereal",
  },
];

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private reverbGain: GainNode | null = null;
  private dryGain: GainNode | null = null;

  private layers: MusicLayer[] = [];
  private currentChapter = 0;
  private targetChapter = 0;
  private transitionProgress = 1;
  private isPlaying = false;
  private animFrame: number | null = null;
  private arpInterval: ReturnType<typeof setInterval> | null = null;

  private lfoNodes: OscillatorNode[] = [];
  private lfoGains: GainNode[] = [];

  // SFX
  private windGain: GainNode | null = null;
  private windNode: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;
  private rainNode: AudioBufferSourceNode | null = null;
  private thunderInterval: ReturnType<typeof setInterval> | null = null;
  private waterGain: GainNode | null = null;
  private waterNode: AudioBufferSourceNode | null = null;

  // Vinyl crackle
  private crackleGain: GainNode | null = null;
  private crackleNode: AudioBufferSourceNode | null = null;

  async init() {
    if (this.ctx) return;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(this.ctx.destination);

    this.reverbNode = this.ctx.createConvolver();
    this.reverbNode.buffer = this.createReverbImpulse(3.5, 2.5);
    this.reverbGain = this.ctx.createGain();
    this.reverbGain.gain.value = 0.6;
    this.dryGain = this.ctx.createGain();
    this.dryGain.gain.value = 0.4;

    this.reverbNode.connect(this.reverbGain);
    this.reverbGain.connect(this.masterGain);
    this.dryGain.connect(this.masterGain);

    this.createCrackle();
    this.initSFX();
  }

  private createReverbImpulse(duration: number, decay: number): AudioBuffer {
    const sampleRate = this.ctx!.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.ctx!.createBuffer(2, length, sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    return buffer;
  }

  private createCrackle() {
    if (!this.ctx) return;
    this.crackleGain = this.ctx.createGain();
    this.crackleGain.gain.value = 0;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 5000;
    this.crackleGain.connect(filter);
    filter.connect(this.masterGain!);

    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 6, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      // Sparse crackle pops
      data[i] = Math.random() > 0.997 ? (Math.random() * 2 - 1) * 0.8 : (Math.random() * 2 - 1) * 0.02;
    }
    this.crackleNode = this.ctx.createBufferSource();
    this.crackleNode.buffer = buf;
    this.crackleNode.loop = true;
    this.crackleNode.connect(this.crackleGain);
    this.crackleNode.start();
  }

  private initSFX() {
    if (!this.ctx) return;

    // Wind
    this.windGain = this.ctx.createGain();
    this.windGain.gain.value = 0;
    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = "bandpass";
    windFilter.frequency.value = 400;
    windFilter.Q.value = 0.5;
    this.windGain.connect(windFilter);
    windFilter.connect(this.masterGain!);

    const windBuf = this.ctx.createBuffer(1, this.ctx.sampleRate * 4, this.ctx.sampleRate);
    const windData = windBuf.getChannelData(0);
    for (let i = 0; i < windData.length; i++) {
      windData[i] = Math.random() * 2 - 1;
    }
    this.windNode = this.ctx.createBufferSource();
    this.windNode.buffer = windBuf;
    this.windNode.loop = true;
    this.windNode.connect(this.windGain);
    this.windNode.start();

    // Rain
    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.value = 0;
    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = "highpass";
    rainFilter.frequency.value = 2000;
    this.rainGain.connect(rainFilter);
    rainFilter.connect(this.masterGain!);

    const rainBuf = this.ctx.createBuffer(1, this.ctx.sampleRate * 3, this.ctx.sampleRate);
    const rainData = rainBuf.getChannelData(0);
    for (let i = 0; i < rainData.length; i++) {
      rainData[i] = Math.random() > 0.97 ? (Math.random() * 2 - 1) * 0.5 : (Math.random() * 2 - 1) * 0.1;
    }
    this.rainNode = this.ctx.createBufferSource();
    this.rainNode.buffer = rainBuf;
    this.rainNode.loop = true;
    this.rainNode.connect(this.rainGain);
    this.rainNode.start();

    // Water
    this.waterGain = this.ctx.createGain();
    this.waterGain.gain.value = 0;
    const waterFilter = this.ctx.createBiquadFilter();
    waterFilter.type = "lowpass";
    waterFilter.frequency.value = 300;
    this.waterGain.connect(waterFilter);
    waterFilter.connect(this.masterGain!);

    const waterBuf = this.ctx.createBuffer(1, this.ctx.sampleRate * 5, this.ctx.sampleRate);
    const waterData = waterBuf.getChannelData(0);
    for (let i = 0; i < waterData.length; i++) {
      waterData[i] = Math.random() * 2 - 1;
    }
    this.waterNode = this.ctx.createBufferSource();
    this.waterNode.buffer = waterBuf;
    this.waterNode.loop = true;
    this.waterNode.connect(this.waterGain);
    this.waterNode.start();
  }

  private playThunder() {
    if (!this.ctx || !this.masterGain) return;
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / this.ctx.sampleRate;
      data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 3) * (Math.sin(t * 20) * 0.5 + 0.5);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const gain = this.ctx.createGain();
    gain.gain.value = 0.15;
    src.connect(gain);
    gain.connect(this.masterGain);
    src.start();
  }

  private applySFX(chapter: number) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    const windLevels = [0.06, 0.03, 0.01, 0.04, 0.02, 0.015, 0.008, 0.005];
    const rainLevels = [0, 0, 0.05, 0, 0.015, 0, 0, 0];
    const waterLevels = [0, 0, 0.06, 0, 0, 0, 0, 0];
    const crackleLevels = [0.012, 0.01, 0.008, 0.01, 0.01, 0.012, 0.015, 0.012];

    if (this.windGain) this.windGain.gain.linearRampToValueAtTime(windLevels[chapter] || 0, t + 2);
    if (this.rainGain) this.rainGain.gain.linearRampToValueAtTime(rainLevels[chapter] || 0, t + 2);
    if (this.waterGain) this.waterGain.gain.linearRampToValueAtTime(waterLevels[chapter] || 0, t + 2);
    if (this.crackleGain) this.crackleGain.gain.linearRampToValueAtTime(crackleLevels[chapter] || 0.01, t + 2);

    if (this.thunderInterval) clearInterval(this.thunderInterval);
    if (chapter === 2 || chapter === 4) {
      this.thunderInterval = setInterval(() => {
        if (this.isPlaying) this.playThunder();
      }, 8000 + Math.random() * 12000);
    }
  }

  private createLayer(freq: number, type: OscillatorType): MusicLayer {
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;
    filter.Q.value = 1.5;
    filter.connect(gain);
    gain.connect(this.dryGain!);
    gain.connect(this.reverbNode!);

    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = (Math.random() - 0.5) * 12; // lofi detune
    osc.connect(filter);
    osc.start();

    // Slow tape wobble LFO
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.3 + Math.random() * 0.6;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = freq * 0.008;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();
    this.lfoNodes.push(lfo);
    this.lfoGains.push(lfoGain);

    return { oscillators: [osc], gain, filter, freq, type };
  }

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.init().then(() => {
      this.layers = [];
      // Warm pad layers (sine + triangle for lofi warmth)
      this.layers.push(this.createLayer(220, "sine"));
      this.layers.push(this.createLayer(330, "triangle"));
      this.layers.push(this.createLayer(165, "sine"));
      // Sub bass
      this.layers.push(this.createLayer(55, "sine"));
      // Soft lead
      this.layers.push(this.createLayer(440, "triangle"));

      this.transitionTo(this.currentChapter);
      this.startAnimation();
    });
  }

  stop() {
    this.isPlaying = false;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    if (this.arpInterval) clearInterval(this.arpInterval);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
    }
    setTimeout(() => {
      this.layers.forEach((l) => {
        l.oscillators.forEach((o) => { try { o.stop(); } catch {} });
      });
      this.lfoNodes.forEach((o) => { try { o.stop(); } catch {} });
      if (this.crackleNode) try { this.crackleNode.stop(); } catch {}
      if (this.windNode) try { this.windNode.stop(); } catch {}
      if (this.rainNode) try { this.rainNode.stop(); } catch {}
      if (this.waterNode) try { this.waterNode.stop(); } catch {}
      if (this.thunderInterval) clearInterval(this.thunderInterval);
      this.layers = [];
      this.lfoNodes = [];
      this.lfoGains = [];
    }, 1200);
  }

  setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(
        vol,
        this.ctx.currentTime + 0.1
      );
    }
  }

  transitionTo(chapter: number) {
    this.targetChapter = chapter;
    if (this.currentChapter !== chapter) {
      this.transitionProgress = 0;
      this.currentChapter = chapter;
    }
    this.applyChapterMusic(chapter);
    this.applySFX(chapter);
  }

  private applyChapterMusic(chapter: number) {
    const music = CHAPTER_MUSIC[chapter];
    if (!music || !this.ctx) return;

    const t = this.ctx.currentTime;
    const ramp = 3; // slow lofi crossfade

    // Pad layers
    const padFreqs = music.chords[0];
    if (this.layers[0]) {
      this.layers[0].oscillators[0].frequency.linearRampToValueAtTime(padFreqs[0], t + ramp);
      this.layers[0].gain.gain.linearRampToValueAtTime(music.padVol, t + ramp);
      this.layers[0].filter.frequency.linearRampToValueAtTime(music.filterFreq, t + ramp);
    }
    if (this.layers[1]) {
      this.layers[1].oscillators[0].frequency.linearRampToValueAtTime(padFreqs[1] || padFreqs[0] * 1.5, t + ramp);
      this.layers[1].gain.gain.linearRampToValueAtTime(music.padVol * 0.7, t + ramp);
      this.layers[1].filter.frequency.linearRampToValueAtTime(music.filterFreq * 0.8, t + ramp);
    }
    if (this.layers[2]) {
      this.layers[2].oscillators[0].frequency.linearRampToValueAtTime(padFreqs[2] || padFreqs[0] * 0.75, t + ramp);
      this.layers[2].gain.gain.linearRampToValueAtTime(music.padVol * 0.5, t + ramp);
    }
    // Sub bass
    if (this.layers[3]) {
      this.layers[3].oscillators[0].frequency.linearRampToValueAtTime(music.bassFreq, t + ramp);
      this.layers[3].gain.gain.linearRampToValueAtTime(music.bassVol, t + ramp);
      this.layers[3].filter.frequency.linearRampToValueAtTime(150, t + ramp);
    }
    // Lead
    if (this.layers[4]) {
      this.layers[4].gain.gain.linearRampToValueAtTime(music.leadVol, t + ramp);
      this.layers[4].filter.frequency.linearRampToValueAtTime(music.filterFreq * 1.5, t + ramp);
    }

    // Reverb
    if (this.reverbGain) {
      this.reverbGain.gain.linearRampToValueAtTime(music.reverbMix, t + ramp);
    }
    if (this.dryGain) {
      this.dryGain.gain.linearRampToValueAtTime(1 - music.reverbMix * 0.5, t + ramp);
    }

    // Arpeggio
    this.startArpeggio(chapter);
  }

  private startArpeggio(chapter: number) {
    if (this.arpInterval) clearInterval(this.arpInterval);
    const music = CHAPTER_MUSIC[chapter];
    if (!music || music.arpVol < 0.001 || !this.layers[4]) return;

    let noteIndex = 0;
    const safeVol = Math.max(music.leadVol, 0.001);
    this.arpInterval = setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.layers[4]) return;
      const note = music.notes[noteIndex % music.notes.length];
      const t = this.ctx.currentTime;

      this.layers[4].oscillators[0].frequency.setValueAtTime(note, t);
      // Soft pluck — use linearRamp instead of exponential to avoid zero-target crash
      this.layers[4].gain.gain.cancelScheduledValues(t);
      this.layers[4].gain.gain.setValueAtTime(safeVol * 1.2, t);
      this.layers[4].gain.gain.linearRampToValueAtTime(safeVol * 0.4, t + 0.4);

      noteIndex++;
    }, (1 / music.tempo) * 600);
  }

  private startAnimation() {
    const animate = () => {
      if (!this.isPlaying || !this.ctx) return;
      const music = CHAPTER_MUSIC[this.currentChapter];
      if (music) {
        this.lfoGains.forEach((lg, i) => {
          const baseFreq = this.layers[i]?.freq || 220;
          const vibratoAmount = music.ambience === "tense" ? 0.008 : 0.004;
          lg.gain.linearRampToValueAtTime(
            baseFreq * vibratoAmount,
            this.ctx!.currentTime + 0.5
          );
        });
      }
      this.animFrame = requestAnimationFrame(animate);
    };
    this.animFrame = requestAnimationFrame(animate);
  }
}

let instance: AudioManager | null = null;

export function getAudioManager(): AudioManager {
  if (!instance) {
    instance = new AudioManager();
  }
  return instance;
}

export { CHAPTER_MUSIC };
export type { ChapterMusic };
