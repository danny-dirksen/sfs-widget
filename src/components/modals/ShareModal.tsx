import React from "react";
import Image from "next/image";
import { Channel, PopupComponent } from "@/utils/models";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Header, Paragraph } from "@/components/Styles";
import { ShareButton } from "./ShareButton";

const copyImg = (
  <Image src={require("@/resources/share-logos/copy.png")} alt="Copy" />
);
const emailImg = (
  <Image src={require("@/resources/share-logos/email.png")} alt="Email" />
);
const facebookImg = (
  <Image src={require("@/resources/share-logos/facebook.png")} alt="Facebook" />
);
const instagramImg = (
  <Image
    src={require("@/resources/share-logos/instagram.png")}
    alt="Instagram"
  />
);
const xImg = <Image src={require("@/resources/share-logos/x.png")} alt="X" />;
const messageImg = (
  <Image src={require("@/resources/share-logos/message.png")} alt="Message" />
);

export function ShareModal() {
  const { track } = useAnalytics();
  const [copied, setCopied] = React.useState(false);
  const { url, title, image, header, hashtag, cc } = getGenericText();

  function onShare(name: string) {
    track("share", { platform: name });
  }

  function onCopy() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShare("copy");
  }

  return (
    <>
      <Header>SHARE WITH A FRIEND!</Header>
      <Paragraph>
        Word-of-mouth is how we grow. You can make an impact by spreading this
        resource on your favorite platforms:
      </Paragraph>
      <div className="flex flex-row justify-center">
        <div className="flex flex-wrap flex-row justify-center">
          <ShareButton
            data={{
              name: "Email",
              img: emailImg,
              onClick: () => onShare("email"),
              href: `mailto:?subject=${title}&body=${header}:%20${url}`,
            }}
          />
          <ShareButton
            data={{
              name: "Facebook",
              img: facebookImg,
              onClick: () => onShare("facebook"),
              href: `https://www.facebook.com/dialog/share?app_id=145634995501895&display=popup&href=${url}`,
            }}
          />
          <ShareButton
            data={{
              name: "Instagram",
              img: instagramImg,
              onClick: () => onShare("instagram"),
              href: `https://www.instagram.com/songs_for_saplings/`,
            }}
          />
          <ShareButton
            data={{
              name: "X (Twitter)",
              img: xImg,
              onClick: () => onShare("x"),
              href: `https://x.com/share?url=${url}&text=${title}&hashtags=${hashtag}`,
            }}
          />
          <ShareButton
            data={{
              name: "Message",
              img: messageImg,
              onClick: () => onShare("message"),
              href: `sms:?&body=${header}%0D%0A${url}`,
            }}
          />
          <ShareButton
            data={{
              name: copied ? "Copied!" : "Copy",
              img: copyImg,
              onClick: onCopy,
            }}
          />
        </div>
      </div>
      <small>
        <center>
          <Paragraph>Message and data rates may apply.</Paragraph>
        </center>
      </small>
    </>
  );
}

function getGenericText() {
  const genericText: Record<string, string> = {
    url: window.location.href,
    title: "Free Music and More from Songs for Saplings",
    image:
      "https://songsforsaplings.com/workspace/uploads/images/saplings-music-banner.jpg",
    header: `Hey, thought you would enjoy this great kid's music that teaches the Bible!`,
    hashtag: "Songs4Saplings",
    cc: "music-widget@songsforsaplings.com",
  };
  // Encode all strings to make them friendly to urls.
  Object.entries(genericText).forEach(
    ([key, val]) => (genericText[key] = encodeURIComponent(val)),
  );
  const { url, title, image, header, hashtag, cc } = genericText;
  return { url, title, image, header, hashtag, cc };
}
