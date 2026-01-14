import { AudioEngine, Note } from './AudioEngine';

export interface Step extends Note {
  step: number;
}

export interface Pattern {
  id: string;
  name: string;
  steps: Step[];
}

export class Sequencer {
  private audioEngine: AudioEngine;
  private currentPattern: Pattern;
  private isPlaying: boolean = false;
  private currentStep: number = 0;
  private tempo: number = 120;
  private intervalId: number | null = null;
  private onStepChange?: (step: number) => void;

  constructor(audioEngine: AudioEngine) {
    this.audioEngine = audioEngine;
    this.currentPattern = this.createEmptyPattern();
  }

  private createEmptyPattern(): Pattern {
    return {
      id: '1',
      name: 'Pattern 1',
      steps: Array.from({ length: 16 }, (_, i) => ({
        step: i,
        pitch: 0,
        octave: 2,
        accent: false,
        slide: false,
        active: false
      }))
    };
  }

  public start() {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.currentStep = 0;
    this.scheduleNextStep();
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
    this.currentStep = 0;
    if (this.onStepChange) {
      this.onStepChange(-1);
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }

  private scheduleNextStep() {
    if (!this.isPlaying) return;

    const currentStepData = this.currentPattern.steps[this.currentStep];

    if (currentStepData.active) {
      // Check if previous step had slide enabled
      const prevStep = this.currentStep > 0
        ? this.currentPattern.steps[this.currentStep - 1]
        : null;

      const slideFrom = prevStep?.active && prevStep?.slide
        ? prevStep.pitch
        : undefined;

      const stepDuration = (60 / this.tempo) / 4; // 16th note duration
      this.audioEngine.playNote(currentStepData, stepDuration, slideFrom);
    }

    if (this.onStepChange) {
      this.onStepChange(this.currentStep);
    }

    this.currentStep = (this.currentStep + 1) % 16;

    const stepTime = (60 / this.tempo) * 1000 / 4; // Convert to milliseconds
    this.intervalId = window.setTimeout(() => {
      this.scheduleNextStep();
    }, stepTime);
  }

  public setTempo(tempo: number) {
    this.tempo = Math.max(40, Math.min(300, tempo));

    // Restart if playing to apply new tempo
    if (this.isPlaying) {
      if (this.intervalId !== null) {
        clearTimeout(this.intervalId);
      }
      this.scheduleNextStep();
    }
  }

  public getTempo(): number {
    return this.tempo;
  }

  public updateStep(stepIndex: number, updates: Partial<Step>) {
    if (stepIndex >= 0 && stepIndex < 16) {
      this.currentPattern.steps[stepIndex] = {
        ...this.currentPattern.steps[stepIndex],
        ...updates
      };
    }
  }

  public toggleStep(stepIndex: number) {
    if (stepIndex >= 0 && stepIndex < 16) {
      const step = this.currentPattern.steps[stepIndex];
      step.active = !step.active;
    }
  }

  public getPattern(): Pattern {
    return this.currentPattern;
  }

  public loadPattern(pattern: Pattern) {
    this.currentPattern = pattern;
  }

  public clearPattern() {
    this.currentPattern = this.createEmptyPattern();
  }

  public setStepChangeCallback(callback: (step: number) => void) {
    this.onStepChange = callback;
  }

  public isRunning(): boolean {
    return this.isPlaying;
  }
}
