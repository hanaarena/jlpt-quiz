"use client";

import { cn } from "@/lib/utils";
import { items } from "../utils/const";
import { Nav } from "./nav";
import { useAtom } from "jotai";
import { collapsedAtom } from "./atoms";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useAtom(collapsedAtom);

  return (
    <div
      className={cn(
        "sidebar border-gray-200 border h-screen transition-all duration-300 ease-in",
        collapsed ? "w-12" : "w-12 w-64"
      )}
    >
      <div
        className={cn(
          "mobile-nav hidden absolute left-3 top-4 cursor-pointer",
          collapsed && "max-sm:block"
        )}
        onClick={() => {
          setCollapsed((prev) => !prev);
        }}
      >
        <div className="w-[20px] h-[3px] bg-black mb-1"></div>
        <div className="w-[20px] h-[3px] bg-black mb-1"></div>
        <div className="w-[20px] h-[3px] bg-black"></div>
      </div>
      <Nav links={items} collapsed={collapsed} />
    </div>
  );
}
