import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { AlignJustify } from "lucide-react";
import { useClickAway } from "@uidotdev/usehooks";
import { motion } from "framer-motion";

import style from "./page.module.css";

const menuList: { id: TKanjiDialogType }[] = [
  {
    id: "viewed"
  },
  {
    id: "fav"
  }
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
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            scale: { type: "spring", visualDuration: 0.2, bounce: 0.2 }
          }}
        >
          <div
            className={cn(
              "menu min-w-[100px] relative -left-10",
              "bg-white shadow rounded-md border px-3 py-2"
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
        </motion.div>
      )}
    </div>
  );
};

export default FloatingIconMenu;
