import axios from 'axios';
import { Scraper, ScraperParams } from './types';
import { ScraperResult, VideoSource } from '../types';

// VidSrc scraper - uses VidSrc API/embed system
// VidSrc is a popular aggregator that provides embed links
export class VidSrcScraper implements Scraper {
  name = 'VidSrc';

  async scrape(params: ScraperParams): Promise<ScraperResult> {
    try {
      const type = params.type === 'movie' ? 'movie' : 'tv';
      const id = params.tmdbId;
      
      // VidSrc uses embed URLs in format:
      // https://vidsrc.me/embed/{type}/{id}
      // or for TV: https://vidsrc.me/embed/{type}/{id}/{season}/{episode}
      
      let embedUrl = `https://vidsrc.me/embed/${type}/${id}`;
      if (params.type === 'tv' && params.season && params.episode) {
        embedUrl = `https://vidsrc.me/embed/${type}/${id}/${params.season}-${params.episode}`;
      }
      
      // Try to fetch the embed page and extract video sources
      try {
        const response = await axios.get(embedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://vidsrc.me/',
          },
          timeout: 10000,
        });

        const html = response.data;
        
        // Extract video sources from the embed page
        // Look for common video source patterns
        const sources: VideoSource[] = [];
        
        // Pattern 1: Look for HLS streams (.m3u8)
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
        
        // Pattern 2: Look for MP4 links
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
        
        // Pattern 3: Look for iframe src with video sources
        const iframeMatches = html.match(/<iframe[^>]+src=["']([^"']+)["']/gi);
        if (iframeMatches && sources.length === 0) {
          // If we find iframes, return the embed URL as a source
          // The player will handle iframe embeds
          sources.push({
            url: embedUrl,
            type: 'other',
            label: 'Embed',
          });
        }
        
        if (sources.length > 0) {
          return {
            success: true,
            sources,
          };
        }
        
        // If no direct sources found, return embed URL as fallback
        return {
          success: true,
          sources: [{
            url: embedUrl,
            type: 'other',
            label: 'VidSrc Embed',
          }],
        };
      } catch (fetchError: any) {
        // If fetch fails, still return embed URL as it might work in iframe
        return {
          success: true,
          sources: [{
            url: embedUrl,
            type: 'other',
            label: 'VidSrc Embed',
          }],
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'VidSrc scraping failed',
      };
    }
  }
}

