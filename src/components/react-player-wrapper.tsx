"use client";

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import dynamic from "next/dynamic";
import type { ReactPlayerProps } from 'react-player';
import { Track } from "@/types/episodes";

// Quality options interface
interface QualityOption {
  label: string;
  value: string;
  url: string;
}

// Speed options
const SPEED_OPTIONS = [
  { label: '0.25x', value: 0.25 },
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: 'Normal', value: 1 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
  { label: '1.75x', value: 1.75 },
  { label: '2x', value: 2 }
];

// Icons for controls
const QUALITY_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
  </svg>
`;

const SPEED_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
`;

const SUBTITLE_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2" ry="2"/>
    <path d="M6 10h4m-4 4h8m2-4h4m-4 4h4"/>
  </svg>
`;

const PLAY_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
`;

const PAUSE_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="6" y="4" width="4" height="16"/>
    <rect x="14" y="4" width="4" height="16"/>
  </svg>
`;

const VOLUME_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
  </svg>
`;

const FULLSCREEN_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
  </svg>
`;

// Add a new icon for the native player switch
const NATIVE_PLAYER_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="3" y1="9" x2="21" y2="9"></line>
    <line x1="9" y1="21" x2="9" y2="9"></line>
  </svg>
`;

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import('react-player/lazy'), {
  ssr: false,
  loading: () => (
    <div className="art-custom-loading">
      <div className="art-spinner"></div>
    </div>
  ),
});

interface SubtitleTrack {
  kind: string;
  src: string;
  srcLang: string;
  label: string;
  default?: boolean;
}

// Extended Track interface for internal use
interface ExtendedTrack extends Track {
  srclang?: string;
}

interface ReactPlayerWrapperProps {
  url: string;
  poster?: string;
  isReady?: (isReady: boolean) => void;
  onProgress?: (state: { played: number; playedSeconds: number }) => void;
  tracks?: Track[];
  className?: string;
  style?: React.CSSProperties;
  playing?: boolean;
  controls?: boolean;
  volume?: number;
  muted?: boolean;
  playbackRate?: number;
  width?: string | number;
  height?: string | number;
  subtitleTracks?: SubtitleTrack[];
  onReady?: (player: any) => void;
  onStart?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: any) => void;
  progressInterval?: number;
  config?: any;
  qualityOptions?: QualityOption[];
  onQualityChange?: (quality: QualityOption) => void;
}

// Create a forwardRef version of the component
const ReactPlayerWrapper = forwardRef<any, ReactPlayerWrapperProps>(({
  url,
  poster,
  isReady,
  onProgress,
  tracks,
  className = "",
  style,
  playing: initialPlaying = false,
  controls = false, // Always disable default controls initially
  volume = 1,
  muted = false,
  playbackRate = 1,
  width = '100%',
  height = '100%',
  subtitleTracks = [],
  onReady,
  onStart,
  onPlay,
  onPause,
  onEnded,
  onError,
  progressInterval = 1000,
  config = {},
  qualityOptions = [],
  onQualityChange,
}, ref) => {
  const [playing, setPlaying] = useState(initialPlaying);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showCustomControls, setShowCustomControls] = useState(true); // Always show controls initially
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<QualityOption | null>(null);
  const [currentSpeed, setCurrentSpeed] = useState(playbackRate);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string | null>(null);
  const [controlsHideTimeout, setControlsHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [isMuted, setIsMuted] = useState(muted);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [wasPlaying, setWasPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [error, setError] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [useNativeControls, setUseNativeControls] = useState(false);

  // Select the first quality option by default if available
  useEffect(() => {
    if (qualityOptions.length > 0 && !currentQuality) {
      setCurrentQuality(qualityOptions[0]);
    }
  }, [qualityOptions, currentQuality]);

  // Expose the ReactPlayer methods via ref
  useImperativeHandle(ref, () => ({
    // Forward ReactPlayer methods to parent component
    play: () => {
      setPlaying(true);
    },
    pause: () => {
      setPlaying(false);
    },
    seekTo: (seconds: number, type?: 'seconds' | 'fraction') => {
      if (playerRef.current) {
        playerRef.current.seekTo(seconds, type || 'seconds');
      }
    },
    getCurrentTime: () => {
      if (playerRef.current) {
        return playerRef.current.getCurrentTime();
      }
      return 0;
    },
    getDuration: () => {
      if (playerRef.current) {
        return playerRef.current.getDuration();
      }
      return 0;
    },
    getInternalPlayer: () => {
      if (playerRef.current) {
        return playerRef.current.getInternalPlayer();
      }
      return null;
    },
    // Custom player controls
    setPlaybackRate: (rate: number) => {
      setCurrentSpeed(rate);
    },
    setQuality: (quality: QualityOption) => {
      setCurrentQuality(quality);
      if (onQualityChange) {
        onQualityChange(quality);
      }
    },
    setSubtitle: (trackSrc: string | null) => {
      setSelectedSubtitle(trackSrc);
    },
    // Toggle native controls
    toggleNativeControls: (useNative: boolean) => {
      setUseNativeControls(useNative);
    },
    // Access to refs
    playerRef,
    containerRef,
    videoRef
  }));

  // Handle component mounting safely
  useEffect(() => {
    setMounted(true);
    
    // Add fullscreen change event listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      setMounted(false);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // When ready state changes, notify parent
  useEffect(() => {
    if (isReady) {
      isReady(ready);
    }
  }, [ready, isReady]);

  // Handle tracks with a completely new approach
  useEffect(() => {
    if (!mounted || !ready || !videoRef.current || !tracks || tracks.length === 0) return;
    
    console.log("Applying track handling with new approach");
    
    const video = videoRef.current;
    
    // Step 1: Clear all existing tracks
    const existingTrackElements = video.querySelectorAll('track');
    existingTrackElements.forEach(track => {
      try {
        video.removeChild(track);
      } catch (e) {
        console.error('Failed to remove track:', e);
      }
    });
    
    // Step 2: Disable all TextTracks
    for (let i = 0; i < video.textTracks.length; i++) {
      try {
        video.textTracks[i].mode = 'disabled';
      } catch (e) {
        console.error('Failed to disable text track:', e);
      }
    }
    
    // Step 3: Wait a moment for the player to stabilize
    setTimeout(() => {
      if (!videoRef.current) return;
      
      const video = videoRef.current;
      let defaultTrackSrc: string | null = null;
      let hasAddedDefaultTrack = false;
      
      // Step 4: Add tracks with explicit attributes
      tracks.forEach((track, index) => {
        try {
          // Create and configure track element
          const trackEl = document.createElement("track");
          trackEl.kind = track.kind || "subtitles";
          trackEl.label = track.label || trackEl.kind;
          trackEl.src = track.file;
          trackEl.srclang = (track as ExtendedTrack).srclang || "en";
          
          // Set default if needed
          if (track.default && !hasAddedDefaultTrack) {
            trackEl.default = true;
            hasAddedDefaultTrack = true;
            defaultTrackSrc = track.file;
          }
          
          // Add to video with explicit data attributes for debugging
          trackEl.setAttribute('data-track-index', index.toString());
          trackEl.setAttribute('data-track-src', track.file);
          video.appendChild(trackEl);
          
          console.log(`Added track: ${track.label || 'Untitled'} (${track.file})`, trackEl);
        } catch (e) {
          console.error("Failed to add track:", e);
        }
      });
      
      // Step 5: If no default track but we have subtitles, use the first subtitle track
      if (!hasAddedDefaultTrack && tracks.some(t => t.kind === 'subtitles' || !t.kind)) {
        const firstSubtitle = tracks.find(t => t.kind === 'subtitles' || !t.kind);
        if (firstSubtitle) {
          defaultTrackSrc = firstSubtitle.file;
        }
      }
      
      // Step 6: If we have a default track, select it after a delay
      if (defaultTrackSrc) {
        console.log("Setting default subtitle track:", defaultTrackSrc);
        setSelectedSubtitle(defaultTrackSrc);
        
        // Wait a moment for tracks to load, then activate
        setTimeout(() => {
          console.log("Activating default subtitle track");
          activateSubtitleTrack(defaultTrackSrc);
        }, 1000);
      }
    }, 500);
  }, [tracks, ready, mounted]);
  
  // Separate function to activate a subtitle track
  const activateSubtitleTrack = (trackSrc: string | null) => {
    if (!videoRef.current) return;
    console.log("Activating subtitle track:", trackSrc);
    
    const video = videoRef.current;
    
    // First, disable all tracks
    Array.from(video.textTracks).forEach(track => {
      track.mode = 'disabled';
    });
    
    if (trackSrc === null) {
      console.log("No subtitle track to activate (all disabled)");
      return;
    }
    
    // Find all track elements
    const trackElements = video.querySelectorAll('track');
    
    // Loop through all track elements and activate the matching one
    let activated = false;
    trackElements.forEach((trackEl: HTMLTrackElement, index) => {
      if (trackEl.src.includes(trackSrc) || trackSrc.includes(trackEl.src)) {
        console.log(`Found matching track element at index ${index}`);
        
        // Try to set the corresponding TextTrack to showing
        if (index < video.textTracks.length) {
          try {
            video.textTracks[index].mode = 'showing';
            console.log(`Activated TextTrack at index ${index}`);
            activated = true;
          } catch (e) {
            console.error(`Failed to activate TextTrack at index ${index}:`, e);
          }
        }
      }
    });
    
    // If we couldn't activate by matching src, try a more aggressive approach
    if (!activated) {
      console.warn("Could not activate subtitle track by src matching, trying fallback");
      
      // Try to activate all subtitle tracks one by one
      for (let i = 0; i < video.textTracks.length; i++) {
        try {
          const track = video.textTracks[i];
          if (track.kind === 'subtitles' || track.kind === 'captions') {
            track.mode = 'showing';
            console.log(`Activated first available subtitle track at index ${i}`);
            activated = true;
            break;
          }
        } catch (e) {
          console.error(`Failed to activate first available subtitle track at index ${i}:`, e);
        }
      }
    }
    
    if (!activated) {
      console.error("Could not activate any subtitle track");
    }
  };
  
  // Update the handleSubtitleChange to use the new function
  const handleSubtitleChange = (trackSrc: string | null) => {
    console.log("Setting subtitle track:", trackSrc);
    setSelectedSubtitle(trackSrc);
    activateSubtitleTrack(trackSrc);
    setShowSubtitleMenu(false);
  };

  // Handle showing/hiding controls on mouse movement
  useEffect(() => {
    const handleMouseMove = () => {
      setShowCustomControls(true);
      
      // Clear existing timeout if any
      if (controlsHideTimeout) {
        clearTimeout(controlsHideTimeout);
      }
      
      // Hide controls after 3 seconds if not interacting with menus
      const timeout = setTimeout(() => {
        if (!showQualityMenu && !showSpeedMenu && !showSubtitleMenu) {
          setShowCustomControls(false);
        }
      }, 3000);
      
      setControlsHideTimeout(timeout);
    };
    
    const playerContainer = containerRef.current;
    if (playerContainer) {
      playerContainer.addEventListener('mousemove', handleMouseMove);
      playerContainer.addEventListener('mouseenter', handleMouseMove);
      
      // Always show controls when user is interacting
      playerContainer.addEventListener('mousedown', () => setShowCustomControls(true));
      playerContainer.addEventListener('touchstart', () => setShowCustomControls(true));
    }
    
    return () => {
      if (playerContainer) {
        playerContainer.removeEventListener('mousemove', handleMouseMove);
        playerContainer.removeEventListener('mouseenter', handleMouseMove);
        playerContainer.removeEventListener('mousedown', () => setShowCustomControls(true));
        playerContainer.removeEventListener('touchstart', () => setShowCustomControls(true));
      }
      
      if (controlsHideTimeout) {
        clearTimeout(controlsHideTimeout);
      }
    };
  }, [controlsHideTimeout, showQualityMenu, showSpeedMenu, showSubtitleMenu]);

  const handleReady = (player: any) => {
    setReady(true);
    setPlaying(initialPlaying); // Auto play when ready
    
    // Get the video element reference
    if (playerRef.current) {
      try {
        const playerElement = playerRef.current.getInternalPlayer();
        if (playerElement && playerElement.querySelector) {
          const videoElement = playerElement.querySelector('video');
          if (videoElement) {
            videoRef.current = videoElement;
            
            // Auto-play if needed
            if (initialPlaying) {
              videoElement.play().catch((error: Error) => {
                console.warn('Auto-play was prevented:', error);
              });
            }
          }
        }
      } catch (e) {
        console.warn('Failed to get video element:', e);
      }
    }
    
    // Call the onReady callback
    if (onReady) {
      onReady(player);
    }
  };

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    if (!seeking) {
      setCurrentTime(state.playedSeconds);
    }
    
    if (onProgress) {
      onProgress(state);
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setCurrentVolume(volume);
    setIsMuted(volume === 0);
    
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().volume = volume;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setCurrentVolume(prevVolume || 0.5);
    } else {
      setPrevVolume(currentVolume);
      setIsMuted(true);
      setCurrentVolume(0);
    }
  };

  // Updated seek handlers for improved functionality
  const handleSeekMouseDown = () => {
    setSeeking(true);
    // Save current playing state
    if (videoRef.current) {
      setWasPlaying(!videoRef.current.paused);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Directly update the played value for smooth UI
    const newPlayed = parseFloat(e.target.value);
    setPlayed(newPlayed);
    
    // Directly update video time for immediate feedback
    if (videoRef.current && duration) {
      const newTime = newPlayed * duration;
      videoRef.current.currentTime = newTime;
      console.log(`Seeking to ${newTime}s (${Math.round(newPlayed * 100)}%)`);
    }
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    
    // Get the target value
    const input = e.target as HTMLInputElement;
    const newPlayed = parseFloat(input.value);
    
    // Seek the video
    if (videoRef.current && duration) {
      const newTime = newPlayed * duration;
      videoRef.current.currentTime = newTime;
      console.log(`Seeked to ${newTime}s (${Math.round(newPlayed * 100)}%)`);
      
      // Resume playback if it was playing before
      if (wasPlaying) {
        videoRef.current.play().catch(err => console.error("Error resuming playback:", err));
      }
    }
  };

  // Add these functions for touch devices
  const handleTouchSeekStart = () => {
    handleSeekMouseDown();
  };
  
  const handleTouchSeekEnd = (e: React.TouchEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const newPlayed = parseFloat(input.value);
    setPlayed(newPlayed);
    
    if (videoRef.current && duration) {
      const newTime = newPlayed * duration;
      videoRef.current.currentTime = newTime;
      console.log(`Touch seeked to ${newTime}s (${Math.round(newPlayed * 100)}%)`);
      
      if (wasPlaying) {
        videoRef.current.play().catch(err => console.error("Error resuming playback:", err));
      }
    }
    
    setSeeking(false);
  };

  const handleError = (error: any) => {
    console.error('React Player Error:', error);
    if (onError) {
      onError(error);
    }
  };

  // Handle quality change
  const handleQualityChange = (quality: QualityOption) => {
    // Store current playback time to resume after quality change
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    
    setCurrentQuality(quality);
    if (onQualityChange) {
      onQualityChange(quality);
    }
    
    // Resume playback at the same point after quality change
    setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.seekTo(currentTime);
      }
    }, 500);
    
    setShowQualityMenu(false);
  };

  // Handle speed change
  const handleSpeedChange = (speed: number) => {
    setCurrentSpeed(speed);
    setShowSpeedMenu(false);
  };

  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Format time (seconds) to MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Fix the updateCurrentSubtitle function using any type to avoid type errors
  const updateCurrentSubtitle = useCallback(() => {
    if (!videoRef.current || !subtitlesEnabled) {
      setCurrentSubtitle('');
      return;
    }

    const textTracks = videoRef.current.textTracks;
    let activeText = '';

    if (textTracks && textTracks.length > 0) {
      for (let i = 0; i < textTracks.length; i++) {
        const track = textTracks[i];
        if (track.mode === 'showing' && track.activeCues && track.activeCues.length > 0) {
          for (let j = 0; j < track.activeCues.length; j++) {
            // Force type as any to access properties safely
            const cue = track.activeCues[j] as any;
            
            // Try to get text content using any available property
            if (cue && (cue.text || cue.textContent)) {
              const cueText = cue.text || cue.textContent || '';
              activeText += (activeText ? '\n' : '') + cueText;
            }
          }
        }
      }
    }

    setCurrentSubtitle(activeText);
  }, [videoRef, subtitlesEnabled]);

  // Add interval to update subtitle display
  useEffect(() => {
    if (!ready || !subtitlesEnabled) return;
    
    // Add cuechange event listener to each text track
    const handleCueChange = () => {
      updateCurrentSubtitle();
    };
    
    if (videoRef.current) {
      const textTracks = videoRef.current.textTracks;
      for (let i = 0; i < textTracks.length; i++) {
        textTracks[i].addEventListener('cuechange', handleCueChange);
      }
      
      // Also poll for updates as a fallback
      const intervalId = setInterval(updateCurrentSubtitle, 200);
      
      return () => {
        clearInterval(intervalId);
        if (videoRef.current) {
          const textTracks = videoRef.current.textTracks;
          for (let i = 0; i < textTracks.length; i++) {
            textTracks[i].removeEventListener('cuechange', handleCueChange);
          }
        }
      };
    }
  }, [ready, videoRef, subtitlesEnabled, updateCurrentSubtitle]);

  // Only render player if mounted (client-side)
  if (!mounted) {
    return (
      <div 
        className={`react-player-wrapper loading ${className}`} 
        style={{
          backgroundImage: poster ? `url(${poster})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          ...style
        }}
      >
        <div className="art-custom-loading">
          <div className="art-spinner"></div>
        </div>
      </div>
    );
  }

  // Get available subtitle tracks
  const availableSubtitles = tracks?.map(track => ({
    label: track.label || '',
    src: track.file,
    srclang: (track as ExtendedTrack).srclang || 'en'
  })) || [];

  // Add additional subtitle tracks if provided
  if (subtitleTracks.length > 0) {
    subtitleTracks.forEach(track => {
      availableSubtitles.push({
        label: track.label,
        src: track.src,
        srclang: track.srcLang
      });
    });
  }

  return (
    <div 
      ref={containerRef} 
      className={`react-player-wrapper ${ready ? 'loaded' : 'loading'} ${debugMode ? 'debug-subtitles' : ''} ${useNativeControls ? 'native-controls' : ''} ${className}`} 
      style={{
        backgroundImage: poster ? `url(${poster})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...style
      }}
    >
      <div className="react-player-container allow-animation">
        <ReactPlayer
          ref={playerRef}
          className="react-player allow-animation"
          url={currentQuality ? currentQuality.url : url}
          playing={playing}
          controls={useNativeControls} // Use native controls when enabled
          volume={currentVolume}
          muted={isMuted}
          playbackRate={currentSpeed}
          width={width}
          height={height}
          onReady={handleReady}
          onStart={onStart}
          onPlay={onPlay ? onPlay : () => setPlaying(true)}
          onPause={onPause ? onPause : () => setPlaying(false)}
          onEnded={onEnded}
          onError={handleError}
          onProgress={handleProgress}
          onDuration={handleDuration}
          progressInterval={progressInterval}
          config={{
            file: {
              attributes: {
                crossOrigin: "anonymous", // Important for subtitle support
                controlsList: useNativeControls ? "" : "nodownload",
                disablePictureInPicture: !useNativeControls,
                onLoadedMetadata: (e: any) => {
                  if (e.target) {
                    setVideoElement(e.target);
                    videoRef.current = e.target;
                  }
                }
              },
              forceVideo: true,
              forceHLS: true,
            },
            youtube: {
              playerVars: {
                cc_load_policy: 1, // Force closed captions
                modestbranding: 1,
                iv_load_policy: 3,
                rel: 0,
                controls: useNativeControls ? 1 : 0
              }
            }
          }}
        />
      </div>

      {/* Custom subtitle display - only show if custom controls are active */}
      {subtitlesEnabled && currentSubtitle && !useNativeControls && (
        <div className="subtitle-container">
          <div className="custom-subtitle">
            {currentSubtitle.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < currentSubtitle.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Our custom controls overlay - only show if not using native controls */}
      {!useNativeControls && (
        <div className={`custom-player-controls ${showCustomControls ? 'visible' : ''}`}>
          {/* Top controls */}
          <div className="custom-player-controls-top">
            {/* Custom settings buttons */}
            <div className="custom-player-controls-settings">
              {/* Native player toggle */}
              <div className="control-item">
                <button 
                  className="control-button native-player-button"
                  onClick={() => setUseNativeControls(true)}
                  title="Switch to browser player"
                >
                  <span 
                    className="control-icon" 
                    dangerouslySetInnerHTML={{ __html: NATIVE_PLAYER_ICON }}
                  />
                  <span className="control-label">Native</span>
                </button>
              </div>

              {/* Quality selection */}
              {qualityOptions.length > 0 && (
                <div className="control-item">
                  <button 
                    className="control-button quality-button"
                    onClick={() => {
                      setShowQualityMenu(!showQualityMenu);
                      setShowSpeedMenu(false);
                      setShowSubtitleMenu(false);
                    }}
                  >
                    <span 
                      className="control-icon" 
                      dangerouslySetInnerHTML={{ __html: QUALITY_ICON }}
                    />
                    <span className="control-label">{currentQuality?.label || 'Auto'}</span>
                  </button>
                  {showQualityMenu && (
                    <div className="control-menu quality-menu">
                      {qualityOptions.map((quality) => (
                        <button
                          key={quality.value}
                          className={`menu-item ${currentQuality?.value === quality.value ? 'active' : ''}`}
                          onClick={() => handleQualityChange(quality)}
                        >
                          {quality.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Playback speed selection */}
              <div className="control-item">
                <button 
                  className="control-button speed-button"
                  onClick={() => {
                    setShowSpeedMenu(!showSpeedMenu);
                    setShowQualityMenu(false);
                    setShowSubtitleMenu(false);
                  }}
                >
                  <span 
                    className="control-icon" 
                    dangerouslySetInnerHTML={{ __html: SPEED_ICON }}
                  />
                  <span className="control-label">{currentSpeed}x</span>
                </button>
                {showSpeedMenu && (
                  <div className="control-menu speed-menu">
                    {SPEED_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        className={`menu-item ${currentSpeed === option.value ? 'active' : ''}`}
                        onClick={() => handleSpeedChange(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Subtitle selection */}
              {availableSubtitles.length > 0 && (
                <div className="control-item">
                  <button 
                    className="control-button subtitle-button"
                    onClick={() => {
                      setShowSubtitleMenu(!showSubtitleMenu);
                      setShowQualityMenu(false);
                      setShowSpeedMenu(false);
                    }}
                  >
                    <span 
                      className="control-icon" 
                      dangerouslySetInnerHTML={{ __html: SUBTITLE_ICON }}
                    />
                    <span className="control-label">
                      {selectedSubtitle 
                        ? availableSubtitles.find(sub => sub.src === selectedSubtitle)?.label || 'On'
                        : 'Off'}
                    </span>
                  </button>
                  {showSubtitleMenu && (
                    <div className="control-menu subtitle-menu">
                      <button
                        className={`menu-item ${selectedSubtitle === null ? 'active' : ''}`}
                        onClick={() => handleSubtitleChange(null)}
                      >
                        Off
                      </button>
                      {availableSubtitles.map((subtitle, index) => (
                        <button
                          key={index}
                          className={`menu-item ${selectedSubtitle === subtitle.src ? 'active' : ''}`}
                          onClick={() => handleSubtitleChange(subtitle.src)}
                        >
                          {subtitle.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom controls bar */}
          <div className="custom-player-controls-bottom">
            {/* Progress bar */}
            <div className="progress-container">
              <input 
                type="range"
                min={0}
                max={0.999999}
                step="any"
                value={played}
                onMouseDown={handleSeekMouseDown}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
                onTouchStart={handleTouchSeekStart}
                onTouchEnd={handleTouchSeekEnd}
                className="progress-slider"
              />
              <div className="time-display">
                <span>{formatTime(played * duration)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            {/* Controls buttons */}
            <div className="controls-buttons">
              <button 
                className="control-button play-button"
                onClick={() => setPlaying(!playing)}
              >
                <span 
                  className="control-icon" 
                  dangerouslySetInnerHTML={{ __html: playing ? PAUSE_ICON : PLAY_ICON }}
                />
              </button>
              
              {/* Volume control */}
              <div className="volume-container">
                <button 
                  className="control-button volume-button"
                  onClick={toggleMute}
                >
                  <span 
                    className="control-icon" 
                    dangerouslySetInnerHTML={{ __html: VOLUME_ICON }}
                  />
                </button>
                <input 
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={currentVolume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>
              
              {/* Fullscreen button */}
              <button 
                className="control-button fullscreen-button"
                onClick={toggleFullScreen}
              >
                <span 
                  className="control-icon" 
                  dangerouslySetInnerHTML={{ __html: FULLSCREEN_ICON }}
                />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Button to switch back to custom controls when using native controls */}
      {useNativeControls && (
        <div className="native-controls-toggle">
          <button
            className="switch-to-custom-button"
            onClick={() => setUseNativeControls(false)}
            title="Switch back to custom player"
          >
            Use Custom Player
          </button>
        </div>
      )}
      
      {/* Debug button that shows regardless of control mode */}
      {window.location.search.includes('debug=true') && (
        <div className="debug-controls">
          <button 
            className="control-button debug-button"
            onClick={() => {
              setDebugMode(!debugMode);
              console.log("Debug mode:", !debugMode);
              
              // Force subtitle display in debug mode
              if (!debugMode && videoRef.current) {
                Array.from(videoRef.current.textTracks).forEach((track, i) => {
                  console.log(`TextTrack ${i}:`, track);
                  if (track.kind === 'subtitles' || track.kind === 'captions') {
                    track.mode = 'showing';
                  }
                });
              }
            }}
          >
            Debug: {debugMode ? 'ON' : 'OFF'}
          </button>
        </div>
      )}
    </div>
  );
});

// Set display name for React DevTools
ReactPlayerWrapper.displayName = 'ReactPlayerWrapper';

export default ReactPlayerWrapper; 