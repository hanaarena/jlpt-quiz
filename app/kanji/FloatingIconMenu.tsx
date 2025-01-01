import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { AlignJustify } from "lucide-react";
import { useClickAway } from "@uidotdev/usehooks";

import style from "./page.module.css";

const menuList: { id: TKanjiDialogType }[] = [
  {
    id: "viewed",
  },
  {
    id: "fav",
  },
];

interface IFloatingIconMenuProps {
  openDialog: (type: TKanjiDialogType) => void;
}

const FloatingIconMenu: React.FC<IFloatingIconMenuProps> = ({ openDialog }) => {
  const [isOpen, setIsOpen] = useState(false);
  const refv = useClickAway<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const handleMenuItem = (id: "frame" | "viewed" | "fav") => {
    if (openDialog) {
      openDialog(id);
    }
  };

  return (
    <div
      className={cn(
        "floating-icon-container",
        "fixed bottom-36 right-[1.4em]",
        "w-[36px] h-[36px] center",
        "shadow line rounded-[50%] text-sm",
        "flex justify-center items-center",
        "border select-none",
        style.border_shadow
      )}
      onClick={toggleMenu}
      ref={refv}
    >
      <AlignJustify className={cn("w-[20px] h-[20px]")} />
      {isOpen && (
        <div
          className={cn(
            "menu",
            "absolute right-0 bottom-[36px] background-white shadow rounded border px-3 py-2",
            "min-w-[100px]"
          )}
        >
          {menuList.map((item) => {
            return (
              <div
                className="text-base mb-1 last:mb-0"
                key={item.id}
                onClick={() => handleMenuItem(item.id)}
              >
                {item.id.charAt(0).toUpperCase() + item.id.slice(1)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FloatingIconMenu;
