import React from 'react';

const AudioControls = ({ voices, selectedVoice, setSelectedVoice, rate, setRate, pitch, setPitch }) => {
  const handleVoiceChange = (e) => {
    const voice = voices.find(v => v.name === e.target.value);
    setSelectedVoice(voice);
  };

  const selectStyle = {
    width: '100%',
    padding: '12px',
    background: 'var(--input-bg)',
    border: '1px solid var(--panel-border)',
    borderRadius: '12px',
    color: 'var(--text-main)',
    fontSize: '1rem',
    outline: 'none',
    appearance: 'none',
    marginBottom: '1.5rem',
    cursor: 'pointer'
  };

  const controlGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%'
  };

  const sliderStyle = {
    width: '100%',
    cursor: 'pointer',
    accentColor: 'var(--primary)'
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <select 
        style={selectStyle} 
        onChange={handleVoiceChange} 
        value={selectedVoice?.name || ''}
      >
        <option value="" disabled>Select a Voice...</option>
        {voices.filter(v => v.lang.includes('en')).map(voice => (
          <option key={voice.name} value={voice.name}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={controlGroupStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <label>Rate (Speed)</label>
            <span>{rate}x</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1" 
            value={rate} 
            onChange={(e) => setRate(parseFloat(e.target.value))}
            style={sliderStyle}
          />
        </div>

        <div style={controlGroupStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <label>Pitch</label>
            <span>{pitch}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="2" 
            step="0.1" 
            value={pitch} 
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            style={sliderStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioControls;
