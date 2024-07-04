import { Link, Navigation, Popup, ResourceTranslation } from '@/utils/models';
import { DropdownOption } from './DropdownOption';
import { PopupInfoResource, PopupInfoResourceProps } from '@/components/modals/PopupInfo';
import { PopupShare } from '../modals/PopupShare';
import { PopupDownload, PopupDownloadProps } from '../modals/PopupDownload';
import { Modal } from '../modals/Modal';
import { ReactNode, useState } from 'react';

interface SelectResourceCardProps {
  data: {
    link: Link;
    translation: ResourceTranslation;
    navigation: Navigation;
    selectResource: (resourceId: string) => void;
  };
}
;
/** Card for a single option in the language dropdown. */
export function SelectResourceCard(props: SelectResourceCardProps) {
  const { link, translation, navigation, selectResource } = props.data;
  const { url, resourceId, channelId } = link;
  const { line1, line2 } = translation;
  
  const [ modal, setModal ] = useState<ReactNode | null>(null);

  function onClick() {
    selectResource(resourceId);
    // Special case for download: open the download dialoge.
    if (channelId === 'download') {
      const newNav = {
        ...navigation,
        resource: resourceId
      };
      setModal(<PopupDownload data={{ navigation: newNav }} />);
    }
  }

  function onClickInfo() {
    setModal(<PopupInfoResource data={{ translation}} />);
  }

  function onClickShare() {
    setModal(<PopupShare />);
  }

  // We don't give the download link right away. We open a popup instead
  // to bring the user through the download process.
  const href = (channelId === 'download') ? undefined : url;

  return (
    <DropdownOption data={{ onClick, onClickInfo, onClickShare, href }}>
      <div className='h-full flex flex-col justify-center py-2 pl-4 pr-1'>
        {line1 ? <div className='widget:text-sm'>{line1}</div> : null}
        <div className='font-bold text-sfs-accent' style={{ fontSize: '1.15rem', lineHeight: '1.1' }}>{line2}</div>
      </div>
      <Modal data={{ onClose: () => setModal(null)}}>
        {modal}
      </Modal>
    </DropdownOption>
  );
}
