import { PartnerInfo } from "@/models/partners";
import { getPartnerInfoList } from "@/utils/persistentData/persistentData";
import { NextResponse } from "next/server";

/** Lists partners and their display names. */
export async function GET(): Promise<NextResponse<PartnerInfo[]>> {
  const partners = await getPartnerInfoList();
  if (partners instanceof Error) return new NextResponse("Server error while fetchin partners.", { status: 500 });
  return NextResponse.json(partners, { status: 200 });
}
