import React, { ReactNode } from 'react';
import { useNavigation } from '@/hooks/useNavigation';
import { Content, Navigation } from '@/utils/models';
import { LeftPane } from './LeftPane';
import { RightPane } from './RightPane';

interface MainContentProps {
  data: {
    content: Content;
  }
};

export function MainContent(props: MainContentProps): JSX.Element {
  const { content } = props.data;
  const { navigation, setNavigation, back } = useNavigation(content);
  const { pic, channel, language, resource } = navigation;
  // this.rightPaneRef = React.createRef();
  // if (this.rightPaneRef.current) {
  //   this.rightPaneRef.current.scrollTo({top: 0, behavior: 'smooth'})
  // }

  const pageNum = !channel ? 1 : !language ? 2 : 3;

  return (
    <div id='main'>
      <LeftPane data={{ content, navigation }} />
      <RightPane data={{ content, navigation, setNavigation, pageNum }} />
    </div>
  );
}