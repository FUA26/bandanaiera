import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const albums = await prisma.photoAlbum.findMany({
      include: {
        coverImage: {
          select: {
            id: true,
            cdnUrl: true,
          },
        },
        _count: {
          select: { photos: { where: { status: 'PUBLISHED' } } },
        },
      },
      orderBy: { order: 'asc' },
    });

    const transformed = albums.map((album) => ({
      id: album.id,
      name: album.name,
      slug: album.slug,
      description: album.description,
      coverImage: album.coverImage?.cdnUrl || null,
      photoCount: album._count.photos,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Public albums API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch albums' },
      { status: 500 }
    );
  }
}
