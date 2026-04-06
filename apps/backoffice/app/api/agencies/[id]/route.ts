import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { agencyUpdateSchema } from '@/lib/validations/agency';
import { getAgencyById, updateAgency, deleteAgency } from '@/lib/services/agency-service';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const agency = await getAgencyById(params.id);

    if (!agency) {
      return NextResponse.json({ message: 'Agency not found' }, { status: 404 });
    }

    return NextResponse.json(agency);
  } catch (error: any) {
    console.error('Error fetching agency:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch agency' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = agencyUpdateSchema.parse({ ...body, id: params.id });

    const agency = await updateAgency(params.id, data, session.user.id);

    return NextResponse.json(agency);
  } catch (error: any) {
    console.error('Error updating agency:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update agency' },
      { status: error.message?.includes('schema') || error.message?.includes('not found') ? 404 : 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await deleteAgency(params.id, session.user.id);

    return NextResponse.json({ message: 'Agency deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting agency:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to delete agency' },
      { status: error.message?.includes('associated services') ? 409 : 500 }
    );
  }
}
