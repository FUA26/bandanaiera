import { prisma } from '@/lib/db/prisma';
import { ProtectedRoute } from '@/components/rbac/ProtectedRoute';
import { PhotosClient } from './photos-client';

async function getPhotos() {
  const [items, total] = await Promise.all([
    prisma.photo.findMany({
      include: {
        album: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        image: {
          select: {
            id: true,
            cdnUrl: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
      take: 50,
    }),
    prisma.photo.count(),
  ]);

  return items;
}

async function getAlbums() {
  return prisma.photoAlbum.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });
}

async function getTags() {
  return prisma.photoTag.findMany({
    orderBy: { name: 'asc' },
  });
}

export default async function PhotosPage() {
  const [photos, albums, tags] = await Promise.all([
    getPhotos(),
    getAlbums(),
    getTags(),
  ]);

  return (
    <ProtectedRoute permissions={["GALLERY_VIEW"]}>
      <PhotosClient
        initialPhotos={photos}
        albums={albums}
        tags={tags}
      />
    </ProtectedRoute>
  );
}
