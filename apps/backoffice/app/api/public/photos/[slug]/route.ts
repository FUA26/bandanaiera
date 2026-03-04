import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { incrementViews } from '@/lib/services/gallery-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const photo = await prisma.photo.findUnique({
      where: { slug: params.slug },
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
    });

    if (!photo || photo.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    // Increment views
    await incrementViews(photo.id);

    const transformed = {
      id: photo.id,
      slug: photo.slug,
      title: photo.title,
      description: photo.description,
      album: photo.album?.name || null,
      albumSlug: photo.album?.slug || null,
      image: photo.image?.cdnUrl || null,
      location: photo.location,
      photographer: photo.photographer,
      views: photo.views + 1,
      likes: photo.likes,
      date: photo.publishedAt?.toISOString() || photo.createdAt.toISOString(),
      featured: photo.isFeatured,
      tags: photo.tags.map(t => t.tag.name),
    };

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Public photo detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photo detail' },
      { status: 500 }
    );
  }
}
