import { ButtonHTMLAttributes, DetailedHTMLProps, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

// Shortcuts for defining functional components that pass all props along.
type Attributes = React.HTMLAttributes<HTMLElement>;
type FC = React.FC<Attributes>;

export const Anchor = (props: {href: string, children: ReactNode}) => (
  <a href={props.href} className='text-sfs-accent underline font-bold' target="_blank">{props.children}</a>
);

export const Header: FC = (props) => (
  <h1 {...props} className='text-sfs-accent font-bold text-xl'>{props.children}</h1>
);

export const Paragraph: FC = (props) => (
  <p {...props}>{props.children}</p>
);

type ButtonProps = (
  ButtonHTMLAttributes<HTMLButtonElement> &
  {
    data?: {
      type?: 'primary' | 'secondary';
    }
  }
);

export const Button: React.FC<ButtonProps> = (props) => {
  const { disabled, className, children, data, ...otherProps } = props;
  const primary = data?.type === 'primary';

  const colorClass = primary ? (
    'text-white border border-2 border-transparent bg-sfs-accent enabled:hover:bg-sfs-accent-dark focus:bg-sfs-accent-dark '
  ) : (
    'text-sfs-accent border border-2 border-sfs-accent enabled:hover:text-sfs-accent-dark focus:text-sfs-accent-dark '
  );
  return <button {...otherProps} disabled={disabled} className={'popout font-bold px-4 py-2 disabled:opacity-40 disabled:cursor-default ' + colorClass + (className || '')}>{children}</button>
}

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = (props) => {
  const inputClass = 'outline-none border border-2 border-black focus:border-sfs-accent px-2 py-1 w-full ';
  const { className, ...allOtherProps } = props;
  return (
    <input {...allOtherProps} className={inputClass + className} />
  );
}