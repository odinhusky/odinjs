import { ISvgProps } from ".."

export default ({ color = "white", size = "20" }: ISvgProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_28_8802)">
      <path
        d="M19.5657 9.10305C19.9594 8.71939 20.0983 8.15632 19.9285 7.63289C19.7583 7.10946 19.315 6.73581 18.7704 6.65652L13.9277 5.95287C13.7215 5.92284 13.5433 5.79348 13.4512 5.60646L11.2862 1.21879C11.0431 0.725801 10.5497 0.419434 9.99983 0.419434C9.45037 0.419434 8.95698 0.725801 8.71389 1.21879L6.54849 5.60686C6.45638 5.79388 6.27776 5.92324 6.07152 5.95327L1.2289 6.65692C0.684651 6.73581 0.240918 7.10986 0.0707142 7.63329C-0.0990896 8.15672 0.0398771 8.71979 0.43355 9.10345L3.93735 12.5188C4.08673 12.6645 4.15522 12.8744 4.11997 13.0794L3.29338 17.902C3.22009 18.3265 3.33143 18.7394 3.60616 19.065C4.03307 19.5724 4.77836 19.727 5.37428 19.4138L9.70507 17.1367C9.88609 17.0418 10.114 17.0426 10.2946 17.1367L14.6258 19.4138C14.8364 19.5248 15.0611 19.5808 15.293 19.5808C15.7163 19.5808 16.1176 19.3926 16.3935 19.065C16.6686 18.7394 16.7796 18.3257 16.7063 17.902L15.8793 13.0794C15.844 12.874 15.9125 12.6645 16.0619 12.5188L19.5657 9.10305Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0_28_8802">
        <rect width="20" height="20" fill={color} />
      </clipPath>
    </defs>
  </svg>
)