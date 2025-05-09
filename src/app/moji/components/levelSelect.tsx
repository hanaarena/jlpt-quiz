"use client";
import { Select, SelectItem } from "@heroui/react";
import { EJLPTLevel } from "@/app/types";
import { useEffect } from "react";
import { getStorage } from "@/app/utils/localstorage";
import { LevelKey, selectorLevel, updateLevel } from "../mojiSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

// NOTE: only N1,N2, N3 are available
const LevelList = Object.values(EJLPTLevel)
  .filter((level) => Number(level.slice(1)) > 0 && Number(level.slice(1)) <= 3)
  .map((level) => {
    return {
      label: level,
      value: level,
    };
  });

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
