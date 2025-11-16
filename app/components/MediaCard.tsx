'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Movie, TVShow } from '../lib/types';
import { getImageUrl } from '../lib/utils';

interface MediaCardProps {
  media: Movie | TVShow;
  type: 'movie' | 'tv';
}

export default function MediaCard({ media, type }: MediaCardProps) {
  const title = type === 'movie' ? (media as Movie).title : (media as TVShow).name;
  const releaseDate = type === 'movie' 
    ? (media as Movie).release_date 
    : (media as TVShow).first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  return (
    <Link href={`/${type}/${media.id}`}>
      <div className="group relative bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div className="aspect-[2/3] relative overflow-hidden bg-gray-900">
          {media.poster_path ? (
            <Image
              src={getImageUrl(media.poster_path, 'w500')}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <span className="text-gray-600 text-sm">No Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{title}</h3>
            <div className="flex items-center justify-between text-xs text-gray-300">
              {year && <span>{year}</span>}
              <div className="flex items-center gap-1">
                <span>⭐</span>
                <span>{media.vote_average.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1 group-hover:hidden">
            {title}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-400">
            {year && <span>{year}</span>}
            <div className="flex items-center gap-1">
              <span>⭐</span>
              <span>{media.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

