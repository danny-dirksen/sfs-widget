import { NextRequest, NextResponse } from "next/server";

export async function POST(_: NextRequest): Promise<NextResponse> {
  console.error("Unsubscribe endpoint is not implemented yet.");
  return new NextResponse("Unsubscribe endpoint is not implemented yet.", {
    status: 501,
  });
}
