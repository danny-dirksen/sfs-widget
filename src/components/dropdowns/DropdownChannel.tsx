import { Content, Navigation } from '@/utils/models';
import { DropdownMenu, DropdownOption } from './Dropdown';
import { MutableRefObject, ReactNode, use, useEffect, useRef, useState } from 'react';
import { MIMEType } from 'util';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

import amazonprimeBanner from '@/resources/channel-banners/amazonprime.png'
import applemusicBanner from '@/resources/channel-banners/applemusic.svg'
import compactdiscBanner from '@/resources/channel-banners/compactdisc.svg'
import downloadBanner from '@/resources/channel-banners/download.svg'
import spotifyBanner from '@/resources/channel-banners/spotify.svg'
import usbdriveBanner from '@/resources/channel-banners/usbdrive.svg'
import youtubeBanner from '@/resources/channel-banners/youtube.svg'

interface DropdownChannelProps {
  data: {
    content: Content;
    navigation: Navigation;
    selectChannel: (channelId: string) => void;
    back: () => void;
  }
};

const banners: Record<string, StaticImport> = {
  'spotify': spotifyBanner,
  'youtube': youtubeBanner,
  'amazonprime': amazonprimeBanner,
  'applemusic': applemusicBanner,
  'download': downloadBanner,
  'compactdisc': compactdiscBanner,
  'usbdrive': usbdriveBanner,
};

export function DropdownChannel(props: DropdownChannelProps) {
  const { content, navigation, selectChannel, back } = props.data;
  const { channels } = content;

  return (
    <DropdownMenu data={{ onScreen: !navigation.channel }}>
      { channels.map(ch => {
        const { channelId, name } = ch;
        const onClick = () => selectChannel(channelId)

        const src = banners[channelId];
        const inner = src ? (
          <Image className='h-10 w-fit' src={src} alt={name} />
        ) : (
          name
        );

        return (
          <DropdownOption key={channelId} data={{ onClick }}>
            <div className='flex justify-center items-center px-4 py-4'>
              {inner}
            </div>
          </DropdownOption>
        )
      }) }
    </DropdownMenu>
  );
}