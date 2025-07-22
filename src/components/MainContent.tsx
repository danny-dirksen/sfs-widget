import React from "react";
import { useNavigation } from "@/hooks/useNavigation";
import { Content } from "@/utils/models";
import { InstructionsPane } from "./InstructionsPane";
import { DropdownPane } from "./DropdownPane";
import { AnalyticsContext } from "@/hooks/useAnalytics";

interface MainContentProps {
  data: {
    content: Content;
    analytics: AnalyticsContext;
  };
}

export function MainContent(props: MainContentProps): JSX.Element {
  const { content, analytics } = props.data;
  const { navigation, setNavigation } = useNavigation(content);
  const { channel, language } = navigation;

  const pageNum = !channel ? 1 : !language ? 2 : 3;

  return (
    <main className="h-full flex flex-col hz:flex-row items-stretch">
      <InstructionsPane data={{ content, navigation }} />
      <DropdownPane
        data={{ content, navigation, analytics, setNavigation, pageNum }}
      />
    </main>
  );
}
