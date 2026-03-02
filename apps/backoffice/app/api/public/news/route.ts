import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@workspace/db';

const querySchema = {
  featured: false,
  category: '',
  limit: 0,
  page: 1,
  pageSize: 20,
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured') === 'true';
    const category = searchParams.get('category') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const where: any = {
      status: 'PUBLISHED',
      showInMenu: true,
    };

    if (featured) {
      where.featured = true;
    }

    if (category) {
      const cat = await prisma.newsCategory.findUnique({
        where: { slug: category },
      });
      if (cat) {
        where.categoryId = cat.id;
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
      prisma.news.findMany({
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
          featuredImage: {
            select: {
              id: true,
              cdnUrl: true,
            },
          },
        },
        orderBy: [
          { featured: 'desc' },
          { publishedAt: 'desc' },
        ],
        skip: limit ? undefined : (page - 1) * pageSize,
        take: limit || pageSize,
      }),
      prisma.news.count({ where }),
    ]);

    const transformed = items.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category.name,
      categorySlug: item.category.slug,
      categoryColor: item.category.color,
      date: item.publishedAt?.toISOString() || item.createdAt.toISOString(),
      image: item.featuredImage?.cdnUrl || null,
      author: item.author,
      readTime: item.readTime,
      featured: item.featured,
      tags: item.tags as string[] || [],
    }));

    return NextResponse.json({
      items: transformed,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Public news API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
