import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { removeDestinationImage } from '@/lib/services/destination-service';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'DESTINATIONS_EDIT');

    await removeDestinationImage(params.imageId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting destination image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete destination image' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
