import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@workspace/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

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
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
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

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Public news detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
