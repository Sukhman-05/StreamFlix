import { NextRequest, NextResponse } from 'next/server';
import { tmdb } from '@/app/lib/tmdb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as 'movie' | 'tv';
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and id parameters are required' },
        { status: 400 }
      );
    }

    const data = type === 'movie'
      ? await tmdb.getMovieDetails(parseInt(id, 10))
      : await tmdb.getTVDetails(parseInt(id, 10));

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in details API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch details' },
      { status: 500 }
    );
  }
}

