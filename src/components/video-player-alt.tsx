/**
 * VideoPlayer2 - A wrapper around ReactPlayerWrapper with additional features
 * This is a simplified version that doesn't depend on the existing player structure
 */
import React, { useRef, useState, useEffect } from "react";
import ReactPlayerWrapper from "./react-player-wrapper";
import "../styles/react-player.css";
import { Track as AppTrack } from "@/types/episodes";

// This Track interface is for internal component use
interface Track {
  file: string; // Use file instead of src to match our app's Track interface
  kind: string;
  label?: string;
  srclang?: string;
  default?: boolean;
}

// Quality option interface
interface QualityOption {
  label: string;
  value: string;
  url: string;
}

// Define a PlayerRef interface to replace "any"
interface PlayerRef {
  seekTo: (time: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
}

interface VideoPlayer2Props {
  url: string;
  poster?: string;
  tracks?: Track[];
  className?: string;
  onProgress?: (state: { played: number; playedSeconds: number }) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onReady?: (player: any) => void;
  intro?: { start: number; end: number };
  outro?: { start: number; end: number };
  qualityOptions?: QualityOption[];
}

const VideoPlayer2: React.FC<VideoPlayer2Props> = ({
  url,
  poster,
  tracks = [],
  className = "",
  onProgress,
  onReady,
  intro,
  outro,
  qualityOptions = [],
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [playerError, setPlayerError] = useState<Error | null>(null);
  const [availableQualities, setAvailableQualities] = useState<QualityOption[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  // Convert Track objects to the format expected by ReactPlayerWrapper
  const convertedTracks = tracks.map(track => ({
    file: track.file,
    kind: track.kind,
    label: track.label || '',
    default: track.default
  })) as AppTrack[];

  // Set up quality options
  useEffect(() => {
    if (qualityOptions && qualityOptions.length > 0) {
      setAvailableQualities(qualityOptions);
    } else if (url) {
      // If no quality options were provided but we have a URL,
      // create a default "Auto" quality option
      setAvailableQualities([
        {
          label: 'Auto',
          value: 'auto',
          url: url
        }
      ]);
    } else {
      setAvailableQualities([]);
    }
  }, [url, qualityOptions]);

  useEffect(() => {
    // Reset states when source changes
    setIsLoaded(false);
    setIsPlayerReady(false);
    setPlayerError(null);
  }, [url]);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePlayerReady = (player: any) => {
    setIsLoaded(true);
    setIsPlayerReady(true);
    if (onReady) onReady(player);
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePlayerError = (error: any) => {
    console.error("Player error:", error);
    setPlayerError(error instanceof Error ? error : new Error(String(error)));
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    // Handle intro/outro skipping
    if (isPlayerReady && playerRef.current) {
      // Skip intro if defined and within range
      if (intro && state.playedSeconds >= intro.start && state.playedSeconds <= intro.end - 0.5) {
        playerRef.current.seekTo(intro.end);
      }
      
      // Skip outro if defined and within range
      if (outro && state.playedSeconds >= outro.start && state.playedSeconds <= outro.end - 0.5) {
        playerRef.current.seekTo(outro.end);
      }
    }
    
    // Forward progress to parent component
    if (onProgress) {
      onProgress(state);
    }
  };

  // Handle quality change
  const handleQualityChange = (quality: QualityOption) => {
    console.log('Quality changed to:', quality.label);
    // The ReactPlayerWrapper handles the actual quality change internally
  };

  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-cs-window border border-cs-border">
        <p className="text-cs-text">No video available</p>
      </div>
    );
  }

  return (
    <div className={`w-full h-full relative ${className} ${isLoaded ? 'player-loaded' : 'player-loading'}`}>
      <ReactPlayerWrapper
        ref={playerRef}
        url={url}
        poster={poster}
        tracks={convertedTracks}
        onReady={handlePlayerReady}
        onProgress={handleProgress}
        onError={handlePlayerError}
        className="allow-animation"
        playing={isPlayerReady}
        controls={false}
        width="100%"
        height="100%"
        progressInterval={1000}
        muted={false}
        qualityOptions={availableQualities}
        onQualityChange={handleQualityChange}
        config={{
          file: {
            attributes: {
              controlsList: "nodownload",
              playsInline: true,
              crossOrigin: "anonymous",
            },
          },
        }}
      />
      
      {playerError && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 z-50">
          <div className="text-red-500 text-xl font-bold mb-2">Playback Error</div>
          <div className="text-white text-sm text-center">
            Unable to play this video. Please try a different source or check your connection.
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer2; 