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
    <div className='flex flex-row gap-2 items-center text-white cursor-pointer hover:bg-black hover:bg-opacity-10 px-2 py-1'
        onClick={onClick} role='button' tabIndex={0}>
      <Arrow className='rotate-180' /> BACK
    </div>
  )
}