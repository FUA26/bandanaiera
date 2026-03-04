import { prisma } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';
import { ProtectedRoute } from '@/components/rbac/ProtectedRoute';
import { EventForm } from '../components/EventForm';

async function getEvent(id: string) {
    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            image: {
                select: {
                    id: true,
                    cdnUrl: true,
                },
            },
        },
    });

    if (!event) {
        notFound();
    }

    return event;
}

async function getCategories() {
    return prisma.eventCategory.findMany({
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
}

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await getEvent(id);
    const categories = await getCategories();

    return (
        <ProtectedRoute permissions={["EVENTS_EDIT"]}>
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Edit Event</h2>
                        <p className="text-muted-foreground">Update event information.</p>
                    </div>
                </div>

                <div className="py-4">
                    <EventForm initialData={event} categories={categories} />
                </div>
            </div>
        </ProtectedRoute>
    );
}
