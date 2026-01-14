import React, { useState, useEffect } from 'react';
import { Sequencer } from '../engine/Sequencer';

interface StepGridProps {
  sequencer: Sequencer;
  currentStep: number;
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVES = [1, 2, 3, 4];

const StepGrid: React.FC<StepGridProps> = ({ sequencer, currentStep }) => {
  const [pattern, setPattern] = useState(sequencer.getPattern());
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPattern({ ...sequencer.getPattern() });
    }, 50);

    return () => clearInterval(interval);
  }, [sequencer]);

  const handleStepClick = (stepIndex: number, e: React.MouseEvent) => {
    const step = pattern.steps[stepIndex];

    if (e.shiftKey) {
      sequencer.updateStep(stepIndex, { accent: !step.accent });
    } else if (e.ctrlKey || e.metaKey) {
      sequencer.updateStep(stepIndex, { slide: !step.slide });
    } else {
      sequencer.toggleStep(stepIndex);
      if (!step.active) {
        setSelectedStep(stepIndex);
      }
    }

    setPattern({ ...sequencer.getPattern() });
  };

  const handleNoteChange = (stepIndex: number, pitch: number) => {
    sequencer.updateStep(stepIndex, { pitch });
    setPattern({ ...sequencer.getPattern() });
  };

  const handleOctaveChange = (stepIndex: number, octave: number) => {
    sequencer.updateStep(stepIndex, { octave });
    setPattern({ ...sequencer.getPattern() });
  };

  return (
    <div className="step-grid-container">
      <div className="step-grid">
        {pattern.steps.map((step, index) => {
          const isActive = step.active;
          const isCurrent = currentStep === index;
          const isSelected = selectedStep === index;

          return (
            <div
              key={index}
              className={`step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={(e) => handleStepClick(index, e)}
            >
              <div className="step-number">{index + 1}</div>

              {isActive && (
                <div className="step-controls">
                  <select
                    className="note-select"
                    value={step.pitch}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleNoteChange(index, parseInt(e.target.value));
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {NOTES.map((note, i) => (
                      <option key={i} value={i}>{note}</option>
                    ))}
                  </select>

                  <select
                    className="octave-select"
                    value={step.octave}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleOctaveChange(index, parseInt(e.target.value));
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {OCTAVES.map((octave) => (
                      <option key={octave} value={octave}>{octave}</option>
                    ))}
                  </select>

                  <div className="step-flags">
                    {step.accent && <span className="flag accent">A</span>}
                    {step.slide && <span className="flag slide">S</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepGrid;
