"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";
import { store } from "./store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <NextThemesProvider defaultTheme="light" attribute="class">
        <Provider store={store}>{children}</Provider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
