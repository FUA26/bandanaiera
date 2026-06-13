import { prisma } from '@/lib/db/prisma';
import { ProtectedRoute } from '@/components/rbac/ProtectedRoute';
import { EventForm } from '../components/EventForm';

async function getCategories() {
    return prisma.eventCategory.findMany({
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
}

export default async function CreateEventPage() {
    const categories = await getCategories();

    return (
        <ProtectedRoute permissions={["EVENTS_CREATE"]}>
            <div className="space-y-8 p-8 pt-6">
                {/* Enhanced Header */}
                <div className="flex items-center justify-between border-b pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-3xl font-bold tracking-tight">Buat Acara</h2>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                Draft
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Tambahkan acara baru ke platform
                        </p>
                    </div>
                </div>

                <EventForm categories={categories} />
            </div>
        </ProtectedRoute>
    );
}
