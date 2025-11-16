import { NextRequest, NextResponse } from 'next/server';
import { tmdb } from '@/app/lib/tmdb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get('endpoint');
    const type = searchParams.get('type') as 'movie' | 'tv' | undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const genre = searchParams.get('genre') ? parseInt(searchParams.get('genre')!, 10) : undefined;
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!, 10) : undefined;

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint parameter is required' },
        { status: 400 }
      );
    }

    let data;
    switch (endpoint) {
      case 'popular':
        if (!type) {
          return NextResponse.json(
            { error: 'Type parameter is required for popular endpoint' },
            { status: 400 }
          );
        }
        data = await tmdb.getPopular(type, page);
        break;
      case 'discover':
        if (!type) {
          return NextResponse.json(
            { error: 'Type parameter is required for discover endpoint' },
            { status: 400 }
          );
        }
        data = await tmdb.getDiscover(type, { genre, year, page });
        break;
      case 'genres':
        if (!type) {
          return NextResponse.json(
            { error: 'Type parameter is required for genres endpoint' },
            { status: 400 }
          );
        }
        data = await tmdb.getGenres(type);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid endpoint' },
          { status: 400 }
        );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in TMDB API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

