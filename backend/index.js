import express from 'express';
import cors from 'cors';
import * as googleTTS from 'google-tts-api';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/api/download-audio', async (req, res) => {
  try {
    const { text, lang = 'en' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    const results = await googleTTS.getAllAudioBase64(text, {
      lang: lang.split('-')[0], 
      slow: false,
      host: 'https://translate.google.com',
      timeout: 10000,
    });
    const buffers = results.map(result => Buffer.from(result.base64, 'base64'));
    const combinedBuffer = Buffer.concat(buffers);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="audio.mp3"');
    res.setHeader('Content-Length', combinedBuffer.length);

    res.send(combinedBuffer);
  } catch (error) {
    console.error("Error generating TTS audio:", error);
    res.status(500).json({ error: 'Failed to generate audio stream' });
  }
});

app.listen(PORT, () => {
  console.log(`TTS Backend server running at http://localhost:${PORT}`);
});
