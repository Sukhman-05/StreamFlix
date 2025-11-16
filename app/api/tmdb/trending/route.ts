import { NextRequest, NextResponse } from 'next/server';
import { tmdb } from '@/app/lib/tmdb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = (searchParams.get('type') as 'movie' | 'tv' | 'all') || 'all';
    const page = parseInt(searchParams.get('page') || '1', 10);

    const data = await tmdb.getTrending(type, page);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in trending API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch trending content' },
      { status: 500 }
    );
  }
}

