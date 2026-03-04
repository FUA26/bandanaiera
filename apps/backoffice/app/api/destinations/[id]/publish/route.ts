import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { destinationPublishSchema } from '@/lib/validations/destination';
import { publishDestination } from '@/lib/services/destination-service';
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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'DESTINATIONS_PUBLISH');

    const body = await request.json();
    const { status } = destinationPublishSchema.parse({ ...body, id: params.id });

    const destination = await publishDestination(params.id, status, session.user.id);

    // Trigger revalidation
    await triggerLandingRevalidation('destinations');
    revalidatePath('/api/public/destinations');
    revalidatePath('/informasi-publik/destinasi-wisata');

    return NextResponse.json(destination);
  } catch (error) {
    console.error('Error publishing destination:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to publish destination' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
