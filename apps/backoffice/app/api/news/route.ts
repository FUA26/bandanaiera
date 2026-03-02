import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requirePermission } from '@/lib/auth/permissions';
import { newsQuerySchema, newsSchema } from '@/lib/validations/news';
import {
  getNewsList,
  createNews,
} from '@/lib/services/news-service';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await requirePermission(session.user.id, 'NEWS_VIEW');

  const searchParams = request.nextUrl.searchParams;
  const query = newsQuerySchema.parse(Object.fromEntries(searchParams));

  const result = await getNewsList(query);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await requirePermission(session.user.id, 'NEWS_CREATE');

  const body = await request.json();
  const data = newsSchema.parse(body);

  const news = await createNews(data, session.user.id);
  return NextResponse.json(news, { status: 201 });
}
