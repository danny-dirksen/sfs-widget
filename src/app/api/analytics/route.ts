import { NextRequest, NextResponse } from 'next/server';
import { TrackingEvent } from '@/utils/models';

import Mixpanel from 'mixpanel';


// Initialize Mixpanel.
const devMode = process.env.NODE_ENV === 'development';
if (devMode) console.log('Running in dev mode.');
const mixpanelToken = devMode ? (
  process.env.NEXT_PUBLIC_MIXPANEL_KEY_DEV
) : (
  process.env.NEXT_PUBLIC_MIXPANEL_KEY_PROD
)
if (!mixpanelToken) throw new Error('Mixpanel token is not defined.');
const mixpanel = Mixpanel.init(mixpanelToken);

export async function POST(req: NextRequest) {
  const { userId, eventName, properties } = await req.json();
  console.log( { userId, eventName, properties });
  if (typeof userId !== 'string' || typeof eventName !== 'string' || !properties) {
    return new NextResponse("Bad request", { status: 400 });
  }
  const event: TrackingEvent = { userId, eventName, properties };
  mixpanel.track(eventName, {
    ...properties,
    distinct_id: userId
  });
  return new NextResponse("Success", { status: 200 })
}