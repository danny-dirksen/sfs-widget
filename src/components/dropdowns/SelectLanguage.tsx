import { Content, Navigation } from '@/utils/models';
import { DropdownMenu } from './DropdownMenu';
import { AnalyticsContext } from '@/hooks/useAnalytics';
import { SelectLanguageCard } from './SelectLanguageCard';

interface SelectLanguageProps {
  data: {
    content: Content;
    navigation: Navigation;
    selectLanguage: (languageId: string) => void;
    back: () => void;
    analytics: AnalyticsContext;
  }
};

export function SelectLanguage(props: SelectLanguageProps) {
  const { content, navigation, selectLanguage, back, analytics } = props.data;
  const { channel } = navigation;
  // Create cards for languages that correspond to the translations above.
  const languages = content.languages.filter(
    l => content.links.some(link => link.languageId === l.languageId && link.channelId === channel)
  );

  return (
    <DropdownMenu data={{ onScreen: !(!navigation.channel || navigation.language), back }}>
      { languages.map((language, key) => (
        <SelectLanguageCard key={key} data={{ language, selectLanguage }} />
      )) }
    </DropdownMenu>
  );
}