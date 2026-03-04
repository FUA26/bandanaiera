import { prisma } from '@/lib/db/prisma';
import { ProtectedRoute } from '@/components/rbac/ProtectedRoute';
import { TagsClient } from './tags-client';

async function getTags() {
  return prisma.photoTag.findMany({
    include: {
      _count: {
        select: { photos: true },
      },
    },
    orderBy: { name: 'asc' },
  });
}

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <ProtectedRoute permissions={["GALLERY_TAGS_MANAGE"]}>
      <TagsClient initialTags={tags} />
    </ProtectedRoute>
  );
}
