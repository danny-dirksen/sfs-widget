import { ReactNode } from 'react';
import Image from 'next/image';
import infoIcon from '@/resources/ui/info.svg';
import shareIcon from '@/resources/ui/share.svg';

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
    <a onClick={onClick} href={href} className='w-full' target='_blank'>{children}</a>
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
    <div className='w-full bg-white popout select-none hover:bg-gray-100 flex flex-row items-stretch shadow-md'>
      { leftSide }
      { rightSide }
    </div>
  );
}