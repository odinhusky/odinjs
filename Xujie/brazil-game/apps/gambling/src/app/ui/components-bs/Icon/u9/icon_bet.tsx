import { ISvgProps } from ".."

export default ({ color = "white", size = "20" }: ISvgProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_53_18889)">
      <path
        d="M14.5401 17.7623L19.7657 8.69377C20.2812 7.94392 19.9063 6.87772 19.1564 6.45593L9.90041 1.10151C9.20914 0.621132 8.01406 0.937476 7.65085 1.69905L5.98711 4.5813H12.3726C13.5677 4.5813 14.5518 5.55376 14.5518 6.74884C14.5518 10.2403 14.751 14.3528 14.5401 17.7623ZM3.80785 7.31123C4.71002 7.31123 5.43644 8.03765 5.43644 8.93982C5.43644 9.84199 4.71002 10.5684 3.80785 10.5684C2.9174 10.5684 2.19098 9.84199 2.19098 8.93982C2.19098 8.03765 2.9174 7.31123 3.80785 7.31123ZM12.4429 19.1214C13.4388 19.1214 14.0012 18.3364 14.0012 17.4108V16.2978V6.74884C14.0012 5.85839 13.2748 5.12025 12.3726 5.12025C7.63913 5.12025 5.79965 5.12025 1.62859 5.12025C0.726421 5.12025 0 5.85839 0 6.74884V17.5046C0 18.395 0.726421 19.1214 1.62859 19.1214H12.4429ZM6.99473 10.4981C7.8969 10.4981 8.62332 11.2245 8.62332 12.1267C8.62332 13.0171 7.8969 13.7553 6.99473 13.7553C6.10428 13.7553 5.37786 13.0171 5.37786 12.1267C5.37786 11.2245 6.10428 10.4981 6.99473 10.4981ZM10.1816 13.685C11.0838 13.685 11.8102 14.4114 11.8102 15.3136C11.8102 16.204 11.0838 16.9422 10.1816 16.9422C9.29115 16.9422 8.56473 16.204 8.56473 15.3136C8.56473 14.4114 9.29115 13.685 10.1816 13.685Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0_53_18889">
        <rect width="20" height="20" fill={color} />
      </clipPath>
    </defs>
  </svg>
)