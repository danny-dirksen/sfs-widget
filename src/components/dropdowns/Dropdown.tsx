import { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import infoIcon from '@/resources/ui/info.svg';
import shareIcon from '@/resources/ui/share.svg';
import { BackButton } from '../BackButton';

interface DropdownMenuProps {
  children: ReactNode[];
  data: {
    onScreen: boolean;
    back?: () => void;
  }
};

export function DropdownMenu(props: DropdownMenuProps) {
  const { children, data } = props;
  const { onScreen, back } = data;
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
  }, [ onScreen ]);

  return (
    <div className='w-1/3 h-full flex flex-col md:justify-center overflow-hidden' >
      { displayed ? (
        // Scroll box
        <div className='w-full h-fit max-h-full overflow-y-scroll flex flex-col items-center'>
          <div className='w-full max-w-md text-black flex flex-col px gap-4 p-4'>
            {/* Back button holder */}
            { back ? (
              <div className='flex-none flex flex-row justify-start'>
                <BackButton data={{ onClick: back }} />
              </div>
            ) : null }
            {children}
          </div>

        </div>
      ) : (
        <>&nbsp;</>
      ) }
    </div>
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

  const className = 'w-full';

  const leftSide = (href) ? (
    <a onClick={onClick} className='w-full' target='_blank'>{children}</a>
  ) : (
    <div tabIndex={0} role='button' onClick={onClick} className={className}>{children}</div>
  );

  const rightBtnClass = 'size-8 p-1 hover:bg-black hover:bg-opacity-10';
  const rightSide = (onClickInfo || onClickShare) ? (
    <div className='flex flex-col justify-between'>
      { onClickInfo ? (
        <Image tabIndex={0} role='button' src={infoIcon} alt="Info" className={rightBtnClass} onClick={onClickInfo} />
      ) : null}
      { onClickShare ? (
        <Image tabIndex={0} role='button' src={shareIcon} alt="Share" className={rightBtnClass} onClick={onClickShare} />
      ) : null}
    </div>
  ) : null;

  return (
    <div className='w-full bg-white clickable flex flex-row items-stretch'>
      { leftSide }
      { rightSide }
    </div>
  );
}