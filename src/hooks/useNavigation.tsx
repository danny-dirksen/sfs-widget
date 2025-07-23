"use client";
import { useEffect, useState } from "react";
import { Content, Navigation } from "@/models/models";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

/** Parse and validate query string params. */
const useValidParams = function (content: Content): Navigation {
  const { channels, languages, resources } = content;

  const params = useSearchParams();

  if (!params)
    return {
      pic: null,
      channel: null,
      language: null,
      resource: null,
    };

  let pic = params.get("p")?.toLowerCase() || null;
  let channel = params.get("c")?.toLowerCase() || null;
  if (!channels.some((c) => c.channelId === channel)) {
    channel = null;
  }

  let language = (channel && params.get("l")?.toLowerCase()) || null;
  if (!languages.some((l) => l.languageId === language)) {
    language = null;
  }

  let resource = (language && params.get("r")?.toLowerCase()) || null;
  if (!resources.some((r) => r.resourceId === resource)) {
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
    if (pic) newParams.set("p", pic);
    if (channel) newParams.set("c", channel);
    if (language) newParams.set("l", language);
    if (resource) newParams.set("r", resource);
    const paramStr = newParams.toString();
    router.push(paramStr.length > 0 ? `/?${paramStr}` : "/");
    _setNavigation(newNav);
  }

  // When any of the params update, propagate that to navigation.
  const { pic, channel, language, resource } = params;
  useEffect(() => {
    _setNavigation({ pic, channel, language, resource });
  }, [pic, channel, language, resource]);

  return { navigation, setNavigation };
}
