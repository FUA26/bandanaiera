import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { destinationFacilitySchema } from '@/lib/validations/destination';
import {
  updateFacility,
  deleteFacility,
} from '@/lib/services/destination-service';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'DESTINATION_FACILITIES_MANAGE');

    const body = await request.json();
    const data = destinationFacilitySchema.partial().parse(body);

    const facility = await updateFacility(params.id, data);

    return NextResponse.json(facility);
  } catch (error) {
    console.error('Error updating facility:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update facility' },
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

    await requirePermission(session.user.id, 'DESTINATION_FACILITIES_MANAGE');

    await deleteFacility(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting facility:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete facility' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
