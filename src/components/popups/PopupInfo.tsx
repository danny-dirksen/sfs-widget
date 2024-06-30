import { Language, PopupComponent, Resource, ResourceTranslation } from '@/utils/models';
import React from 'react';
import { Header, Anchor, Paragraph } from '@/components/Styles';

export interface PopupInfoLanguageProps {
  data: {
    language: Language;
  }
};

export const PopupInfoLanguage: PopupComponent<PopupInfoLanguageProps> = (props) => {
  const { autonym, info } = props.data.language;
  const data = {
    title: `SONGS FOR SAPLINGS - ${autonym}`,
    body: info ? info.split('\n\n') : []
  };
  return <PopupInfo data={data} />
}

export interface PopupInfoResourceProps {
  data: {
    translation: ResourceTranslation;
  }
};

export const PopupInfoResource: PopupComponent<PopupInfoResourceProps> = (props) => {
  const { translation } = props.data;
  const { info, line1, line2 } = translation;
  const data = {
    title: line1 ? `${line1} - ${line2}` : line2,
    body: info ? info.split('\n\n') : []
  };
  return <PopupInfo data={data} />
}

interface PopupInfoProps {
  data: {
    title: React.ReactNode;
    body: React.ReactNode[];
  }
}

function PopupInfo(props: PopupInfoProps) {
  const { title, body } = props.data;
  return (
    <>
      <Header>{title}</Header>
      {[...body, genericParagraph].map((paragraph, i) => (
        <Paragraph key={i} >{paragraph}</Paragraph>
      ))}
    </>
  );
}

const genericParagraph = (
  <>
    Thank you for your interest in our music. Using these links, you can learn
    about <Anchor href='https://songsforsaplings.com/resources/'>our other free resources</Anchor>,
    how to <Anchor href='https://songsforsaplings.com/freemusic/'>share this music</Anchor> with
    your friends and church for free, or how
    to <Anchor href='https://songsforsaplings.com/contact/'>get in touch</Anchor> with
    Songs for Saplings.
  </>
);