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
      d="M17.4998 1.0415H12.4998C11.6944 1.0415 11.0415 1.69442 11.0415 2.49984V7.49984C11.0415 8.30525 11.6944 8.95817 12.4998 8.95817H17.4998C18.3053 8.95817 18.9582 8.30525 18.9582 7.49984V2.49984C18.9582 1.69442 18.3053 1.0415 17.4998 1.0415Z"
      fill={color}
    />
    <path
      d="M18.9442 13.9688L16.0308 11.0554C15.757 10.7826 15.3863 10.6294 14.9997 10.6294C14.6132 10.6294 14.2424 10.7826 13.9687 11.0554L11.0552 13.9688C10.7822 14.2425 10.6289 14.6133 10.6289 14.9999C10.6289 15.3865 10.7822 15.7573 11.0552 16.031L13.9687 18.9444C14.2423 19.2175 14.6131 19.3709 14.9997 19.3709C15.3863 19.3709 15.7572 19.2175 16.0308 18.9444L18.9442 16.031C19.2174 15.7574 19.3709 15.3866 19.3709 14.9999C19.3709 14.6133 19.2174 14.2424 18.9442 13.9688Z"
      fill={color}
    />
    <path
      d="M7.49984 1.0415H2.49984C1.69442 1.0415 1.0415 1.69442 1.0415 2.49984V7.49984C1.0415 8.30525 1.69442 8.95817 2.49984 8.95817H7.49984C8.30525 8.95817 8.95817 8.30525 8.95817 7.49984V2.49984C8.95817 1.69442 8.30525 1.0415 7.49984 1.0415Z"
      fill={color}
    />
    <path
      d="M7.49984 11.0415H2.49984C1.69442 11.0415 1.0415 11.6944 1.0415 12.4998V17.4998C1.0415 18.3053 1.69442 18.9582 2.49984 18.9582H7.49984C8.30525 18.9582 8.95817 18.3053 8.95817 17.4998V12.4998C8.95817 11.6944 8.30525 11.0415 7.49984 11.0415Z"
      fill={color}
    />
  </svg>
)