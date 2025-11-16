export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_name: string;
  popularity: number;
  origin_country: string[];
}

export interface MediaDetails extends Movie, TVShow {
  genres: Genre[];
  production_companies?: any[];
  production_countries?: any[];
  spoken_languages?: any[];
  status?: string;
  tagline?: string;
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Season[];
  created_by?: any[];
  networks?: any[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  air_date: string;
  episode_count: number;
}

export interface VideoSource {
  url: string;
  quality?: string;
  type: 'hls' | 'mp4' | 'other';
  label?: string;
}

export interface ScraperResult {
  success: boolean;
  sources?: VideoSource[];
  error?: string;
}

export type MediaType = 'movie' | 'tv';

