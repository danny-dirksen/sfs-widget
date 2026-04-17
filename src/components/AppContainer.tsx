import React from "react";
import localFont from "next/font/local";

const renner = localFont({
  src: [
    {
      path: "../resources/fonts/renner-light.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../resources/fonts/renner-lightitalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../resources/fonts/renner-medium.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../resources/fonts/renner-mediumitalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
});

/**
 * Container for the entire app, with a background and font. This is separate from the layout because the layout is server-rendered and can't use client-side features like state or effects, but we want the font to apply to the entire app including any popups or other client-rendered components.
 * @param param0
 * @returns
 */

export function AppContainer({ children }: { children: React.ReactNode; }) {
  return (
    <div id="app" className={renner.className + " h-full relative bg-sfs-bg "}>
      {children}
    </div>
  );
}
