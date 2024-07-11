import { Content, Navigation } from '@/utils/models';
import { DropdownMenu } from './DropdownMenu';
import { DropdownOption } from './DropdownOption';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

import amazonprimeBanner from '@/resources/channel-banners/amazonprime.png';
import applemusicBanner from '@/resources/channel-banners/applemusic.svg';
import compactdiscBanner from '@/resources/channel-banners/compactdisc.svg';
import downloadBanner from '@/resources/channel-banners/download.svg';
import spotifyBanner from '@/resources/channel-banners/spotify.svg';
import usbdriveBanner from '@/resources/channel-banners/usbdrive.svg';
import youtubeBanner from '@/resources/channel-banners/youtube.svg';
import { AnalyticsContext } from '@/hooks/useAnalytics';
import { ChannelCard } from './ChannelCard';
import { DonateDialog } from './DonateDialog';

interface ChannelSelectProps {
  data: {
    content: Content;
    navigation: Navigation;
    analytics: AnalyticsContext;
    selectChannel: (channelId: string) => void;
    clickLink: (eventType: string, link: string) => void;
    back: () => void;
  }
};

export const banners: Record<string, StaticImport> = {
  'spotify': spotifyBanner,
  'youtube': youtubeBanner,
  'amazonprime': amazonprimeBanner,
  'applemusic': applemusicBanner,
  'download': downloadBanner,
  'compactdisc': compactdiscBanner,
  'usbdrive': usbdriveBanner,
};

export function ChannelSelect(props: ChannelSelectProps) {
  const { content, navigation, clickLink, selectChannel, back } = props.data;
  const { channels } = content;
  
  const orderCdsLink = 'https://store.songsforsaplings.com/collections/music';
  function orderCds() {
    clickLink('orderCd', orderCdsLink);
  }


  return (
    <DropdownMenu data={{ onScreen: !navigation.channel }}>
      { channels.map(channel => (
        <ChannelCard key={channel.channelId} data={{ channel, selectChannel }} />
      )) }
      {/* There is a link card at the bottom to order cds. */}
      <DropdownOption data={{ href: orderCdsLink, onClick: () => orderCds }}>
        <div className='flex justify-center items-center p-4 widget:p-2 text-2xl widget:text-sm font-bold uppercase'>
          ORDER CDS
        </div>
      </DropdownOption>
      <DonateDialog data={{ clickLink }} />
    </DropdownMenu>
  );
}