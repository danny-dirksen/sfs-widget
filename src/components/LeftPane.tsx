import { Content, Navigation } from '@/utils/models';
import arrow from '@/resources/ui/arrow.svg';
import Image from 'next/image';

interface LeftPaneProps {
  data: {
    content: Content;
    navigation: Navigation;
  }
};

export function LeftPane(props: LeftPaneProps) {
  const { content, navigation } = props.data;
  const { channel, language } = navigation;

  let pageNum = language ? 3 : (channel ? 2 : 1);

  return (
    <div className='pane left-pane'>
      <Prompt data={{ navigation }}/>
      <Selected>{channel}</Selected>
      <Selected>{language}</Selected>
      <Hint data={{ pageNum }} />
    </div>
  );
}

interface PromptProps {
  data: {
    navigation: Navigation;
  }
};

function Prompt(props: PromptProps) {
  const { channel, language } = props.data.navigation;

  if (!channel) return <div id='prompt'>How do you<br/>listen to music?</div>;
  else if (!language) return <div id='prompt'>What language<br/>do you speak?</div>;
  else return <div id='prompt'>What Volume<br/>would you like?</div>;
}

function Selected(props: {children: string | null}) {
  const { children } = props;
  if (!children) return <></>;
  return (
    <div className='selected'>
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
  
  if (pageNum === 1) {
    var inner = <><Arrow leftSide />SELECT A SOURCE<Arrow /></>
  } else if (pageNum === 2) {
    var inner = <><Arrow leftSide />CHOOSE A LANGUAGE<Arrow /></>
  } else {
    var inner = <>CHOOSE YOUR MUSIC<br/>AND THAT'S IT!</>
  }
  return <div className='flex flex-row justify-center items-center gap-2'>{inner}</div>;
}

function Arrow(props: { leftSide?: true}) {
  const { leftSide } = props;
  const hideLeft = leftSide ? ' md:hidden' : '';
  return <Image className={'h-[1em] w-[1em] rotate-90 md:rotate-0' + hideLeft} src={arrow} alt='->' />
}