import { Content, Navigation } from '@/utils/models';
import { Arrow } from './Arrow';

interface LeftPaneProps {
  data: {
    content: Content;
    navigation: Navigation;
  }
};

export function LeftPane(props: LeftPaneProps) {
  const { content, navigation } = props.data;
  const { channel, language } = navigation;
  const channelName = content.channels.find(ch => ch.channelId === channel)?.name || null;
  const languageName = content.languages.find(l => l.languageId === language)?.autonym || null;

  let pageNum = language ? 3 : (channel ? 2 : 1);

  return (
    <div className={'flex-shrink-0 md:flex-[2] p-4 flex flex-col justify-center text-center gap-2 md:gap-6 '
        + 'border-black border-opacity-10 border-b md:border-b-0 md:border-r '}>
      <div className='text-3xl'>
        { (!channel) ? (
          <>How do you<br/>listen to music?</>
        ) : (!language) ? (
          <>What language<br/>do you speak?</>
        ) : (
          <>What Volume<br/>would you like?</>
        ) }
      </div>
      <Selected>{channelName}</Selected>
      <Selected>{languageName}</Selected>
      <Hint data={{ pageNum }} />
    </div>
  );
}

function Selected(props: {children: string | null}) {
  const { children } = props;
  if (!children) return <div>&nbsp;</div>;
  return (
    <div className='text-green-900 font-[renner-medium]'>
      SELECTED: {children.toUpperCase()}
    </div>
  );
}

interface HintProps {
  data: {
    pageNum: number;
  }
};

function Hint(props: HintProps) {
  const { pageNum } = props.data;

  const arrowOnLeft = <Arrow className='rotate-90 md:hidden' />;
  const arrowOnRight = <Arrow className='rotate-90 md:rotate-0' />;
  
  if (pageNum === 1) {
    var inner = <>{ arrowOnLeft }SELECT A SOURCE{ arrowOnRight }</>
  } else if (pageNum === 2) {
    var inner = <>{ arrowOnLeft }CHOOSE A LANGUAGE{ arrowOnRight }</>
  } else {
    var inner = <><div>CHOOSE YOUR MUSIC<br/>AND THAT'S IT!</div></>
  }
  return <div className='flex flex-row justify-center items-center gap-2'>{inner}</div>;
}

