import Navigation from '../components/Navigation';
import SearchBar from '../components/SearchBar';
import MediaGrid from '../components/MediaGrid';
import { Movie, TVShow } from '../lib/types';
import { getImageUrl } from '../lib/utils';
import Link from 'next/link';
import Image from 'next/image';

async function getTrendingMovies(): Promise<Movie[]> {
  try {
    // Use tmdb client directly in server components
    const { tmdb } = await import('../lib/tmdb');
    const data = await tmdb.getTrending('movie', 1);
    return data.results as Movie[];
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
}

async function getTrendingTV(): Promise<TVShow[]> {
  try {
    const { tmdb } = await import('../lib/tmdb');
    const data = await tmdb.getTrending('tv', 1);
    return data.results as TVShow[];
  } catch (error) {
    console.error('Error fetching trending TV:', error);
    return [];
  }
}

async function getPopularMovies(): Promise<Movie[]> {
  try {
    const { tmdb } = await import('../lib/tmdb');
    const data = await tmdb.getPopular('movie', 1);
    return data.results as Movie[];
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
}

export default async function HomePage() {
  const [trendingMovies, trendingTV, popularMovies] = await Promise.all([
    getTrendingMovies(),
    getTrendingTV(),
    getPopularMovies(),
  ]);

  const featured = trendingMovies[0] || trendingTV[0];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        {featured && (
          <div className="relative h-[60vh] min-h-[400px] rounded-lg overflow-hidden mb-12">
            {featured.backdrop_path && (
              <Image
                src={getImageUrl(featured.backdrop_path, 'w1280')}
                alt={featured.title || featured.name}
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-2xl px-8">
                <h1 className="text-5xl font-bold text-white mb-4">
                  {featured.title || featured.name}
                </h1>
                <p className="text-gray-300 text-lg mb-6 line-clamp-3">
                  {featured.overview}
                </p>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/watch/${'title' in featured ? 'movie' : 'tv'}/${featured.id}`}
                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Watch Now
                  </Link>
                  <Link
                    href={`/${'title' in featured ? 'movie' : 'tv'}/${featured.id}`}
                    className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    More Info
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-12 flex justify-center">
          <SearchBar showSuggestions={true} />
        </div>

        {/* Trending Movies */}
        {trendingMovies.length > 0 && (
          <div className="mb-12">
            <MediaGrid items={trendingMovies} type="movie" title="Trending Movies" />
          </div>
        )}

        {/* Trending TV Shows */}
        {trendingTV.length > 0 && (
          <div className="mb-12">
            <MediaGrid items={trendingTV} type="tv" title="Trending TV Shows" />
          </div>
        )}

        {/* Popular Movies */}
        {popularMovies.length > 0 && (
          <div className="mb-12">
            <MediaGrid items={popularMovies} type="movie" title="Popular Movies" />
          </div>
        )}
      </div>
    </div>
  );
}

