import { ISvgProps } from ".."

export default ({ color = "white", size = "20" }: ISvgProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_671_59209)">
      <path
        d="M11.7508 0.928235L13.2664 6.40842L7.49568 6.44398L8.46461 5.18838C8.51442 5.12492 8.53999 5.04627 8.53689 4.96615C8.53689 4.96615 8.53689 4.96615 8.53689 4.95282C8.53797 4.94322 8.53797 4.93353 8.53689 4.92393C8.52986 4.86414 8.50752 4.80709 8.47197 4.75812C8.43641 4.70914 8.38881 4.66985 8.33361 4.64392L5.78593 2.72385C4.69582 1.90732 3.36382 1.46472 1.99378 1.46381C1.86052 1.46381 1.72726 1.46381 1.59175 1.47714C2.54868 0.595117 3.7918 0.0745086 5.10125 0.00740413C6.41069 -0.0597004 7.70206 0.331024 8.74693 1.11046L10.2692 2.2505C10.3462 2.30711 10.4427 2.33184 10.538 2.31939C10.5851 2.31307 10.6306 2.29765 10.6717 2.274C10.7127 2.25036 10.7487 2.21896 10.7774 2.18161L11.7508 0.928235ZM2.31675 20H16.914C17.263 19.9994 17.5976 19.8627 17.8444 19.6199C18.0912 19.377 18.2301 19.0478 18.2307 18.7044V15.7465H15.2313C14.3975 15.7465 13.5978 15.4206 13.0082 14.8405C12.4186 14.2603 12.0874 13.4735 12.0874 12.6531C12.0874 11.8327 12.4186 11.0458 13.0082 10.4657C13.5978 9.88556 14.3975 9.55964 15.2313 9.55964H18.2307V6.60399C18.2301 6.26055 18.0912 5.93135 17.8444 5.68851C17.5976 5.44566 17.263 5.30897 16.914 5.30839H13.7158L14.0907 6.66621C14.1052 6.71923 14.1072 6.77478 14.0967 6.82868C14.0861 6.88258 14.0632 6.93341 14.0298 6.97733C13.996 7.02066 13.9526 7.0558 13.9028 7.08007C13.8531 7.10434 13.7984 7.11709 13.7429 7.11734L6.76164 7.14623C6.69411 7.14602 6.62797 7.12732 6.57064 7.09221C6.5133 7.0571 6.46703 7.00698 6.43702 6.94745C6.40701 6.88793 6.39443 6.82136 6.40071 6.7552C6.40698 6.68904 6.43186 6.62591 6.47254 6.57287L7.45502 5.30616H2.31675C1.96753 5.30616 1.63261 5.44266 1.38567 5.68564C1.13873 5.92861 1 6.25815 1 6.60176V18.7044C1.0006 19.0478 1.13952 19.377 1.38633 19.6199C1.63314 19.8627 1.96771 19.9994 2.31675 20ZM18.9964 10.9819V14.3154C19.0116 14.4856 18.9584 14.6549 18.8482 14.7871C18.738 14.9192 18.5796 15.0035 18.4069 15.0221H15.2313C14.6029 15.0031 14.0066 14.7442 13.5688 14.3001C13.1311 13.8561 12.8863 13.2617 12.8863 12.6431C12.8863 12.0244 13.1311 11.4301 13.5688 10.986C14.0066 10.5419 14.6029 10.283 15.2313 10.2641H18.4069C18.5817 10.2826 18.7419 10.3685 18.8525 10.5031C18.963 10.6377 19.0147 10.8099 18.9964 10.9819ZM16.2025 12.6531C16.2025 12.4632 16.1453 12.2776 16.0381 12.1197C15.9309 11.9618 15.7785 11.8388 15.6002 11.7661C15.4219 11.6935 15.2257 11.6745 15.0365 11.7115C14.8472 11.7485 14.6733 11.84 14.5369 11.9742C14.4004 12.1085 14.3075 12.2796 14.2698 12.4658C14.2322 12.652 14.2515 12.845 14.3254 13.0205C14.3992 13.1959 14.5243 13.3458 14.6847 13.4513C14.8452 13.5568 15.0338 13.6131 15.2268 13.6131C15.4856 13.6131 15.7337 13.512 15.9167 13.3319C16.0997 13.1519 16.2025 12.9077 16.2025 12.6531Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0_671_59209">
        <rect width="20" height="20" fill={color} />
      </clipPath>
    </defs>
  </svg>
)
