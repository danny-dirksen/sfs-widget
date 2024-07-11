import React from 'react';
import { Content, Navigation, Popup } from '@/utils/models';
import { ChannelSelect } from './dropdowns/ChannelSelect';
import { LanguageSelect } from './dropdowns/LanguageSelect';
import { ResourceSelect } from './dropdowns/ResourceSelect';
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

  function selectPartner(pic: string | null) {
    const newNav = {
      ...navigation,
      pic
    };
    setNavigation(newNav);
    track('selectPartner', newNav);
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

  function clickLink(eventType: string, link: string) {
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
        <ChannelSelect data={{ content, navigation, analytics, selectChannel, clickLink, back }} />
        <LanguageSelect data={{ content, navigation, analytics, selectLanguage, clickLink, back }} />
        <ResourceSelect data={{ content, navigation, analytics, selectResource, clickLink, selectPartner, back }} />
      </div>
      {/* Small gradient to bg at the bottom indicating scrollability */}
      <div className='absolute w-full h-4 bg-gradient-to-t from-sfs-bg bottom-0 left-0'></div>
    </div>
  )
}