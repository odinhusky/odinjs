import cx from "apps/gambling/src/app/ui/utils/cx";
import WalletBalanceItem from "./WalletBalanceItem";
import { BalanceSectionType, BalanceSectionValue } from "../types/walletTypes";
import t from "apps/gambling/src/assets/constant/lang";

interface WalletTotalSectionProps {
  balanceSectionValue?: BalanceSectionValue;
  tabState: BalanceSectionType;
}

export const WalletTotalSection = ({
  balanceSectionValue,
  tabState,
}: WalletTotalSectionProps) => {
  
  const descriptionText = {
    'total': t['totalCountDescription'],
    'deposit': t['depositDescription'],
    'promotion': t['promotionDescription'],
  };

  return (
    <div
        className={cx('bg-linear-3-main',
          'rounded-xl',
          'mt-2 mobile:mt-3',
          'px-5 py-3 mobile:px-9 mobile:py-5 tablet:px-[225px]'
        )}
      >
        <div className='text-center text-xs mobile:text-sm tablet:text-base border-b w-full pb-1'>{descriptionText[tabState]}</div>

        <div
          className={cx(
            'flex justify-between mobile:justify-center',
            'gap-5 tablet:gap-[90px]',
            'mt-2 mobile:mt-3 ',
          )}
        >
          <WalletBalanceItem
            amount={(balanceSectionValue && balanceSectionValue[tabState]?.balance) || 0}
            unit={tabState === 'total'? `${t['Balance']} ${t['Total']}` : t['Balance']}
          />
          
          <WalletBalanceItem
            amount={(balanceSectionValue && balanceSectionValue[tabState]?.retrievable) || 0}
            unit={tabState === 'total'? `${t['Withdrawable']} ${t['Total']}` : t['Withdrawable']}
          />
        </div>
      </div>
  )
}

export default WalletTotalSection;