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
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative mb-8">
          {tvShow.backdrop_path && (
            <div className="absolute inset-0 h-96 rounded-lg overflow-hidden">
              <Image
                src={getImageUrl(tvShow.backdrop_path, 'w1280')}
                alt={tvShow.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
            </div>
          )}
          
          <div className="relative flex flex-col md:flex-row gap-8 pt-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              {tvShow.poster_path ? (
                <Image
                  src={getImageUrl(tvShow.poster_path, 'w500')}
                  alt={tvShow.name}
                  width={300}
                  height={450}
                  className="rounded-lg shadow-2xl"
                />
              ) : (
                <div className="w-[300px] h-[450px] bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600">No Image</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{tvShow.name}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-300">
                {tvShow.first_air_date && (
                  <span>{new Date(tvShow.first_air_date).getFullYear()}</span>
                )}
                {tvShow.number_of_seasons && (
                  <span>{tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? 's' : ''}</span>
                )}
                {tvShow.number_of_episodes && (
                  <span>{tvShow.number_of_episodes} Episodes</span>
                )}
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span className="font-semibold">{tvShow.vote_average.toFixed(1)}</span>
                  <span className="text-gray-500">({tvShow.vote_count} votes)</span>
                </div>
              </div>

              {tvShow.genres && tvShow.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tvShow.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {tvShow.tagline && (
                <p className="text-xl text-gray-400 italic mb-4">"{tvShow.tagline}"</p>
              )}

              <p className="text-lg mb-6 leading-relaxed">{tvShow.overview}</p>

              <Link
                href={`/watch/tv/${tvShow.id}`}
                className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Watch Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

