import React, { ReactNode } from 'react';
import { useNavigation } from '@/hooks/useNavigation';
import { Content, Navigation } from '@/utils/models';
import { LeftPane } from './LeftPane';
import { RightPane } from './RightPane';
import { Popup } from '@/utils/models';

interface MainContentProps {
  data: {
    content: Content;
    openPopup: (newPopup: Popup<any>) => void;
  }
};

export function MainContent(props: MainContentProps): JSX.Element {
  const { content, openPopup } = props.data;
  const { navigation, setNavigation } = useNavigation(content);
  const { pic, channel, language, resource } = navigation;
  // this.rightPaneRef = React.createRef();
  // if (this.rightPaneRef.current) {
  //   this.rightPaneRef.current.scrollTo({top: 0, behavior: 'smooth'})
  // }


  const pageNum = !channel ? 1 : !language ? 2 : 3;

  return (
    <div className='h-full flex flex-col md:flex-row items-stretch'>
      <LeftPane data={{ content, navigation }} />
      <RightPane data={{ content, navigation, setNavigation, openPopup, pageNum }} />
    </div>
  );
}