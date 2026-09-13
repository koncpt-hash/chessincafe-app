import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Terminarz | ChessInCafe",
  description: "Zapisz się na turniej szachowy w kawiarni w Warszawie.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Zmieniasz fonty tutaj: podmień URL na inny z fonts.google.com (przycisk "Get font" -> "Use on the web" -> skopiuj link @import/href),
            a nazwę rodziny podmień też w globals.css (--font-display / --font-body / --font-mono-data). */}
        <link
          href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Merriweather+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-ink font-body">{children}</body>
    </html>
  );
}
