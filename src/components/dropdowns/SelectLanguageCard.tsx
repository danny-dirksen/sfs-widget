import { Language } from '@/utils/models';
import { DropdownOption } from './DropdownOption';
import { PopupInfoLanguage, PopupInfoLanguageProps } from '@/components/modals/PopupInfo';
import { PopupShare } from '../modals/PopupShare';
import { ReactNode, useState } from 'react';
import { Modal } from '../modals/Modal';

interface SelectLanguageCardProps {
  data: {
    language: Language;
    selectLanguage: (languageId: string) => void;
  };
}
;
/** Card for a single option in the language dropdown. */
export function SelectLanguageCard(props: SelectLanguageCardProps) {
  const { language, selectLanguage } = props.data;
  const { languageId, autonym } = language;
  const [ modal, setModal ] = useState<ReactNode | null>(null);

  function onClick() {
    selectLanguage(languageId);
  }

  function onClickInfo() {
    setModal(<PopupInfoLanguage data={{ language }} />);
  }

  function onClickShare() {
    setModal(<PopupShare/>);
  }

  return (
    <DropdownOption key={languageId} data={{ onClick, onClickInfo, onClickShare }}>
      <div className='h-full flex flex-col justify-center text-center text-xl widget:text-sm font-bold'>
        {autonym}
      </div>
      <Modal data={{ onClose: () => setModal(null)}}>
        {modal}
      </Modal>
    </DropdownOption>
  );
}