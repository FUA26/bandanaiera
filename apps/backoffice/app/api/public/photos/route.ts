import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const albumSlug = searchParams.get('album') || undefined;
    const isFeatured = searchParams.get('featured') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const where: any = {
      status: 'PUBLISHED',
      showInMenu: true,
    };

    if (isFeatured) {
      where.isFeatured = true;
    }

    if (albumSlug) {
      const album = await prisma.photoAlbum.findUnique({
        where: { slug: albumSlug },
      });
      if (album) {
        where.albumId = album.id;
      } else {
        return NextResponse.json({
          items: [],
          total: 0,
          page: 1,
          pageSize,
          totalPages: 0,
        });
      }
    }

    const [items, total] = await Promise.all([
      prisma.photo.findMany({
        where,
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
          { publishedAt: 'desc' },
        ],
        skip: limit ? undefined : (page - 1) * pageSize,
        take: limit || pageSize,
      }),
      prisma.photo.count({ where }),
    ]);

    const transformed = items.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      description: item.description,
      album: item.album?.name || null,
      albumSlug: item.album?.slug || null,
      image: item.image?.cdnUrl || null,
      location: item.location,
      photographer: item.photographer,
      views: item.views,
      likes: item.likes,
      date: item.publishedAt?.toISOString() || item.createdAt.toISOString(),
      featured: item.isFeatured,
      tags: item.tags.map(t => t.tag.name),
    }));

    return NextResponse.json({
      items: transformed,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Public photos API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}
