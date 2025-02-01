"use client";
import { Select, SelectItem } from "@heroui/react";
import { EJLPTLevel } from "@/app/types";
import { useEffect, useState } from "react";
import { getStorage, setStorage } from "@/app/utils/localstorage";

const LevelList = Object.values(EJLPTLevel)
  .filter((level) => level !== EJLPTLevel.N0)
  .map((level) => {
    return {
      label: level,
      value: level,
    };
  });
const LevelKey = "kanji-level";

export default function LevelSelect() {
  const [value, setValue] = useState<Set<EJLPTLevel>>();

  useEffect(() => {
    let defaultLevel = getStorage(LevelKey);
    if (defaultLevel) {
      defaultLevel = JSON.parse(defaultLevel)[0];
      setValue(new Set([defaultLevel]));
    }
  }, []);

  useEffect(() => {
    if (value) {
      const arr = Array.from(value);
      setStorage(LevelKey, JSON.stringify(arr));
    }
  }, [value]);

  return (
    <Select
      className="w-36 flex items-center mb-4"
      items={LevelList}
      label="Level"
      aria-label="Select JLPT level"
      labelPlacement="outside-left"
      selectedKeys={value}
      onSelectionChange={(e) => {
        setValue(e as Set<EJLPTLevel>);
      }}
      isLoading={!value}
    >
      {(level) => (
        <SelectItem key={level.value}>{level.label.toUpperCase()}</SelectItem>
      )}
    </Select>
  );
}
