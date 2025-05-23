export function Moji1HeaderSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 100"
      fill="#FFAA33"
    >
      <path
        d="M500 80.7C358 68 0 4 0 4V0h1000v84.7c-216 23.3-358 8.6-500-4Z"
        opacity=".3"
      ></path>
      <path
        d="M500 65.7C358 53 0 4 0 4V0h1000v62.7c-216 23.3-358 15.6-500 3Z"
        opacity=".5"
      ></path>
      <path d="M500 50.7C358 38 0 4 0 4V0h1000v40.7C784 64 642 63.3 500 50.7Z"></path>
    </svg>
  );
}

export default function Moji1Header() {
  return (
    <header className="w-full">
      <Moji1HeaderSvg />
    </header>
  );
}
