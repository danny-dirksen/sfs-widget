'use client';
import { useState } from 'react';
import { Content, Navigation } from '@/utils/models';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

/** Parse and validate query string params. */
const useValidParams = function (content: Content): Navigation {
  const { channels, languages, resources } = content;

  const params = useSearchParams();
  let pic = params.get('p')?.toLowerCase() || null;
  let channel = params.get('c')?.toLowerCase() || null;
  if (!channels.some(c => c.channelId === channel)) {
    channel = null;
  }

  let language = channel && params.get('l')?.toLowerCase() || null;
  if (!languages.some(l => l.languageId === language)) {
    language = null;
  }

  let resource = language && params.get('r')?.toLowerCase() || null;
  if (!resources.some(r => r.resourceId === resource)) {
    resource = null;
  }

  return { pic, channel, language, resource };
};

export function useNavigation(content: Content) {

  const params = useValidParams(content);
  const [navigation, _setNavigation] = useState<Navigation>(params);
  const router = useRouter();

  function setNavigation(newNav: Navigation) {
    const { pic, channel, language, resource } = newNav;
    const newParams = new URLSearchParams();
    if (pic) newParams.set('p', pic);
    if (channel) newParams.set('c', channel);
    if (language) newParams.set('l', language);
    if (resource) newParams.set('r', resource);
    const paramStr = newParams.toString();
    router.push(paramStr.length > 0 ? `/?${paramStr}` : '/');
    _setNavigation(newNav);
  }

  function back() {
    const { channel, language } = navigation;
    if (language) {
      setNavigation({ ...navigation, resource: null, language: null });
    } else if (channel) {
      setNavigation({ ...navigation, channel: null, resource: null, language: null });
    }
  }

  return { navigation, setNavigation, back };
}
