import { Content, Language, Link, Navigation, Popup, ResourceTranslation } from '@/utils/models';
import { DropdownMenu } from './DropdownMenu';
import { DropdownOption } from './DropdownOption';
import { PopupInfoResource, PopupInfoResourceProps } from '@/components/popups/PopupInfo';
import { PopupShare } from '../popups/PopupShare';
import { PopupDownload, PopupDownloadProps } from '../popups/PopupDownload';
import { AnalyticsContext } from '@/hooks/useAnalytics';

interface SelectResourceProps {
  data: {
    content: Content;
    navigation: Navigation;
    selectResource: (resourceId: string) => void;
    openPopup: (newPopup: Popup<any>) => void;
    back: () => void;
    analytics: AnalyticsContext;
  }
};

export function SelectResource(props: SelectResourceProps) {
  const { content, navigation, selectResource, openPopup, back } = props.data;
  const { channel, language, pic } = navigation;
  // Find relevant links and their corresponding data, such as descriptions. above.
  const linkInfo = content.links.filter( // Only relevant links.
    // If channelId === null, it displays for all channels.
    l => (l.channelId === channel || !l.channelId) && l.languageId === language
  ).map( // Find a description of the resource in the correct langauge.
    l => ({
      link: l,
      translation: content.resourceTranslations.find(
        t => t.languageId === l.languageId && t.resourceId === l.resourceId
      )
    })
  ).filter( // If for some reason, we can't find translation, don't display.
    info => info.translation
  );

  return (
    <DropdownMenu data={{ onScreen: !!(navigation.channel && navigation.language), back }}>
      { linkInfo.map(({ link, translation }, key) => (
        <ResourceCard key={key} data={{ link, translation: translation!, navigation, selectResource, openPopup }} />
      )) }
    </DropdownMenu>
  );
}

interface ResourceCardProps {
  data: {
    link: Link;
    translation: ResourceTranslation;
    navigation: Navigation
    selectResource: (resourceId: string) => void;
    openPopup: (newPopup: Popup<any>) => void;
  };
};



/** Card for a single option in the language dropdown. */
function ResourceCard(props: ResourceCardProps) {
  const { link, translation, navigation, selectResource, openPopup } = props.data;
  const { url, resourceId, channelId } = link;
  const { line1, line2 } = translation;
  
  function onClick() {
    selectResource(resourceId);
    // Special case for download: open the download dialoge.
    if (channelId === 'download') {
      const newPopup: Popup<PopupDownloadProps> = {
        name: 'downloadResource',
        Component: PopupDownload,
        props: {
          data: {
            navigation: {
              ...navigation,
              resource: resourceId
            }
          }
        }
      };
      openPopup(newPopup);
    }
  }

  function onClickInfo() {
    const newPopup: Popup<PopupInfoResourceProps> = {
      name: 'infoResource',
      Component: PopupInfoResource,
      props: { data: { translation } }
    };
    openPopup(newPopup);
  }

  function onClickShare() {
    const newPopup: Popup<null> = {
      name: 'shareResource',
      Component: PopupShare,
      props: null
    };
    openPopup(newPopup);
  }

  // We don't give the download link right away. We open a popup instead
  // to bring the user through the download process.
  const href = (channelId === 'download') ? undefined : url;

  return (
    <DropdownOption data={{ onClick, onClickInfo, onClickShare, href }}>
      <div className='h-full flex flex-col justify-center py-2 pl-4 pr-1'>
        { line1 ? <div className=''>{line1}</div> : null }
        <div className='font-bold text-sfs-accent' style={{ fontSize: '1.15rem', lineHeight: '1.1' }}>{line2}</div>
      </div>
    </DropdownOption>
  )
}