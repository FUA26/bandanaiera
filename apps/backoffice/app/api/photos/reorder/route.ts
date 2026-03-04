import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { photoReorderSchema } from '@/lib/validations/gallery';
import { reorderPhotos } from '@/lib/services/gallery-service';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'GALLERY_REORDER');

    const body = await request.json();
    const { items } = photoReorderSchema.parse(body);

    await reorderPhotos(items, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering photos:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to reorder photos' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
