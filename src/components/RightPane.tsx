import React from 'react';
import { Content, Navigation, Popup } from '@/utils/models';
import { DropdownChannel } from './dropdowns/DropdownChannel';
import { DropdownLanguage } from './dropdowns/DropdownLanguage';
// import DropdownResource from './DropdownResource';



interface RightPaneProps {
  data: {
    content: Content;
    navigation: Navigation;
    setNavigation: (navigation: Navigation) => void;
    openPopup: (newPopup: Popup<any>) => void;
    pageNum: number;
  }
};

export function RightPane(props: RightPaneProps) {
  const { content, navigation, setNavigation, openPopup, pageNum } = props.data;

  function selectChannel(channelId: string) {
    setNavigation({
      ...navigation,
      channel: channelId
    })
  }

  function selectLanguage(languageId: string) {
    setNavigation({
      ...navigation,
      language: languageId
    });
  }

  function selectResource(resourceId: string) {
    setNavigation({
      ...navigation,
      resource: resourceId
    });
  }

  function back() {
    const { channel, language } = navigation;
    if (language) {
      setNavigation({ ...navigation, resource: null, language: null });
    } else if (channel) {
      setNavigation({ ...navigation, channel: null, resource: null, language: null });
    }
  }

  let style = {
    transform: 'translateX(' + (1 - pageNum) * 100 / 3 + '%)'
  };
  return (
    // Holds caroseul with correct frame size
    <div className='flex-[3] overflow-hidden'>
      {/* Carousel */}
      <div className='w-[300%] h-full transition-transform flex flex-row items-stretch' style={style}>
        <DropdownChannel data={{ content, navigation, selectChannel, back }} />
        <DropdownLanguage data={{ content, navigation, selectLanguage, openPopup, back }} />
        {/* <DropdownResource data={{ content, navigation }} /> */}
      </div>
    </div>
  )
}