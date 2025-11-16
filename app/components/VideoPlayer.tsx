'use client';

import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import Hls from 'hls.js';
import { VideoSource } from '../lib/types';

interface VideoPlayerProps {
  sources: VideoSource[];
  poster?: string;
  autoplay?: boolean;
  onError?: (error: Error) => void;
}

export default function VideoPlayer({ 
  sources, 
  poster, 
  autoplay = false,
  onError,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (!videoRef.current || sources.length === 0) return;

    const video = videoRef.current;
    let hls: Hls | null = null;

    const initializePlayer = () => {
      // Clean up previous player instance
      if (playerRef.current) {
        playerRef.current.dispose();
      }

      // Initialize Video.js player
      const player = videojs(video, {
        controls: true,
        responsive: true,
        fluid: true,
        autoplay: autoplay,
        preload: 'auto',
        poster: poster,
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        html5: {
          vhs: {
            overrideNative: true,
          },
        },
      });

      playerRef.current = player;

      // Handle player errors
      player.on('error', () => {
        const playerError = player.error();
        if (playerError) {
          console.error('Video.js error:', playerError);
          tryNextSource();
        }
      });

      // Load the current source
      loadSource(sources[currentSourceIndex]);
    };

    const loadSource = (source: VideoSource) => {
      if (!video) return;

      setError(null);

      // Clean up previous HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (source.type === 'hls' || source.url.endsWith('.m3u8')) {
        // Use HLS.js for HLS streams
        if (Hls.isSupported()) {
          hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
            backBufferLength: 90,
          });

          hls.loadSource(source.url);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (autoplay) {
              video.play().catch(err => {
                console.error('Autoplay failed:', err);
              });
            }
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.error('HLS network error, trying to recover...');
                  hls?.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.error('HLS media error, trying to recover...');
                  hls?.recoverMediaError();
                  break;
                default:
                  console.error('HLS fatal error, trying next source...');
                  tryNextSource();
                  break;
              }
            }
          });

          hlsRef.current = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Native HLS support (Safari)
          video.src = source.url;
          if (autoplay) {
            video.play().catch(err => {
              console.error('Autoplay failed:', err);
            });
          }
        } else {
          console.error('HLS not supported');
          tryNextSource();
        }
      } else if (source.type === 'mp4' || source.url.endsWith('.mp4')) {
        // Direct MP4
        video.src = source.url;
        if (autoplay) {
          video.play().catch(err => {
            console.error('Autoplay failed:', err);
          });
        }
      } else {
        // Other types - try to load as video source
        video.src = source.url;
        if (autoplay) {
          video.play().catch(err => {
            console.error('Autoplay failed:', err);
          });
        }
      }

      // Handle video errors
      video.onerror = () => {
        console.error('Video element error');
        tryNextSource();
      };
    };

    const tryNextSource = () => {
      if (currentSourceIndex < sources.length - 1) {
        const nextIndex = currentSourceIndex + 1;
        setCurrentSourceIndex(nextIndex);
      } else {
        const errorMsg = 'All video sources failed to load';
        setError(errorMsg);
        if (onError) {
          onError(new Error(errorMsg));
        }
      }
    };

    initializePlayer();

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [sources, currentSourceIndex, autoplay, poster, onError]);

  if (sources.length === 0) {
    return (
      <div className="w-full aspect-video bg-black flex items-center justify-center">
        <p className="text-white">No video sources available</p>
      </div>
    );
  }

  // Check if current source is an embed/iframe
  const currentSource = sources[currentSourceIndex];
  const isEmbed = currentSource?.type === 'other' || 
                  currentSource?.url.includes('embed') ||
                  currentSource?.url.includes('iframe');

  if (error && !isEmbed) {
    return (
      <div className="w-full aspect-video bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-2">Error loading video</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Render iframe for embed sources
  if (isEmbed && currentSource) {
    return (
      <div className="w-full">
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={currentSource.url}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ border: 'none' }}
          />
        </div>
        {sources.length > 1 && (
          <div className="mt-2 text-sm text-gray-400">
            Source {currentSourceIndex + 1} of {sources.length}
            {currentSource.label && ` - ${currentSource.label}`}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered"
          playsInline
        />
      </div>
      {sources.length > 1 && (
        <div className="mt-2 text-sm text-gray-400">
          Source {currentSourceIndex + 1} of {sources.length}
          {sources[currentSourceIndex]?.label && ` - ${sources[currentSourceIndex].label}`}
        </div>
      )}
    </div>
  );
}
