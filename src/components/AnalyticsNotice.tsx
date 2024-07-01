import React from 'react'
import { AnalyticsContext } from '@/hooks/useAnalytics';
import { Button } from './Styles';

interface AnalyticsNoticeProps {
  data: {
    analytics: AnalyticsContext;
  }
};

export function AnalyticsNotice(props: AnalyticsNoticeProps) {
  const { trackingChoice, setTrackingChoice } = props.data.analytics;
  // If user has already opted in or out, or we don't know, then don't show.
  if (trackingChoice !== 'none') return <></>;

  return (
    <div className='absolute bottom-0 right-0 w-full text-right p-2'>
      <div className='inline-flex flex-col md:flex-row items-end md:items-center gap-2 max-w-full w-fit bg-white shadow-md px-4 py-2 text-black'>
        <div className='text-left'>We uses cookies and analytics to monitor traffic and make this tool better.</div>
        <div className='flex items-stretch h-fit w-fit gap-2 flex-row'>
          <Button type='primary' onClick={() => setTrackingChoice('optin')}>Okay</Button>
          <Button type='secondary' onClick={() => setTrackingChoice('optout')}>No Thanks</Button>
        </div>
      </div>
    </div>
  );
}