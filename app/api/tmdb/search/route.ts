import { NextRequest, NextResponse } from 'next/server';
import { tmdb } from '@/app/lib/tmdb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const page = parseInt(searchParams.get('page') || '1', 10);

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const data = await tmdb.search(query, page);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in search API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search' },
      { status: 500 }
    );
  }
}

