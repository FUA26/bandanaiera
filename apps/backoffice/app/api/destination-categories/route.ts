import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { destinationCategorySchema } from '@/lib/validations/destination';
import {
  getDestinationCategories,
  createDestinationCategory,
} from '@/lib/services/destination-service';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await requirePermission(session.user.id, 'DESTINATIONS_VIEW');

    const result = await getDestinationCategories();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching destination categories:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch categories' },
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

    await requirePermission(session.user.id, 'DESTINATION_CATEGORIES_MANAGE');

    const body = await request.json();
    const data = destinationCategorySchema.parse(body);

    const category = await createDestinationCategory(data);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating destination category:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create category' },
      { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
