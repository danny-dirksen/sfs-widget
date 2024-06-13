'use client';

//Import Mixpanel SDK
// import mixpanel from 'mixpanel-browser';
import { useEffect, useMemo, useState } from 'react';

// Initialize Mixpanel.
const devMode = process.env.NODE_ENV === 'development';
if (devMode) console.log('Running in dev mode.');
const mixpanelKey = devMode ? (
  process.env.NEXT_PUBLIC_MIXPANEL_KEY_DEV
) : (
  process.env.NEXT_PUBLIC_MIXPANEL_KEY_PROD
)
if (!mixpanelKey) throw new Error('Mixpanel key is not defined.');
// mixpanel.init(mixpanelKey, { debug: true, track_pageview: true, persistence: 'localStorage' });

// export const mp = mixpanel;

/** Generate a random base36 id */
const randomID = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36);
const getLocalStorage = () => typeof window === 'undefined' ? null : window.localStorage;

type TrackingChoice = 'init' | 'none' | 'optin' | 'optout'

/** This hook provides a reactive wrapper for all the mixpanel operations. */
export function useMixpanel() {
  const [ trackingChoice, setTrackingChoice ] = useState<TrackingChoice>('init');
  
  // Keep local storage in sync with state using mixpanel methods.
  useEffect(() => {
    // Validate the choice stored in local storage.
    let validatedChoice: TrackingChoice = (localStorage.getItem('sfs_choice')) as TrackingChoice;
    console.log('before coersion:', {trackingChoice, validatedChoice})
    if (!(['none', 'optin', 'optout'].includes(validatedChoice))) {
      validatedChoice = 'none';
    }
    console.log('after coersion:', {trackingChoice, validatedChoice})

    // The first time, 
    if (trackingChoice === 'init') {
      // Identify, creating new id if necessary.
      const userId = localStorage.getItem('sfs_id') || randomID();
      localStorage.setItem('sfs_id', userId);
      // mp.identify(userId);

      // Get choice from local storage if possible
      localStorage.setItem('sfs_choice', validatedChoice);
    }
    // Sync with session storage
    if (localStorage.getItem('sfs_choice') !== trackingChoice) {
      setTrackingChoice(validatedChoice);
    }
  }, [ trackingChoice ]);

  /**
   * Track a user action unless they opted out.
   * @param event_name same as for mixpanel.track()
   * @param properties same as for mixpanel.track()
   */
  function track(event_name: string, properties: Object | undefined) {
    // if (!mp.has_opted_in_tracking) return;
    fetch('/api/analytics', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id:localStorage.getItem('id'),
        event_name,
        properties
      })
    });
  }
  return { trackingChoice, setTrackingChoice, track };
}