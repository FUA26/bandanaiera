import { prisma } from '@/lib/db/prisma';
import { ProtectedRoute } from '@/components/rbac/ProtectedRoute';
import { TourismForm } from '../components/TourismForm';

async function getCategories() {
    return prisma.tourismCategory.findMany({
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
        select: { id: true, name: true, slug: true },
    });
}

function CreateTourismContent({ categories }: { categories: any[] }) {
    return (
        <div className="space-y-8 p-8 pt-6">
            {/* Enhanced Header */}
            <div className="flex items-center justify-between border-b pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-3xl font-bold tracking-tight">Tambah Destinasi Wisata</h2>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            Draft
                        </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Tambahkan destinasi wisata baru ke platform
                    </p>
                </div>
            </div>

            <TourismForm categories={categories} />
        </div>
    );
}

export default async function CreateTourismPage() {
    const categories = await getCategories();

    return (
        <ProtectedRoute permissions={["TOURISM_CREATE"]}>
            <CreateTourismContent categories={categories} />
        </ProtectedRoute>
    );
}
