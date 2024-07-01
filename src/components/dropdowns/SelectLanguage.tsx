import { Content, Language, Navigation, Popup } from '@/utils/models';
import { DropdownMenu } from './DropdownMenu';
import { DropdownOption } from './DropdownOption';
import { PopupInfoLanguage, PopupInfoLanguageProps } from '@/components/popups/PopupInfo';
import { PopupShare } from '../popups/PopupShare';
import { AnalyticsContext } from '@/hooks/useAnalytics';

interface SelectLanguageProps {
  data: {
    content: Content;
    navigation: Navigation;
    selectLanguage: (languageId: string) => void;
    openPopup: (newPopup: Popup<any>) => void;
    back: () => void;
    analytics: AnalyticsContext;
  }
};

export function SelectLanguage(props: SelectLanguageProps) {
  const { content, navigation, selectLanguage, openPopup, back, analytics } = props.data;
  const { channel } = navigation;
  // Create cards for languages that correspond to the translations above.
  const languages = content.languages.filter(
    l => content.links.some(link => link.languageId === l.languageId && link.channelId === channel)
  );

  return (
    <DropdownMenu data={{ onScreen: !(!navigation.channel || navigation.language), back }}>
      { languages.map((language, key) => (
        <LanguageCard key={key} data={{ language, selectLanguage, openPopup }} />
      )) }
    </DropdownMenu>
  );
}

interface LanguageCardProps {
  data: {
    language: Language;
    selectLanguage: (languageId: string) => void;
    openPopup: (newPopup: Popup<any>) => void;
  };
};

/** Card for a single option in the language dropdown. */
function LanguageCard(props: LanguageCardProps) {
  const { language, selectLanguage, openPopup } = props.data;
  const { languageId, autonym } = language;
  
  function onClick() {
    selectLanguage(languageId);
  }

  function onClickInfo() {
    const newPopup: Popup<PopupInfoLanguageProps> = {
      name: 'infoLanguage',
      Component: PopupInfoLanguage,
      props: { data: { language } }
    };
    openPopup(newPopup);
  }

  function onClickShare() {
    const newPopup: Popup<null> = {
      name: 'shareLanguage',
      Component: PopupShare,
      props: null
    };
    openPopup(newPopup);
  }

  return (
    <DropdownOption key={languageId} data={{ onClick, onClickInfo, onClickShare }}>
      <div className='h-full flex flex-col justify-center text-center text-xl font-bold'>
        { autonym }
      </div>
    </DropdownOption>
  )
}