import { Link, Navigation, ResourceTranslation } from "@/utils/models";
import { DropdownOption } from "./DropdownOption";
import { PopupInfoResource } from "@/components/modals/InfoModal";
import { ShareModal } from "../modals/ShareModal";
import { DownloadModal } from "../modals/DownloadModal";
import { Modal } from "../modals/Modal";
import { useState } from "react";

interface ResourceCardProps {
  data: {
    link: Link;
    translation: ResourceTranslation;
    navigation: Navigation;
    selectResource: (resourceId: string) => void;
    selectPartner: (pic: string | null) => void;
  };
}
/** Card for a single option in the language dropdown. */
export function ResourceCard(props: ResourceCardProps) {
  const { link, translation, navigation, selectResource, selectPartner } =
    props.data;
  const { url, resourceId, channelId } = link;
  const { line1, line2 } = translation;

  const [modal, setModal] = useState<"download" | "info" | "share" | null>(
    null,
  );

  function onClick() {
    selectResource(resourceId);
    // Special case for download: open the download dialoge.
    if (channelId === "download") {
      selectResource(resourceId);
      setModal("download");
    }
  }

  function onClickInfo() {
    setModal("info");
  }

  function onClickShare() {
    setModal("share");
  }

  // We don't give the download link right away. We open a popup instead
  // to bring the user through the download process.
  const href = channelId === "download" ? undefined : url;

  return (
    <DropdownOption data={{ onClick, onClickInfo, onClickShare, href }}>
      <div className="h-full flex flex-col justify-center py-2 pl-4 pr-1">
        {line1 ? <div className="widget:text-sm">{line1}</div> : null}
        <div
          className="font-bold text-sfs-accent"
          style={{ fontSize: "1.15rem", lineHeight: "1.1" }}
        >
          {line2}
        </div>
      </div>
      <Modal data={{ onClose: () => setModal(null) }}>
        {modal === "download" ? (
          <DownloadModal data={{ navigation, selectPartner }} />
        ) : modal === "info" ? (
          <PopupInfoResource data={{ translation }} />
        ) : modal === "share" ? (
          <ShareModal />
        ) : null}
      </Modal>
    </DropdownOption>
  );
}
