import { NextRequest, NextResponse } from 'next/server';
import { getTourismList } from '@/lib/services/tourism-service';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '20');
        const categoryId = searchParams.get('categoryId') || undefined;
        const search = searchParams.get('search') || undefined;

        const featuredParam = searchParams.get('featured');
        const featured = featuredParam === 'true' ? true : (featuredParam === 'false' ? false : undefined);

        const result = await getTourismList({
            page,
            pageSize,
            categoryId,
            status: 'PUBLISHED',
            featured,
            search,
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching public tourism destinations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tourism destinations' },
            { status: 500 }
        );
    }
}
