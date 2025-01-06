import { cn } from "@nextui-org/react";
import { GrammarLevelTypeV2 } from "../data/grammarV2";

import style from "./page.module.css";
import { useAnimate } from "framer-motion";

interface StageStartProps {
  onClick?: (level: GrammarLevelTypeV2) => void;
}

const LEVEL = {
  n1: {
    name: "N1",
    left: 85,
    duration: 0.7,
    vd: 3.4,
  },
  n2: {
    name: "N2",
    left: 65,
    duration: 0.7,
    vd: 3.4,
  },
  n3: {
    name: "N3",
    left: 45,
    duration: 0.7,
    vd: 3.4,
  },
  n4: {
    name: "N4",
    left: 75,
    duration: 0.7,
    vd: 3.4,
  },
  n5: {
    name: "N5",
    left: 55,
    duration: 0.7,
    vd: 3.4,
  },
};

export default function StageStart({ onClick }: StageStartProps) {
  const [scope, animate] = useAnimate();
  const [scope2, animate2] = useAnimate();

  return (
    <div
      ref={scope2}
      className={cn("flex flex-col items-center py-8 h-screen relative")}
    >
      <p className={cn("text-2xl bold mb-12", style.title_color)}>
        Select JLPT Level
      </p>
      <div ref={scope} className="level-circles w-7/12">
        {Object.entries(LEVEL).map(([level, value], index) => (
          <div
            key={`level-${level}`}
            className={cn(
              "rounded-full w-20 h-20 flex items-center justify-center text-3xl",
              "absolute border bold",
              style.title_color,
              style.icon_bg,
              style.icon_border,
              style[`${level}_pos`]
            )}
            onClick={() => {
              animate(
                scope.current.children[index],
                {
                  left: value.left,
                  top: 8,
                  opacity: 0,
                },
                {
                  duration: value.duration,
                  ease: "easeInOut",
                  opacity: {
                    type: "spring",
                    visualDuration: value.vd,
                    bounce: 0.5,
                  },
                }
              );
              animate2(
                scope2.current,
                {
                  opacity: 0,
                },
                {
                  delay: 0.8,
                }
              );
              // orginial animation
              // animate(
              //   scope.current.children[index],
              //   {
              //     scale: [1, 0.6, 22],
              //     opacity: [1, 0.75],
              //     zIndex: 10,
              //   },
              //   {
              //     duration: 0.5,
              //     ease: "circInOut",
              //   }
              // );
              if (onClick) {
                onClick(level as GrammarLevelTypeV2);
              }
            }}
          >
            <p className="relative">{value.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
