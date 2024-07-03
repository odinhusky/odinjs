import { ISvgProps } from ".."

export default ({ color = "white", size = "20" }: ISvgProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_40_15397)">
      <path
        d="M8.11203 16.2498C6.15952 16.2498 4.57031 14.6606 4.57031 12.7081V4.1665H3.11203C1.84784 4.1665 0.820312 5.19388 0.820312 6.45807V17.7081C0.820312 18.9723 1.84784 19.9998 3.11203 19.9998H13.5286C14.7928 19.9998 15.8203 18.9723 15.8203 17.7081V16.2498H8.11203Z"
        fill={color}
      />
      <path
        d="M19.1536 2.29172C19.1536 1.02585 18.1277 0 16.862 0H8.11203C6.84616 0 5.82031 1.02585 5.82031 2.29172V12.7083C5.82031 13.9742 6.84616 15 8.11203 15H16.862C18.1277 15 19.1536 13.9742 19.1536 12.7083V2.29172Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0_40_15397">
        <rect width="20" height="20" fill={color} />
      </clipPath>
    </defs>
  </svg>
)
