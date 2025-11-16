import { notFound } from 'next/navigation';
import Navigation from '../../../components/Navigation';
import { getImageUrl } from '../../../lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { MediaDetails } from '../../../lib/types';

async function getTVDetails(id: number): Promise<MediaDetails | null> {
  try {
    const { tmdb } = await import('../../../lib/tmdb');
    const data = await tmdb.getTVDetails(id);
    return data;
  } catch (error) {
    console.error('Error fetching TV details:', error);
    return null;
  }
}

export default async function TVDetailPage({ params }: { params: { id: string } }) {
  const tvShow = await getTVDetails(parseInt(params.id, 10));

  if (!tvShow) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navigation />
      
      {/* Hero Section - Full width with backdrop */}
      <div className="relative h-[80vh] min-h-[500px] w-full overflow-hidden">
        {tvShow.backdrop_path && (
          <Image
            src={getImageUrl(tvShow.backdrop_path, 'original')}
            alt={tvShow.name}
            fill
            className="object-cover"
            priority
            quality={90}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-netflix-black" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-end pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex flex-col md:flex-row gap-8 items-end">
              {/* Poster */}
              <div className="flex-shrink-0">
                {tvShow.poster_path ? (
                  <Image
                    src={getImageUrl(tvShow.poster_path, 'w500')}
                    alt={tvShow.name}
                    width={300}
                    height={450}
                    className="shadow-2xl"
                  />
                ) : (
                  <div className="w-[300px] h-[450px] bg-netflix-gray-800 flex items-center justify-center">
                    <span className="text-netflix-gray-400">No Image</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 text-white pb-4">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
                  {tvShow.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-4 text-netflix-gray-200">
                  {tvShow.first_air_date && (
                    <span className="text-lg">{new Date(tvShow.first_air_date).getFullYear()}</span>
                  )}
                  {tvShow.number_of_seasons && (
                    <span className="text-lg">{tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? 's' : ''}</span>
                  )}
                  {tvShow.number_of_episodes && (
                    <span className="text-lg">{tvShow.number_of_episodes} Episodes</span>
                  )}
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 fill-netflix-red" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-lg font-semibold">{tvShow.vote_average.toFixed(1)}</span>
                    <span className="text-netflix-gray-400">({tvShow.vote_count} votes)</span>
                  </div>
                </div>

                {tvShow.genres && tvShow.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tvShow.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-netflix-gray-700/50 text-sm backdrop-blur-sm border border-netflix-gray-600/50"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {tvShow.tagline && (
                  <p className="text-xl text-netflix-gray-300 italic mb-4">"{tvShow.tagline}"</p>
                )}

                <p className="text-lg mb-6 leading-relaxed max-w-3xl text-netflix-gray-200">
                  {tvShow.overview}
                </p>

                <Link
                  href={`/watch/tv/${tvShow.id}`}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-netflix-black font-bold text-lg hover:bg-white/80 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  Play
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
