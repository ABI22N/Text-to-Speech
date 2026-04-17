import { useState, useEffect } from 'react';

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const synth = window.speechSynthesis;

  useEffect(() => {
    const fetchVoices = () => {
      setVoices(synth.getVoices());
    };

    fetchVoices();
    synth.onvoiceschanged = fetchVoices;

    return () => {
      synth.onvoiceschanged = null;
    };
  }, [synth]);

  const speak = ({ text, voice, rate, pitch }) => {
    // Always cancel completely to unblock the internal browser speech queue 
    // This fixes the "restart" breaking bug
    synth.cancel();
    
    if (text !== '') {
      setTimeout(() => {
        setIsSpeaking(true);
        setIsPaused(false);
        const utterThis = new SpeechSynthesisUtterance(text);
        
        utterThis.onend = () => {
          setIsSpeaking(false);
          setIsPaused(false);
        };
        // Some browsers don't fire onend properly if interrupted, onerror covers it
        utterThis.onerror = () => {
          setIsSpeaking(false);
          setIsPaused(false);
        };

        if (voice) utterThis.voice = voice;
        utterThis.pitch = pitch;
        utterThis.rate = rate;

        synth.speak(utterThis);
      }, 50);
    }
  };

  const pause = () => {
    if (synth.speaking && !synth.paused) {
      synth.pause();
      setIsPaused(true);
    } else if (synth.paused) {
      synth.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    // Forcefully cancel and update state immediately. This fixes the unresponsive stop button.
    synth.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return { voices, speak, pause, stop, isSpeaking, isPaused };
};
