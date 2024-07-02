import { ReactNode } from "react";

// Shortcuts for defining functional components that pass all props along.
type Attributes = React.HTMLAttributes<HTMLElement>;
type FC = React.FC<Attributes>;

export const Anchor = (props: {href: string, children: ReactNode}) => (
  <a href={props.href} className='text-sfs-accent underline font-bold' target="_blank">{props.children}</a>
);

export const Header: FC = (props) => (
  <h1 {...props} className='text-sfs-accent font-bold text-lg mb-4'>{props.children}</h1>

);

export const Paragraph: FC = (props) => (
  <p {...props} className='mb-4'>{props.children}</p>
);

interface ButtonProps {
  type: 'primary' | 'secondary';
  disabled?: boolean;
};

export const Button: React.FC<Attributes & ButtonProps > = (props) => {
  const { type, children, className, ...buttonProps } = props;

  const colorClass = type === 'primary' ? (
    'text-white bg-sfs-accent enabled:hover:bg-sfs-accent-dark focus:bg-sfs-accent-dark '
  ) : (
    'text-sfs-accent border border-2 border-sfs-accent enabled:hover:text-sfs-accent-dark focus:text-sfs-accent-dark '
  );
  return <button {...buttonProps} className={'popout font-bold px-4 py-2 disabled:opacity-40 disabled:cursor-default ' + colorClass + (className || '')}>{children}</button>
}