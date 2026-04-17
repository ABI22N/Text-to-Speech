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
        
        <div style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>
          <h3 style={{ color: 'var(--text-main)', marginTop: '1.5rem', marginBottom: '1rem' }}>How to Use PlayVoice</h3>
          
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li><strong>Step 1: Input Text.</strong> Type or paste your text directly into the main text area. Alternatively, you can click <em>"Choose File"</em> to upload a <code>.txt</code> or <code>.pdf</code> file to automatically extract the text.</li>
            <li style={{ marginTop: '0.8rem' }}><strong>Step 2: Choose a Voice.</strong> Use the dropdown menu below the text box to select your preferred accent and language voice.</li>
            <li style={{ marginTop: '0.8rem' }}><strong>Step 3: Adjust Settings.</strong> Tweak the <em>Rate (Speed)</em> and <em>Pitch</em> sliders until you find the perfect tone.</li>
            <li style={{ marginTop: '0.8rem' }}><strong>Step 4: Play and Control.</strong> Click <strong>Convert & Play</strong> to start listening. You can use the <strong>Pause/Resume</strong> button to hold your place, or <strong>Stop</strong> to completely clear the playback.</li>
            <li style={{ marginTop: '0.8rem' }}><strong>Step 5: Download.</strong> Want to save it for later? Make sure your local backend server is running and click <strong>Download MP3</strong> to save the generated audio file to your device.</li>
          </ul>
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
