"use client";

import {Select, SelectItem} from "@heroui/react";
import Link from "next/link";
import { ChatTypeValue, LevelList } from "@/app/utils/const";
import { useState } from "react";

const iconPath = {
  CurvedDiamond‌: <path d="M16 6L24 16 16 26 8 16Z" fill="#FF6B6B" stroke="#EE5253" strokeWidth="1.5"/>,
  HexagonBurst: <path d="M16 4l8 14-8 8-8-8 8-14Z" fill="#FC427B" stroke="#EB3B5A" strokeWidth="1.5"/>,
  WavyCircle: <path d="M16 8Q20 4 24 16T16 24Q12 28 8 16T16 8Z" fill="#48DBFB" stroke="#0ABDE3" strokeWidth="1.2"/>,
  SpikyStar: <path d="M16 4l4 10 10 2-8 7 2 10-8-6-8 6 2-10-8-7 10-2Z" fill="#F9CA24" stroke="#F0932B" strokeWidth="1"/>,
  SwirledLeaf: <path d="M16 6C8 14 12 22 24 18 20 10 16 6 16 6Z" fill="#20BF6B" stroke="#26DE81" strokeWidth="1.4"/>
}

function Icon({ className, iconName }: { className: string, iconName: keyof typeof iconPath}) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {iconPath[iconName]}
    </svg>
  );
}

const categories: {name: string, title: string, icon: keyof typeof iconPath, iconBgColor: string, iconTextColor: string}[] = [
  {
    name: ChatTypeValue.Moji1Quick,
    title: "文字·語彙 漢字読み",
    icon: "WavyCircle",
    iconBgColor: "bg-blue-100",
    iconTextColor: "text-blue-600",
  },
  {
    name: ChatTypeValue.Moji5Quick,
    title: "文字·語彙 言い換え類義",
    icon: "SwirledLeaf",
    iconBgColor: "bg-orange-100",
    iconTextColor: "text-orange-600",
  },
  {
    name: ChatTypeValue.Dokkai1,
    title: "読解 内容理解(短文)",
    icon: "CurvedDiamond‌",
    iconBgColor: "bg-purple-100",
    iconTextColor: "text-purple-600",
  },
];

export default function QuickQuiz() {
  const [levelValue, setLevelValue] = useState(`${LevelList[1].value}`);

  return (
    <>
      <div className="bg-[#fefaf3] fixed w-full h-full"></div>
      <div className="relative">
        <div className="min-h-screen p-4">
          <div className="max-w-md mx-auto p-4 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              Quiz categories
            </h2>
            <Select
              className="w-1/2 mb-4 flex items-center"
              defaultSelectedKeys={["cat"]}
              label="Level"
              placeholder="Select JLPT level"
              labelPlacement="outside-left"
              selectedKeys={[levelValue]}
              onChange={e => setLevelValue(e.target.value)}
            >
              {LevelList.map((level) => (
                <SelectItem key={level.label}>{level.value.toUpperCase()}</SelectItem>
              ))}
            </Select>
            <div className="space-y-3">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-150 shadow-sm"
                  href={`/quickQuiz/${category.name}?level=${levelValue}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${category.iconBgColor}`}>
                      <Icon
                        className={`h-6 w-6 ${category.iconTextColor}`}
                        iconName={category.icon}
                      />
                    </div>
                    <span className="text-md font-medium text-gray-700">
                      {category.title}
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
