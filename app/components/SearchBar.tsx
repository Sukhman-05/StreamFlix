'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Movie, TVShow } from '../lib/types';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
}

export default function SearchBar({ onSearch, showSuggestions = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<(Movie | TVShow)[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestionsList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    if (onSearch) {
      onSearch(searchQuery);
    } else {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
    setShowSuggestionsList(false);
  };

  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/tmdb/search?query=${encodeURIComponent(searchQuery)}&page=1`);
      const data = await response.json();
      setSuggestions(data.results?.slice(0, 5) || []);
      setShowSuggestionsList(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const debouncedFetch = useRef(debounce(fetchSuggestions, 300)).current;

  useEffect(() => {
    if (showSuggestions) {
      debouncedFetch(query);
    }
  }, [query, showSuggestions, debouncedFetch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const getTitle = (item: Movie | TVShow) => {
    return 'title' in item ? item.title : item.name;
  };

  const getType = (item: Movie | TVShow): 'movie' | 'tv' => {
    return 'title' in item ? 'movie' : 'tv';
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestionsList(true);
            }
          }}
          placeholder="Search movies and TV shows..."
          className="w-full px-4 py-3 pl-12 bg-netflix-gray-800 border border-netflix-gray-700 rounded-md text-white placeholder-netflix-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-netflix-gray-400 hover:text-white transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          </div>
        )}
      </form>

      {showSuggestions && showSuggestionsList && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-netflix-gray-800 border border-netflix-gray-700 rounded-md shadow-2xl max-h-96 overflow-y-auto">
          {suggestions.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                const type = getType(item);
                router.push(`/${type}/${item.id}`);
                setShowSuggestionsList(false);
                setQuery('');
              }}
              className="w-full px-4 py-3 text-left hover:bg-netflix-gray-700 transition-colors flex items-center gap-3 border-b border-netflix-gray-700 last:border-0"
            >
              {item.poster_path && (
                <Image
                  src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                  alt={getTitle(item)}
                  width={48}
                  height={64}
                  className="w-12 h-16 object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{getTitle(item)}</p>
                <p className="text-netflix-gray-400 text-sm">
                  {getType(item) === 'movie' ? 'Movie' : 'TV Show'}
                  {item.vote_average !== undefined && item.vote_average !== null && (
                    <> • ⭐ {item.vote_average.toFixed(1)}</>
                  )}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
