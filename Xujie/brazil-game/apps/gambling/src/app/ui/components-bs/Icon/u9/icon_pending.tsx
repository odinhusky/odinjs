import { ISvgProps } from ".."

export default ({ color = "white", size = "20" }: ISvgProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_28_8810)">
      <path
        d="M16.0547 0.343262V3.90647H19.6176L16.0547 0.343262Z"
        fill={color}
      />
      <path
        d="M15.4688 5.07812C15.1452 5.07812 14.8828 4.81578 14.8828 4.49219V0H6.48438C5.51512 0 4.72656 0.788555 4.72656 1.75781V8.30816C4.91961 8.29066 5.11496 8.28125 5.3125 8.28125C7.30969 8.28125 9.09754 9.19438 10.2807 10.625H16.6406C16.9642 10.625 17.2266 10.8873 17.2266 11.2109C17.2266 11.5345 16.9642 11.7969 16.6406 11.7969H11.0527C11.4189 12.5116 11.6551 13.3033 11.7309 14.1406H16.6406C16.9642 14.1406 17.2266 14.403 17.2266 14.7266C17.2266 15.0502 16.9642 15.3125 16.6406 15.3125H11.7309C11.5557 17.2476 10.5218 18.9385 9.01398 20H18.2031C19.1724 20 19.9609 19.2114 19.9609 18.2422V5.07812H15.4688ZM16.6406 8.28125H8.04688C7.72328 8.28125 7.46094 8.01891 7.46094 7.69531C7.46094 7.37172 7.72328 7.10938 8.04688 7.10938H16.6406C16.9642 7.10938 17.2266 7.37172 17.2266 7.69531C17.2266 8.01891 16.9642 8.28125 16.6406 8.28125Z"
        fill={color}
      />
      <path
        d="M5.3125 9.45312C2.40473 9.45312 0.0390625 11.8188 0.0390625 14.7266C0.0390625 17.6343 2.40473 20 5.3125 20C8.22027 20 10.5859 17.6343 10.5859 14.7266C10.5859 11.8188 8.22027 9.45312 5.3125 9.45312ZM6.875 15.3125H5.3125C4.98891 15.3125 4.72656 15.0502 4.72656 14.7266V12.3828C4.72656 12.0592 4.98891 11.7969 5.3125 11.7969C5.63609 11.7969 5.89844 12.0592 5.89844 12.3828V14.1406H6.875C7.19859 14.1406 7.46094 14.403 7.46094 14.7266C7.46094 15.0502 7.19859 15.3125 6.875 15.3125Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0_28_8810">
        <rect width="20" height="20" fill={color} />
      </clipPath>
    </defs>
  </svg>
)