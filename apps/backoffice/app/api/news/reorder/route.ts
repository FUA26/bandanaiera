import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requirePermission } from '@/lib/auth/permissions';
import { newsReorderSchema } from '@/lib/validations/news';
import { reorderNews } from '@/lib/services/news-service';

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await requirePermission(session.user.id, 'NEWS_REORDER');

  const body = await request.json();
  const { items } = newsReorderSchema.parse(body);

  await reorderNews(items, session.user.id);
  return NextResponse.json({ success: true });
}
