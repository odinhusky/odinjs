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
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.7922 19.7656C12.7867 18.2949 12.8784 16.7065 12.0672 15.0002C11.8416 15.9156 11.4289 16.4712 10.8291 16.667C11.3861 15.0764 10.9207 13.358 9.43293 11.5117C9.40082 13.4186 8.94258 14.8076 8.05817 15.6789C6.83981 16.878 6.85414 18.2313 8.10114 19.7387C2.92465 16.9839 2.19434 13.2893 5.91012 8.65477C6.14059 9.77437 6.69907 10.4618 7.58563 10.7169C6.61926 6.61609 7.63602 3.12191 10.6359 0.234375C10.6543 6.64246 12.6193 7.21203 15.1038 10.0725C17.7863 13.5051 16.2099 17.4665 11.7922 19.7656Z"
      fill={color}
    />
  </svg>
)