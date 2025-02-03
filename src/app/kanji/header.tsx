import BackHomeLink from "../components/backHomeLink";

export default function Header() {
  return (
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -40 1440 360">
        <path
          className="fill-[#09f] dark:fill-[#0e5483]"
          d="m0 256 26.7-21.3C53.3 213 107 171 160 138.7 213.3 107 267 85 320 101.3 373.3 117 427 171 480 176c53.3 5 107-37 160-42.7 53.3-5.3 107 26.7 160 48C853.3 203 907 213 960 208c53.3-5 107-27 160-37.3 53.3-10.7 107-10.7 160 16 53.3 26.3 107 80.3 133 106.6l27 26.7V-40H0Z"
        />
      </svg>
      <BackHomeLink />
    </div>
  );
}
