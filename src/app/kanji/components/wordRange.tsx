"use client";

import { Input, Slider } from "@heroui/react";
import { useState } from "react";

export default function WordRange() {
  const [value, setValue] = useState(25);

  return (
    <div className="flex w-full items-center gap-2">
      <Slider
        className="w-full flex-auto"
        aria-label="Temperature"
        defaultValue={25}
        maxValue={100}
        minValue={1}
        size="sm"
        step={1}
        value={value}
        onChange={(n) => setValue(Number(n))}
      />
      <Input
        className="w-20"
        label=""
        type="number"
        value={value.toString()}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    </div>
  );
}
