import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { newsQuerySchema, newsSchema } from '@/lib/validations/news';
import {
  getNewsList,
  createNews,
} from '@/lib/services/news-service';
import { revalidatePath } from 'next/cache';

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

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'NEWS_VIEW');

    const searchParams = request.nextUrl.searchParams;
    const query = newsQuerySchema.parse(Object.fromEntries(searchParams));

    const result = await getNewsList(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch news' },
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

    await requirePermission(session.user.id, 'NEWS_CREATE');

    const body = await request.json();
    const data = newsSchema.parse(body);

    const news = await createNews(data, session.user.id);

    // Trigger landing revalidation if published
    if (news.status === 'PUBLISHED') {
      await triggerLandingRevalidation('news');
      revalidatePath('/api/public/news');
      revalidatePath('/informasi-publik/berita-terkini');
    }

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create news' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
