import { formatLocaleMoney } from "../../../../../../utils/format";

type IdepositButtonProps = {
  rechargeValue: number;
  isMobile: boolean;
  rate: string;
}
export const depositButtonProps = ({
  rechargeValue,
  isMobile,
  rate,
}: IdepositButtonProps) => {

  const rechargeStyle =
  `
  md:flex-1
  text-sm md:text-lg lg:text-xl xl:text-2xl
  text-center ${rate === '' ? 'md:text-center' : 'md:text-right'}
  `;

  const rateStyle =
  `
  w-full
  md:w-auto md:flex-1
  md:self-end text-right
  lg:text-left sm:self-center
  text-xs md:text-lg  lg:text-lg xl:text-xl
  `;

  return {
    rechargeValue: `R$ ${formatLocaleMoney(rechargeValue)}`,
    rechargeClassName: rechargeStyle,
    className: `flex-col-reverse px-3 py-2 min-h-[50px] rounded-md text-white  items-center justify-center`,
    activeRechargeClassName: `${rechargeStyle} text-[#047A70]`,
    bgClassName: 'bg-[#069D5C]',
    activeBgClassName: 'bg-gradient-to-b from-[#C8F568] to-[#16FF8F]',
    rate: `+ R$ ${rate}`,
    rateClassName: ` text-[#FDEF70] ${rateStyle} `,
    activeRateClassName: `text-[#047A70] ${rateStyle}`,
    isRateTag: false,
    rateTagClassName: '',
  }
}
