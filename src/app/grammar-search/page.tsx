"use client";

import React, { useState, useMemo } from "react";
import { grammarList as grammarV1 } from "@/data/grammar";
import { grammarList as grammarV2 } from "@/data/grammarV2";
import GrammarV2DetailCard from "../grammar/card";
import { Divider, Spacer, cn } from "@heroui/react";

import type { GrammarLevelType } from "@/data/grammar";
import type { GrammarLevelTypeV2 } from "@/data/grammarV2";

type GrammarItem = {
  grammar: string;
  meaning: string;
  explanation?: string;
  examples: string[][];
  originalKey: string;
  level: string;
  dataset: "v1" | "v2";
  english_meaning?: string;
};

function collectAllGrammar(): GrammarItem[] {
  // V1
  const v1Levels = ["n5", "n4", "n3", "n2", "n1", "n0"] as GrammarLevelType[];
  const v1: GrammarItem[] = [];
  v1Levels.forEach((level) => {
    const list = grammarV1[level]
    if (list) {
      list.keys.forEach((key: string) => {
        const g = list.data[key];
        v1.push({
          grammar: g.grammar,
          meaning: g.meaning,
          explanation: g.explanation,
          examples: g.examples,
          originalKey: key,
          level,
          dataset: "v1",
        });
      });
    }
  });
  // V2
  const v2Levels = ["n5", "n4", "n3", "n2", "n1"] as GrammarLevelTypeV2[];
  const v2: GrammarItem[] = [];
  v2Levels.forEach((level) => {
    const list = grammarV2[level];
    if (list) {
      list.keys.forEach((key: string) => {
        const g = list.data[key];
        v2.push({
          grammar: g.grammar ?? "",
          meaning: g.meaning ?? "",
          explanation: g.explanation,
          examples: g.examples,
          originalKey: key,
          level,
          dataset: "v2",
        });
      });
    }
  });
  return [...v1, ...v2];
}

const allGrammar = collectAllGrammar();
console.log(allGrammar)

export default function GrammarSearch() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<GrammarItem | null>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim();
    return allGrammar.filter(
      (g) =>
        g.grammar?.includes(q) ||
        g.originalKey?.includes(q)
    );
  }, [query]);

  return (
    <div className="w-full mx-auto p-4">
      <h2 className="text-xl font-bold mb-2">Grammar Search</h2>
      <input
        type="text"
        placeholder="Search grammar"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        className="w-full p-3 text-lg mb-4 border border-gray-300 rounded"
      />
      {query && !selected && (
        <ul
          className="rounded border-gray-200 border-solid border-1 max-h-[50vh] overflow-auto"
        >
          {results.length === 0 && <li className="p-3">No results</li>}
          {results.slice(0, 30).map((g, i) => (
            <li
              key={g.dataset + g.level + g.originalKey}
              className={cn("p-3 border-b-[1px] border-color-gray-200 cursor-pointer", i % 2 ? "bg-[#f6f8fb]" : "bg-white")}
              onClick={() => setSelected(g)}
            >
              <b>{g.grammar}</b>{" "}
              <span className="text-sm text-gray-400">
                ({g.level}, {g.dataset})
              </span>
              <div className="text-sm text-[#555]">{g.meaning}</div>
            </li>
          ))}
        </ul>
      )}
      {selected && (
        <div
          className="mt-4 border border-gray-200 rounded p-4"
        >
          <button
            onClick={() => setSelected(null)}
            className="mb-3"
          >
            ← Back
          </button>
          <div>
            {selected.grammar && (
              <GrammarV2DetailCard
                title={"Grammar"}
                content={selected.grammar}
              />
            )}
            {selected.meaning && <Spacer y={4} />}
            {selected.meaning && (
              <GrammarV2DetailCard
                title={"Meaning"}
                content={selected.meaning}
              />
            )}
            {selected.english_meaning && <Spacer y={4} />}
            {selected.english_meaning && (
              <GrammarV2DetailCard
                title={"English Meaning"}
                content={selected.english_meaning}
              />
            )}
            {selected.explanation && <Spacer y={4} />}
            {selected.explanation && (
              <GrammarV2DetailCard
                title={"Explanation"}
                content={selected.explanation}
              />
            )}
            {selected.examples && <Spacer y={4} />}
            {selected.examples && (
              <GrammarV2DetailCard
                className="max-h-96 overflow-y-auto"
                title={"Examples"}
              >
                {selected.examples.map((e, i) => (
                  <div
                    key={`exp-${i}`}
                    className={cn(
                      "flex flex-col w-full rounded-lg border px-4 py-2 mb-2",
                      "last:mb-0 border-yellow-500 bg-yellow-500 bg-opacity-15"
                    )}
                  >
                    <p
                      className="text-lg"
                      dangerouslySetInnerHTML={{
                        __html: e[0],
                      }}
                    />
                    <Divider className="my-2" />
                    <p
                      className="text-lg"
                      dangerouslySetInnerHTML={{
                        __html: e[1],
                      }}
                    />
                    {e[2] && (
                      <>
                        <Divider className="my-2" />
                        <p
                          className="text-lg"
                          dangerouslySetInnerHTML={{
                            __html: e[2],
                          }}
                        />
                      </>
                    )}
                  </div>
                ))}
              </GrammarV2DetailCard>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
