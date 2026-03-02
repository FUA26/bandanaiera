import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requirePermission } from '@/lib/auth/permissions';
import { newsCategorySchema } from '@/lib/validations/news';
import {
  getNewsCategories,
  createNewsCategory,
} from '@/lib/services/news-service';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await requirePermission(session.user.id, 'NEWS_CATEGORIES_MANAGE');

  const categories = await getNewsCategories();
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await requirePermission(session.user.id, 'NEWS_CATEGORIES_MANAGE');

  const body = await request.json();
  const data = newsCategorySchema.parse(body);

  const category = await createNewsCategory(data);
  return NextResponse.json(category, { status: 201 });
}
