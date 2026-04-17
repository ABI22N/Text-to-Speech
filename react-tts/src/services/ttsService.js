const API_URL = 'http://localhost:5000/api';

export const downloadTTSAudio = async (text, lang) => {
  try {
    const response = await fetch(`${API_URL}/download-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, lang })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch audio: ${response.statusText}`);
    }

    const blob = await response.blob();
    const tempUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = tempUrl;
    a.download = 'speech-audio.mp3';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(tempUrl);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading TTS audio:', error);
    throw error;
  }
};
