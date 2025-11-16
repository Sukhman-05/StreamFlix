import Navigation from '../components/Navigation';
import MediaGrid from '../components/MediaGrid';
import HeroCarousel from '../components/HeroCarousel';
import { Movie, TVShow } from '../lib/types';

async function getTrendingMovies(): Promise<Movie[]> {
  try {
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

async function getHighRatedMovies(): Promise<Movie[]> {
  try {
    const { tmdb } = await import('../lib/tmdb');
    // Fetch multiple pages to get a larger pool of movies
    const [page1, page2, page3, page4, page5] = await Promise.all([
      tmdb.getPopular('movie', 1),
      tmdb.getPopular('movie', 2),
      tmdb.getPopular('movie', 3),
      tmdb.getPopular('movie', 4),
      tmdb.getPopular('movie', 5),
    ]);
    
    // Combine all results
    const allMovies = [
      ...(page1.results as Movie[]),
      ...(page2.results as Movie[]),
      ...(page3.results as Movie[]),
      ...(page4.results as Movie[]),
      ...(page5.results as Movie[]),
    ];
    
    // Filter movies with rating >= 8.5 and backdrop image
    const highRatedMovies = allMovies.filter(
      (movie) => movie.vote_average >= 8.5 && movie.backdrop_path && movie.overview
    );
    
    // Remove duplicates based on ID
    const uniqueMovies = Array.from(
      new Map(highRatedMovies.map(movie => [movie.id, movie])).values()
    );
    
    // Randomly shuffle and select 5
    const shuffled = [...uniqueMovies].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  } catch (error) {
    console.error('Error fetching high-rated movies:', error);
    return [];
  }
}

export default async function HomePage() {
  const [trendingMovies, trendingTV, heroMovies] = await Promise.all([
    getTrendingMovies(),
    getTrendingTV(),
    getHighRatedMovies(),
  ]);

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navigation />
      
      {/* Hero Carousel - 5 randomized popular movies with rating >= 8.5 */}
      {heroMovies.length > 0 ? (
        <HeroCarousel movies={heroMovies} />
      ) : (
        // Fallback to trending movie if no high-rated movies available
        trendingMovies.length > 0 && (
          <div className="relative h-[85vh] min-h-[500px] md:h-[90vh] md:min-h-[600px] w-full overflow-hidden">
            {/* Single movie fallback */}
          </div>
        )
      )}

      {/* Content rows */}
      <div className="relative -mt-24 sm:-mt-32 z-10 pb-12">
        {/* Trending Movies */}
        {trendingMovies.length > 0 && (
          <div className="mb-6 md:mb-8">
            <MediaGrid items={trendingMovies} type="movie" title="Trending Now" />
          </div>
        )}

        {/* Trending TV Shows */}
        {trendingTV.length > 0 && (
          <div className="mb-6 md:mb-8">
            <MediaGrid items={trendingTV} type="tv" title="Trending TV Shows" />
          </div>
        )}
      </div>
    </div>
  );
}
