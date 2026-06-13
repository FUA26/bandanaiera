import { prisma } from '@/lib/db/prisma';
import { ProtectedRoute } from '@/components/rbac/ProtectedRoute';
import { CategoriesClient } from './categories-client';

async function getCategories() {
    return prisma.tourismCategory.findMany({
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
        include: {
            _count: {
                select: { destinations: true },
            },
        },
    });
}

function TourismCategoriesContent() {
    const categories = getCategories();

    return (
        <div className="space-y-8 p-8 pt-6">
            {/* Enhanced Header */}
            <div className="flex items-center justify-between border-b pb-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">Kategori Destinasi</h2>
                    <p className="text-muted-foreground text-sm">
                        Kelola kategori untuk destinasi wisata
                    </p>
                </div>
            </div>

            <CategoriesClient categoriesPromise={categories} />
        </div>
    );
}

export default function TourismCategoriesPage() {
    return (
        <ProtectedRoute permissions={["TOURISM_VIEW"]}>
            <TourismCategoriesContent />
        </ProtectedRoute>
    );
}
