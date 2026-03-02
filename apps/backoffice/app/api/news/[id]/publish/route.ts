import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requirePermission } from '@/lib/auth/permissions';
import { newsPublishSchema } from '@/lib/validations/news';
import { publishNews } from '@/lib/services/news-service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await requirePermission(session.user.id, 'NEWS_PUBLISH');

  const { id } = await params;
  const body = await request.json();
  const { status } = newsPublishSchema.parse({ ...body, id });

  const news = await publishNews(id, status, session.user.id);
  return NextResponse.json(news);
}
