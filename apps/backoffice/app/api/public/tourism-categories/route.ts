import { NextRequest, NextResponse } from 'next/server';
import { getVisibleTourismCategories } from '@/lib/services/tourism-service';
import { cachedQuery, generateCacheKey } from '@/lib/cache/cache';

export async function GET() {
    try {
        const cacheKey = generateCacheKey('tourism-categories:list');

        const categories = await cachedQuery(
            cacheKey,
            () => getVisibleTourismCategories(),
            300
        );

        return NextResponse.json({ categories }, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error('Error fetching public tourism categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}
