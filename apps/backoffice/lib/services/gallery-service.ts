import { prisma, Prisma } from '@/lib/db/prisma';
import { PhotoStatus } from '@prisma/client';

export interface PhotoListOptions {
  page?: number;
  pageSize?: number;
  albumId?: string;
  status?: PhotoStatus;
  isFeatured?: boolean;
  search?: string;
  tags?: string; // comma separated tags
}

export interface PaginatedPhotos<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const PHOTO_INCLUDE = {
  album: true,
  image: true,
  tags: {
    include: {
      tag: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  updatedBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} as const;

export async function getPhotosList(options: PhotoListOptions = {}): Promise<PaginatedPhotos<any>> {
  const { page = 1, pageSize = 20, albumId, status, isFeatured, search, tags } = options;

  const where: Prisma.PhotoWhereInput = {};

  if (albumId) {
    where.albumId = albumId;
  }

  if (status) {
    where.status = status;
  }

  if (isFeatured !== undefined) {
    where.isFeatured = isFeatured;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (tags) {
    const tagArray = tags.split(',').map(t => t.trim());
    where.tags = {
      some: {
        tag: {
          name: { in: tagArray }
        }
      }
    };
  }

  const [items, total] = await Promise.all([
    prisma.photo.findMany({
      where,
      include: PHOTO_INCLUDE,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.photo.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getPhotoById(id: string) {
  return prisma.photo.findUnique({
    where: { id },
    include: PHOTO_INCLUDE,
  });
}

export async function getPhotoBySlug(slug: string) {
  return prisma.photo.findUnique({
    where: { slug },
    include: PHOTO_INCLUDE,
  });
}

export async function createPhoto(data: any, userId: string) {
  const { tags, ...photoData } = data;

  const photo = await prisma.photo.create({
    data: {
      ...photoData,
      createdById: userId,
      publishedAt: photoData.status === 'PUBLISHED' ? new Date() : null,
      tags: tags ? {
        create: tags.map((tagId: string) => ({
          tag: { connect: { id: tagId } }
        }))
      } : undefined
    },
    include: PHOTO_INCLUDE,
  });

  await logPhotoActivity(photo.id, userId, 'created', { data });

  return photo;
}

export async function updatePhoto(id: string, data: any, userId: string) {
  const existing = await getPhotoById(id);
  if (!existing) {
    throw new Error('Photo not found');
  }

  const { tags, ...photoData } = data;
  const updates: any = { ...photoData };

  // Set publishedAt when publishing
  if (photoData.status === 'PUBLISHED' && existing.status !== 'PUBLISHED') {
    updates.publishedAt = new Date();
  }

  const photo = await prisma.photo.update({
    where: { id },
    data: {
      ...updates,
      updatedById: userId,
      tags: tags ? {
        deleteMany: {},
        create: tags.map((tagId: string) => ({
          tag: { connect: { id: tagId } }
        }))
      } : undefined
    },
    include: PHOTO_INCLUDE,
  });

  await logPhotoActivity(id, userId, 'updated', {
    before: existing,
    after: photo,
  });

  return photo;
}

export async function deletePhoto(id: string, userId: string) {
  const existing = await getPhotoById(id);
  if (!existing) {
    throw new Error('Photo not found');
  }

  await logPhotoActivity(id, userId, 'deleted', { before: existing });

  await prisma.photo.delete({
    where: { id },
  });

  return existing;
}

export async function publishPhoto(id: string, status: PhotoStatus, userId: string) {
  const existing = await getPhotoById(id);
  if (!existing) {
    throw new Error('Photo not found');
  }

  const photo = await prisma.photo.update({
    where: { id },
    data: {
      status,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
      updatedById: userId,
    },
    include: PHOTO_INCLUDE,
  });

  const action = status === 'PUBLISHED' ? 'published' : status === 'ARCHIVED' ? 'archived' : 'unpublished';
  await logPhotoActivity(id, userId, action, { before: existing, after: photo });

  return photo;
}

export async function reorderPhotos(items: Array<{ id: string; order: number }>, userId?: string) {
  const updates = items.map(({ id, order }) =>
    prisma.photo.update({
      where: { id },
      data: { order },
    })
  );

  await prisma.$transaction(updates);

  if (userId) {
    await logPhotoActivity(items[0].id, userId, 'reordered', { items });
  }

  return true;
}

export async function incrementViews(id: string) {
  return prisma.photo.update({
    where: { id },
    data: {
      views: {
        increment: 1,
      },
    },
  });
}

// Activity logging
export async function logPhotoActivity(photoId: string, userId: string, action: string, changes?: any) {
  return prisma.photoActivityLog.create({
    data: {
      photoId,
      userId,
      action,
      changes,
    },
  });
}

export async function getPhotoActivityLogs(photoId: string) {
  return prisma.photoActivityLog.findMany({
    where: { photoId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Albums
export async function getAlbumsList(options: { page?: number; pageSize?: number; search?: string } = {}) {
  const { page = 1, pageSize = 20, search } = options;

  const where: Prisma.PhotoAlbumWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.photoAlbum.findMany({
      where,
      include: {
        coverImage: true,
        _count: {
          select: { photos: true },
        },
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.photoAlbum.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAlbumById(id: string) {
  return prisma.photoAlbum.findUnique({
    where: { id },
    include: {
      coverImage: true,
      photos: {
        where: { status: 'PUBLISHED' },
        include: { image: true },
        orderBy: { order: 'asc' }
      }
    },
  });
}

export async function getAlbumBySlug(slug: string) {
  return prisma.photoAlbum.findUnique({
    where: { slug },
    include: {
      coverImage: true,
      photos: {
        where: { status: 'PUBLISHED' },
        include: { image: true },
        orderBy: { order: 'asc' }
      }
    },
  });
}

export async function createAlbum(data: any) {
  return prisma.photoAlbum.create({
    data,
  });
}

export async function updateAlbum(id: string, data: any) {
  return prisma.photoAlbum.update({
    where: { id },
    data,
  });
}

export async function deleteAlbum(id: string) {
  // Check if album has photos
  const count = await prisma.photo.count({
    where: { albumId: id },
  });

  if (count > 0) {
    throw new Error('Cannot delete album with existing photos');
  }

  return prisma.photoAlbum.delete({
    where: { id },
  });
}

export async function reorderAlbums(items: Array<{ id: string; order: number }>) {
  const updates = items.map(({ id, order }) =>
    prisma.photoAlbum.update({
      where: { id },
      data: { order },
    })
  );

  await prisma.$transaction(updates);
  return true;
}

// Tags
export async function getAllTags() {
  return prisma.photoTag.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { photos: true }
      }
    }
  });
}

export async function getTagById(id: string) {
  return prisma.photoTag.findUnique({
    where: { id },
  });
}

export async function createTag(data: any) {
  return prisma.photoTag.create({
    data,
  });
}

export async function deleteTag(id: string) {
  return prisma.photoTag.delete({
    where: { id },
  });
}
