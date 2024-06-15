import { Language, PopupComponent, Resource, ResourceTranslation } from '@/utils/models';
import React from 'react';

export interface PopupInfoLanguageProps {
  data: {
    language: Language;
  }
};

export const PopupInfoLanguage: PopupComponent = (props) => {
  const { autonym, info } = (props as PopupInfoLanguageProps).data.language;
  const data = {
    title: autonym,
    body: info ? info.split('\n\n') : []
  };
  return <PopupInfo data={data} />
}

export interface PopupInfoResourceProps {
  data: {
    translation: ResourceTranslation;
  }
};

export const PopupInfoResource: PopupComponent = (props) => {
  const { translation } = (props as PopupInfoResourceProps).data;
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
      <h1 className='pop-up-header'>{title}</h1>
      {[...body, genericParagraph].map((paragraph, i) => (
        <p key={i} className='pop-up-text'>{paragraph}</p>
      ))}
    </>
  );
}

const genericParagraph = (
  <>
    Thank you for your interest in our music. Using these links, you can learn about
    <a href='https://songsforsaplings.com/resources/' target='_blank' rel='noopener noreferrer'>our other free resources</a>,
    how to <a href='https://songsforsaplings.com/freemusic/' target='_blank' rel='noopener noreferrer'>share this music</a>
    with your friends and church for free, or how to
    <a href='https://songsforsaplings.com/contact/' target='_blank' rel='noopener noreferrer'>get in touch</a>
    with Songs for Saplings.
  </>
);