import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const items = await prisma.destination.findMany({
      where: {
        status: 'PUBLISHED',
        isFeatured: true,
      },
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
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
      take: 6,
    });

    const transformed = items.map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      description: item.description,
      category: item.category.name,
      categorySlug: item.category.slug,
      categoryIcon: item.category.icon,
      image: item.coverImage?.cdnUrl || null,
      location: item.locationAddress,
      rating: item.rating ? parseFloat(item.rating.toString()) : null,
      reviewsCount: item.reviewsCount,
      priceInfo: item.priceInfo,
      openHours: item.openHours,
      featured: item.isFeatured,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Public featured destinations API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured destinations' },
      { status: 500 }
    );
  }
}
