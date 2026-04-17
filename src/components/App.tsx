"use client";

import React, { useEffect } from "react";
import { BrandingLayer } from "./Branding";
import { MainContent } from "./MainContent";
import { AnalyticsNotice } from "./AnalyticsNotice";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Content } from "@/models/content";
import { PartnerInfo } from "@/models/partners";
import { AppContainer } from "./AppContainer";

interface AppProps {
  data: {
    content: Content;
    partner: PartnerInfo | null;
  };
}

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
    analytics.track("loadPage", {});
  }, [analytics]);

  return (
    <AppContainer>
      <BrandingLayer data={{ partner }} />
      <MainContent data={{ content, analytics }} />
      {/* Popup layer */}
      <AnalyticsNotice data={{ analytics }} />
      {/* { popup && <div id='popup-layer' className='absolute top-0 left-0 w-full h-full' /> } */}
    </AppContainer>
  );
};