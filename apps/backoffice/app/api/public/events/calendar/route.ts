import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const year = request.nextUrl.searchParams.get('year');
    const month = request.nextUrl.searchParams.get('month');

    if (!year || !month) {
      return NextResponse.json(
        { error: 'Year and month parameters required' },
        { status: 400 }
      );
    }

    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);

    const events = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        showInMenu: true,
        date: {
          gte: startDate,
          lte: endDate,
        },
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
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
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
    console.error('Public event calendar API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events for calendar' },
      { status: 500 }
    );
  }
}
