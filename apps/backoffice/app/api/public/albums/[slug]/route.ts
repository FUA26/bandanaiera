import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const album = await prisma.photoAlbum.findUnique({
      where: { slug: params.slug },
      include: {
        coverImage: {
          select: {
            id: true,
            cdnUrl: true,
          },
        },
        photos: {
          where: { status: 'PUBLISHED' },
          include: {
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
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    const transformed = {
      id: album.id,
      name: album.name,
      slug: album.slug,
      description: album.description,
      coverImage: album.coverImage?.cdnUrl || null,
      photos: album.photos.map(photo => ({
        id: photo.id,
        slug: photo.slug,
        title: photo.title,
        description: photo.description,
        image: photo.image?.cdnUrl || null,
        location: photo.location,
        photographer: photo.photographer,
        views: photo.views,
        likes: photo.likes,
        date: photo.publishedAt?.toISOString() || photo.createdAt.toISOString(),
        featured: photo.isFeatured,
        tags: photo.tags.map(t => t.tag.name),
      })),
    };

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Public album detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch album detail' },
      { status: 500 }
    );
  }
}
