import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { cachedQuery, generateCacheKey } from '@/lib/cache/cache';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured') === 'true';
    const category = searchParams.get('category') || undefined;
    const type = searchParams.get('type') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const params = { featured, category, type, limit, page, pageSize };
    const cacheKey = generateCacheKey('events:list', { params });

    const result = await cachedQuery(
      cacheKey,
      async () => {
        const where: any = {
          status: 'PUBLISHED',
          showInMenu: true,
        };

        if (featured) {
          where.featured = true;
        }

        if (category) {
          const cat = await prisma.eventCategory.findUnique({
            where: { slug: category },
          });
          if (cat) {
            where.categoryId = cat.id;
          } else {
            return {
              items: [],
              total: 0,
              page: 1,
              pageSize,
              totalPages: 0,
            };
          }
        }

        if (type) {
          where.type = type.toUpperCase();
        }

        const [items, total] = await Promise.all([
          prisma.event.findMany({
            where,
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
            orderBy: [
              { featured: 'desc' },
              { date: 'asc' },
              { order: 'asc' },
            ],
            skip: limit ? undefined : (page - 1) * pageSize,
            take: limit || pageSize,
          }),
          prisma.event.count({ where }),
        ]);

        const transformed = items.map((item) => ({
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
          locationUrl: item.locationUrl,
          type: item.type,
          image: item.image?.cdnUrl || null,
          organizer: item.organizer,
          organizerContact: item.organizerContact,
          registrationRequired: item.registrationRequired,
          registrationUrl: item.registrationUrl,
          maxAttendees: item.maxAttendees,
          featured: item.featured,
        }));

        return {
          items: transformed,
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        };
      },
      300
    );

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Public events API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
