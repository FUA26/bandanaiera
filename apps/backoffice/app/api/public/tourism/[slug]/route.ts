import { NextRequest, NextResponse } from 'next/server';
import { getTourismBySlug } from '@/lib/services/tourism-service';
import { cachedQuery, generateCacheKey } from '@/lib/cache/cache';

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const cacheKey = generateCacheKey('tourism:item', { slug: params.slug });

        const destination = await cachedQuery(
            cacheKey,
            () => getTourismBySlug(params.slug),
            300
        );

        if (!destination || destination.status !== 'PUBLISHED') {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json({ destination }, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error('Error fetching public tourism destination by slug:', error);
        return NextResponse.json(
            { error: 'Failed to fetch destination' },
            { status: 500 }
        );
    }
}
