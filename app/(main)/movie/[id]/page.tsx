import { notFound } from 'next/navigation';
import Navigation from '../../../components/Navigation';
import { getImageUrl, formatRuntime } from '../../../lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { MediaDetails } from '../../../lib/types';

async function getMovieDetails(id: number): Promise<MediaDetails | null> {
  try {
    const { tmdb } = await import('../../../lib/tmdb');
    const data = await tmdb.getMovieDetails(id);
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  const movie = await getMovieDetails(parseInt(params.id, 10));

  if (!movie) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative mb-8">
          {movie.backdrop_path && (
            <div className="absolute inset-0 h-96 rounded-lg overflow-hidden">
              <Image
                src={getImageUrl(movie.backdrop_path, 'w1280')}
                alt={movie.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
            </div>
          )}
          
          <div className="relative flex flex-col md:flex-row gap-8 pt-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              {movie.poster_path ? (
                <Image
                  src={getImageUrl(movie.poster_path, 'w500')}
                  alt={movie.title}
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-300">
                {movie.release_date && (
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                )}
                {movie.runtime && (
                  <span>{formatRuntime(movie.runtime)}</span>
                )}
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-gray-500">({movie.vote_count} votes)</span>
                </div>
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {movie.tagline && (
                <p className="text-xl text-gray-400 italic mb-4">"{movie.tagline}"</p>
              )}

              <p className="text-lg mb-6 leading-relaxed">{movie.overview}</p>

              <Link
                href={`/watch/movie/${movie.id}`}
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

