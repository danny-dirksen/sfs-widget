import { Content } from "@/models/content";
import { getContent } from "@/utils/persistentData/persistentData";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse<Content>> {
  const { searchParams } = new URL(req.url);
  const pid = searchParams.get("p");
  const content = await getContent(pid);
  return content instanceof Error
    ? new NextResponse("Failed to get content.", { status: 500 })
    : NextResponse.json(content);
}
