import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MusicPlayerProps {
  audioSrc?: string;
  autoPlay?: boolean;
}

export function MusicPlayer({ audioSrc = '', autoPlay = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay blocked — wait for user interaction
      });
    }
  }, [autoPlay]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
    if (!hasInteracted) setHasInteracted(true);
  }, [isPlaying, hasInteracted]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute right-0 top-12 glass px-3 py-1.5 text-xs whitespace-nowrap"
          >
            {isPlaying ? 'Playing' : 'Tap to play'}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={togglePlay}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        onFocus={() => setShowTip(true)}
        onBlur={() => setShowTip(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative w-11 h-11 rounded-full glass flex items-center justify-center
                   text-theme-text cursor-pointer transition-shadow
                   hover:shadow-glow focus:outline-none focus-visible:ring-2
                   focus-visible:ring-theme-primary"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}

        {isPlaying && (
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400
                           shadow-[0_0_6px_rgba(74,222,128,0.6)] animate-pulse" />
        )}
      </motion.button>

      <audio ref={audioRef} src={audioSrc} loop />
    </div>
  );
}

export default MusicPlayer;
