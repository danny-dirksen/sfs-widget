import { Content, Navigation } from '@/utils/models';
import { Arrow } from './Arrow';

interface InstructionsPaneProps {
  data: {
    content: Content;
    navigation: Navigation;
  }
};

export function InstructionsPane(props: InstructionsPaneProps) {
  const { content, navigation } = props.data;
  const { channel, language } = navigation;
  const channelName = content.channels.find(ch => ch.channelId === channel)?.name || null;
  const languageName = content.languages.find(l => l.languageId === language)?.autonym || null;

  let pageNum = language ? 3 : (channel ? 2 : 1);

  return (
    <div className={'flex-shrink-0 hz:flex-[2] p-4 flex flex-col justify-center text-center gap-2 hz:gap-4 widget:gap-1 '
        + 'border-black border-opacity-10 border-b hz:border-b-0 hz:border-r tracking-widest text-white'}>
      <div className='text-3xl widget:text-lg widget:font-bold'>
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
  if (!children) return <div className='hz:hidden'>&nbsp;</div>;
  return (
    <div className='text-sfs-dark font-bold widget:text-xs'>
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

  const arrowOnLeft = <Arrow className='rotate-90 hz:hidden' />;
  const arrowOnRight = <Arrow className='rotate-90 hz:rotate-0' />;
  const hints = [
    <>{ arrowOnLeft }SELECT A SOURCE{ arrowOnRight }</>,
    <>{ arrowOnLeft }CHOOSE A LANGUAGE{ arrowOnRight }</>,
    <>CHOOSE YOUR MUSIC<br/>{`AND THAT'S IT!`}</>
  ];
  const hintText = hints[pageNum - 1];
  return <div className='flex flex-row justify-center items-center gap-2'>{hintText}</div>;
}

