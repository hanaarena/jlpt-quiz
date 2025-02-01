import type { Metadata } from "next";
// import localFont from "next/font/local";
import { Providers } from "./providers";
import { M_PLUS_Rounded_1c } from "next/font/google";

import "./globals.css";

// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });
const inter = M_PLUS_Rounded_1c({
  display: "swap",
  weight: ["300", "500", "900"],
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
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
