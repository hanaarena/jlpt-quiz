import { Radio, RadioGroup, RadioProps, cn } from "@nextui-org/react";
import { GrammarLevelTypeV2, TGrammarDataset } from "../data/grammarV2";
import { useAtom } from "jotai";

import { useAnimate } from "framer-motion";
import { datasetAtom } from "./atom";

import style from "./page.module.css";
import { useEffect, useState } from "react";
import LoadingV3 from "../components/loadingV3";

interface StageStartProps {
  onClick?: (level: GrammarLevelTypeV2) => void;
}

const LEVEL = {
  n1: {
    name: "N1",
    left: 85,
    duration: 0.7,
    vd: 3.4
  },
  n2: {
    name: "N2",
    left: 65,
    duration: 0.7,
    vd: 3.4
  },
  n3: {
    name: "N3",
    left: 45,
    duration: 0.7,
    vd: 3.4
  },
  n4: {
    name: "N4",
    left: 75,
    duration: 0.7,
    vd: 3.4
  },
  n5: {
    name: "N5",
    left: 55,
    duration: 0.7,
    vd: 3.4
  }
};
const ExternalLevel = {
  n0: {
    name: "N0",
    left: 45,
    duration: 0.7,
    vd: 3.4
  }
};

function DataSelection(props: RadioProps) {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 items-center justify-between",
          "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-2 border-1 border-transparent",
          "data-[selected=true]:border-[#f5a524] bg-[#f6e5d0] bg-opacity-50"
        ),
        label: cn("bold", style.title_color)
      }}
    >
      {children}
    </Radio>
  );
}

export default function StageStart({ onClick }: StageStartProps) {
  const [scope, animate] = useAnimate();
  const [scope2, animate2] = useAnimate();
  const [dataset, setDataset] = useAtom(datasetAtom);
  const [levelArr, setLevelArr] =
    useState<
      Record<
        string,
        { name: string; left: number; duration: number; vd: number }
      >
    >(LEVEL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLevelArr((prev) => {
      let obj = {};
      if (dataset === "v1") {
        obj = {
          ...prev,
          ...ExternalLevel
        };
      } else {
        obj = { ...prev };
        if ("n0" in obj) {
          delete obj.n0;
        }
      }
      setLoading(false);
      return obj;
    });
  }, [dataset]);

  return (
    <div
      ref={scope2}
      className={cn("flex flex-col items-center py-8 h-screen relative")}
    >
      {loading ? (
        <LoadingV3 />
      ) : (
        <>
          <p className={cn("text-2xl bold mb-12", style.title_color)}>
            Select JLPT Level
          </p>
          <div ref={scope} className="level-circles w-7/12">
            {Object.entries(levelArr).map(([level, value], index) => (
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
                      top: 8
                    },
                    {
                      duration: value.duration,
                      ease: "easeInOut"
                    }
                  );
                  animate2(
                    scope2.current,
                    {
                      opacity: 0
                    },
                    {
                      delay: 0.66
                    }
                  );
                  if (onClick) {
                    onClick(level as GrammarLevelTypeV2);
                  }
                }}
              >
                <p className="relative">{value.name}</p>
              </div>
            ))}
          </div>
          <RadioGroup
            label="Select a dataset"
            orientation="horizontal"
            className="mt-80"
            value={dataset}
            onValueChange={(value) => setDataset(value as TGrammarDataset)}
            classNames={{
              label: cn("text-center", style.title_color)
            }}
            color="warning"
          >
            <DataSelection description="More grammars" value="v1">
              V1
            </DataSelection>
            <DataSelection description="More examples" value="v2">
              V2
            </DataSelection>
          </RadioGroup>
        </>
      )}
    </div>
  );
}
