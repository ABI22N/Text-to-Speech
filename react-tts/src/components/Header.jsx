import React from 'react';

const Header = ({ onInfoClick }) => {
  return (
    <header style={{
      padding: '1.5rem 2rem',
      background: 'var(--header-bg)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--panel-border)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="https://voice.ai/hub/wp-content/uploads/2025/09/62b264ced6e2c5184b2ce2d4_The_8_Best_TTS_Voice_Providers.jpg" alt="PlayVoice Logo" style={{ height: '32px', borderRadius: '4px' }} /> PlayVoice
        </div>
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <a href="#" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>Home</a>
          <a href="#info" onClick={(e) => { e.preventDefault(); onInfoClick && onInfoClick(); }} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Info</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
