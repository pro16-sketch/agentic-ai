import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles, Radio } from 'lucide-react';

interface AudioSitrepPlayerProps {
  script: string;
  title?: string;
}

export const AudioSitrepPlayer: React.FC<AudioSitrepPlayerProps> = ({ script, title = "Executive Audio SITREP" }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (!synthRef.current || !script) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setProgress(0);
      return;
    }

    synthRef.current.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Try to find a good English voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Samantha')) && v.lang.startsWith('en')) || voices[0];
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error or aborted:", e);
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setProgress(0);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-800/40 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
      <div className="flex items-center space-x-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
          isPlaying 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
            : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
        }`}>
          {isPlaying ? (
            <Radio className="w-4 h-4 animate-pulse" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-white tracking-wide">{title}</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
              AI Voice
            </span>
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-1 max-w-md">
            {script}
          </p>
        </div>
      </div>

      {/* Audio Wave Visualizer (when active) */}
      <div className="flex items-center space-x-3 self-end sm:self-center">
        {isPlaying && (
          <div className="flex items-center space-x-1 px-2 py-1 bg-slate-950/60 rounded-md border border-slate-800">
            <span className="w-1 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="w-1 h-4 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '75ms' }} />
            <span className="text-[10px] font-mono text-blue-300 ml-1.5">Speaking...</span>
          </div>
        )}

        <button
          onClick={handlePlayPause}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/30'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause SITREP</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Listen to SITREP</span>
            </>
          )}
        </button>

        {isPlaying && (
          <button
            onClick={handleStop}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            title="Stop audio"
          >
            <VolumeX className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
