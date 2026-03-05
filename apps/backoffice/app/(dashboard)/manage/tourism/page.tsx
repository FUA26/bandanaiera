/**
 * Tourism Page
 */

import { prisma } from '@/lib/db/prisma';
import { ProtectedRoute } from '@/components/rbac/ProtectedRoute';
import { TourismClient } from './tourism-client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

async function getTourism() {
    return prisma.tourismDestination.findMany({
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
            image: {
                select: {
                    id: true,
                    cdnUrl: true,
                },
            },
        },
        orderBy: [
            { featured: 'desc' },
            { createdAt: 'desc' },
        ],
        take: 50,
    });
}

async function getCategories() {
    return prisma.tourismCategory.findMany({
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
}

async function TourismContent() {
    const [tourism, categories] = await Promise.all([
        getTourism(),
        getCategories(),
    ]);

    return (
        <TourismClient
            initialTourism={tourism}
            initialCategories={categories}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Destinasi Wisata</h1>
                        <p className="text-muted-foreground">
                            Kelola destinasi wisata Kabupaten Naiera
                        </p>
                    </div>
                </div>
            }
        />
    );
}

export default function TourismPage() {
    return (
        <ProtectedRoute permissions={["TOURISM_VIEW"]}>
            <TourismContent />
        </ProtectedRoute>
    );
}
