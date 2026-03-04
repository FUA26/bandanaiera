import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { photoUpdateSchema } from '@/lib/validations/gallery';
import {
  getPhotoById,
  updatePhoto,
  deletePhoto,
} from '@/lib/services/gallery-service';
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

    await requirePermission(session.user.id, 'GALLERY_VIEW');

    const photo = await getPhotoById(params.id);
    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Error fetching photo:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch photo' },
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

    await requirePermission(session.user.id, 'GALLERY_EDIT');

    const body = await request.json();
    const data = photoUpdateSchema.parse({ ...body, id: params.id });

    const photo = await updatePhoto(params.id, data, session.user.id);

    // Trigger revalidation
    await triggerLandingRevalidation('gallery');
    revalidatePath('/api/public/photos');
    revalidatePath('/api/public/albums');
    revalidatePath('/informasi-publik/galeri-foto');

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Error updating photo:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update photo' },
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

    await requirePermission(session.user.id, 'GALLERY_DELETE');

    await deletePhoto(params.id, session.user.id);

    // Trigger revalidation
    await triggerLandingRevalidation('gallery');
    revalidatePath('/api/public/photos');
    revalidatePath('/api/public/albums');
    revalidatePath('/informasi-publik/galeri-foto');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete photo' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
