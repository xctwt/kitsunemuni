import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Track } from '@/types/episodes';
import ReactPlayerWrapper from './react-player-wrapper';

interface KitsunePlayerProps {
  animeId?: string;
  episodeId?: string;
  src?: string;
  poster?: string;
  subtitles?: Track[];
  className?: string;
  onReady?: () => void;
  autoPlay?: boolean;
  qualityOptions?: { label: string; value: string; url: string }[];
}

const KitsunePlayer = ({
  animeId,
  episodeId,
  src,
  poster,
  subtitles = [],
  className = "",
  onReady,
  autoPlay = false,
  qualityOptions = [],
}: KitsunePlayerProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [useNativeControls, setUseNativeControls] = useState(false);
  const playerRef = useRef<any>(null);

  // Handle the player ready state
  const handlePlayerReady = () => {
    setIsLoaded(true);
    if (onReady) onReady();
  };

  const toggleNativeControls = (useNative: boolean) => {
    setUseNativeControls(useNative);
    if (playerRef.current) {
      playerRef.current.toggleNativeControls(useNative);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Toggle native controls with 'n' key
      if (e.key.toLowerCase() === 'n') {
        toggleNativeControls(!useNativeControls);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [useNativeControls]);

  return (
    <div className={cn("kitsune-player-container", className)}>
      {src ? (
        <ReactPlayerWrapper
          ref={playerRef}
          url={src}
          poster={poster}
          tracks={subtitles}
          playing={autoPlay}
          className={cn("kitsune-player", isLoaded ? "loaded" : "loading")}
          onReady={handlePlayerReady}
          qualityOptions={qualityOptions}
        />
      ) : (
        <div className="no-video-message">No video URL provided</div>
      )}
      
      {/* Optional native controls toggle button outside player */}
      <div className="native-toggle-control">
        <button 
          onClick={() => toggleNativeControls(!useNativeControls)}
          className="native-toggle-button"
          title={useNativeControls ? "Switch to custom player" : "Switch to browser player"}
        >
          {useNativeControls ? "Custom Player" : "Browser Player"}
        </button>
        <div className="keyboard-shortcut-hint">Press 'N' to toggle</div>
      </div>
    </div>
  );
};

export default KitsunePlayer; 