import React, { useState } from 'react';
import { AudioEngine, SynthParams } from '../engine/AudioEngine';

interface SynthControlsProps {
  audioEngine: AudioEngine;
}

interface KnobProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const Knob: React.FC<KnobProps> = ({ label, value, onChange, min = 0, max = 1 }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="knob-container">
      <div className="knob-label">{label}</div>
      <div className="knob">
        <div
          className="knob-indicator"
          style={{
            transform: `rotate(${-135 + (percentage * 2.7)}deg)`
          }}
        />
        <div className="knob-value">{Math.round(percentage)}</div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="knob-slider"
      />
    </div>
  );
};

const SynthControls: React.FC<SynthControlsProps> = ({ audioEngine }) => {
  const [params, setParams] = useState<SynthParams>(audioEngine.params);

  const updateParam = <K extends keyof SynthParams>(param: K, value: SynthParams[K]) => {
    audioEngine.updateParam(param, value);
    setParams({ ...audioEngine.params });
  };

  const handleWaveformChange = (waveform: 'sawtooth' | 'square') => {
    updateParam('waveform', waveform);
  };

  return (
    <div className="synth-controls">
      <div className="control-section">
        <h3>Oscillator</h3>
        <div className="waveform-selector">
          <button
            className={params.waveform === 'sawtooth' ? 'active' : ''}
            onClick={() => handleWaveformChange('sawtooth')}
          >
            Saw
          </button>
          <button
            className={params.waveform === 'square' ? 'active' : ''}
            onClick={() => handleWaveformChange('square')}
          >
            Square
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3>Filter</h3>
        <div className="knobs">
          <Knob
            label="Cutoff"
            value={params.cutoff}
            onChange={(v) => updateParam('cutoff', v)}
          />
          <Knob
            label="Resonance"
            value={params.resonance}
            onChange={(v) => updateParam('resonance', v)}
          />
          <Knob
            label="Env Mod"
            value={params.envMod}
            onChange={(v) => updateParam('envMod', v)}
          />
        </div>
      </div>

      <div className="control-section">
        <h3>Envelope</h3>
        <div className="knobs">
          <Knob
            label="Decay"
            value={params.decay}
            onChange={(v) => updateParam('decay', v)}
          />
          <Knob
            label="Accent"
            value={params.accent}
            onChange={(v) => updateParam('accent', v)}
          />
        </div>
      </div>
    </div>
  );
};

export default SynthControls;
