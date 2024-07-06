interface ShareButtonProps {
  data: {
    name: string;
    img: JSX.Element;
    href?: string;
    onClick?: () => void;
  }
};

export function ShareButton(props: ShareButtonProps) {
  const { name, img, href, onClick } = props.data;
  return (
    <a className='popout select-none hover:bg-sfs-darken p-1 size-20 text-center flex flex-col justify-center items-center gap-1' href={href} target='_blank' rel='noopener noreferrer' onClick={onClick}>
      <div className='size-8'>
        {img}
      </div>
      <div className=''>{name}</div>
    </a>
  );
}