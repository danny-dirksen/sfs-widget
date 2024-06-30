import React from 'react'
import { Arrow } from './Arrow';

interface BackButtonProps {
  data: {
    onClick: () => void;
  }
};

export function BackButton(props: BackButtonProps) {
  const { onClick } = props.data;
  return (
    <div className={'px-2 py-1 popout flex flex-row gap-2 items-center text-white tracking-widest '
        + 'cursor-pointer hover:bg-black hover:bg-opacity-10'}
        onClick={onClick} role='button' tabIndex={0}>
      <Arrow className='rotate-180' /> BACK
    </div>
  )
}