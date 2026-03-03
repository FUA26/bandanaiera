import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { newsCategorySchema } from '@/lib/validations/news';
import {
  getNewsCategories,
  createNewsCategory,
} from '@/lib/services/news-service';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'NEWS_CATEGORIES_MANAGE');

    const categories = await getNewsCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching news categories:', error);
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

    await requirePermission(session.user.id, 'NEWS_CATEGORIES_MANAGE');

    const body = await request.json();
    const data = newsCategorySchema.parse(body);

    const category = await createNewsCategory(data);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating news category:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create category' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
