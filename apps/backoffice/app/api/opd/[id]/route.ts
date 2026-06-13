import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { opdUpdateSchema } from '@/lib/validations/opd';
import { getOpdById, updateOpd, deleteOpd } from '@/lib/services/opd-service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const opd = await getOpdById(id);

    if (!opd) {
      return NextResponse.json({ message: 'Opd not found' }, { status: 404 });
    }

    return NextResponse.json(opd);
  } catch (error: any) {
    console.error('Error fetching opd:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch opd' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const data = opdUpdateSchema.parse({ ...body, id });

    const opd = await updateOpd(id, data, session.user.id);

    return NextResponse.json(opd);
  } catch (error: any) {
    console.error('Error updating opd:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update opd' },
      { status: error.message?.includes('schema') || error.message?.includes('not found') ? 404 : 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PATCH(req, { params });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await deleteOpd(id, session.user.id);

    return NextResponse.json({ message: 'Opd deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting opd:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to delete opd' },
      { status: error.message?.includes('associated services') ? 409 : 500 }
    );
  }
}
