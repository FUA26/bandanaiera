import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { tourismCategorySchema } from '@/lib/validations/tourism';
import {
    getTourismCategories,
    createTourismCategory,
} from '@/lib/services/tourism-service';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // You can customize the permission name as needed
        await requirePermission(session.user.id, 'TOURISM_VIEW');

        const categories = await getTourismCategories();
        return NextResponse.json({ categories });
    } catch (error) {
        console.error('Error fetching tourism categories:', error);
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

        await requirePermission(session.user.id, 'TOURISM_CREATE');

        const body = await request.json();
        const data = tourismCategorySchema.parse(body);

        const category = await createTourismCategory(data);
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error('Error creating tourism category:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create category' },
            { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
        );
    }
}
