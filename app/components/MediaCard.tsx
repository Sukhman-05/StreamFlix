'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Movie, TVShow } from '../lib/types';
import { getImageUrl } from '../lib/utils';

interface MediaCardProps {
  media: Movie | TVShow;
  type: 'movie' | 'tv';
}

export default function MediaCard({ media, type }: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const title = type === 'movie' ? (media as Movie).title : (media as TVShow).name;
  const releaseDate = type === 'movie' 
    ? (media as Movie).release_date 
    : (media as TVShow).first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  return (
    <Link 
      href={`/${type}/${media.id}`}
      className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative transition-all duration-300 ease-out transform hover:scale-110 hover:z-50">
        <div className="aspect-[2/3] relative overflow-hidden bg-netflix-gray-800 shadow-lg">
          {media.poster_path ? (
            <Image
              src={getImageUrl(media.poster_path, 'w500')}
              alt={title}
              fill
              className="object-cover transition-transform duration-300"
              sizes="(max-width: 768px) 160px, (max-width: 1200px) 180px, 220px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-netflix-gray-800">
              <span className="text-netflix-gray-400 text-xs">No Image</span>
            </div>
          )}
          
          {/* Hover overlay with info */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 drop-shadow-lg">
                  {title}
                </h3>
                <div className="flex items-center justify-between text-xs">
                  {year && (
                    <span className="text-netflix-gray-300">{year}</span>
                  )}
                  {media.vote_average !== undefined && media.vote_average !== null && (
                    <div className="flex items-center gap-1 text-netflix-gray-300">
                      <svg className="w-3 h-3 fill-netflix-red" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{media.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
