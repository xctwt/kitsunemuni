"use client";

import { useRef, useState, useEffect } from "react";
import ReactPlayerWrapper from "@/components/react-player-wrapper";
import "../styles/react-player.css";
import { IEpisodeSource } from "@/types/episodes";
import { IAnime } from "@/types/anime";

// Quality option interface
interface QualityOption {
  label: string;
  value: string;
  url: string;
}

interface VideoPlayerProps {
  animeInfo: IAnime | { image: string; title: string };
  episodeInfo?: IEpisodeSource;
  subOrDub?: "sub" | "dub";
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  animeInfo,
  episodeInfo,
  // We need to receive subOrDub but don't use it yet
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  subOrDub,
}: VideoPlayerProps) => {
  // Define a proper interface for the player reference
  interface PlayerRef {
    seekTo: (time: number) => void;
  }
  
  const playerRef = useRef<PlayerRef | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [playerError, setPlayerError] = useState<Error | null>(null);
  const [qualityOptions, setQualityOptions] = useState<QualityOption[]>([]);
  const uri = episodeInfo?.sources[0]?.url || "";
  let hasDefaultTrack = false;

  // Generate quality options from available sources
  useEffect(() => {
    if (episodeInfo?.sources && episodeInfo.sources.length > 0) {
      // Map sources to quality options
      // This is a simplification - in a real app, you might want to parse resolution from URLs
      // or have quality information in your API response
      const options: QualityOption[] = episodeInfo.sources.map((source, index) => {
        // For demo purposes, we'll create dummy quality options
        // In a real implementation, you'd get this from your API
        let label: string;
        let value: string;
        
        // Simple simulation of different qualities
        if (index === 0) {
          label = 'Auto';
          value = 'auto';
        } else if (index === 1) {
          label = '720p';
          value = '720p';
        } else if (index === 2) {
          label = '1080p';
          value = '1080p';
        } else {
          label = `Source ${index + 1}`;
          value = `source-${index}`;
        }
        
        return {
          label,
          value,
          url: source.url
        };
      });
      
      setQualityOptions(options);
    } else {
      setQualityOptions([]);
    }
  }, [episodeInfo]);

  useEffect(() => {
    // Reset states when source changes
    setIsLoaded(false);
    setIsPlayerReady(false);
    setPlayerError(null);
  }, [episodeInfo]);

  // Add proper type for player parameter
  const handlePlayerReady = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    player: React.MutableRefObject<unknown>
  ) => {
    setIsLoaded(true);
    setIsPlayerReady(true);
  };

  // Add proper type for error parameter
  const handlePlayerError = (error: Error | string) => {
    console.error("Player error:", error);
    setPlayerError(error instanceof Error ? error : new Error(String(error)));
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    // Handle intro/outro skipping if available
    if (isPlayerReady && playerRef.current && episodeInfo) {
      // Skip intro if defined and within range
      if (episodeInfo.intro && 
          episodeInfo.intro.start !== undefined && 
          episodeInfo.intro.end !== undefined &&
          state.playedSeconds >= episodeInfo.intro.start && 
          state.playedSeconds <= episodeInfo.intro.end - 0.5) {
        playerRef.current.seekTo(episodeInfo.intro.end);
      }
      
      // Skip outro if defined and within range
      if (episodeInfo.outro && 
          episodeInfo.outro.start !== undefined && 
          episodeInfo.outro.end !== undefined &&
          state.playedSeconds >= episodeInfo.outro.start && 
          state.playedSeconds <= episodeInfo.outro.end - 0.5) {
        playerRef.current.seekTo(episodeInfo.outro.end);
      }
    }
  };

  // Handle quality change
  const handleQualityChange = (quality: QualityOption) => {
    console.log('Quality changed to:', quality.label);
    // The ReactPlayerWrapper handles the actual quality change internally
  };

  // Get the correct image source
  const posterImage = 'image' in animeInfo 
    ? animeInfo.image 
    : animeInfo.poster;

  return (
    <div
      className={`w-full h-full min-h-[20vh] sm:min-h-[30vh] max-h-[60vh] md:min-h-[40vh] lg:min-h-[60vh] border border-cs-border ${isLoaded ? 'player-loaded' : 'player-loading'} relative`}
    >
      {uri ? (
        <ReactPlayerWrapper
          ref={playerRef}
          url={uri}
          poster={posterImage}
          tracks={episodeInfo?.tracks?.map(track => ({
            ...track,
            // Ensure subtitles are properly identified
            kind: track.kind || "subtitles",
            // If a track doesn't have a label, use the kind as label
            label: track.label || track.kind || "Subtitles",
            // Set the first subtitle track as default
            default: !hasDefaultTrack && (track.kind === "subtitles" || track.kind === undefined) 
              ? (hasDefaultTrack = true, true) : track.default
          }))}
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
          qualityOptions={qualityOptions}
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
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-cs-window">
          <p className="text-cs-text">Loading player...</p>
        </div>
      )}
      
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

export default VideoPlayer;
