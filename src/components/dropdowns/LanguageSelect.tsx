import { Content, Navigation } from "@/models/models";
import { DropdownMenu } from "./DropdownMenu";
import { AnalyticsContext } from "@/hooks/useAnalytics";
import { LanguageCard } from "./LanguageCard";
import { DonateDialog } from "./DonateDialog";

interface LanguageSelectProps {
  data: {
    content: Content;
    navigation: Navigation;
    selectLanguage: (languageId: string) => void;
    clickLink: (eventType: string, link: string) => void;
    back: () => void;
    analytics: AnalyticsContext;
  };
}

export function LanguageSelect(props: LanguageSelectProps) {
  const { content, navigation, selectLanguage, clickLink, back } = props.data;
  const { channel } = navigation;
  // Create cards for languages that correspond to the translations above.
  const languages = content.languages.filter((l) =>
    content.links.some(
      (link) => link.languageId === l.languageId && link.channelId === channel,
    ),
  );

  return (
    <DropdownMenu
      data={{ onScreen: !(!navigation.channel || navigation.language), back }}
    >
      {languages.map((language, key) => (
        <LanguageCard key={key} data={{ language, selectLanguage }} />
      ))}
      <DonateDialog data={{ clickLink }} />
    </DropdownMenu>
  );
}
