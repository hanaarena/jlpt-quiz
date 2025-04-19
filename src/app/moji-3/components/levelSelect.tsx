"use client";
import { Select, SelectItem } from "@heroui/react";
import { EJLPTLevel } from "@/app/types";
import { useEffect } from "react";
import { getStorage } from "@/app/utils/localstorage";
import { LevelKey, selectorLevel, updateLevel } from "../moji3Slice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { LevelList } from "@/app/utils/const";

export default function LevelSelect() {
  const dispatch = useAppDispatch();
  const level = useAppSelector(selectorLevel);

  useEffect(() => {
    let defaultLevel = getStorage(LevelKey);
    if (defaultLevel) {
      defaultLevel = JSON.parse(defaultLevel)[0];
      dispatch(updateLevel(new Set([defaultLevel])));
    } else {
      const n = new Set([EJLPTLevel.N2]);
      dispatch(updateLevel(n));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Select
      className="w-36 flex items-center mb-4"
      items={LevelList}
      label="Level"
      aria-label="Select JLPT level"
      labelPlacement="outside-left"
      selectedKeys={level}
      onSelectionChange={(e) => {
        dispatch(updateLevel(e as Set<EJLPTLevel>));
      }}
      isLoading={!level.size}
      classNames={{
        label: "text-lg",
      }}
    >
      {(level) => (
        <SelectItem key={level.value}>{level.label.toUpperCase()}</SelectItem>
      )}
    </Select>
  );
}
