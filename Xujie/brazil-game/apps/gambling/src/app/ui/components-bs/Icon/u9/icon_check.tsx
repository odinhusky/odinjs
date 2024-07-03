import { ISvgProps } from ".."

export default ({ color = "white", size = "20" }: ISvgProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_31_11560)">
      <path
        d="M19.5353 3.26877C18.9165 2.64915 17.9116 2.64954 17.292 3.26877L7.19574 13.3654L2.70838 8.87812C2.08875 8.25849 1.08435 8.25849 0.464721 8.87812C-0.154907 9.49774 -0.154907 10.5021 0.464721 11.1218L6.07367 16.7307C6.38329 17.0403 6.78928 17.1955 7.19531 17.1955C7.60134 17.1955 8.00772 17.0407 8.31733 16.7307L19.5353 5.51239C20.1549 4.8932 20.1549 3.88836 19.5353 3.26877Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0_31_11560">
        <rect width="20" height="20" fill={color} />
      </clipPath>
    </defs>
  </svg>
)
