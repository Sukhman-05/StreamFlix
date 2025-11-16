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
    return null;
  }

  return (
    <div className="mb-12 px-2 sm:px-4 md:px-6 lg:px-8">
      {title && (
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 px-2">
          {title}
        </h2>
      )}
      <div className="relative group">
        <div 
          className="overflow-x-auto overflow-y-hidden scrollbar-hide pb-4 scroll-smooth touch-pan-x"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth'
          }}
        >
          <div className="flex gap-2 px-2" style={{ width: 'max-content' }}>
            {items.map((item) => (
              <div 
                key={item.id} 
                className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] xl:w-[220px]"
              >
                <MediaCard media={item} type={type} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
