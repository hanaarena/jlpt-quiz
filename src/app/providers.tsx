"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <NextThemesProvider defaultTheme="light" attribute="class">
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
