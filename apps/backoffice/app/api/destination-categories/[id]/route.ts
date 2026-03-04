import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { destinationCategorySchema } from '@/lib/validations/destination';
import {
  updateDestinationCategory,
  deleteDestinationCategory,
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

    await requirePermission(session.user.id, 'DESTINATION_CATEGORIES_MANAGE');

    const body = await request.json();
    const data = destinationCategorySchema.partial().parse(body);

    const category = await updateDestinationCategory(params.id, data);

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating destination category:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update category' },
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

    await requirePermission(session.user.id, 'DESTINATION_CATEGORIES_MANAGE');

    await deleteDestinationCategory(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting destination category:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete category' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
