'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '../../components/Navigation';
import SearchBar from '../../components/SearchBar';
import MediaGrid from '../../components/MediaGrid';
import { Movie, TVShow } from '../../lib/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);

  useEffect(() => {
    if (queryParam) {
      performSearch(queryParam);
    }
  }, [queryParam]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setMovies([]);
      setTVShows([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(searchQuery)}&page=1`);
      const data = await res.json();
      const allResults = data.results || [];
      
      setResults(allResults);
      
      // Separate movies and TV shows
      const moviesList = allResults.filter((item: Movie | TVShow) => 'title' in item) as Movie[];
      const tvList = allResults.filter((item: Movie | TVShow) => 'name' in item) as TVShow[];
      
      setMovies(moviesList);
      setTVShows(tvList);
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
      setMovies([]);
      setTVShows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    performSearch(searchQuery);
  };

  return (
    <div className="min-h-screen bg-netflix-black pt-16">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Search</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} showSuggestions={true} />
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-netflix-gray-400 mt-4">Searching...</p>
          </div>
        ) : query ? (
          <>
            {results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-netflix-gray-400 text-lg">No results found for "{query}"</p>
              </div>
            ) : (
              <>
                {movies.length > 0 && (
                  <div className="mb-12">
                    <MediaGrid items={movies} type="movie" title={`Movies (${movies.length})`} />
                  </div>
                )}
                {tvShows.length > 0 && (
                  <div className="mb-12">
                    <MediaGrid items={tvShows} type="tv" title={`TV Shows (${tvShows.length})`} />
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-netflix-gray-400 text-lg">Enter a search query to find movies and TV shows</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-netflix-black pt-16">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-netflix-gray-400 mt-4">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
