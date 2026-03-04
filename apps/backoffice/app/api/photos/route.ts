import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { photoQuerySchema, photoSchema } from '@/lib/validations/gallery';
import {
  getPhotosList,
  createPhoto,
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

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'GALLERY_VIEW');

    const searchParams = request.nextUrl.searchParams;
    const params = Object.fromEntries(searchParams);
    
    // Convert string booleans to real booleans for zod
    if (params.isFeatured === 'true') (params as any).isFeatured = true;
    if (params.isFeatured === 'false') (params as any).isFeatured = false;

    const query = photoQuerySchema.parse(params);

    const result = await getPhotosList(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch photos' },
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

    await requirePermission(session.user.id, 'GALLERY_CREATE');

    const body = await request.json();
    const data = photoSchema.parse(body);

    const photo = await createPhoto(data, session.user.id);

    // Trigger landing revalidation if published
    if (photo.status === 'PUBLISHED') {
      await triggerLandingRevalidation('gallery');
      revalidatePath('/api/public/photos');
      revalidatePath('/api/public/albums');
      revalidatePath('/informasi-publik/galeri-foto');
    }

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create photo' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
