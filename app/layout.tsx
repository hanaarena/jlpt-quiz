export const dynamic = "force-static";

import { Provider } from "jotai";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Excceed JLPT",
  description: "-。-",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("h-dvh bg-background font-sans antialiased")}>
        <Provider>{children}</Provider>
        <Toaster />
      </body>
    </html>
  );
}
