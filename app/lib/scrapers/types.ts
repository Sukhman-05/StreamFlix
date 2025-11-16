import { VideoSource, ScraperResult } from '../types';

export interface ScraperParams {
  type: 'movie' | 'tv';
  title: string;
  year?: number;
  tmdbId: number;
  season?: number;
  episode?: number;
}

export interface Scraper {
  name: string;
  scrape(params: ScraperParams): Promise<ScraperResult>;
}

