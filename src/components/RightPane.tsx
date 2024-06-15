import React from 'react';
import { Content, Navigation } from '@/utils/models';
import { DropdownChannel } from './DropdownChannel';
// import DropdownLanguage from './DropdownLanguage';
// import DropdownResource from './DropdownResource';



interface RightPaneProps {
  data: {
    content: Content;
    navigation: Navigation;
    pageNum: number;
  }
};

export function RightPane(props: RightPaneProps) {
  const { content, navigation, pageNum } = props.data;

  let style = {
    transform: 'translateX(' + 33.333 * (1 - pageNum) + '%)'
  };
  return (
    <div className='pane right-pane'>
      <div className='right-pane-inner' style={style}>
        <DropdownChannel data={{ content, navigation }} />
        {/* <DropdownLanguage data={{ content, navigation }} />
        <DropdownResource data={{ content, navigation }} /> */}
      </div>
    </div>
  )
}