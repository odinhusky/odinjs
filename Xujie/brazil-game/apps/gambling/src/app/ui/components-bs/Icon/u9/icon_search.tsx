import { ISvgProps } from ".."

export default ({ color = "white", size = "20" }: ISvgProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_23_7545)">
      <path
        d="M19.708 16.8809L15.1207 12.2936C14.7313 11.9043 14.0965 11.9043 13.7072 12.2936L12.603 11.1895C14.6566 8.44779 14.4433 4.54327 11.9523 2.05227C9.21589 -0.684091 4.7833 -0.684091 2.05227 2.05227C-0.684091 4.78864 -0.684091 9.22123 2.05227 11.9523C4.54327 14.4433 8.44779 14.6566 11.1895 12.603L12.2936 13.7072C11.9043 14.0965 11.9043 14.7313 12.2936 15.1207L16.8809 19.708C17.2703 20.0973 17.9051 20.0973 18.2944 19.708L19.708 18.2944C20.0973 17.9051 20.0973 17.2703 19.708 16.8809ZM11.0401 9.92532L9.93599 11.0295C9.08788 11.6482 8.07441 11.9949 7.0076 11.9949C5.66342 12.0003 4.40992 11.4829 3.4658 10.5334C2.52167 9.58928 1.99893 8.33044 1.99893 6.99693C1.99893 5.66342 2.52167 4.40459 3.4658 3.46046C4.40992 2.51634 5.66876 1.9936 7.00227 1.9936C8.33578 1.9936 9.59461 2.51634 10.5387 3.46046C11.4829 4.40459 12.0056 5.66342 12.0056 6.99693C12.0056 8.06908 11.6589 9.07721 11.0401 9.92532Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0_23_7545">
        <rect width="20" height="20" fill={color} />
      </clipPath>
    </defs>
  </svg>
)
