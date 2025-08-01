import { Language, ResourceTranslation } from "@/models/content";
import React from "react";
import { Header, Anchor, Paragraph } from "@/components/Styles";
import { PopupComponent } from "@/hooks/usePopups";

export interface PopupInfoLanguageProps {
  data: {
    language: Language;
  };
}

export const PopupInfoLanguage: PopupComponent<PopupInfoLanguageProps> = (
  props,
) => {
  const { autonym, info } = props.data.language;
  const data = {
    title: `SONGS FOR SAPLINGS - ${autonym}`,
    body: info ? info.split("\n\n") : [],
  };
  return <PopupInfo data={data} />;
};

export interface PopupInfoResourceProps {
  data: {
    translation: ResourceTranslation;
  };
}

export const PopupInfoResource: PopupComponent<PopupInfoResourceProps> = (
  props,
) => {
  const { translation } = props.data;
  const { info, line1, line2 } = translation;
  const data = {
    title: line1 ? `${line1} - ${line2}` : line2,
    body: info ? info.split("\n\n") : [],
  };
  return <PopupInfo data={data} />;
};

interface PopupInfoProps {
  data: {
    title: React.ReactNode;
    body: React.ReactNode[];
  };
}

function PopupInfo(props: PopupInfoProps) {
  const { title, body } = props.data;
  return (
    <>
      <Header>{title}</Header>
      {[...body, genericParagraph].map((paragraph, i) => (
        <Paragraph key={i}>{paragraph}</Paragraph>
      ))}
    </>
  );
}

const genericParagraph = (
  <>
    Thank you for your interest in our music. Using these links, you can learn
    about{" "}
    <Anchor href="https://store.songsforsaplings.com/collections/resources">
      our other free resources
    </Anchor>
    , how to{" "}
    <Anchor href="https://www.songsforsaplings.com/listen/">
      share this music
    </Anchor>{" "}
    with your friends and church for free, or how to{" "}
    <Anchor href="https://share.hsforms.com/1geeaoz7KRDO6zeyklqFY8wcdo1h">
      get in touch
    </Anchor>{" "}
    with Songs for Saplings.
  </>
);
