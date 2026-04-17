import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { AppContainer } from "@/components/AppContainer";

export const metadata: Metadata = {
  title: "Free Resources - Songs for Saplings",
  description: "Access Songs for Saplings resources in any way you want.",
  other: {
    "theme-color": "#2fb257",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      {/* <meta name="theme-color" content="#2fb257"></meta> */}
      <body className="h-full">
        <AppContainer>
          <Suspense>{children}</Suspense>
        </AppContainer>
      </body>
    </html>
  );
}
