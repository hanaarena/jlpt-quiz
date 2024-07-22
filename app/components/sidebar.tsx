"use client";

import { cn } from "@/lib/utils";
import { items } from "../utils/const";
import { Nav } from "./nav";
import { useAtomValue } from "jotai";
import { collapsedAtom } from "./atoms";

export default function Sidebar() {
  const collapsed = useAtomValue(collapsedAtom);

  return (
    <div
      className={cn(
        "sidebar fixed bg-white border-gray-200 border h-screen transition-all duration-300 ease-in",
        "mt-[51px] w-36 z-10",
        collapsed ? "-left-36" : "left-0"
      )}
      style={{
        boxShadow: "0 13px 13px #d1d1d1",
      }}
    >
      <Nav links={items} collapsed={collapsed} />
    </div>
  );
}
