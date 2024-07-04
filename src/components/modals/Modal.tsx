'use-client';

import { MouseEventHandler, ReactNode, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ModalContainer } from './ModalContainer';

interface PopupProps {
  children: ReactNode | null;
  data: {
    onClose: () => void;
  };
}

export function Modal(props: PopupProps) {
  const { children, data } = props;
  const { onClose } = data;

  // Keep a delayed version of the state when children becomes null.
  const [zombieChildren, setZombieChildren] = useState<ReactNode | null>(children);
  useEffect(() => {
    if (!children) {
      const timeout = setTimeout(() => setZombieChildren(children), 200);
      return () => clearTimeout(timeout);
    } else {
      setZombieChildren(children);
    }
  }, [children]);

  // Find parent to add the popup to.
  const [ parent, setParent ] = useState<Element | null>(null);
  useEffect(() => {
    setParent(document.getElementById('app'));
  }, []);
  if (!parent) return null;

  const dispChildren = children || zombieChildren; // Updates instantly
  const opacity = (children && zombieChildren) ? '' : 'opacity-0'; // Becomes true later, false sooner.
  const scale = (children && zombieChildren) ? '' : 'scale-90'; // Becomes true later, false sooner.


  // Don't let click events propagate back to the element that opened the popup.
  const onClick: MouseEventHandler = e => e.stopPropagation();
  const intoBody = (
    <div className={`absolute top-0 left-0 w-full h-full transition-opacity bg-black bg-opacity-20 ${opacity}`} onClick={onClick}>
      <div className={`h-full transition-transform ${scale}`}>
        <ModalContainer onClose={onClose}>
          {dispChildren}
        </ModalContainer>
      </div>
    </div>
  );

  return dispChildren ? (
    createPortal(
      intoBody,
      parent,
      'modal'
    )
  ) : null;
}
