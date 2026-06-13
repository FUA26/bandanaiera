import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { opdReorderSchema } from '@/lib/validations/opd';
import { reorderOpds } from '@/lib/services/opd-service';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = opdReorderSchema.parse(body);

    await reorderOpds(data.opds, session.user.id);

    return NextResponse.json({ message: 'Opds reordered successfully' });
  } catch (error: any) {
    console.error('Error reordering opds:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to reorder opds' },
      { status: error.message?.includes('schema') ? 400 : 500 }
    );
  }
}
