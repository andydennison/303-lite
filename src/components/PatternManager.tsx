import React, { useRef } from 'react';
import { Sequencer, Pattern } from '../engine/Sequencer';

interface PatternManagerProps {
  sequencer: Sequencer;
}

const PatternManager: React.FC<PatternManagerProps> = ({ sequencer }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const pattern = sequencer.getPattern();
    const dataStr = JSON.stringify(pattern, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${pattern.name.replace(/\s+/g, '_')}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleLoad = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const pattern = JSON.parse(event.target?.result as string) as Pattern;
        sequencer.loadPattern(pattern);
      } catch (error) {
        alert('Error loading pattern: Invalid file format');
        console.error(error);
      }
    };
    reader.readAsText(file);

    // Reset input so the same file can be loaded again
    e.target.value = '';
  };

  const handleExport = () => {
    const pattern = sequencer.getPattern();
    const exportData = {
      pattern,
      version: '1.0.0',
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `303lite_${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="pattern-manager">
      <button className="pattern-btn save" onClick={handleSave}>
        💾 Save Pattern
      </button>
      <button className="pattern-btn load" onClick={handleLoad}>
        📂 Load Pattern
      </button>
      <button className="pattern-btn export" onClick={handleExport}>
        📤 Export
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default PatternManager;
