import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "./providers";

import "./globals.css";

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const japFont = localFont({
  src: "./fonts/MPLUSRounded1c-Medium.ttf",
  variable: "--font-jpn",
  weight: "500",
});

export const metadata: Metadata = {
  title: "Exceed JLPT ~ !",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${japFont.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
