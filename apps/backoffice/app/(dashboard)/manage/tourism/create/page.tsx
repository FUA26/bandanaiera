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
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tambah Destinasi Wisata</h2>
                    <p className="text-muted-foreground">
                        Tambahkan destinasi wisata baru
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
