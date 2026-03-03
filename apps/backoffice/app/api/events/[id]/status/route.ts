import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { eventStatusSchema } from '@/lib/validations/event';
import { updateEventStatus } from '@/lib/services/event-service';
import { revalidatePath } from 'next/cache';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'EVENTS_EDIT');

    const { id } = await params;
    const body = await request.json();
    const { status } = eventStatusSchema.parse({ ...body, id });

    const event = await updateEventStatus(id, status, session.user.id);

    // Trigger landing revalidation when publishing events
    if (status === 'PUBLISHED') {
      const revalidateSecret = process.env.REVALIDATE_SECRET;
      const landingUrl = process.env.LANDING_URL || 'http://localhost:3000';

      if (revalidateSecret) {
        try {
          await fetch(`${landingUrl}/api/revalidate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secret: revalidateSecret, tag: 'events' }),
          });
        } catch (error) {
          console.error('Failed to revalidate landing:', error);
          // Don't fail the request if revalidation fails
        }
      }

      // Revalidate locally
      revalidatePath('/api/public/events');
      revalidatePath('/informasi-publik/agenda-kegiatan');
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update status' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
