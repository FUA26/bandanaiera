import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.destinationCategory.findMany({
      include: {
        _count: {
          select: { destinations: { where: { status: 'PUBLISHED' } } },
        },
      },
      orderBy: { order: 'asc' },
    });

    const transformed = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      destinationCount: cat._count.destinations,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Public destination categories API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
