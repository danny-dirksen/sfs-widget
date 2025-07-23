import { reloadSheet } from "@/utils/googleSheets/sheets";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const result = await throttle(
    async () => reloadSheet(),
    async () => new Error(`Daily upload cap of ${REQS_PER_DAY} exceeded`),
  );
  return result instanceof Error
    ? new NextResponse(`Error: ${result.message}`, { status: 400 })
    : new NextResponse("Success.", { status: 200 });
}

// This code is used to cap requests to no more than REQS_PER_DAY requests per day.
const REQS_PER_DAY: number = 5;
let reqsRemaining: number = REQS_PER_DAY;
let lastReq: number = Date.now(); // ms

function throttle<T>(
  allow: () => Promise<T>,
  block: () => Promise<T>,
): Promise<T> {
  const thisReq = Date.now(); // ms
  const daysSinceLast = (thisReq - lastReq) / 1000 / 60 / 60 / 24;
  // Allowance regenerates linearly until it hits cap.
  reqsRemaining = Math.min(
    reqsRemaining + REQS_PER_DAY * daysSinceLast,
    REQS_PER_DAY,
  );
  if (reqsRemaining >= 1) {
    reqsRemaining -= 1;
    lastReq = thisReq;
    return allow();
  } else {
    return block();
  }
}
