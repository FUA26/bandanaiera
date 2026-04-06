import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { agencyReorderSchema } from '@/lib/validations/agency';
import { reorderAgencies } from '@/lib/services/agency-service';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = agencyReorderSchema.parse(body);

    await reorderAgencies(data.agencies, session.user.id);

    return NextResponse.json({ message: 'Agencies reordered successfully' });
  } catch (error: any) {
    console.error('Error reordering agencies:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to reorder agencies' },
      { status: error.message?.includes('schema') ? 400 : 500 }
    );
  }
}
