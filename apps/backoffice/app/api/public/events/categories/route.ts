import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.eventCategory.findMany({
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

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Public event categories API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
