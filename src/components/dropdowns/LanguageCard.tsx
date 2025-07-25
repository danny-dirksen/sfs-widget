import { Language } from "@/models/content";
import { DropdownOption } from "./DropdownOption";
import { PopupInfoLanguage } from "@/components/modals/InfoModal";
import { ShareModal } from "../modals/ShareModal";
import { useState } from "react";
import { Modal } from "../modals/Modal";

interface LanguageCardProps {
  data: {
    language: Language;
    selectLanguage: (languageId: string) => void;
  };
}

/** Card for a single option in the language dropdown. */
export function LanguageCard(props: LanguageCardProps) {
  const { language, selectLanguage } = props.data;
  const { languageId, autonym } = language;
  const [modal, setModal] = useState<null | "info" | "share">(null);

  function onClick() {
    selectLanguage(languageId);
  }

  function onClickInfo() {
    setModal("info");
  }

  function onClickShare() {
    setModal("share");
  }

  return (
    <DropdownOption
      key={languageId}
      data={{ onClick, onClickInfo, onClickShare }}
    >
      <div className="h-full flex flex-col justify-center text-center text-xl widget:text-sm font-bold">
        {autonym}
      </div>
      <Modal data={{ onClose: () => setModal(null) }}>
        {modal === "info" ? (
          <PopupInfoLanguage data={{ language }} />
        ) : modal === "share" ? (
          <ShareModal />
        ) : null}
      </Modal>
    </DropdownOption>
  );
}
