import axios from 'axios';
import { Scraper, ScraperParams } from './types';
import { ScraperResult, VideoSource } from '../types';

// SuperEmbed scraper - another popular embed aggregator
export class SuperEmbedScraper implements Scraper {
  name = 'SuperEmbed';

  async scrape(params: ScraperParams): Promise<ScraperResult> {
    try {
      const type = params.type === 'movie' ? 'movie' : 'tv';
      const id = params.tmdbId;
      
      // SuperEmbed uses similar pattern
      let embedUrl = `https://www.2embed.to/embed/${type}/${id}`;
      if (params.type === 'tv' && params.season && params.episode) {
        embedUrl = `https://www.2embed.to/embed/${type}/${id}/${params.season}/${params.episode}`;
      }
      
      // Try to extract video sources
      try {
        const response = await axios.get(embedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://www.2embed.to/',
          },
          timeout: 10000,
        });

        const html = response.data;
        const sources: VideoSource[] = [];
        
        // Extract video sources
        const hlsMatches = html.match(/https?:\/\/[^\s"']+\.m3u8/g);
        if (hlsMatches) {
          hlsMatches.forEach((url: string) => {
            sources.push({
              url: url,
              type: 'hls',
              quality: 'auto',
              label: 'HLS Stream',
            });
          });
        }
        
        const mp4Matches = html.match(/https?:\/\/[^\s"']+\.mp4/g);
        if (mp4Matches) {
          mp4Matches.forEach((url: string) => {
            sources.push({
              url: url,
              type: 'mp4',
              quality: 'auto',
              label: 'MP4 Stream',
            });
          });
        }
        
        if (sources.length > 0) {
          return {
            success: true,
            sources,
          };
        }
        
        // Return embed URL as fallback
        return {
          success: true,
          sources: [{
            url: embedUrl,
            type: 'other',
            label: 'SuperEmbed',
          }],
        };
      } catch (fetchError: any) {
        return {
          success: true,
          sources: [{
            url: embedUrl,
            type: 'other',
            label: 'SuperEmbed',
          }],
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'SuperEmbed scraping failed',
      };
    }
  }
}

