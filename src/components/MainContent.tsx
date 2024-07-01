import React, { ReactNode } from 'react';
import { useNavigation } from '@/hooks/useNavigation';
import { Content, Navigation } from '@/utils/models';
import { InstructionsPane } from './InstructionsPane';
import { DropdownPane } from './DropdownPane';
import { Popup } from '@/utils/models';
import { AnalyticsContext } from '@/hooks/useAnalytics';

interface MainContentProps {
  data: {
    content: Content;
    openPopup: (newPopup: Popup<any>) => void;
    analytics: AnalyticsContext
  }
};

export function MainContent(props: MainContentProps): JSX.Element {
  const { content, openPopup, analytics } = props.data;
  const { navigation, setNavigation } = useNavigation(content);
  const { pic, channel, language, resource } = navigation;
  // this.rightPaneRef = React.createRef();
  // if (this.rightPaneRef.current) {
  //   this.rightPaneRef.current.scrollTo({top: 0, behavior: 'smooth'})
  // }


  const pageNum = !channel ? 1 : !language ? 2 : 3;

  return (
    <main className='h-full flex flex-col md:flex-row items-stretch'>
      <InstructionsPane data={{ content, navigation }} />
      <DropdownPane data={{ content, navigation, analytics, setNavigation, openPopup, pageNum }} />
    </main>
  );
}