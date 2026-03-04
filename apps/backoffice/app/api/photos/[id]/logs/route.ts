import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { getPhotoActivityLogs } from '@/lib/services/gallery-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'GALLERY_VIEW');

    const logs = await getPhotoActivityLogs(params.id);
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching photo logs:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch photo logs' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
