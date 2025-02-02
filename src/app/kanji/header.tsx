import Link from "next/link";

export default function Header() {
  return (
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -40 1440 360">
        <path
          className="fill-[#09f] dark:fill-[#0e5483]"
          d="m0 256 26.7-21.3C53.3 213 107 171 160 138.7 213.3 107 267 85 320 101.3 373.3 117 427 171 480 176c53.3 5 107-37 160-42.7 53.3-5.3 107 26.7 160 48C853.3 203 907 213 960 208c53.3-5 107-27 160-37.3 53.3-10.7 107-10.7 160 16 53.3 26.3 107 80.3 133 106.6l27 26.7V-40H0Z"
        />
      </svg>
      <div className="absolute px-2 top-4 left-1/2 -translate-x-1/2 -skew-y-3 -skew-x-6 text-white">
        <Link href="/" aria-label="Excceed JLPT!">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
