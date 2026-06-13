import { prisma } from '@/lib/db/prisma';
import { ProtectedRoute } from '@/components/rbac/ProtectedRoute';
import { TourismForm } from '../components/TourismForm';
import { notFound } from 'next/navigation';

async function getTourismDestination(id: string) {
    return prisma.tourismDestination.findUnique({
        where: { id },
        include: {
            image: {
                select: {
                    id: true,
                    cdnUrl: true,
                },
            },
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });
}

async function getCategories() {
    return prisma.tourismCategory.findMany({
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
        select: { id: true, name: true, slug: true },
    });
}

function EditTourismContent({
    destination,
    categories
}: {
    destination: any;
    categories: any[];
}) {
    return (
        <div className="space-y-8 p-8 pt-6">
            {/* Enhanced Header */}
            <div className="flex items-center justify-between border-b pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-3xl font-bold tracking-tight">Edit Destinasi Wisata</h2>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                            Editing
                        </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Mengedit: <span className="font-medium text-foreground">{destination.name}</span>
                    </p>
                </div>
            </div>

            <TourismForm initialData={destination} categories={categories} />
        </div>
    );
}

export default async function EditTourismPage({
    params,
}: {
    params: { id: string };
}) {
    const [destination, categories] = await Promise.all([
        getTourismDestination(params.id),
        getCategories(),
    ]);

    if (!destination) {
        notFound();
    }

    return (
        <ProtectedRoute permissions={["TOURISM_EDIT"]}>
            <EditTourismContent destination={destination} categories={categories} />
        </ProtectedRoute>
    );
}
