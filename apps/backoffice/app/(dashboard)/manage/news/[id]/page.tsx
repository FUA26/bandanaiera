
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
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div>
                    <h1 className="text-3xl font-bold">Edit News</h1>
                    <p className="text-muted-foreground">
                        Make changes to the news article
                    </p>
                </div>
                <NewsForm initialData={newsItem} categories={categories} />
            </div>
        </ProtectedRoute>
    );
}
