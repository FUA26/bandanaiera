import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { eventCategorySchema } from '@/lib/validations/event';
import {
  getEventCategories,
  createEventCategory,
} from '@/lib/services/event-service';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'EVENT_CATEGORIES_MANAGE');

    const categories = await getEventCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching event categories:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch categories' },
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

    await requirePermission(session.user.id, 'EVENT_CATEGORIES_MANAGE');

    const body = await request.json();
    const data = eventCategorySchema.parse(body);

    const category = await createEventCategory(data);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating event category:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create category' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
