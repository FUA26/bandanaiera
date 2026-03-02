import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requirePermission } from '@/lib/auth/permissions';
import { eventCategorySchema } from '@/lib/validations/event';
import {
  getEventCategories,
  createEventCategory,
} from '@/lib/services/event-service';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await requirePermission(session.user.id, 'EVENT_CATEGORIES_MANAGE');

  const categories = await getEventCategories();
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await requirePermission(session.user.id, 'EVENT_CATEGORIES_MANAGE');

  const body = await request.json();
  const data = eventCategorySchema.parse(body);

  const category = await createEventCategory(data);
  return NextResponse.json(category, { status: 201 });
}
