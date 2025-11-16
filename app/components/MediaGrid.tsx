'use client';

import { Movie, TVShow } from '../lib/types';
import MediaCard from './MediaCard';

interface MediaGridProps {
  items: (Movie | TVShow)[];
  type: 'movie' | 'tv';
  title?: string;
}

export default function MediaGrid({ items, type, title }: MediaGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No {type === 'movie' ? 'movies' : 'TV shows'} found</p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((item) => (
          <MediaCard key={item.id} media={item} type={type} />
        ))}
      </div>
    </div>
  );
}

