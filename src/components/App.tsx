'use client';

import React, { RefObject, Suspense, useEffect, useRef, useState } from 'react';
import { BrandingLayer } from './Branding';
import { MainContent } from './MainContent';
import { AnalyticsNotice } from './AnalyticsNotice';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Content, PartnerInfo, Navigation, Popup } from '@/utils/models';
import { usePopups } from '@/hooks/usePopups';
import localFont from 'next/font/local';

const renner = localFont({
  src: [
    {
      path: '../resources/fonts/renner-light.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../resources/fonts/renner-lightitalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../resources/fonts/renner-medium.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../resources/fonts/renner-mediumitalic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
})


interface AppProps {
  data: {
    content: Content;
    partner: PartnerInfo | null;
  }
};

export const App: React.FC<AppProps> = (props) => {
  const { content, partner } = props.data;
  const analytics = useAnalytics();

  // const openPopupTracked: typeof openPopup = (popup) =>{
  //   openPopup(popup);
  //   analytics.track(popup.name + 'Screen', {});
  // }

  // const closePopupTracked: typeof closePopup = (name) => {
  //   closePopup(name);
  //   analytics.track('exitScreen', { screen: name });
  // }

  // const [ popup, setPopup ] = useState<string | null>(null);

  useEffect(() => {
    analytics.track('loadPage', {});
  }, []);

  return (
    <div id='app' className={renner.className + ' h-full relative bg-sfs-bg '}>
      <BrandingLayer data={{ partner }} />
      <MainContent data={{ content, analytics }}/>
      {/* Popup layer */}
      <AnalyticsNotice data={{ analytics }} />
      {/* { popup && <div id='popup-layer' className='absolute top-0 left-0 w-full h-full' /> } */}
    </div>
  );
}