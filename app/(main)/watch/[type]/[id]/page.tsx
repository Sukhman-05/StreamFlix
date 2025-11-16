'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '../../../../components/Navigation';
import VideoPlayer from '../../../../components/VideoPlayer';
import { VideoSource, MediaDetails } from '../../../../lib/types';
import { getImageUrl } from '../../../../lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as 'movie' | 'tv';
  const id = params.id as string;
  const season = params.season as string | undefined;
  const episode = params.episode as string | undefined;

  const [sources, setSources] = useState<VideoSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mediaDetails, setMediaDetails] = useState<MediaDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    fetchMediaDetails();
    fetchSources();
  }, [type, id, season, episode]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMediaDetails = async () => {
    setLoadingDetails(true);
    try {
      const res = await fetch(`/api/tmdb/details?type=${type}&id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setMediaDetails(data);
      }
    } catch (error) {
      console.error('Error fetching media details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchSources = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        type,
        id,
      });
      if (season) params.append('season', season);
      if (episode) params.append('episode', episode);

      const res = await fetch(`/api/sources?${params}`);
      const data = await res.json();

      if (data.success && data.sources && data.sources.length > 0) {
        setSources(data.sources);
      } else {
        setError(data.error || 'No video sources found');
        setSources([]);
      }
    } catch (err: any) {
      console.error('Error fetching sources:', err);
      setError(err.message || 'Failed to load video sources');
      setSources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchSources();
  };

  const title = mediaDetails
    ? type === 'movie'
      ? (mediaDetails as any).title
      : (mediaDetails as any).name
    : 'Loading...';

  return (
    <div className="min-h-screen bg-netflix-black pt-16">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-netflix-gray-300 hover:text-white transition-colors flex items-center gap-2 font-medium"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Media Info */}
        {mediaDetails && (
          <div className="mb-6 flex items-center gap-4">
            {mediaDetails.poster_path && (
              <Image
                src={getImageUrl(mediaDetails.poster_path, 'w300')}
                alt={title}
                width={80}
                height={120}
              />
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
              {type === 'tv' && season && episode && (
                <p className="text-netflix-gray-400">
                  Season {season}, Episode {episode}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Video Player */}
        <div className="bg-netflix-black overflow-hidden">
          {loading ? (
            <div className="w-full aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white font-medium">Loading video sources...</p>
              </div>
            </div>
          ) : error ? (
            <div className="w-full aspect-video flex items-center justify-center">
              <div className="text-center">
                <p className="text-white text-xl mb-6 font-medium">{error}</p>
                <button
                  onClick={handleRetry}
                  className="px-8 py-3 bg-white text-netflix-black font-bold rounded-md hover:bg-white/80 transition-all duration-200"
                >
                  Retry
                </button>
                <p className="text-netflix-gray-400 text-sm mt-6">
                  If the problem persists, the content may not be available.
                </p>
              </div>
            </div>
          ) : sources.length > 0 ? (
            <VideoPlayer
              sources={sources}
              poster={mediaDetails?.backdrop_path ? getImageUrl(mediaDetails.backdrop_path, 'w1280') : undefined}
              autoplay={false}
              onError={(err) => {
                console.error('Video player error:', err);
                setError('Failed to play video. Trying next source...');
              }}
            />
          ) : (
            <div className="w-full aspect-video flex items-center justify-center">
              <p className="text-white font-medium">No video sources available</p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        {mediaDetails && (
          <div className="mt-8">
            <Link
              href={`/${type}/${id}`}
              className="text-white hover:text-netflix-red transition-colors font-medium inline-flex items-center gap-2"
            >
              View Details
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
