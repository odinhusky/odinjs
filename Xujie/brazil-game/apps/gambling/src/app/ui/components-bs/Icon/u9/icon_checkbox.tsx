import { ISvgProps } from ".."

export default ({ color, size = "16" }: ISvgProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="16" height="16" rx="2" fill={color || "var(--tertiary-main)"} />
    <g clip-path="url(#clip0_122_3726)">
      <path
        d="M13.7212 3.9613C13.3499 3.58952 12.747 3.58976 12.3752 3.9613L6.31744 10.0193L3.62503 7.32691C3.25325 6.95513 2.65061 6.95513 2.27883 7.32691C1.90706 7.69868 1.90706 8.30133 2.27883 8.6731L5.6442 12.0385C5.82998 12.2242 6.07357 12.3174 6.31719 12.3174C6.5608 12.3174 6.80463 12.2245 6.9904 12.0385L13.7212 5.30747C14.0929 4.93595 14.0929 4.33305 13.7212 3.9613Z"
        fill="var(--quaternary-main)"
      />
    </g>
    <defs>
      <clipPath id="clip0_122_3726">
        <rect width="12" height="12" fill="white" transform="translate(2 2)" />
      </clipPath>
    </defs>
  </svg>
)
