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
            <div className="space-y-8 p-8 pt-6">
                {/* Enhanced Header */}
                <div className="flex items-center justify-between border-b pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-3xl font-bold tracking-tight">Edit Acara</h2>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                                Editing
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Mengedit: <span className="font-medium text-foreground">{event.title}</span>
                        </p>
                    </div>
                </div>

                <EventForm initialData={event} categories={categories} />
            </div>
        </ProtectedRoute>
    );
}
