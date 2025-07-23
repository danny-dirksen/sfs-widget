import { Content, Navigation } from "@/models/models";
import { DropdownMenu } from "./DropdownMenu";
import { AnalyticsContext } from "@/hooks/useAnalytics";
import { ResourceCard } from "./ResourceCard";
import { DonateDialog } from "./DonateDialog";

interface ResourceSelectProps {
  data: {
    content: Content;
    navigation: Navigation;
    selectResource: (resourceId: string) => void;
    selectPartner: (pic: string | null) => void;
    clickLink: (eventType: string, link: string) => void;
    back: () => void;
    analytics: AnalyticsContext;
  };
}

export function ResourceSelect(props: ResourceSelectProps) {
  const {
    content,
    navigation,
    selectResource,
    selectPartner,
    clickLink,
    back,
  } = props.data;
  const { channel, language } = navigation;
  // Find relevant links and their corresponding data, such as descriptions. above.
  const linkInfo = content.links
    // Only relevant links.
    // If channelId === null, it displays for all channels.
    .filter(
      (l) =>
        (l.channelId === channel || !l.channelId) && l.languageId === language,
    )
    // Find a description of the resource in the correct langauge.
    .map((l) => ({
      link: l,
      translation: content.resourceTranslations.find(
        (t) => t.languageId === l.languageId && t.resourceId === l.resourceId,
      ),
    }))
    // If for some reason, we can't find translation, don't display.
    .filter((info) => info.translation);

  return (
    <DropdownMenu
      data={{ onScreen: !!(navigation.channel && navigation.language), back }}
    >
      {linkInfo.map(({ link, translation }, key) => (
        <ResourceCard
          key={key}
          data={{
            link,
            translation: translation!,
            navigation,
            selectResource,
            selectPartner,
          }}
        />
      ))}
      <DonateDialog data={{ clickLink }} />
    </DropdownMenu>
  );
}
