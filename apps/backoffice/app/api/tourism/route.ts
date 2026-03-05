import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { tourismQuerySchema, tourismSchema } from '@/lib/validations/tourism';
import {
    getTourismList,
    createTourism,
} from '@/lib/services/tourism-service';
import { revalidatePath } from 'next/cache';

async function triggerLandingRevalidation(tag: 'tourism') {
    const revalidateSecret = process.env.REVALIDATE_SECRET;
    const landingUrl = process.env.LANDING_URL || 'http://localhost:3000';

    if (revalidateSecret) {
        try {
            await fetch(`${landingUrl}/api/revalidate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secret: revalidateSecret, tag }),
            });
        } catch (error) {
            console.error('Failed to revalidate landing:', error);
        }
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await requirePermission(session.user.id, 'TOURISM_VIEW');

        const searchParams = request.nextUrl.searchParams;
        const query = tourismQuerySchema.parse(Object.fromEntries(searchParams));

        const result = await getTourismList(query);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching tourism destinations:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch destinations' },
            { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await requirePermission(session.user.id, 'TOURISM_CREATE');

        const body = await request.json();
        const data = tourismSchema.parse(body);

        const destination = await createTourism(data, session.user.id);

        // Trigger landing revalidation if published
        if (destination.status === 'PUBLISHED') {
            await triggerLandingRevalidation('tourism');
            revalidatePath('/api/public/tourism');
            revalidatePath('/informasi-publik/destinasi-wisata');
        }

        return NextResponse.json(destination, { status: 201 });
    } catch (error) {
        console.error('Error creating tourism destination:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create destination' },
            { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
        );
    }
}
