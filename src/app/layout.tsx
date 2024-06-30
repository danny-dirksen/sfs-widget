import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Free Resources - Songs for Saplings',
  description: 'Access Songs for Saplings resources in any way you want.',
  other: {
    'theme-color': '#2fb257'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='h-full'>
      {/* <meta name="theme-color" content="#2fb257"></meta> */}
      <body className='h-full'>{children}</body>
    </html>
  );
}
