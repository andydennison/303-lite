# 303 Lite

A modern desktop bassline synthesizer inspired by the legendary Roland TB-303. Built with Electron, React, and the Web Audio API.

## Features

- **16-Step Sequencer**: Classic step-based pattern programming
- **TB-303 Style Synthesis**:
  - Sawtooth and square wave oscillators
  - Resonant low-pass filter with envelope modulation
  - Accent and slide per step
- **Modern UI**: Clean, intuitive interface optimized for creativity
- **Real-time Control**: Adjust synth parameters while playing
- **Pattern Management**: Save and load your bassline patterns

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This will start webpack in watch mode and launch the Electron app.

### Build

```bash
npm run build
npm start
```

## How to Use

### Creating Patterns

1. **Add Steps**: Click on any step box (1-16) to activate it
2. **Set Notes**: Once a step is active, use the dropdowns to select the note and octave
3. **Add Accent**: Shift+Click on a step to toggle accent (louder, brighter)
4. **Add Slide**: Ctrl/Cmd+Click on a step to toggle slide (glide to next note)

### Playback

- **Play/Pause**: Start or pause pattern playback
- **Stop**: Stop playback and reset to step 1
- **Tempo**: Adjust the BPM (40-300) using the slider or input
- **Clear**: Clear all steps from the current pattern

### Sound Design

- **Waveform**: Choose between sawtooth (classic 303 sound) or square wave
- **Cutoff**: Controls the filter frequency
- **Resonance**: Adjusts filter resonance (self-oscillation at high values)
- **Env Mod**: Amount of envelope modulation applied to the filter
- **Decay**: Filter envelope decay time
- **Accent**: How much accent affects volume and filter

### Pattern Management

- **Save Pattern**: Export current pattern to a JSON file
- **Load Pattern**: Import a previously saved pattern
- **Export**: Export pattern with metadata

## Keyboard Shortcuts

- **Click**: Toggle step on/off
- **Shift+Click**: Toggle accent
- **Ctrl/Cmd+Click**: Toggle slide

## Technology Stack

- **Electron**: Cross-platform desktop application
- **React**: UI framework
- **TypeScript**: Type-safe code
- **Web Audio API**: Real-time audio synthesis
- **Webpack**: Module bundling

## Architecture

```
src/
├── engine/
│   ├── AudioEngine.ts    # Web Audio synthesis engine
│   └── Sequencer.ts      # Pattern sequencer and playback
├── components/
│   ├── StepGrid.tsx      # 16-step pattern grid
│   ├── SynthControls.tsx # Synth parameter controls
│   ├── TransportControls.tsx # Play/stop/tempo
│   └── PatternManager.tsx     # Save/load patterns
├── App.tsx               # Main application
├── renderer.tsx          # React entry point
├── main.ts              # Electron main process
└── styles.css           # Application styles
```

## Tips for Creating Basslines

1. **Start Simple**: Activate a few steps with the root note
2. **Add Movement**: Use different octaves to create melodic motion
3. **Use Accents Sparingly**: Accent every 4th or 8th step for rhythm
4. **Slides Create Flow**: Add slides between consecutive notes for that classic 303 glide
5. **Tweak the Filter**: High resonance and envelope modulation create the signature acid sound
6. **Experiment with Tempo**: Try different BPMs to find your groove

## License

MIT
