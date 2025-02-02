export function MojiHeaderSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 100"
      fill="#000b76"
    >
      <path
        d="M 500 91 C 359 85 0 24 0 24 V -4 h 1000 v 84.7 c -216 23.3 -358 8.6 -500 10.3 Z"
        opacity=".3"
      ></path>
      <path
        d="M 500 82 C 358 73 0 24 0 24 V 0 h 1000 v 62.7 c -216 23.3 -358 15.6 -500 20.3 Z"
        opacity=".5"
      ></path>
      <path d="M 500 70.7 C 358 58 0 24 0 24 V -1 h 1000 v 40.7 C 784 84 642 83.3 500 70.7 Z"></path>
    </svg>
  );
}

export function MojiHeader2Svg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 360">
      <path
        fill="#000b76"
        fillOpacity="1"
        d="M 0 138.24 L 40 122.832 C 80 108 160 76.32 240 92.16 C 320 108 400 168.48 480 168.912 C 560 168.48 640 108 720 99.792 C 800 92.16 880 138.24 960 199.728 C 1040 260.64 1120 338.4 1200 353.232 C 1280 368.64 1360 322.56 1400 299.52 L 1440 276.48 L 1440 0 L 1400 0 C 1360 0 1280 0 1200 0 C 1120 0 1040 0 960 0 C 880 0 800 0 720 0 C 640 0 560 0 480 0 C 400 0 320 0 240 0 C 160 0 80 0 40 0 L 0 0 Z"
      ></path>
    </svg>
  );
}

export default function MojiHeader() {
  return (
    <header className="w-full">
      <MojiHeader2Svg />
    </header>
  );
}
