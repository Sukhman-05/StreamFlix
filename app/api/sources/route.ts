import { NextRequest, NextResponse } from 'next/server';
import { scrapeVideoSources } from '@/app/lib/scrapers';
import { tmdb } from '@/app/lib/tmdb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as 'movie' | 'tv';
    const id = searchParams.get('id');
    const season = searchParams.get('season');
    const episode = searchParams.get('episode');

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and id parameters are required' },
        { status: 400 }
      );
    }

    // Fetch media details to get title and year
    let title: string;
    let year: number | undefined;

    try {
      const details = type === 'movie'
        ? await tmdb.getMovieDetails(parseInt(id, 10))
        : await tmdb.getTVDetails(parseInt(id, 10));

      title = type === 'movie' ? details.title : details.name;
      year = type === 'movie' 
        ? details.release_date ? new Date(details.release_date).getFullYear() : undefined
        : details.first_air_date ? new Date(details.first_air_date).getFullYear() : undefined;
    } catch (error) {
      // If we can't fetch details, use a generic title
      title = `Media ${id}`;
    }

    // Prepare scraper parameters
    const scraperParams = {
      type,
      title,
      year,
      tmdbId: parseInt(id, 10),
      season: season ? parseInt(season, 10) : undefined,
      episode: episode ? parseInt(episode, 10) : undefined,
    };

    // Scrape video sources
    const result = await scrapeVideoSources(scraperParams);

    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error || 'Failed to find video sources',
          sources: []
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      sources: result.sources || [],
    });
  } catch (error: any) {
    console.error('Error in sources API:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch video sources',
        sources: []
      },
      { status: 500 }
    );
  }
}

