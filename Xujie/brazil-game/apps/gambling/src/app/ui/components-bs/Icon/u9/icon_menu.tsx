import { ISvgProps } from ".."

export default ({ color = "white", size = "20" }: ISvgProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_671_59187)">
      <path
        d="M1.5 6H18.5C19.3286 6 20 5.32861 20 4.5C20 3.67139 19.3286 3 18.5 3H1.5C0.671387 3 0 3.67139 0 4.5C0 5.32861 0.671387 6 1.5 6Z"
        fill={color}
      />
      <path
        d="M18.5 9H1.5C0.671387 9 0 9.67139 0 10.5C0 11.3286 0.671387 12 1.5 12H18.5C19.3286 12 20 11.3286 20 10.5C20 9.67139 19.3286 9 18.5 9Z"
        fill={color}
      />
      <path
        d="M18.5 15H1.5C0.671387 15 0 15.6714 0 16.5C0 17.3286 0.671387 18 1.5 18H18.5C19.3286 18 20 17.3286 20 16.5C20 15.6714 19.3286 15 18.5 15Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0_671_59187">
        <rect width="20" height="20" fill={color} />
      </clipPath>
    </defs>
  </svg>
)
