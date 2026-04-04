import { NextRequest, NextResponse } from 'next/server';
import { getTourismList } from '@/lib/services/tourism-service';
import { cachedQuery, generateCacheKey } from '@/lib/cache/cache';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '20');
        const categoryId = searchParams.get('categoryId') || undefined;
        const search = searchParams.get('search') || undefined;

        const featuredParam = searchParams.get('featured');
        const featured = featuredParam === 'true' ? true : (featuredParam === 'false' ? false : undefined);

        const params = { page, pageSize, categoryId, status: 'PUBLISHED' as const, featured, search };
        const cacheKey = generateCacheKey('tourism:list', { params });

        const result = await cachedQuery(
            cacheKey,
            () => getTourismList(params),
            300
        );

        return NextResponse.json(result, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error('Error fetching public tourism destinations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tourism destinations' },
            { status: 500 }
        );
    }
}
