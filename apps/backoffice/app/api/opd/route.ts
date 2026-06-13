import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { opdQuerySchema, opdCreateSchema } from '@/lib/validations/opd';
import { getOpdList, createOpd } from '@/lib/services/opd-service';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const queryData = Object.fromEntries(searchParams);

    const query = opdQuerySchema.parse(queryData);

    const result = await getOpdList(query);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching opds:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch opds' },
      { status: error.message?.includes('schema') ? 400 : 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = opdCreateSchema.parse(body);

    const opd = await createOpd(data, session.user.id);

    return NextResponse.json(opd, { status: 201 });
  } catch (error: any) {
    console.error('Error creating opd:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create opd' },
      { status: error.message?.includes('schema') ? 400 : 500 }
    );
  }
}
