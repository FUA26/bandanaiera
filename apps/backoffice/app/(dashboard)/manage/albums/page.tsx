import { prisma } from '@/lib/db/prisma';
import { ProtectedRoute } from '@/components/rbac/ProtectedRoute';
import { AlbumsClient } from './albums-client';

async function getAlbums() {
  return prisma.photoAlbum.findMany({
    include: {
      coverImage: {
        select: {
          id: true,
          cdnUrl: true,
        },
      },
      _count: {
        select: { photos: true },
      },
    },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
}

export default async function AlbumsPage() {
  const albums = await getAlbums();

  return (
    <ProtectedRoute permissions={["GALLERY_ALBUMS_MANAGE"]}>
      <AlbumsClient initialAlbums={albums} />
    </ProtectedRoute>
  );
}
