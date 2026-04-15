"use client";
import { ErrorPage } from "../components/ErrorPage";
import "./globals.css";

export default function GlobalError(_: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <ErrorPage data={{ message: `It looks like something went wrong.` }} />
      </body>
    </html>
  );
}
