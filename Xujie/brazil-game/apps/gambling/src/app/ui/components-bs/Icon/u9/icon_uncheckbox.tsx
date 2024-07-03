import { ISvgProps } from ".."

export default ({ color="white", size = '16' }: ISvgProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="16" height="16" rx="2" fill={color} fill-opacity="0.1" />
    <rect
      x="0.5"
      y="0.5"
      width="15"
      height="15"
      rx="1.5"
      stroke={color}
      stroke-opacity="0.4"
    />
  </svg>
)
