"use client";

import { useState } from "react";
import { useAnimate } from "framer-motion";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";

import { cn } from "@/lib/utils";
import style from "./page.module.css";

import type { GrammarLevelTypeV2 } from "@/app/data/grammarV2/index";

const LEVEL = {
  n1: "N1",
  n2: "N2",
  n3: "N3",
  n4: "N4",
  n5: "N5",
};

export default function GrammarV2() {
  const [stage, setStage] = useState<"start" | "playing" | "end">("start");
  const [scope, animate] = useAnimate();
  const [currentLevel, setCurrentLevel] = useState<GrammarLevelTypeV2>("n5");

  const handleChangeStage = (_stage: "start" | "playing" | "end") => {
    setStage(_stage);
  };

  return (
    <div className={cn(style.default_bg, "h-screen")}>
      {stage === "start" && (
        <div className={cn("flex flex-col items-center py-8")}>
          <p className={cn("text-2xl bold mb-12", style.title_color)}>
            Select JLPT Level
          </p>
          <div
            ref={scope}
            className="level-circles w-7/12 flex justify-center flex-wrap gap-x-4 gap-y-8"
          >
            {Object.entries(LEVEL).map(([key, value], index) => (
              <div
                key={`level-${key}`}
                className={cn(
                  "rounded-full w-20 h-20 flex items-center justify-center text-3xl",
                  "relative border bold",
                  style.title_color,
                  style.icon_bg,
                  style.icon_border
                )}
                onClick={() => {
                  setCurrentLevel(key as GrammarLevelTypeV2);
                  animate(
                    scope.current.children[index],
                    {
                      scale: [1, 0.6, 22],
                      zIndex: 10,
                    },
                    {
                      duration: 0.5,
                      ease: "circInOut",
                    }
                  );
                  // after animation end
                  setTimeout(() => {
                    handleChangeStage("playing");
                  }, 600);
                }}
              >
                <p className="relative">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {stage === "playing" && (
        <div>
          <Navbar classNames={{ base: "bg-[#fdedd3] py-4" }}>
            <NavbarContent justify="start">
              <NavbarItem>
                <div
                  className={cn(
                    "rounded-full w-20 h-20 flex items-center justify-center text-3xl",
                    "relative border bold",
                    style.title_color,
                    style.icon_bg,
                    style.icon_border
                  )}
                >
                  {currentLevel.toUpperCase()}
                </div>
              </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
              <NavbarItem>1 / 5</NavbarItem>
            </NavbarContent>
          </Navbar>
        </div>
      )}
    </div>
  );
}
