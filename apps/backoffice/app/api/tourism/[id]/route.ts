import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { tourismUpdateSchema, tourismPublishSchema } from '@/lib/validations/tourism';
import {
    getTourismById,
    updateTourism,
    deleteTourism,
    publishTourism,
} from '@/lib/services/tourism-service';
import { revalidatePath } from 'next/cache';
import { invalidateTourismCache } from '@/lib/cache/revalidate';

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

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await requirePermission(session.user.id, 'TOURISM_VIEW');

        const destination = await getTourismById(params.id);
        if (!destination) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(destination);
    } catch (error) {
        console.error('Error fetching tourism destination:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch destination' },
            { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await requirePermission(session.user.id, 'TOURISM_EDIT');

        const body = await request.json();
        const data = tourismUpdateSchema.parse({ ...body, id: params.id });

        const destination = await updateTourism(params.id, data, session.user.id);

        if (destination.status === 'PUBLISHED') {
            await triggerLandingRevalidation('tourism');
            revalidatePath('/api/public/tourism');
            revalidatePath('/informasi-publik/destinasi-wisata');
            revalidatePath(`/informasi-publik/destinasi-wisata/${destination.slug}`);
        }

        // Invalidate Redis cache
        await invalidateTourismCache();

        return NextResponse.json(destination);
    } catch (error) {
        console.error('Error updating tourism destination:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to update destination' },
            { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await requirePermission(session.user.id, 'TOURISM_DELETE');

        const destination = await deleteTourism(params.id, session.user.id);

        if (destination.status === 'PUBLISHED') {
            await triggerLandingRevalidation('tourism');
            revalidatePath('/api/public/tourism');
            revalidatePath('/informasi-publik/destinasi-wisata');
            revalidatePath(`/informasi-publik/destinasi-wisata/${destination.slug}`);
        }

        // Invalidate Redis cache
        await invalidateTourismCache();

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting tourism destination:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to delete destination' },
            { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await requirePermission(session.user.id, 'TOURISM_PUBLISH');

        const body = await request.json();
        const data = tourismPublishSchema.parse({ ...body, id: params.id });

        const destination = await publishTourism(params.id, data.status, session.user.id);

        await triggerLandingRevalidation('tourism');
        revalidatePath('/api/public/tourism');
        revalidatePath('/informasi-publik/destinasi-wisata');
        revalidatePath(`/informasi-publik/destinasi-wisata/${destination.slug}`);

        // Invalidate Redis cache
        await invalidateTourismCache();

        return NextResponse.json(destination);
    } catch (error) {
        console.error('Error publishing tourism destination:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to publish destination' },
            { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
        );
    }
}
