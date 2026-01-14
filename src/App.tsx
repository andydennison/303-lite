import React, { useEffect, useRef, useState } from 'react';
import { AudioEngine } from './engine/AudioEngine';
import { Sequencer } from './engine/Sequencer';
import StepGrid from './components/StepGrid';
import SynthControls from './components/SynthControls';
import TransportControls from './components/TransportControls';
import PatternManager from './components/PatternManager';

const App: React.FC = () => {
  const audioEngineRef = useRef<AudioEngine | null>(null);
  const sequencerRef = useRef<Sequencer | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const initAudio = async () => {
      const engine = new AudioEngine();
      const sequencer = new Sequencer(engine);

      audioEngineRef.current = engine;
      sequencerRef.current = sequencer;

      sequencer.setStepChangeCallback((step) => {
        setCurrentStep(step);
      });

      await engine.init();
      setIsInitialized(true);
    };

    initAudio();

    return () => {
      if (sequencerRef.current) {
        sequencerRef.current.stop();
      }
      if (audioEngineRef.current) {
        audioEngineRef.current.destroy();
      }
    };
  }, []);

  const handlePlay = () => {
    if (sequencerRef.current && audioEngineRef.current) {
      audioEngineRef.current.init();
      sequencerRef.current.start();
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (sequencerRef.current) {
      sequencerRef.current.stop();
      setIsPlaying(false);
      setCurrentStep(-1);
    }
  };

  const handleClear = () => {
    if (sequencerRef.current) {
      sequencerRef.current.clearPattern();
      setCurrentStep(-1);
    }
  };

  if (!isInitialized) {
    return (
      <div className="app loading">
        <div>Initializing audio...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>303 Lite</h1>
        <p className="subtitle">Bassline Synthesizer</p>
      </header>

      <main className="main-content">
        <div className="control-row">
          <TransportControls
            sequencer={sequencerRef.current!}
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onStop={handleStop}
            onClear={handleClear}
          />
          <PatternManager
            sequencer={sequencerRef.current!}
          />
        </div>

        <StepGrid
          sequencer={sequencerRef.current!}
          currentStep={currentStep}
        />

        <SynthControls
          audioEngine={audioEngineRef.current!}
        />
      </main>

      <footer className="footer">
        <p>Modern bassline synthesizer • Click steps to activate • Shift+Click for accent • Ctrl+Click for slide</p>
      </footer>
    </div>
  );
};

export default App;
