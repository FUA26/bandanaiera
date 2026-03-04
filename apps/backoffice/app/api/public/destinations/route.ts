import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get('category') || undefined;
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

    if (categorySlug) {
      const category = await prisma.destinationCategory.findUnique({
        where: { slug: categorySlug },
      });
      if (category) {
        where.categoryId = category.id;
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
      prisma.destination.findMany({
        where,
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
        skip: limit ? undefined : (page - 1) * pageSize,
        take: limit || pageSize,
      }),
      prisma.destination.count({ where }),
    ]);

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

    return NextResponse.json({
      items: transformed,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Public destinations API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
}
