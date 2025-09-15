// export const dynamic = "force-static";

import type { Metadata } from "next";
import { Providers } from "./providers";
import QRCode from "./components/QRCode";

import "./globals.css";

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
      <body className={`antialiased`}>
        <Providers>
          <QRCode />
          {children}
        </Providers>
      </body>
    </html>
  );
}
