import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { destinationFacilitySchema } from '@/lib/validations/destination';
import {
  getAllFacilities,
  createFacility,
} from '@/lib/services/destination-service';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'DESTINATIONS_VIEW');

    const result = await getAllFacilities();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch facilities' },
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

    await requirePermission(session.user.id, 'DESTINATION_FACILITIES_MANAGE');

    const body = await request.json();
    const data = destinationFacilitySchema.parse(body);

    const facility = await createFacility(data);

    return NextResponse.json(facility, { status: 201 });
  } catch (error) {
    console.error('Error creating facility:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create facility' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
