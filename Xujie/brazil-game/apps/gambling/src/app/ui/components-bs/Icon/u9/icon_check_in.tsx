import { ISvgProps } from ".."

export default ({ color = "white", size = "20" }: ISvgProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.75 4.3501V6.23135H1.25V4.3501C1.25 3.31887 2.09373 2.4751 3.125 2.4751H5.3125V4.32511C5.3125 4.66885 5.59376 4.95011 5.9375 4.95011C6.28124 4.95011 6.5625 4.66885 6.5625 4.32511V2.4751H13.4375V4.32511C13.4375 4.66885 13.7188 4.95011 14.0625 4.95011C14.4062 4.95011 14.6875 4.66885 14.6875 4.32511V2.4751H16.875C17.9063 2.4751 18.75 3.31887 18.75 4.3501Z"
      fill={color}
    />
    <path
      d="M13.75 13.7375H18.3688L13.125 18.4125V14.3625C13.125 14.0188 13.4063 13.7375 13.75 13.7375Z"
      fill={color}
    />
    <path
      d="M18.75 7.4812V12.4875H13.75C12.7187 12.4875 11.875 13.3312 11.875 14.3625V18.75H3.125C2.09373 18.75 1.25 17.9062 1.25 16.875V7.4812H18.75Z"
      fill={color}
    />
    <path
      d="M6.5625 1.875V2.47498H5.3125V1.875C5.3125 1.53126 5.59376 1.25 5.9375 1.25C6.28124 1.25 6.5625 1.53126 6.5625 1.875Z"
      fill={color}
    />
    <path
      d="M14.6875 1.875V2.47498H13.4375V1.875C13.4375 1.53126 13.7188 1.25 14.0625 1.25C14.4062 1.25 14.6875 1.53126 14.6875 1.875Z"
      fill={color}
    />
  </svg>
)