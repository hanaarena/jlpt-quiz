// export const dynamic = "force-static";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { M_PLUS_Rounded_1c } from "next/font/google";
import { Providers } from "./providers";

import "./globals.css";

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});
const inter = M_PLUS_Rounded_1c({
  display: "swap",
  weight: ["300", "500", "900"],
  subsets: ["latin"],
  variable: "--font-jpn",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        {/* <link
          href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;500;900&display=swap"
          rel="stylesheet"
        /> */}
      </head>
      <body className={`antialiased ${inter.variable} ${geistMono.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
