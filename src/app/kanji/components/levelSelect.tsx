"use client";
import { Select, SelectItem } from "@heroui/react";
import { EJLPTLevel } from "@/app/types";

const LevelList = Object.values(EJLPTLevel)
  .filter((level) => level !== EJLPTLevel.N0)
  .map((level) => {
    return {
      label: level,
      value: level,
    };
  });

export default function LevelSelect() {
  return (
    <Select
      className="w-28 flex items-center mb-4"
      items={LevelList}
      label="Level"
      placeholder="Select JLPT level"
      labelPlacement="outside-left"
      defaultSelectedKeys={[EJLPTLevel.N2]}
    >
      {(level) => (
        <SelectItem key={level.value}>{level.label.toUpperCase()}</SelectItem>
      )}
    </Select>
  );
}
