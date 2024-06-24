import React from 'react'
import Image from 'next/image'
import { StaticImageData } from 'next/image';
import { Channel, PopupComponent } from '@/utils/models';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Header, Paragraph } from '@/components/BasicStyles';

const copyImg = <Image src={require('@/resources/share-logos/copy.png')} alt='Copy' />
const emailImg = <Image src={require('@/resources/share-logos/email.png')} alt='Email' />
const facebookImg = <Image src={require('@/resources/share-logos/facebook.png')} alt='Facebook' />
const instagramImg = <Image src={require('@/resources/share-logos/instagram.png')} alt='Instagram' />
const twitterImg = <Image src={require('@/resources/share-logos/twitter.png')} alt='Twitter' />
const messageImg = <Image src={require('@/resources/share-logos/message.png')} alt='Message' />

export const PopupShare: PopupComponent<null> = () => {
  const { track } = useAnalytics();
  const [ copied, setCopied ] = React.useState(false);
  const { url, title, image, header, hashtag, cc } = getGenericText();

  function onShare(name: string) {
    track('share', { platform: name})
  }

  function onCopy() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShare('copy');
  }

  return (
    <>
      <Header>SHARE WITH A FRIEND!</Header>
      <Paragraph>
        Word-of-mouth is how we grow. You can make an impact by spreading this resource on your favorite platforms:
      </Paragraph>
      <div className='flex flex-wrap flex-row justify-center p-8'>
        <ShareButton data={{
          name: 'Email',
          img: emailImg,
          onClick: () => onShare('email'),
          href: `mailto:?Subject=${title}&cc=${cc}&Body=${header}%0D%0A%0D%0A${url}`
        }} />
        <ShareButton data={{
          name: 'Facebook',
          img: facebookImg,
          onClick: () => onShare('facebook'),
          href: `http://www.facebook.com/sharer.php?u=${url}`
        }} />
        <ShareButton data={{
          name: 'Instagram',
          img: instagramImg,
          onClick: () => onShare('instagram'),
          href: `https://www.instagram.com/songs_for_saplings/`
        }} />
        <ShareButton data={{
          name: 'Twitter',
          img: twitterImg,
          onClick: () => onShare('twitter'),
          href: `https://twitter.com/share?url=${url}&text=${title}&hashtags=${hashtag}`
        }} />
        <ShareButton data={{
          name: 'Message',
          img: messageImg,
          onClick: () => onShare('message'),
          href: `sms:?&body=${header}%0D%0A${url}`
        }} />
        <ShareButton data={{
          name: copied ? 'Copied!' : 'Copy',
          img: copyImg,
          onClick: onCopy
        }} />
      </div>
      <Paragraph><small><center>Message and data rates may apply.</center></small></Paragraph>
    </>
  );
}

interface ShareButtonProps {
  data: {
    name: string;
    img: JSX.Element;
    href?: string;
    onClick?: () => void;
  }
};

function ShareButton(props: ShareButtonProps) {
  const { name, img, href, onClick } = props.data;
  return (
    <a className='clickable p-1 size-20 text-center flex flex-col justify-center items-center gap-1' href={href} target='_blank' rel='noopener noreferrer' onClick={onClick}>
      <div className='size-8'>
        {img}
      </div>
      <div className='tracking-normal'>{name}</div>
    </a>
  );
}

function getGenericText() {
  const genericText: Record<string, string> = {
    url: window.location.href,
    title: 'Free Music and More from Songs for Saplings',
    image: 'https://songsforsaplings.com/workspace/uploads/images/saplings-music-banner.jpg',
    header: `Hey, thought you would enjoy this great kid's music that teaches the Bible!`,
    hashtag: 'Songs4Saplings',
    cc: 'music-widget@songsforsaplings.com',
  }
  // Encode all strings to make them friendly to urls.
  Object.entries(genericText).forEach(([key, val]) => genericText[key] = encodeURIComponent(val));
  const { url, title, image, header, hashtag, cc } = genericText;
  return { url, title, image, header, hashtag, cc };
}