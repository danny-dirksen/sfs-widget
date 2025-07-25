import { reloadSheet } from "@/utils/persistentData/persistentData";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const result = await throttle({
    allow: async () => await reloadSheet(),
    block: async () => new Error(`Daily upload cap of ${REQS_PER_DAY} reloads exceeded`),
  });
  // If the request is blocked due to throttling, return an error response.
  if (!result.allowed) {
    return new NextResponse(result.data.message, { status: 400 });
  }

  // Return the result of the reload operation.
  return result.data instanceof Error
    ? new NextResponse("Failed to reload sheet.", { status: 500 })
    : new NextResponse("Sheet reloaded successfully.", { status: 200 });
}

/**
 * Throttle function to limit the number of requests.
 * Requests are allowed based on a daily cap.
 * If the cap is exceeded, it calls the block function.
 * @returns The result of the allow or block function.
 */
async function throttle<T, U>({ allow, block }: {
  /** Function to call when request is allowed */
  allow: () => Promise<T>,
  /** Function to call when request is blocked */
  block: () => Promise<U>,
}): Promise<ThrottleResult<T, U>> {
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
    return { allowed: true, data: await allow() };
  } else {
    return { allowed: false, data: await block() };
  }
}

// Parameters for throttling.
const REQS_PER_DAY: number = 5;

// Throttle state.
let reqsRemaining: number = REQS_PER_DAY;
let lastReq: number = Date.now(); // ms

type ThrottleResult<T, U> =
  | { allowed: true; data: T }
  | { allowed: false; data: U };