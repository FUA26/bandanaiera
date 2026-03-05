import { NextRequest, NextResponse } from 'next/server';
import { getTourismBySlug } from '@/lib/services/tourism-service';

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const destination = await getTourismBySlug(params.slug);

        if (!destination || destination.status !== 'PUBLISHED') {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json({ destination });
    } catch (error) {
        console.error('Error fetching public tourism destination by slug:', error);
        return NextResponse.json(
            { error: 'Failed to fetch destination' },
            { status: 500 }
        );
    }
}
