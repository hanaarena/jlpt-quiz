"use client";

import React, { useState, useMemo } from "react";
import * as grammarV1 from "@/data/grammar";
import * as grammarV2 from "@/data/grammarV2";
import GrammarV2DetailCard from "../grammar/card";
import { Divider, Spacer, cn } from "@heroui/react";

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
  const v1Levels = ["n5", "n4", "n3", "n2", "n1", "n0"];
  const v1: GrammarItem[] = [];
  v1Levels.forEach((level) => {
    const list =
      (grammarV1 as any).default?.grammarList?.[level] ||
      (grammarV1 as any).grammarList?.[level];
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
  const v2Levels = ["n5", "n4", "n3", "n2", "n1"];
  const v2: GrammarItem[] = [];
  v2Levels.forEach((level) => {
    const list =
      (grammarV2 as any).default?.grammarList?.[level] ||
      (grammarV2 as any).grammarList?.[level];
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

export default function GrammarSearch() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<GrammarItem | null>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return allGrammar.filter(
      (g) =>
        g.grammar?.toLowerCase().includes(q) ||
        g.meaning?.toLowerCase().includes(q) ||
        g.explanation?.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="w-full mx-auto p-4">
      <h2>Grammar Search</h2>
      <input
        type="text"
        placeholder="Search grammar or meaning..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelected(null);
        }}
        style={{
          width: "100%",
          padding: 8,
          fontSize: 16,
          marginBottom: 16,
          border: "1px solid #ccc",
          borderRadius: 4,
        }}
      />
      {query && !selected && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            border: "1px solid #eee",
            borderRadius: 4,
          }}
        >
          {results.length === 0 && <li style={{ padding: 8 }}>No results</li>}
          {results.slice(0, 30).map((g, i) => (
            <li
              key={g.dataset + g.level + g.originalKey}
              style={{
                padding: 8,
                borderBottom: "1px solid #f0f0f0",
                cursor: "pointer",
                background: i % 2 ? "#fafbfc" : "#fff",
              }}
              onClick={() => setSelected(g)}
            >
              <b>{g.grammar}</b>{" "}
              <span style={{ color: "#888" }}>
                ({g.level}, {g.dataset})
              </span>
              <div style={{ fontSize: 13, color: "#555" }}>{g.meaning}</div>
            </li>
          ))}
        </ul>
      )}
      {selected && (
        <div
          style={{
            marginTop: 24,
            border: "1px solid #eee",
            borderRadius: 4,
            padding: 16,
          }}
        >
          <button
            onClick={() => setSelected(null)}
            style={{ marginBottom: 12 }}
          >
            ← Back
          </button>
          <h3>
            {selected.grammar}{" "}
            <span style={{ color: "#888", fontSize: 16 }}>
              ({selected.level}, {selected.dataset})
            </span>
          </h3>
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
