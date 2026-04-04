import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { newsUpdateSchema } from '@/lib/validations/news';
import {
  getNewsById,
  updateNews,
  deleteNews,
} from '@/lib/services/news-service';
import { revalidatePath } from 'next/cache';
import { invalidateNewsCache } from '@/lib/cache/revalidate';

async function triggerLandingRevalidation(tag: 'events' | 'news') {
  const revalidateSecret = process.env.REVALIDATE_SECRET;
  const landingUrl = process.env.LANDING_URL || 'http://localhost:3000';

  if (revalidateSecret) {
    try {
      await fetch(`${landingUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: revalidateSecret, tag }),
      });
    } catch (error) {
      console.error('Failed to revalidate landing:', error);
      // Don't fail the request if revalidation fails
    }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch news' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'NEWS_EDIT');

    const { id } = await params;
    const body = await request.json();
    const data = newsUpdateSchema.parse({ ...body, id });

    const news = await updateNews(id, data, session.user.id);

    // Trigger landing revalidation if published
    if (news.status === 'PUBLISHED') {
      await triggerLandingRevalidation('news');
      revalidatePath('/api/public/news');
      revalidatePath('/informasi-publik/berita-terkini');
    }

    // Invalidate Redis cache
    await invalidateNewsCache(id);

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update news' },
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

    await requirePermission(session.user.id, 'NEWS_DELETE');

    const { id } = await params;
    const news = await deleteNews(id, session.user.id);

    // Always revalidate landing on delete (news might have been published)
    await triggerLandingRevalidation('news');
    revalidatePath('/api/public/news');
    revalidatePath('/informasi-publik/berita-terkini');

    // Invalidate Redis cache
    await invalidateNewsCache(id);

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete news' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
