import { ReactNode } from "react";

export const Anchor = (props: {href: string, children: ReactNode}) => (
  <a href={props.href} className='text-sfs-focus underline font-[renner-medium]'>{props.children}</a>
);

export const Header = (props: { children: ReactNode}) => (
  <h1 className='text-sfs-focus font-[renner-medium] tracking-normal text-lg mb-4'>{props.children}</h1>

);

export const Paragraph = (props: { children: ReactNode}) => (
  <p className='mb-4 tracking-normal'>{props.children}</p>
);