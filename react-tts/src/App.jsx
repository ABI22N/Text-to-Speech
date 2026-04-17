import React, { useState } from 'react';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { downloadTTSAudio } from './services/ttsService';
import TTSConverter from './components/TTSConverter';
import AudioControls from './components/AudioControls';
import Header from './components/Header';

function App() {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const { voices, speak, pause, stop, isSpeaking, isPaused } = useSpeechSynthesis();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleConvert = () => {
    speak({
      text,
      voice: selectedVoice,
      rate,
      pitch
    });
  };

  const handleDownloadMP3 = async () => {
    if (!text) return;
    try {
      setIsDownloading(true);
      const lang = selectedVoice?.lang || 'en';
      await downloadTTSAudio(text, lang);
    } catch (error) {
      console.error("Failed to trigger MP3 download:", error);
      alert("Error generating MP3. Make sure the backend server is running on port 5000.");
    } finally {
      setIsDownloading(false);
    }
  };

  const infoPanelStyle = {
    position: 'fixed',
    top: 0,
    right: isInfoOpen ? 0 : '-400px',
    maxWidth: '100%',
    width: '400px',
    height: '100vh',
    background: 'var(--info-bg)',
    backdropFilter: 'blur(20px)',
    borderLeft: '1px solid var(--panel-border)',
    transition: 'right 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    zIndex: 1000,
    padding: '2rem',
    color: 'var(--text-main)',
    boxShadow: isInfoOpen ? '-10px 0 30px rgba(0,0,0,0.1)' : 'none',
    overflowY: 'auto'
  };

  return (
    <>
      <Header onInfoClick={() => setIsInfoOpen(true)} />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div className="glass-panel">
          <h1 className="title">Text to Speech Converter</h1>
          
          <TTSConverter text={text} setText={setText} />
          
          <AudioControls 
            voices={voices}
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
            rate={rate}
            setRate={setRate}
            pitch={pitch}
            setPitch={setPitch}
          />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className={`btn btn-primary ${(isSpeaking && !isPaused) ? 'is-playing' : ''}`} 
              onClick={handleConvert}
              disabled={!text}
            >
              {isSpeaking ? 'Restart' : 'Convert & Play'}
            </button>
            <button 
              className="btn" 
              style={{ background: 'transparent', color: 'var(--primary)', border: '2px solid var(--primary)' }}
              onClick={pause}
              disabled={!isSpeaking}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button 
              className="btn btn-danger" 
              onClick={stop}
              disabled={!isSpeaking}
            >
              Stop
            </button>
            <button 
              className="btn" 
              style={{ background: 'transparent', color: 'var(--text-main)', border: '2px solid var(--panel-border)' }}
              onClick={handleDownloadMP3}
              disabled={!text || isDownloading}
              title="Download full text as MP3"
            >
              {isDownloading ? 'Processing...' : 'Download MP3'}
            </button>
          </div>
        </div>
      </div>

      <div style={infoPanelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--primary)', margin: 0 }}>Info & Help</h2>
          <button 
            onClick={() => setIsInfoOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            &times;
          </button>
        </div>
        
        <div style={{ lineHeight: '1.6', color: 'var(--text-muted)' }}>
          <h3 style={{ color: 'var(--text-main)', marginTop: '1.5rem' }}>How to use</h3>
          <p>Type your text into the main box, or upload a `.txt` / `.pdf` file. Choose your preferred voice, tweak the rate and pitch, and click "Convert & Play" to listen.</p>

          <h3 style={{ color: 'var(--text-main)', marginTop: '1.5rem' }}>Features</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>Native in-browser text-to-speech with no external dependencies for playback.</li>
            <li>Direct extraction of texts from PDF documents and Text files.</li>
            <li>Download the full requested text directly as an MP3 file (powered by local backend server).</li>
            <li>Dynamic UI with modern glassmorphism design.</li>
          </ul>

          <h3 style={{ color: 'var(--text-main)', marginTop: '1.5rem' }}>Note</h3>
          <p>Please ensure that the local backend server is running on port 5000 in order to use the full MP3 download functionality.</p>
        </div>
      </div>
      
      {isInfoOpen && (
        <div 
          onClick={() => setIsInfoOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.2)',
            zIndex: 999
          }}
        />
      )}
    </>
  );
}

export default App;
