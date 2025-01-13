import {
  Button,
  Divider,
  Navbar,
  NavbarContent,
  NavbarItem,
  Spacer
} from "@nextui-org/react";
import { cn } from "@/lib/utils";
import EmblaCarousel from "../components/EmblaCarousel";
import GrammarV2DetailCard from "./card";

import style from "./page.module.css";
import type { GrammarLevelTypeV2, TGrammarV2 } from "../data/grammarV2";
import { ESTAGE } from "./page";

interface StageReviewProps {
  level: GrammarLevelTypeV2;
  className?: string;
  grammarList: TGrammarV2[];
  index: number;
  handleChangeStage: (stage: ESTAGE, level?: GrammarLevelTypeV2) => void;
  updateGrammarIndex: (index: number) => void;
}

export default function StageReview({
  level,
  className,
  grammarList,
  index,
  handleChangeStage,
  updateGrammarIndex
}: StageReviewProps) {
  return (
    <div
      className={cn(
        "stage-review",
        style.default_bg_img,
        "min-h-screen",
        className
      )}
    >
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
              {level.toUpperCase()}
            </div>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <div className="flex items-center flex-col">
              <p className="bold text-2xl mb-2">
                {index + 1} / {grammarList.length}
              </p>
              <Button
                className={cn("ml-2 bg-[#e36f23] text-white")}
                size="sm"
                onPress={() => handleChangeStage(ESTAGE.TESTING)}
              >
                Start
              </Button>
            </div>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <EmblaCarousel
        className="px-4 py-2"
        options={{ loop: true }}
        onSelect={(index) => {
          updateGrammarIndex(index);
          window.scrollTo({ top: 0 });
        }}
        control={{
          className:
            "fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-x-20",
          next: (
            <div className="relative w-24 text-center">
              <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-[#e36f23]"></span>
              <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-[#e36f23] bg-white px-3 py-1 text-base font-bold text-black transition duration-100">
                Next
              </span>
            </div>
          ),
          prev: (
            <div className="relative w-24 text-center">
              <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-[#e36f23]"></span>
              <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-[#e36f23] bg-white px-3 py-1 text-base font-bold text-black transition duration-100">
                Prev
              </span>
            </div>
          )
        }}
      >
        {grammarList.map((g) => (
          <div key={`slide-${g.originalKey}`} className="embla__slide mb-12">
            <p className={cn("text-[#d36f32]", "text-4xl mt-3 mb-4")}>
              {g.originalKey}
            </p>
            {g.grammar && (
              <GrammarV2DetailCard title={"Grammar"} content={g.grammar} />
            )}
            {g.meaning && <Spacer y={4} />}
            {g.meaning && (
              <GrammarV2DetailCard title={"Meaning"} content={g.meaning} />
            )}
            {g.english_meaning && <Spacer y={4} />}
            {g.english_meaning && (
              <GrammarV2DetailCard
                title={"English Meaning"}
                content={g.english_meaning}
              />
            )}
            {g.explanation && <Spacer y={4} />}
            {g.explanation && (
              <GrammarV2DetailCard
                title={"Explanation"}
                content={g.explanation}
              />
            )}
            {g.examples && <Spacer y={4} />}
            {g.examples && (
              <GrammarV2DetailCard
                className="max-h-96 overflow-y-auto"
                title={"Examples"}
              >
                {g.examples.map((e, i) => (
                  <div
                    key={`exp-${i}`}
                    className={cn(
                      "relative",
                      "flex flex-col w-full rounded-lg border px-4 py-2 mb-2",
                      "last:mb-0 border-yellow-500 bg-yellow-500 bg-opacity-10"
                    )}
                  >
                    <p
                      className="text-lg"
                      dangerouslySetInnerHTML={{
                        __html: e[0]
                      }}
                    />
                    <Divider className="my-2" />
                    <p
                      className="text-lg"
                      dangerouslySetInnerHTML={{
                        __html: e[1]
                      }}
                    />
                    {/* compatible with v1 data which have third translation */}
                    {e[2] && (
                      <>
                        <Divider className="my-2" />
                        <p
                          className="text-lg"
                          dangerouslySetInnerHTML={{
                            __html: e[2]
                          }}
                        />
                      </>
                    )}
                  </div>
                ))}
              </GrammarV2DetailCard>
            )}
          </div>
        ))}
      </EmblaCarousel>
    </div>
  );
}
