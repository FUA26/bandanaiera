import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { eventCategoryUpdateSchema } from '@/lib/validations/event';
import {
  updateEventCategory,
  deleteEventCategory,
} from '@/lib/services/event-service';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'EVENT_CATEGORIES_MANAGE');

    const { id } = await params;
    const body = await request.json();
    const data = eventCategoryUpdateSchema.parse({ ...body, id });

    const category = await updateEventCategory(id, data);
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating event category:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update category' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'EVENT_CATEGORIES_MANAGE');

    const { id } = await params;

    try {
      await deleteEventCategory(id);
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to delete' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error deleting event category:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
