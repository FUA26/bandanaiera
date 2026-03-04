import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { destinationImageSchema } from '@/lib/validations/destination';
import {
  getDestinationImages,
  addDestinationImage,
} from '@/lib/services/destination-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'DESTINATIONS_VIEW');

    const images = await getDestinationImages(params.id);
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching destination images:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch destination images' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
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

    await requirePermission(session.user.id, 'DESTINATIONS_EDIT');

    const body = await request.json();
    const data = destinationImageSchema.parse(body);

    const image = await addDestinationImage(params.id, data);

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Error adding destination image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add destination image' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
