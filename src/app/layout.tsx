import type { Metadata } from "next";
import { Brygada_1918, Karla, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const brygada1918 = Brygada_1918({
  variable: "--font-display-raw",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

const karla = Karla({
  variable: "--font-body-raw",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-data-raw",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Terminarz | ChessInCafe",
  description: "Zapisz się na turniej szachowy w kawiarni w Warszawie.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${brygada1918.variable} ${karla.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink font-body">{children}</body>
    </html>
  );
}
