
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
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div>
                    <h1 className="text-3xl font-bold">New News</h1>
                    <p className="text-muted-foreground">
                        Create a new news article
                    </p>
                </div>
                <NewsForm categories={categories} />
            </div>
        </ProtectedRoute>
    );
}
