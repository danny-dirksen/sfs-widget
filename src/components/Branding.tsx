import React from 'react'
import Image from 'next/image'
import { useAnalytics } from '@/hooks/useAnalytics';
import { PartnerInfo } from '@/utils/models';
import sfsLogo from '@/resources/ui/sfsLogoWhite.svg';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

interface BrandingLayerProps {
  data: {
    partner: PartnerInfo | null;
  }
};

export function BrandingLayer(props: BrandingLayerProps) {
  const { partner } = props.data;
  const { track } = useAnalytics();
  
  const partnerBranding = partner ? (
    <Branding data={{
      name: partner.name,
      href: partner.url,
      image: `/partnerbranding/${partner.pic}.png`,
      onClick: () => track('partnerWebsite', { partner: partner.pic })
    }} />
  ) : null;
  return (
    <div className='absolute top-0 left-0 h-full w-fit flex flex-col justify-between'>
      {partnerBranding}
      <Branding data={{
        name: 'Songs for Saplings',
        image: sfsLogo,
        href: 'https://songsforsaplings.com/',
        onClick: () => track('website', {})
      }}/>
    </div>
  );
}

interface BrandingProps {
  data: {
    name: string;
    image: StaticImport | string | null;
    href: string;
    onClick: () => void;
  }
};

export function Branding(props: BrandingProps) {
  const { name, image, href, onClick } = props.data;

  return (
    <a className='branding-container'
        href={href} target='_blank' rel='noopener noreferrer' onClick={onClick} >
      {image ? 
        <Image className='branding' alt={name} src={image} priority={typeof image !== 'string'} /> :
        <div className='branding'>{name}</div>
      }
    </a>
  )
}