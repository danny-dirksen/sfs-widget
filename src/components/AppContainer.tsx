import React from "react";
import { renner } from "./App";

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
