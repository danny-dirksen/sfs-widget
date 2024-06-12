"use client";

//Import Mixpanel SDK
import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel.
const devMode = process.env.NODE_ENV === "development";
const mixpanelKey = devMode ? (
  process.env.NEXT_PUBLIC_MIXPANEL_key_dev
) : (
  process.env.NEXT_PUBLIC_MIXPANEL_key_prod
)
if (!mixpanelKey) throw new Error("Mixpanel key is not defined.");
mixpanel.init(mixpanelKey, { debug: true, track_pageview: true, persistence: 'localStorage'});

export const mp = mixpanel;