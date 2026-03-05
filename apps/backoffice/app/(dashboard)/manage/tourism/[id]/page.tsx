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
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Edit Destinasi Wisata</h2>
                    <p className="text-muted-foreground">
                        Edit informasi destinasi wisata yang sudah ada
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
