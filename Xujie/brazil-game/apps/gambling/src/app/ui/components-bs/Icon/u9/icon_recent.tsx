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
      d="M10.4806 4.00001C9.19587 4.00355 7.94107 4.35845 6.87471 5.01988C5.80834 5.68132 4.97824 6.61962 4.48924 7.71629C4.00024 8.81295 3.87428 10.0188 4.12727 11.1815C4.38026 12.3442 5.00085 13.4116 5.91066 14.2489C6.82046 15.0863 7.97868 15.6559 9.23903 15.886C10.4994 16.1161 11.8053 15.9962 12.9919 15.5416C14.1785 15.0869 15.1925 14.3179 15.9059 13.3316C16.6193 12.3453 17 11.1859 17 10C16.9992 9.2108 16.8298 8.42947 16.5016 7.70071C16.1735 6.97194 15.6929 6.31002 15.0875 5.75279C14.482 5.19556 13.7635 4.75395 12.973 4.45319C12.1825 4.15244 11.3356 3.99844 10.4806 4.00001ZM13.9374 11.2764H9.83449C9.65114 11.2764 9.47529 11.2091 9.34563 11.0894C9.21598 10.9698 9.14314 10.8074 9.14314 10.6382V6.17099H10.4806V10H13.9374V11.2764Z"
      fill={color}
    />
    <path
      d="M10.5999 18.9999C8.89278 18.9969 7.21937 18.5426 5.7624 17.6866C4.30542 16.8306 3.1209 15.6057 2.3382 14.1459L3.52289 13.5459C4.42628 15.2156 5.93413 16.5088 7.76133 17.1812C9.58852 17.8535 11.6084 17.8583 13.439 17.1946C15.2696 16.5309 16.7841 15.2448 17.696 13.5794C18.6079 11.9141 18.854 9.98486 18.3879 8.15665C17.9218 6.32845 16.7757 4.72796 15.1663 3.65783C13.5569 2.5877 11.5959 2.12211 9.65391 2.34911C7.71196 2.5761 5.92376 3.47993 4.62743 4.88971C3.3311 6.29948 2.61651 8.11746 2.61879 9.99989C2.61794 10.1483 2.56367 10.2919 2.46522 10.4061C2.36677 10.5204 2.23022 10.5983 2.0788 10.6266C1.92739 10.6549 1.77047 10.6318 1.63473 10.5613C1.499 10.4908 1.39285 10.3772 1.33434 10.2399L0 7.02989L1.24704 6.55589L1.65233 7.53389C2.1295 5.9223 3.06476 4.47091 4.3528 3.34316C5.64084 2.21541 7.23049 1.45609 8.94274 1.15071C10.655 0.845332 12.4218 1.00602 14.0443 1.61468C15.6668 2.22334 17.0805 3.2558 18.1261 4.59579C19.1718 5.93578 19.8079 7.53008 19.9629 9.19915C20.1179 10.8682 19.7855 12.5458 19.0032 14.0429C18.2209 15.5401 17.0199 16.7973 15.5352 17.6731C14.0505 18.5488 12.3413 19.0084 10.5999 18.9999Z"
      fill={color}
    />
  </svg>
)
