import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const destination = await prisma.destination.findUnique({
      where: { slug: params.slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
        coverImage: {
          select: {
            id: true,
            cdnUrl: true,
          },
        },
        images: {
          include: {
            image: {
              select: {
                id: true,
                cdnUrl: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        facilities: {
          include: {
            facility: true,
          },
          orderBy: { facility: { order: 'asc' } },
        },
        relations: true,
      },
    });

    if (!destination || destination.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    const transformed = {
      id: destination.id,
      slug: destination.slug,
      name: destination.name,
      description: destination.description,
      category: destination.category.name,
      categorySlug: destination.category.slug,
      categoryIcon: destination.category.icon,
      coverImage: destination.coverImage?.cdnUrl || null,
      images: destination.images.map(img => ({
        url: img.image.cdnUrl,
        caption: img.caption,
      })),
      facilities: destination.facilities.map(f => ({
        name: f.facility.name,
        icon: f.facility.icon,
      })),
      location: {
        address: destination.locationAddress,
        lat: destination.locationLat ? parseFloat(destination.locationLat.toString()) : null,
        lng: destination.locationLng ? parseFloat(destination.locationLng.toString()) : null,
      },
      rating: destination.rating ? parseFloat(destination.rating.toString()) : null,
      reviewsCount: destination.reviewsCount,
      priceInfo: destination.priceInfo,
      openHours: destination.openHours,
      featured: destination.isFeatured,
      related: destination.relations,
    };

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Public destination detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch destination detail' },
      { status: 500 }
    );
  }
}
