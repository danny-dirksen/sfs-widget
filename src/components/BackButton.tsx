import React from 'react'
import { Arrow } from './Arrow';

interface BackButtonProps {
  data: {
    onClick: () => void;
    color?: 'black' | 'white';
  }
};

export function BackButton(props: BackButtonProps) {
  const { onClick, color } = props.data;
  const black = color === 'black';

  const colorClass = black ? 'text-black' : 'text-white';

  return (
    <div className={'px-2 py-1 popout flex flex-row gap-2 items-center tracking-widest '
        + 'cursor-pointer w-max hover:bg-black hover:bg-opacity-10 ' + colorClass}
        onClick={onClick} role='button' tabIndex={0}>
      <Arrow className='rotate-180' color={color} /> BACK
    </div>
  )
}