import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requirePermission } from '@/lib/auth/permissions';
import { newsCategoryUpdateSchema } from '@/lib/validations/news';
import {
  updateNewsCategory,
  deleteNewsCategory,
} from '@/lib/services/news-service';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await requirePermission(session.user.id, 'NEWS_CATEGORIES_MANAGE');

  const { id } = await params;
  const body = await request.json();
  const data = newsCategoryUpdateSchema.parse({ ...body, id });

  const category = await updateNewsCategory(id, data);
  return NextResponse.json(category);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await requirePermission(session.user.id, 'NEWS_CATEGORIES_MANAGE');

  const { id } = await params;

  try {
    await deleteNewsCategory(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete' },
      { status: 400 }
    );
  }
}
