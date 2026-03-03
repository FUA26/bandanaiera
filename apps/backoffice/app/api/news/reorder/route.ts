import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { newsReorderSchema } from '@/lib/validations/news';
import { reorderNews } from '@/lib/services/news-service';

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'NEWS_REORDER');

    const body = await request.json();
    const { items } = newsReorderSchema.parse(body);

    await reorderNews(items, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering news:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to reorder news' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
