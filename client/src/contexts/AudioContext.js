import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrequencies, setCurrentFrequencies] = useState([]);
  const [masterVolume, setMasterVolume] = useState(0.5);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const gainNodesRef = useRef([]);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  const initializeAudio = useCallback(async () => {
    if (isInitialized) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      // Create analyser for visualization
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.connect(audioContextRef.current.destination);
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }, [isInitialized]);

  const createOscillator = useCallback((frequency, volume = 0.5, waveType = 'sine', isBinaural = false, binauralOffset = 0) => {
    if (!audioContextRef.current) return null;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency + binauralOffset, audioContextRef.current.currentTime);
    
    gainNode.gain.setValueAtTime(volume * masterVolume, audioContextRef.current.currentTime);
    
    oscillator.connect(gainNode);
    
    if (isBinaural) {
      // Create stereo panner for binaural beats
      const panner = audioContextRef.current.createStereoPanner();
      panner.pan.setValueAtTime(binauralOffset > 0 ? 1 : -1, audioContextRef.current.currentTime);
      gainNode.connect(panner);
      panner.connect(analyserRef.current);
    } else {
      gainNode.connect(analyserRef.current);
    }
    
    return { oscillator, gainNode };
  }, [masterVolume]);

  const playFrequencies = useCallback(async (frequencies) => {
    if (!isInitialized) {
      await initializeAudio();
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    // Stop existing oscillators
    stopAll();

    const newOscillators = [];
    const newGainNodes = [];

    frequencies.forEach((freq, index) => {
      const { oscillator, gainNode } = createOscillator(
        freq.value,
        freq.volume,
        freq.waveType,
        freq.isBinaural,
        freq.binauralOffset
      );

      if (oscillator && gainNode) {
        oscillator.start();
        newOscillators.push(oscillator);
        newGainNodes.push(gainNode);
      }
    });

    oscillatorsRef.current = newOscillators;
    gainNodesRef.current = newGainNodes;
    setCurrentFrequencies(frequencies);
    setIsPlaying(true);
  }, [isInitialized, initializeAudio, createOscillator]);

  const stopAll = useCallback(() => {
    oscillatorsRef.current.forEach(oscillator => {
      try {
        oscillator.stop();
      } catch (error) {
        // Oscillator might already be stopped
      }
    });
    
    oscillatorsRef.current = [];
    gainNodesRef.current = [];
    setCurrentFrequencies([]);
    setIsPlaying(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const updateVolume = useCallback((newVolume) => {
    setMasterVolume(newVolume);
    gainNodesRef.current.forEach(gainNode => {
      if (gainNode) {
        gainNode.gain.setValueAtTime(newVolume, audioContextRef.current.currentTime);
      }
    });
  }, []);

  const getAnalyserData = useCallback(() => {
    if (!analyserRef.current) return null;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    return dataArray;
  }, []);

  const startVisualization = useCallback((callback) => {
    const animate = () => {
      if (isPlaying) {
        const data = getAnalyserData();
        if (data && callback) {
          callback(data);
        }
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    animate();
  }, [isPlaying, getAnalyserData]);

  const stopVisualization = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopAll();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopAll]);

  const value = {
    isPlaying,
    currentFrequencies,
    masterVolume,
    isInitialized,
    playFrequencies,
    stopAll,
    updateVolume,
    getAnalyserData,
    startVisualization,
    stopVisualization,
    initializeAudio
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};