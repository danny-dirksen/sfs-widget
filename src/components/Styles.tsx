import { ReactNode } from "react";

export const Anchor = (props: {href: string, children: ReactNode}) => (
  <a href={props.href} className='text-sfs-accent underline font-bold'>{props.children}</a>
);

export const Header = (props: { children: ReactNode}) => (
  <h1 className='text-sfs-accent font-bold text-lg mb-4'>{props.children}</h1>

);

export const Paragraph = (props: { children: ReactNode}) => (
  <p className='mb-4'>{props.children}</p>
);

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  type: 'primary' | 'secondary';
  disabled?: boolean;
};

export const Button = (props: ButtonProps) => {
  const { children, onClick, type, disabled } = props;
  const colorClass = type === 'primary' ? (
    'text-white bg-sfs-accent enabled:hover:bg-sfs-accent-dark focus:bg-sfs-accent-dark'
  ) : (
    'text-sfs-accent border border-2 border-sfs-accent enabled:hover:text-sfs-accent-dark focus:text-sfs-accent-dark'
  );
  return <button onClick={onClick} disabled={disabled} className={'popout font-bold px-4 py-2 disabled:opacity-40 disabled:cursor-default ' + colorClass}>{children}</button>
}