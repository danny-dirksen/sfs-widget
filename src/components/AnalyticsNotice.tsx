import React from 'react'
import { AnalyticsContext } from '@/hooks/useAnalytics';

interface AnalyticsNoticeProps {
  data: {
    context: AnalyticsContext;
  }
};

export function AnalyticsNotice(props: AnalyticsNoticeProps) {
  const { trackingChoice, setTrackingChoice, track } = props.data.context;
  // If user has already opted in or out, or we don't know, then don't show.
  if (trackingChoice !== 'none') return <></>;

  return (
    <div className='notification-container'>
      <div className='notification'>
        <span>We uses cookies to monitor traffic and make this tool better.</span>
        <div style={{display: 'inline-block'}}>
          <button className='notification-button' onClick={() => setTrackingChoice('optin')}>
            Okay
          </button>
          <button className='notification-button' onClick={() => setTrackingChoice('optout')}>
            No Thanks
          </button>
        </div>
      </div>
    </div>
  );
}