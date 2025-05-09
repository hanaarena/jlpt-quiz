export default function Bg1() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 2 1"
    >
      <rect fill="#88AA88" width="2" height="1" />
      <defs>
        <linearGradient
          id="a"
          gradientUnits="userSpaceOnUse"
          x1="0"
          x2="0"
          y1="0"
          y2="1"
          gradientTransform="rotate(0,0.5,0.5)"
        >
          <stop offset="0" stop-color="#88AA88" />
          <stop offset="1" stop-color="#A0FFEF" />
        </linearGradient>
        <linearGradient
          id="b"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientTransform="rotate(196,0.5,0.5)"
        >
          <stop offset="0" stop-color="#E2FFBE" stop-opacity="0" />
          <stop offset="1" stop-color="#E2FFBE" stop-opacity="1" />
        </linearGradient>
        <linearGradient
          id="c"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="2"
          y2="2"
          gradientTransform="rotate(0,0.5,0.5)"
        >
          <stop offset="0" stop-color="#E2FFBE" stop-opacity="0" />
          <stop offset="1" stop-color="#E2FFBE" stop-opacity="1" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" fill="url(#a)" width="2" height="1" />
      <g fill-opacity="0.15">
        <polygon fill="url(#b)" points="0 1 0 0 2 0" />
        <polygon fill="url(#c)" points="2 1 2 0 0 0" />
      </g>
    </svg>
  );
}
