import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { albumReorderSchema } from '@/lib/validations/gallery';
import { reorderAlbums } from '@/lib/services/gallery-service';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'GALLERY_ALBUMS_MANAGE');

    const body = await request.json();
    const { items } = albumReorderSchema.parse(body);

    await reorderAlbums(items);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering albums:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to reorder albums' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
