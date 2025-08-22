import Link from "next/link";
import BackgroundImage from "./components/BackgroundImage";

const EntryList = [
  {
    path: "/quickQuiz",
    name: "Quick Test",
  },
  {
    path: "/kanji",
    name: "漢字",
  },
  {
    path: "/grammar",
    name: "文法",
  },
  {
    path: "/moji",
    name: "語彙",
  },
  {
    path: "/moji-1",
    name: "文字(発音)",
  },
  {
    path: "/moji-3",
    name: "文字(単語)",
  },
  {
    path: "/grammar-search",
    name: "文法辞典",
  },
  {
    path: "/sorting",
    name: "排序",
    disabled: true,
  },
];

export default async function Home() {
  return (
    <>
      <BackgroundImage src="/bg-0.jpeg" />
      <div className="max-w-3xl flex flex-col mx-auto items-center min-h-screen p-8 relative">
        <p className="mt-10 text-4xl mb-10 font-bold">Choose Quiz</p>
        <main className="flex flex-col gap-y-4 justify-center w-10/12 md:w-7/12">
          {EntryList.map((e) => {
            return (
              <Link key={e.path} href={e.disabled ? "" : e.path}>
                <div
                  className={`flex items-center justify-between bg-white p-4 rounded-lg border border-gray-100 ${
                    e.disabled
                      ? "bg-gray-100 cursor-not-allowed opacity-60"
                      : "hover:bg-gray-50 cursor-pointer"
                  } transition-colors duration-150 shadow-sm`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`rounded-lg`}>
                      <span className="circle-char-flex colored">
                        {e.name[0]}
                      </span>
                    </div>
                    <span
                      className={`text-md font-medium ${
                        e.disabled ? "text-gray-500" : "text-gray-700"
                      }`}
                    >
                      {e.name}
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`h-5 w-5 ${
                      e.disabled ? "text-gray-300" : "text-gray-400"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </div>
              </Link>
            );
          })}
        </main>
      </div>
    </>
  );
}
