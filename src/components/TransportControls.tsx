import React, { useState, useEffect } from 'react';
import { Sequencer } from '../engine/Sequencer';

interface TransportControlsProps {
  sequencer: Sequencer;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onClear: () => void;
}

const TransportControls: React.FC<TransportControlsProps> = ({
  sequencer,
  isPlaying,
  onPlay,
  onStop,
  onClear
}) => {
  const [tempo, setTempo] = useState(sequencer.getTempo());

  const handleTempoChange = (newTempo: number) => {
    setTempo(newTempo);
    sequencer.setTempo(newTempo);
  };

  return (
    <div className="transport-controls">
      <div className="transport-buttons">
        <button
          className={`transport-btn play ${isPlaying ? 'active' : ''}`}
          onClick={isPlaying ? onStop : onPlay}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button
          className="transport-btn stop"
          onClick={onStop}
          disabled={!isPlaying}
        >
          ⏹ Stop
        </button>
        <button
          className="transport-btn clear"
          onClick={onClear}
        >
          Clear
        </button>
      </div>

      <div className="tempo-control">
        <label>Tempo</label>
        <input
          type="number"
          min="40"
          max="300"
          value={tempo}
          onChange={(e) => handleTempoChange(parseInt(e.target.value) || 120)}
          className="tempo-input"
        />
        <input
          type="range"
          min="40"
          max="300"
          value={tempo}
          onChange={(e) => handleTempoChange(parseInt(e.target.value))}
          className="tempo-slider"
        />
        <span className="tempo-label">BPM</span>
      </div>
    </div>
  );
};

export default TransportControls;
