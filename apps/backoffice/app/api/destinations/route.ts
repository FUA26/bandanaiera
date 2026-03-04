import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { destinationQuerySchema, destinationSchema } from '@/lib/validations/destination';
import {
  getDestinationsList,
  createDestination,
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

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'DESTINATIONS_VIEW');

    const searchParams = request.nextUrl.searchParams;
    const params = Object.fromEntries(searchParams);
    
    // Convert string booleans to real booleans for zod
    if (params.isFeatured === 'true') (params as any).isFeatured = true;
    if (params.isFeatured === 'false') (params as any).isFeatured = false;

    const query = destinationQuerySchema.parse(params);

    const result = await getDestinationsList(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching destinations:', error);
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

    await requirePermission(session.user.id, 'DESTINATIONS_CREATE');

    const body = await request.json();
    const data = destinationSchema.parse(body);

    const destination = await createDestination(data, session.user.id);

    // Trigger landing revalidation if published
    if (destination.status === 'PUBLISHED') {
      await triggerLandingRevalidation('destinations');
      revalidatePath('/api/public/destinations');
      revalidatePath('/informasi-publik/destinasi-wisata');
    }

    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    console.error('Error creating destination:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create destination' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
