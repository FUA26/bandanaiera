
import { prisma } from '@/lib/db/prisma';
import { ProtectedRoute } from '@/components/rbac/ProtectedRoute';
import { NewsForm } from '../components/NewsForm';

async function getCategories() {
    return prisma.newsCategory.findMany({
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
}

export default async function CreateNewsPage() {
    const categories = await getCategories();

    return (
        <ProtectedRoute permissions={["NEWS_CREATE"]}>
            <div className="space-y-8 p-8 pt-6">
                {/* Enhanced Header */}
                <div className="flex items-center justify-between border-b pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight">Berita Baru</h1>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                Draft
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Buat berita baru untuk website
                        </p>
                    </div>
                </div>

                <NewsForm categories={categories} />
            </div>
        </ProtectedRoute>
    );
}
