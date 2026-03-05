import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { requirePermission } from '@/lib/auth/permissions';
import { tourismCategoryUpdateSchema } from '@/lib/validations/tourism';
import {
    updateTourismCategory,
    deleteTourismCategory,
} from '@/lib/services/tourism-service';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await requirePermission(session.user.id, 'TOURISM_EDIT');

        const body = await request.json();
        const data = tourismCategoryUpdateSchema.parse({ ...body, id: params.id });

        const category = await updateTourismCategory(params.id, data);
        return NextResponse.json(category);
    } catch (error) {
        console.error('Error updating tourism category:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to update category' },
            { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await requirePermission(session.user.id, 'TOURISM_DELETE');

        await deleteTourismCategory(params.id);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting tourism category:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to delete category' },
            { status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500 }
        );
    }
}
