'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import MediaGrid from '../../components/MediaGrid';
import { Movie, TVShow, Genre } from '../../lib/types';

export default function BrowsePage() {
  const [type, setType] = useState<'movie' | 'tv'>('movie');
  const [items, setItems] = useState<(Movie | TVShow)[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [year, setYear] = useState<string>('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGenres();
  }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchItems();
  }, [type, selectedGenre, year, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchGenres = async () => {
    try {
      const res = await fetch(`/api/tmdb?endpoint=genres&type=${type}`);
      const data = await res.json();
      setGenres(data || []);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        endpoint: 'discover',
        type,
        page: page.toString(),
      });
      if (selectedGenre) {
        params.append('genre', selectedGenre.toString());
      }
      if (year) {
        params.append('year', year);
      }

      const res = await fetch(`/api/tmdb?${params}`);
      const data = await res.json();
      setItems(data.results || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setPage(1);
  };

  const handleYearChange = (newYear: string) => {
    setYear(newYear);
    setPage(1);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-netflix-black pt-16">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Browse</h1>

        {/* Filters */}
        <div className="mb-8 space-y-6">
          {/* Type Toggle */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setType('movie');
                setSelectedGenre(null);
                setYear('');
                setPage(1);
              }}
              className={`px-6 py-3 rounded-md font-bold transition-all duration-200 ${
                type === 'movie'
                  ? 'bg-white text-netflix-black'
                  : 'bg-netflix-gray-700/50 text-netflix-gray-200 hover:bg-netflix-gray-700'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => {
                setType('tv');
                setSelectedGenre(null);
                setYear('');
                setPage(1);
              }}
              className={`px-6 py-3 rounded-md font-bold transition-all duration-200 ${
                type === 'tv'
                  ? 'bg-white text-netflix-black'
                  : 'bg-netflix-gray-700/50 text-netflix-gray-200 hover:bg-netflix-gray-700'
              }`}
            >
              TV Shows
            </button>
          </div>

          {/* Genre Filter */}
          <div>
            <label className="block text-sm font-medium text-netflix-gray-300 mb-3">Genre</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleGenreChange(null)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedGenre === null
                    ? 'bg-white text-netflix-black'
                    : 'bg-netflix-gray-700/50 text-netflix-gray-200 hover:bg-netflix-gray-700'
                }`}
              >
                All
              </button>
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreChange(genre.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    selectedGenre === genre.id
                      ? 'bg-white text-netflix-black'
                      : 'bg-netflix-gray-700/50 text-netflix-gray-200 hover:bg-netflix-gray-700'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-netflix-gray-300 mb-3">Year</label>
            <select
              value={year}
              onChange={(e) => handleYearChange(e.target.value)}
              className="px-4 py-2 bg-netflix-gray-800 text-white rounded-md border border-netflix-gray-700 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-netflix-gray-400 mt-4">Loading...</p>
          </div>
        ) : (
          <>
            <MediaGrid items={items} type={type} />
            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-6 py-3 bg-netflix-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-netflix-gray-600 transition-all duration-200 font-medium"
              >
                Previous
              </button>
              <span className="px-6 py-3 text-netflix-gray-300 font-medium">Page {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={items.length < 20}
                className="px-6 py-3 bg-netflix-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-netflix-gray-600 transition-all duration-200 font-medium"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
