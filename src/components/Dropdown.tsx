import { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import infoIcon from '@/resources/ui/info.svg';
import shareIcon from '@/resources/ui/share.svg';

interface DropdownMenuProps {
  children: ReactNode[];
  data: {
    onScreen: boolean;
  }
};

export function DropdownMenu(props: DropdownMenuProps) {
  const { children, data } = props;
  const { onScreen } = data;
  const [ displayed, setDisplayed ] = useState(onScreen);

  // Stop displaying 300ms after it leaves the screen.
  // This allows us to see it sliding out.
  useEffect(() => {
    if (onScreen) {
      setDisplayed(true);
    } else {
      const timeout = setTimeout(() => {
        setDisplayed(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [ onScreen ])

  return (
    <div>{children}</div>
  );
}

interface DropDownOptionProps {
  children: ReactNode;
  data: {
    href?: string;
    onClick?: () => void;
    onClickInfo?: () => void;
    onClickShare?: () => void;
  }
};

export function DropdownOption(props: DropDownOptionProps) {
  const { children, data } = props;
  const { href, onClick, onClickInfo, onClickShare } = data;

  const leftSide = (href) ? (
    <a onClick={onClick} className='w-full' target='_blank'>{children}</a>
  ) : (
    <div onClick={onClick} className='w-full'>{children}</div>
  );

  const rightSide = (onClickInfo || onClickShare) ? (
    <div className='flex flex-col'>
      { onClickInfo ? (
        <Image src={infoIcon} alt="Info" className='w-8 h-8 p-2' onClick={onClickInfo} />
      ) : null}
      { onClickShare ? (
        <Image src={shareIcon} alt="Share" className='w-8 h-8 p-2' onClick={onClickShare} />
      ) : null}
    </div>
  ) : null;

  return (
    <div className='w-full bg-white relative'>
      { leftSide }
      { rightSide }
    </div>
  );
}