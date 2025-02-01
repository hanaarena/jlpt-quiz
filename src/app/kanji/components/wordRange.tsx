"use client";

import { getStorage } from "@/app/utils/localstorage";
import { Input, Slider } from "@heroui/react";
import { useEffect, useState } from "react";
import { CountKey, selectorCount, updateCount } from "../kanjiSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

export default function WordRange() {
  const [value, setValue] = useState(0);
  const count = useAppSelector(selectorCount);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const defaultLevel = getStorage(CountKey);
    if (defaultLevel) {
      dispatch(updateCount(Number(defaultLevel)));
    } else {
      dispatch(updateCount(25));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (value) {
  //     setStorage(CountKey, value);
  //   }
  // }, [value]);

  return (
    <div className="flex w-full items-center gap-2">
      <Slider
        isDisabled={!count}
        aria-label="Words-count"
        label="Words count"
        hideValue
        maxValue={100}
        minValue={1}
        size="md"
        step={1}
        value={count}
        onChange={(n) => dispatch(updateCount(Number(n)))}
      />
      <Input
        className="w-20"
        type="number"
        value={count.toString()}
        onChange={(e) => {
          const n = Number(e.target.value);
          dispatch(updateCount(n));
        }}
        onBlur={(e) => {
          let n = Number(e.target.value);
          if (n > 100) n = 100;
          else if (n < 1) n = 1;
          dispatch(updateCount(n));
        }}
      />
    </div>
  );
}
