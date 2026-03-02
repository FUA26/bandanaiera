import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const limit = request.nextUrl.searchParams.get('limit');
    const now = new Date();

    const events = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        showInMenu: true,
        date: { gte: now },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
        image: {
          select: {
            id: true,
            cdnUrl: true,
          },
        },
      },
      orderBy: [{ date: 'asc' }, { featured: 'desc' }],
      take: limit ? parseInt(limit) : undefined,
    });

    const transformed = events.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      description: item.description,
      category: item.category.name,
      categorySlug: item.category.slug,
      categoryColor: item.category.color,
      date: item.date.toISOString(),
      time: item.time,
      location: item.location,
      type: item.type,
      image: item.image?.cdnUrl || null,
      organizer: item.organizer,
      registrationRequired: item.registrationRequired,
      registrationUrl: item.registrationUrl,
      featured: item.featured,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Public upcoming events API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming events' },
      { status: 500 }
    );
  }
}
