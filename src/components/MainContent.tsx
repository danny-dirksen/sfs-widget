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
    analytics: AnalyticsContext
  }
};

export function MainContent(props: MainContentProps): JSX.Element {
  const { content, analytics } = props.data;
  const { navigation, setNavigation } = useNavigation(content);
  const { pic, channel, language, resource } = navigation;
  // this.rightPaneRef = React.createRef();
  // if (this.rightPaneRef.current) {
  //   this.rightPaneRef.current.scrollTo({top: 0, behavior: 'smooth'})
  // }


  const pageNum = !channel ? 1 : !language ? 2 : 3;

  return (
    <main className='h-full flex flex-col hz:flex-row items-stretch'>
      <InstructionsPane data={{ content, navigation }} />
      <DropdownPane data={{ content, navigation, analytics, setNavigation, pageNum }} />
    </main>
  );
}