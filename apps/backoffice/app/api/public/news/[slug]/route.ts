import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { cachedQuery, generateCacheKey } from '@/lib/cache/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Generate cache key based on slug
    const cacheKey = generateCacheKey('news:item', { slug });

    // Wrap the database query in cachedQuery
    const result = await cachedQuery(cacheKey, async () => {
      const news = await prisma.news.findFirst({
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
          featuredImage: {
            select: {
              id: true,
              cdnUrl: true,
            },
          },
        },
      });

      if (!news) {
        return null;
      }

      const transformed = {
        id: news.id,
        slug: news.slug,
        title: news.title,
        excerpt: news.excerpt,
        content: news.content,
        category: news.category.name,
        categorySlug: news.category.slug,
        categoryColor: news.category.color,
        date: news.publishedAt?.toISOString() || news.createdAt.toISOString(),
        image: news.featuredImage?.cdnUrl || null,
        author: news.author,
        readTime: news.readTime,
        featured: news.featured,
        tags: news.tags as string[] || [],
      };

      return transformed;
    }, 300); // 5 minute cache

    if (!result) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Public news detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
