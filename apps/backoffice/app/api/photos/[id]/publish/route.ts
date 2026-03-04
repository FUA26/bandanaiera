import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { photoPublishSchema } from '@/lib/validations/gallery';
import { publishPhoto } from '@/lib/services/gallery-service';
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

    await requirePermission(session.user.id, 'GALLERY_PUBLISH');

    const body = await request.json();
    const { status } = photoPublishSchema.parse({ ...body, id: params.id });

    const photo = await publishPhoto(params.id, status, session.user.id);

    // Trigger revalidation
    await triggerLandingRevalidation('gallery');
    revalidatePath('/api/public/photos');
    revalidatePath('/api/public/albums');
    revalidatePath('/informasi-publik/galeri-foto');

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Error publishing photo:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to publish photo' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
