import cx from "apps/gambling/src/app/ui/utils/cx";
import { formatLocaleMoney } from "apps/gambling/src/app/ui/utils/format";

interface WalletBalanceItemProps {
  amount: number;
  unit: string;
}

export const WalletBalanceItem = ({
  amount,
  unit
}: WalletBalanceItemProps) => {
  return (
    <div className={cx(
      'flex flex-col gap-1 justify-center items-center w-full text-center',
      'mobile:gap-3'
    )}>
     <div 
        className={cx(
          'text-base mobile:text-2xl tablet:text-[40px] font-bold'
        )}
      >
        R$ <br className='mobile:hidden' /> {formatLocaleMoney(amount)}
      </div>
     <div className='font-medium text-sm tablet:text-base'>{unit}</div>
   </div>
  )
}

export default WalletBalanceItem;