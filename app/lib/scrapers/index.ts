import { ScraperParams, Scraper } from './types';
import { ScraperResult, VideoSource } from '../types';
import { VidSrcScraper } from './vidsrc';
import { SuperEmbedScraper } from './superembed';
import { Source1Scraper } from './source1';
import { Source2Scraper } from './source2';
import { Source3Scraper } from './source3';

// Scraper orchestrator - tries multiple sources with fallback
class ScraperOrchestrator {
  private scrapers: Scraper[];

  constructor() {
    // Order matters - try most reliable sources first
    this.scrapers = [
      new VidSrcScraper(),
      new SuperEmbedScraper(),
      new Source1Scraper(),
      new Source2Scraper(),
      new Source3Scraper(),
    ];
  }

  async scrape(params: ScraperParams): Promise<ScraperResult> {
    const errors: string[] = [];

    // Try each scraper sequentially until one succeeds
    for (const scraper of this.scrapers) {
      try {
        const result = await scraper.scrape(params);
        
        if (result.success && result.sources && result.sources.length > 0) {
          return {
            success: true,
            sources: result.sources,
          };
        }
        
        if (result.error) {
          errors.push(`${scraper.name}: ${result.error}`);
        }
      } catch (error: any) {
        console.error(`Error with scraper ${scraper.name}:`, error);
        errors.push(`${scraper.name}: ${error.message || 'Unknown error'}`);
      }
    }

    // All scrapers failed
    return {
      success: false,
      error: `All scrapers failed. Errors: ${errors.join('; ')}`,
    };
  }

  // Get sources from multiple scrapers in parallel (for redundancy)
  async scrapeAll(params: ScraperParams): Promise<VideoSource[]> {
    const promises = this.scrapers.map(scraper => 
      scraper.scrape(params).catch(() => ({ success: false, error: 'Failed' } as ScraperResult))
    );

    const results = await Promise.all(promises);
    const allSources: VideoSource[] = [];

    results.forEach(result => {
      if (result.success && 'sources' in result && result.sources && result.sources.length > 0) {
        allSources.push(...result.sources);
      }
    });

    // Remove duplicates based on URL
    const uniqueSources = Array.from(
      new Map(allSources.map(source => [source.url, source])).values()
    );

    return uniqueSources;
  }
}

// Export singleton instance
export const scraperOrchestrator = new ScraperOrchestrator();

// Export function for easy use
export async function scrapeVideoSources(params: ScraperParams): Promise<ScraperResult> {
  return scraperOrchestrator.scrape(params);
}

// Export all scrapers for individual use if needed
export { VidSrcScraper, SuperEmbedScraper, Source1Scraper, Source2Scraper, Source3Scraper };

