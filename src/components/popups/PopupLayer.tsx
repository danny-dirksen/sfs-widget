import x from '@/resources/ui/x.svg'
import { Content, Navigation } from '@/utils/models';
import { Popup } from '@/utils/models';
import Image from 'next/image';

interface PopupLayerProps {
  data: {
    popups: Popup<any>[];
    onClose: (name: string) => void;
  },
};

export function PopupLayer(props: PopupLayerProps) {
  const { popups, onClose } = props.data;

  // Don't display if there are none.
  const visible = popups.length > 0;
  if (!visible) return <></>;
  
  return (
    <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-50'>
      {popups.map(({name, Component, props}) => (
        <PopupContainer key={name} onCloseMe={() => onClose(name)}>
          <Component {...props}></Component>
        </PopupContainer>
      ))}
    </div>
  );
}

interface PopupContainerProps {
  children: React.ReactNode;
  onCloseMe: () => void;
};

function PopupContainer(props: PopupContainerProps) {
  const { children, onCloseMe } = props;
  return (
    <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center p-2 md:p-8 overflow-hidden'>
      <div className='w-full max-w-2xl min-h-30 h-fit max-h-full overflow-y-scroll bg-white text-black'>
        <div className='text-right'>
          <Image className='size-8 inline-block p-2 clickable' alt='X' src={x} onClick={onCloseMe} />
        </div>
        <div className='p-4 py-0 md:px-8 md:pb-4'>
          {children}
        </div>
      </div>
    </div>
  );
}