import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const event = await prisma.event.findFirst({
      where: {
        slug,
        status: 'PUBLISHED',
        showInMenu: true,
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
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }

    const transformed = {
      id: event.id,
      slug: event.slug,
      title: event.title,
      description: event.description,
      category: event.category.name,
      categorySlug: event.category.slug,
      categoryColor: event.category.color,
      date: event.date.toISOString(),
      time: event.time,
      location: event.location,
      locationUrl: event.locationUrl,
      type: event.type,
      image: event.image?.cdnUrl || null,
      organizer: event.organizer,
      organizerContact: event.organizerContact,
      registrationRequired: event.registrationRequired,
      registrationUrl: event.registrationUrl,
      maxAttendees: event.maxAttendees,
      featured: event.featured,
    };

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Public event detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}
