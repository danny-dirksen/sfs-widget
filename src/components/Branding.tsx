import React, { useEffect, useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import Image from "next/image";
import { PartnerInfo } from "@/models/partners";

interface BrandingLayerProps {
  data: {
    partner: PartnerInfo | null;
  };
}

export function BrandingLayer(props: BrandingLayerProps) {
  const { partner } = props.data;
  const { track } = useAnalytics();

  const partnerBranding = partner ? (
    <Branding
      data={{
        name: partner.name,
        href: partner.url,
        image: `/partnerbranding/${partner.pic}.png`,
        onClick: () => track("partnerWebsite", { partner: partner.pic }),
      }}
    />
  ) : null;
  return (
    <div
      className={
        "absolute top-0 flex left-0 justify-between font-white h-fit " +
        "hz:h-full w-full hz:w-fit flex-row hz:flex-col"
      }
    >
      {partnerBranding}
      <Branding
        data={{
          name: "Songs for Saplings",
          image: "/branding/sfsLogoWhite.svg",
          href: "https://songsforsaplings.com/",
          onClick: () => track("website", {}),
        }}
      />
    </div>
  );
}

interface BrandingProps {
  data: {
    name: string;
    image: string | null;
    href: string;
    onClick: () => void;
  };
}

export function Branding(props: BrandingProps) {
  const { name, image, href, onClick } = props.data;

  // Make a fake request just to find out if we need to display backup text.
  const [imgErr, setImgErr] = useState(false);
  useEffect(() => {
    if (!image) return;
    setImgErr(false);
    fetch(image).then((resp) => {
      if (!resp.ok) setImgErr(true);
    });
  }, [image]);

  return (
    <a
      className="branding-container text-white relative h-12 widget:h-7 w-20"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
    >
      {!imgErr && image ? (
        <Image
          fill
          className="p-2 widget:p-1 w-auto object-contain object-left"
          alt={name}
          src={image}
        />
      ) : (
        // Backup text.
        <div className="m-1 border border-white text-center px-2 py-1 uppercase w-min leading-4">
          {name}
        </div>
      )}
    </a>
  );
}
