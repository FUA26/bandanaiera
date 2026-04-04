import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { cachedQuery, generateCacheKey } from '@/lib/cache/cache';

export async function GET(request: NextRequest) {
  try {
    // Generate cache key
    const cacheKey = generateCacheKey('news:categories');

    // Wrap the database query in cachedQuery
    const categories = await cachedQuery(cacheKey, async () => {
      return await prisma.newsCategory.findMany({
        where: {
          showInMenu: true,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          order: true,
        },
        orderBy: [
          { order: 'asc' },
          { name: 'asc' },
        ],
      });
    }, 300); // 5 minute cache

    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Public news categories API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
