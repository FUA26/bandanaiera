import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requirePermission } from '@/lib/auth/permissions';
import { newsUpdateSchema } from '@/lib/validations/news';
import {
  getNewsById,
  updateNews,
  deleteNews,
} from '@/lib/services/news-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await requirePermission(session.user.id, 'NEWS_VIEW');

  const { id } = await params;
  const news = await getNewsById(id);

  if (!news) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(news);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await requirePermission(session.user.id, 'NEWS_EDIT');

  const { id } = await params;
  const body = await request.json();
  const data = newsUpdateSchema.parse({ ...body, id });

  const news = await updateNews(id, data, session.user.id);
  return NextResponse.json(news);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await requirePermission(session.user.id, 'NEWS_DELETE');

  const { id } = await params;
  const news = await deleteNews(id, session.user.id);
  return NextResponse.json(news);
}
