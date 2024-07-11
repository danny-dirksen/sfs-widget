import { AnchorHTMLAttributes, ButtonHTMLAttributes, DetailedHTMLProps, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

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

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = (props) => {
  const inputClass = 'outline-none border border-2 border-black focus:border-sfs-accent px-2 py-1 w-full ';
  const { className, ...allOtherProps } = props;
  return (
    <input {...allOtherProps} className={inputClass + className} />
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  secondary?: boolean;
}

export const Button: React.FC<ButtonProps> = (props) => {
  const { secondary, className: classExtend, ...otherProps } = props;
  const className = getButtonClass(secondary, classExtend);
  return <button {...otherProps} className={className} />
}

type ButtonAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  secondary?: boolean;
}

export const ButtonAnchor: React.FC<ButtonAnchorProps> = (props) => {
  const { secondary, className: classExtend, ...otherProps } = props;
  const className = getButtonClass(secondary, classExtend);
  return <a {...otherProps} className={className} />
}

/**
 * Returns the appropriate button style based on the secondary prop.
 * @param secondary Set to truthy to use the secondary style.
 * @param className Additional classes to add to the button.
 * @returns 
 */
function getButtonClass(secondary: any, className: string | undefined) {
  const genericClass = (
    'popout font-bold px-4 py-2 disabled:opacity-40 disabled:cursor-default inline-block ' +
    'border border-2 border-sfs-accent enabled:hover:border-sfs-accent-dark focus:border-sfs-accent-dark'
  );
  const colorClass = secondary ? (
    'text-sfs-accent focus:text-sfs-accent-dark ' +
    'enabled:hover:text-sfs-accent-dark '
  ) : (
    'text-white border-sfs-accent ' +
    'bg-sfs-accent enabled:hover:bg-sfs-accent-dark focus:bg-sfs-accent-dark'
  );
  return `${genericClass} ${colorClass} ${className || ''}`;
};