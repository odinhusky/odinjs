import {formatLocaleMoney} from "../../../../../../utils/format";
import {twMerge} from "tailwind-merge";


interface BalanceCardProps {
  title: string;
  balance?: number;
  extractable?: number;
  className?: string;
  titleClassName?: string
}

export const BalanceCard = ({
  title,
  balance,
  extractable,
  className,
  titleClassName
}: BalanceCardProps) => {
  return (
    <div
      className={twMerge(
        "w-1/3 bg-linear-5-main rounded-2xl p-4 text-white shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]",
        className
      )}
      style={{
        textShadow: '0 4px 4px #00000040',
      }}
    >
      <div
        className={
        twMerge(
          "rounded-lg text-center p-2 text-xl bg-linear-5-light-hover font-extrabold",
          titleClassName
        )
        }>
        {title}
      </div>
      <div className="flex mt-3 items-stretch">
        <div className="w-full text-center flex flex-col gap-1">
          <div className='font-extrabold text-base'>R${formatLocaleMoney(balance || 0)}</div>
          <div className="font-bold text-sm">Balanço Total</div>
        </div>
        <div className="w-[1px] bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)]"/>
        <div className="w-full text-center flex flex-col gap-1">
          <div className='font-extrabold text-base'>R${formatLocaleMoney(extractable || 0)}</div>
          <div className="font-bold text-sm">Retirável Total</div>
        </div>
      </div>
    </div>
  )
}