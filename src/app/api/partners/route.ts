import { getPartnerList } from '@/utils/sheets';
import { NextRequest, NextResponse } from 'next/server';

/** Lists partners and their display names. */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const partners = await getPartnerList();
  if (!partners) return new NextResponse('Server error.', { status: 500 });
  return NextResponse.json(partners, { status: 200 });
}