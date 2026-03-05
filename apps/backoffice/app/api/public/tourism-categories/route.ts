import { NextRequest, NextResponse } from 'next/server';
import { getVisibleTourismCategories } from '@/lib/services/tourism-service';

export async function GET() {
    try {
        const categories = await getVisibleTourismCategories();
        return NextResponse.json({ categories });
    } catch (error) {
        console.error('Error fetching public tourism categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}
