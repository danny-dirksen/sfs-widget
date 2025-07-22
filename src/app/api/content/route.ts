import { getContent } from "@/utils/sheets";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const pid = searchParams.get("p");
  const content = await getContent(pid);
  return NextResponse.json(content);
}
