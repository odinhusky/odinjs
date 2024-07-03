import { ISvgProps } from ".."

export default ({ color = "white", size = "20" }: ISvgProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_14_4774)">
      <path
        d="M18.386 4.51669L15.2129 3.09033V13.6123L17.5488 8.53731H17.5591L18.8407 5.71562C19.0386 5.25874 18.8371 4.72739 18.386 4.51669Z"
        fill={color}
      />
      <path
        d="M13.0836 1.3083e-08H1.39376C0.732274 0.0111918 0.200299 0.547722 0.194824 1.2093V18.7803C0.200202 19.4437 0.730627 19.9833 1.3938 20H13.0734C13.7526 20.0057 14.308 19.4597 14.3137 18.7804V18.7803V1.2093C14.3023 0.53808 13.755 -9.68859e-05 13.0836 1.3083e-08ZM3.04753 3.70023V3.79326H2.90281V4.25837H2.30335V3.79326H2.10698V3.70023C1.64739 3.64999 1.29245 3.27315 1.26977 2.81133C1.27418 2.61545 1.34322 2.4265 1.46614 2.27388H1.52815L2.13799 1.50901C2.26715 1.37936 2.43319 1.29273 2.61342 1.26095C2.78116 1.25353 2.94235 1.3265 3.04753 1.45731L3.7297 2.25319C3.76124 2.27766 3.78614 2.30964 3.80203 2.34622C3.86952 2.49248 3.90814 2.65043 3.91575 2.81133C3.90533 3.28996 3.52573 3.67863 3.04753 3.70023ZM8.4325 12.062L8.42218 12.0517C8.17615 12.0389 7.93289 11.9937 7.69868 11.9173V12.9509H8.21549V13.8708H6.30334V12.9509H6.74776V11.9173C6.51487 11.9974 6.27054 12.0393 6.02427 12.0413C4.92616 12.0821 4.00189 11.2272 3.95707 10.1292C3.98716 9.74629 4.12713 9.38021 4.36017 9.07493L4.44288 9.00259L6.64442 6.36694C6.96346 6.02445 7.4998 6.00546 7.84229 6.3245C7.85692 6.33816 7.87111 6.35231 7.88473 6.36694L10.076 8.96127C10.3502 9.28292 10.5101 9.68636 10.5307 10.1086C10.4698 11.2177 9.54315 12.0803 8.4325 12.062ZM12.3602 18.1188V18.2221H12.2154V18.6873H11.616V18.2221H11.4196V18.1084C10.9552 18.0764 10.592 17.6953 10.5824 17.2299C10.5831 17.0395 10.6528 16.8559 10.7788 16.7131L11.3886 15.9689C11.507 15.8563 11.66 15.7871 11.8227 15.7725C11.9914 15.7597 12.1551 15.8337 12.2568 15.9689L12.9493 16.7441C13.0458 16.8996 13.0993 17.078 13.1043 17.2609C13.0951 17.6888 12.7823 18.0493 12.3602 18.1188Z"
        fill={color}
      />
      <path
        d="M19.6884 11.3697L18.1173 9.57129L15.2129 15.8348V16.0622L19.6263 12.1759C19.8393 11.9576 19.8654 11.6181 19.6884 11.3697Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0_14_4774">
        <rect width="20" height="20" fill={color} />
      </clipPath>
    </defs>
  </svg>
)