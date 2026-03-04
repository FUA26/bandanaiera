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
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Create Event</h2>
                        <p className="text-muted-foreground">Add a new event to the platform.</p>
                    </div>
                </div>

                <div className="py-4">
                    <EventForm categories={categories} />
                </div>
            </div>
        </ProtectedRoute>
    );
}
