import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { destinationUpdateSchema } from '@/lib/validations/destination';
import {
  getDestinationById,
  updateDestination,
  deleteDestination,
} from '@/lib/services/destination-service';
import { revalidatePath } from 'next/cache';

async function triggerLandingRevalidation(tag: string) {
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
      console.error(`Failed to revalidate landing for tag ${tag}:`, error);
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

    await requirePermission(session.user.id, 'DESTINATIONS_VIEW');

    const destination = await getDestinationById(params.id);
    if (!destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    return NextResponse.json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
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

    await requirePermission(session.user.id, 'DESTINATIONS_EDIT');

    const body = await request.json();
    const data = destinationUpdateSchema.parse({ ...body, id: params.id });

    const destination = await updateDestination(params.id, data, session.user.id);

    // Trigger revalidation
    await triggerLandingRevalidation('destinations');
    revalidatePath('/api/public/destinations');
    revalidatePath('/informasi-publik/destinasi-wisata');

    return NextResponse.json(destination);
  } catch (error) {
    console.error('Error updating destination:', error);
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

    await requirePermission(session.user.id, 'DESTINATIONS_DELETE');

    await deleteDestination(params.id, session.user.id);

    // Trigger revalidation
    await triggerLandingRevalidation('destinations');
    revalidatePath('/api/public/destinations');
    revalidatePath('/informasi-publik/destinasi-wisata');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting destination:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete destination' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
