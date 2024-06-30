'use client'; // Error components must be Client Components

import Image from 'next/image';
import sfsLogoWhite from '@/resources/ui/logoBig.png';
import { Button } from './Styles';
import Link from 'next/link';

interface ErrorPageProps {
  data: {
    message: string;
  };
}
;
export function ErrorPage(props: ErrorPageProps) {
  const { message } = props.data;
  return (
    <main className='h-full max-w-lg mx-auto p-4 flex flex-col gap-4 justify-center text-center'>
      <h1 className='text-3xl font-bold'>Whoops!</h1>
      <p>{message} Please try again or check back with us later. Feel free to <a className='text-green-600 underline' href="https://songsforsaplings.com/contact/">contact us</a> if this problem persists. </p>
      <div className='flex flex-row items-center justify-center gap-4'>
        <Link className='border-2 border-sfs-accent bg-sfs-accent text-white px-4 py-2' href={'/'}>TRY AGAIN</Link>
        <Link className='border-2 border-sfs-accent text-sfs-accent px-4 py-2' href={'http://songsforsaplings.com'}>BACK TO WEBSITE</Link>
      </div>
      <p>Have a nice day!</p>
      <div>
        <Image priority className='inline-block h-10 w-auto' src={sfsLogoWhite} alt='Songs for Saplings' />
      </div>
    </main>
  );
}
