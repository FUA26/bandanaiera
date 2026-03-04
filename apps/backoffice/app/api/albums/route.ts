import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { albumQuerySchema, albumSchema } from '@/lib/validations/gallery';
import {
  getAlbumsList,
  createAlbum,
} from '@/lib/services/gallery-service';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'GALLERY_VIEW');

    const searchParams = request.nextUrl.searchParams;
    const query = albumQuerySchema.parse(Object.fromEntries(searchParams));

    const result = await getAlbumsList(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching albums:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch albums' },
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

    await requirePermission(session.user.id, 'GALLERY_ALBUMS_MANAGE');

    const body = await request.json();
    const data = albumSchema.parse(body);

    const album = await createAlbum(data);

    return NextResponse.json(album, { status: 201 });
  } catch (error) {
    console.error('Error creating album:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create album' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
