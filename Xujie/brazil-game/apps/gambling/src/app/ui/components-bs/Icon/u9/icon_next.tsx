import { ISvgProps } from ".."

export default ({ color = "white", size = "20" }: ISvgProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_17_4892)">
      <path
        d="M10 0C4.48582 0 0 4.48582 0 10C0 15.5142 4.48582 20 10 20C15.5142 20 20 15.5142 20 10C20 4.48582 15.5142 0 10 0ZM13.0892 10.5892L8.9225 14.7558C8.76 14.9183 8.54668 15 8.33332 15C8.12 15 7.90664 14.9183 7.74414 14.7558C7.41832 14.43 7.41832 13.9033 7.74414 13.5775L11.3217 10L7.74418 6.4225C7.41836 6.09668 7.41836 5.57 7.74418 5.24418C8.07 4.91836 8.59668 4.91836 8.9225 5.24418L13.0892 9.41086C13.415 9.73668 13.415 10.2633 13.0892 10.5892Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0_17_4892">
        <rect width="20" height="20" fill={color} />
      </clipPath>
    </defs>
  </svg>
)
