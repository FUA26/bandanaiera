import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { agencyQuerySchema, agencyCreateSchema } from '@/lib/validations/agency';
import { getAgencyList, createAgency } from '@/lib/services/agency-service';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const queryData = Object.fromEntries(searchParams);

    const query = agencyQuerySchema.parse(queryData);

    const result = await getAgencyList(query);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching agencies:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch agencies' },
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
    const data = agencyCreateSchema.parse(body);

    const agency = await createAgency(data, session.user.id);

    return NextResponse.json(agency, { status: 201 });
  } catch (error: any) {
    console.error('Error creating agency:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create agency' },
      { status: error.message?.includes('schema') ? 400 : 500 }
    );
  }
}
