"use client";

import { Tooltip } from "@heroui/react";
import { QrCode } from "lucide-react";
import { useEffect, useState } from "react";

export default function QRCode() {
  const [isPC, setIsPC] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.navigator) {
      const userAgent = navigator.userAgent;
      const isPC = !/Mobi|Android|iPhone|iPad|iPod/.test(userAgent);
      setIsPC(isPC);
    }
  }, []);

  if (isPC) {
    return (
      <Tooltip
        content={
          <div className="px-1 py-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-40 h-40"
              src="/qrcode-quiz.png"
              alt={"quiz-qrcode"}
            />
          </div>
        }
      >
        <div className="fixed left-3/4 -translate-x-1/2 top-4 z-10 hover:cursor-pointer border rounded-xl border-gray-400 border-2 p-1">
          <QrCode />
        </div>
      </Tooltip>
    );
  }

  return;
}
