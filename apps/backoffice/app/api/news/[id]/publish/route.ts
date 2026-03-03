import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { newsPublishSchema } from '@/lib/validations/news';
import { publishNews } from '@/lib/services/news-service';
import { revalidatePath } from 'next/cache';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'NEWS_PUBLISH');

    const { id } = await params;
    const body = await request.json();
    const { status } = newsPublishSchema.parse({ ...body, id });

    const news = await publishNews(id, status, session.user.id);

    // Trigger landing revalidation when publishing
    if (status === 'PUBLISHED') {
      const revalidateSecret = process.env.REVALIDATE_SECRET;
      const landingUrl = process.env.LANDING_URL || 'http://localhost:3000';

      if (revalidateSecret) {
        try {
          await fetch(`${landingUrl}/api/revalidate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secret: revalidateSecret, tag: 'news' }),
          });
        } catch (error) {
          console.error('Failed to revalidate landing:', error);
          // Don't fail the request if revalidation fails
        }
      }

      // Revalidate locally
      revalidatePath('/api/public/news');
      revalidatePath('/informasi-publik/berita-terkini');
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error publishing news:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to publish news' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
