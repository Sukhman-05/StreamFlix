import axios from 'axios';
import { Movie, TVShow, MediaDetails, Genre } from './types';

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

if (!TMDB_API_KEY) {
  console.warn('TMDB API key is not set. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file');
}

const api = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export interface TrendingResponse {
  page: number;
  results: (Movie | TVShow)[];
  total_pages: number;
  total_results: number;
}

export interface SearchResponse {
  page: number;
  results: (Movie | TVShow)[];
  total_pages: number;
  total_results: number;
}

export const tmdb = {
  async getTrending(type: 'movie' | 'tv' | 'all' = 'all', page: number = 1): Promise<TrendingResponse> {
    try {
      if (type === 'all') {
        const [movies, tv] = await Promise.all([
          api.get<TrendingResponse>(`/trending/movie/day`, { params: { page } }),
          api.get<TrendingResponse>(`/trending/tv/day`, { params: { page } }),
        ]);
        return {
          page,
          results: [...movies.data.results, ...tv.data.results],
          total_pages: Math.max(movies.data.total_pages, tv.data.total_pages),
          total_results: movies.data.total_results + tv.data.total_results,
        };
      }
      const response = await api.get<TrendingResponse>(`/trending/${type}/day`, { params: { page } });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending:', error);
      throw error;
    }
  },

  async getPopular(type: 'movie' | 'tv' = 'movie', page: number = 1): Promise<TrendingResponse> {
    try {
      const response = await api.get<TrendingResponse>(`/${type}/popular`, { params: { page } });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular:', error);
      throw error;
    }
  },

  async search(query: string, page: number = 1): Promise<SearchResponse> {
    try {
      const response = await api.get<SearchResponse>('/search/multi', {
        params: { query, page },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching:', error);
      throw error;
    }
  },

  async getMovieDetails(id: number): Promise<MediaDetails> {
    try {
      const response = await api.get<MediaDetails>(`/movie/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  async getTVDetails(id: number): Promise<MediaDetails> {
    try {
      const response = await api.get<MediaDetails>(`/tv/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching TV details:', error);
      throw error;
    }
  },

  async getGenres(type: 'movie' | 'tv' = 'movie'): Promise<Genre[]> {
    try {
      const response = await api.get<{ genres: Genre[] }>(`/genre/${type}/list`);
      return response.data.genres;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  },

  async getDiscover(
    type: 'movie' | 'tv' = 'movie',
    params: {
      genre?: number;
      year?: number;
      page?: number;
      sort_by?: string;
    } = {}
  ): Promise<TrendingResponse> {
    try {
      const response = await api.get<TrendingResponse>(`/discover/${type}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching discover:', error);
      throw error;
    }
  },
};

