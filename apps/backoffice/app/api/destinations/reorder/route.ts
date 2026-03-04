import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { destinationReorderSchema } from '@/lib/validations/destination';
import { reorderDestinations } from '@/lib/services/destination-service';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'DESTINATIONS_REORDER');

    const body = await request.json();
    const { items } = destinationReorderSchema.parse(body);

    await reorderDestinations(items, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering destinations:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to reorder destinations' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
