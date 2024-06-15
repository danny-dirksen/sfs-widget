import x from '../resources/ui/x.svg'
import { Content, Navigation } from '@/utils/models';
import { Popup } from '@/utils/models';

interface PopupLayerProps {
  data: {
    popups: Popup[];
    onClose: (name: string) => void;
  },
};

export function PopupLayer(props: PopupLayerProps) {
  const { popups, onClose } = props.data;

  // Don't display if there are none.
  const visible = popups.length > 0;
  if (!visible) return <></>;
  
  return (
    <div className='pop-up-screen'>
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
    <div className='pop-up-container'>
      <div className='x-container'>
        <img className='x' alt='X' src={x} onClick={onCloseMe} />
      </div>
      <div className='pop-up-content'>
        {children}
      </div>
    </div>
  );
}