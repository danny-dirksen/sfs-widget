import { NextRequest, NextResponse } from "next/server";

import Mixpanel from "mixpanel";
import { logger } from "@/utils/varUtils";
import { AnalyticsEventSchema } from "@/models/api";

// Initialize Mixpanel.
const devMode = process.env.NODE_ENV === "development";
if (devMode) logger.info("Running in dev mode.");
const mixpanelToken = devMode
  ? process.env.NEXT_PUBLIC_MIXPANEL_KEY_DEV
  : process.env.NEXT_PUBLIC_MIXPANEL_KEY_PROD;
if (!mixpanelToken) throw new Error("Mixpanel token is not defined.");
const mixpanel = Mixpanel.init(mixpanelToken);

export async function POST(req: NextRequest) {
  // Parse and validate the request body.
  const data: unknown = await req.json();
  const parsed = AnalyticsEventSchema.safeParse(data);
  if (!parsed.success) {
    logger.error("Invalid analytics event data:", parsed.error);
    return new NextResponse("Bad request", { status: 400 });
  }
  const { userId, eventName, properties } = parsed.data;

  mixpanel.track(eventName, {
    ...properties,
    distinct_id: userId,
  });
  return new NextResponse("Success", { status: 200 });
}
