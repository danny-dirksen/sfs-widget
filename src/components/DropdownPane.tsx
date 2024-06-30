import React from 'react';
import { Content, Navigation, Popup } from '@/utils/models';
import { SelectChannel } from './dropdowns/SelectChannel';
import { SelectLanguage } from './dropdowns/SelectLanguage';
import { SelectResource } from './dropdowns/SelectResource';



interface DropdownPaneProps {
  data: {
    content: Content;
    navigation: Navigation;
    setNavigation: (navigation: Navigation) => void;
    openPopup: (newPopup: Popup<any>) => void;
    pageNum: number;
  }
};

export function DropdownPane(props: DropdownPaneProps) {
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
        <SelectChannel data={{ content, navigation, selectChannel, back }} />
        <SelectLanguage data={{ content, navigation, selectLanguage, openPopup, back }} />
        <SelectResource data={{ content, navigation, selectResource, openPopup, back }} />
      </div>
    </div>
  )
}