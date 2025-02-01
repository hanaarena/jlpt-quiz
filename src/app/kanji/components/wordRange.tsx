"use client";

import { getStorage, setStorage } from "@/app/utils/localstorage";
import { Input, Slider } from "@heroui/react";
import { useEffect, useState } from "react";

const CountKey = "kanji-words-count";

export default function WordRange() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const defaultLevel = getStorage(CountKey);
    if (defaultLevel) {
      setValue(defaultLevel);
    }
  }, []);

  useEffect(() => {
    if (value) {
      setStorage(CountKey, value);
    }
  }, [value]);

  return (
    <div className="flex w-full items-center gap-2">
      <Slider
        isDisabled={!value}
        aria-label="Words-count"
        label="Words count"
        hideValue
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
        type="number"
        value={value.toString()}
        onChange={(e) => {
          let n = Number(e.target.value);
          if (n > 100) n = 100;
          else if (n < 1) n = 1;
          setValue(n);
        }}
      />
    </div>
  );
}
