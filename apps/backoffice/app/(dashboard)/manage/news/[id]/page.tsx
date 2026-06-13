
import { prisma } from '@/lib/db/prisma';
import { ProtectedRoute } from '@/components/rbac/ProtectedRoute';
import { NewsForm } from '../components/NewsForm';
import { notFound } from 'next/navigation';

async function getNewsItem(id: string) {
    const item = await prisma.news.findUnique({
        where: { id },
        include: {
            featuredImage: true,
        },
    });
    return item;
}

async function getCategories() {
    return prisma.newsCategory.findMany({
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
}

interface EditNewsPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
    const { id } = await params;
    const [newsItem, categories] = await Promise.all([
        getNewsItem(id),
        getCategories(),
    ]);

    if (!newsItem) {
        notFound();
    }

    return (
        <ProtectedRoute permissions={["NEWS_EDIT"]}>
            <div className="space-y-8 p-8 pt-6">
                {/* Enhanced Header */}
                <div className="flex items-center justify-between border-b pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight">Edit Berita</h1>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                                Editing
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Mengedit: <span className="font-medium text-foreground">{newsItem.title}</span>
                        </p>
                    </div>
                </div>

                <NewsForm initialData={newsItem} categories={categories} />
            </div>
        </ProtectedRoute>
    );
}
