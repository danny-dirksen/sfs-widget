import React from 'react';
import { Content, Navigation, Popup } from '@/utils/models';
import { SelectChannel } from './dropdowns/SelectChannel';
import { SelectLanguage } from './dropdowns/SelectLanguage';
import { SelectResource } from './dropdowns/SelectResource';
import { AnalyticsContext } from '@/hooks/useAnalytics';



interface DropdownPaneProps {
  data: {
    content: Content;
    navigation: Navigation;
    analytics: AnalyticsContext;
    setNavigation: (navigation: Navigation) => void;
    pageNum: number;
  }
};

export function DropdownPane(props: DropdownPaneProps) {
  const { content, navigation, analytics, setNavigation, pageNum } = props.data;
  const { track } = analytics;

  function selectChannel(channelId: string) {
    const newNav = {
      ...navigation,
      channel: channelId
    };
    setNavigation(newNav);
    track('selectChannel', newNav);
  }

  function selectLanguage(languageId: string) {
    const newNav = {
      ...navigation,
      language: languageId
    };
    setNavigation(newNav);
    track('selectLanguage', newNav);
  }

  function selectResource(resourceId: string) {
    const newNav = {
      ...navigation,
      resource: resourceId
    };
    setNavigation(newNav);
    track('selectResource', newNav);
  }

  function back() {
    const { channel, language } = navigation;
    if (language) {
      setNavigation({ ...navigation, resource: null, language: null });
    } else if (channel) {
      setNavigation({ ...navigation, channel: null, resource: null, language: null });
    }
    track('back', navigation);
  }

  function clickChannelLink(eventType: string, link: string) {
    track(eventType, {link});
  }

  let style = {
    transform: 'translateX(' + (1 - pageNum) * 100 / 3 + '%)'
  };
  return (
    // Holds caroseul with correct frame size
    <div className='flex-[3] overflow-hidden relative'>
      {/* Carousel */}
      <div className='w-[300%] h-full transition-transform flex flex-row items-stretch' style={style}>
        <SelectChannel data={{ content, navigation, analytics, selectChannel, clickChannelLink, back }} />
        <SelectLanguage data={{ content, navigation, analytics, selectLanguage, back }} />
        <SelectResource data={{ content, navigation, analytics, selectResource, back }} />
      </div>
      {/* Small gradient to bg at the bottom indicating scrollability */}
      <div className='absolute w-full h-4 bg-gradient-to-t from-sfs-bg bottom-0 left-0'></div>
    </div>
  )
}