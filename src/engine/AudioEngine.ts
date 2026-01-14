export interface SynthParams {
  waveform: 'sawtooth' | 'square';
  cutoff: number;
  resonance: number;
  envMod: number;
  decay: number;
  accent: number;
}

export interface Note {
  pitch: number;
  octave: number;
  accent: boolean;
  slide: boolean;
  active: boolean;
}

export class AudioEngine {
  private audioContext: AudioContext;
  private masterGain: GainNode;
  private currentVoice: {
    oscillator: OscillatorNode;
    filter: BiquadFilterNode;
    gainNode: GainNode;
    filterEnv: number;
  } | null = null;

  public params: SynthParams = {
    waveform: 'sawtooth',
    cutoff: 0.3,
    resonance: 0.7,
    envMod: 0.5,
    decay: 0.3,
    accent: 0.5
  };

  constructor() {
    this.audioContext = new AudioContext();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.3;
    this.masterGain.connect(this.audioContext.destination);
  }

  public async init() {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  public playNote(note: Note, duration: number, slideFrom?: number) {
    const now = this.audioContext.currentTime;
    const frequency = this.noteToFrequency(note.pitch, note.octave);

    // If sliding and there's a current voice, slide the pitch
    if (slideFrom !== undefined && this.currentVoice) {
      const startFreq = this.noteToFrequency(slideFrom, note.octave);
      this.currentVoice.oscillator.frequency.cancelScheduledValues(now);
      this.currentVoice.oscillator.frequency.setValueAtTime(startFreq, now);
      this.currentVoice.oscillator.frequency.exponentialRampToValueAtTime(frequency, now + 0.05);
      return;
    }

    // Stop current voice if not sliding
    if (this.currentVoice) {
      this.stopCurrentVoice();
    }

    // Create new voice
    const oscillator = this.audioContext.createOscillator();
    const filter = this.audioContext.createBiquadFilter();
    const gainNode = this.audioContext.createGain();

    oscillator.type = this.params.waveform;
    oscillator.frequency.setValueAtTime(frequency, now);

    filter.type = 'lowpass';
    const baseFreq = 50 + (this.params.cutoff * 5000);
    const envAmount = this.params.envMod * 3000;
    const accentMod = note.accent ? (1 + this.params.accent) : 1;

    // Filter envelope
    const peakFreq = Math.min(baseFreq + (envAmount * accentMod), 20000);
    filter.frequency.setValueAtTime(peakFreq, now);
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(baseFreq, 50),
      now + (this.params.decay * 2)
    );

    filter.Q.value = this.params.resonance * 20;

    // Amplitude envelope
    const peakGain = note.accent ? (0.8 + (this.params.accent * 0.2)) : 0.6;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(peakGain, now + 0.003);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.start(now);
    oscillator.stop(now + duration);

    this.currentVoice = {
      oscillator,
      filter,
      gainNode,
      filterEnv: envAmount
    };

    oscillator.onended = () => {
      if (this.currentVoice?.oscillator === oscillator) {
        this.currentVoice = null;
      }
    };
  }

  private stopCurrentVoice() {
    if (this.currentVoice) {
      const now = this.audioContext.currentTime;
      this.currentVoice.gainNode.gain.cancelScheduledValues(now);
      this.currentVoice.gainNode.gain.setValueAtTime(
        this.currentVoice.gainNode.gain.value,
        now
      );
      this.currentVoice.gainNode.gain.linearRampToValueAtTime(0.01, now + 0.02);
      this.currentVoice.oscillator.stop(now + 0.02);
      this.currentVoice = null;
    }
  }

  private noteToFrequency(pitch: number, octave: number): number {
    // pitch: 0=C, 1=C#, 2=D, etc.
    const a4 = 440;
    const semitone = pitch + (octave * 12) - 57; // A4 is 57 semitones from C0
    return a4 * Math.pow(2, semitone / 12);
  }

  public updateParam<K extends keyof SynthParams>(param: K, value: SynthParams[K]) {
    this.params[param] = value;
  }

  public setMasterVolume(volume: number) {
    this.masterGain.gain.value = volume;
  }

  public destroy() {
    if (this.currentVoice) {
      this.stopCurrentVoice();
    }
    this.audioContext.close();
  }
}
