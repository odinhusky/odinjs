import cx from "apps/gambling/src/app/ui/utils/cx";
import t from "apps/gambling/src/assets/constant/lang";
import { useState } from "react";
import BaseBadge from "apps/gambling/src/app/ui/components-bs/Badge/BaseBadge";
import { FLEX_CENTER } from "apps/gambling/src/assets/constant/style";
import { formatLocaleMoney } from "apps/gambling/src/app/ui/utils/format";

interface WalletDepositBtnProps {
  isSelected: boolean;
  onClick: () => void;
  rechargeValue: number;
  rate: string;
  isShowRate: boolean;
}

export const WalletDepositBtn = ({
  isSelected,
  onClick,
  rechargeValue,
  rate,
  isShowRate
}: WalletDepositBtnProps) => {

  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <button
      className={
        cx(
          FLEX_CENTER,
          'flex-col gap-1',
          'rounded-lg',
          'min-h-[72px]',
          'bg-[var(--grayscale-50)]',

          {
            'bg-linear-3-main': hover || active || isSelected
          }
        )
      }
      onMouseOver={() => { setHover(true); }}
      onMouseOut={() => { setHover(false); }}
      onMouseDown={() => { setActive(true); }}
      onMouseUp={() => { setActive(false); }}
      onTouchStart={() => { setActive(true); }}
      onTouchEnd={() => { setActive(false); }}
      onClick={onClick}
    >
      <div className={cx(
        'font-bold tablet:font-medium',
        'text-sm tablet:text-base',
        'leading-5 tablet:leading-6'
      )}>
        +{t['moneyWithRSign'](formatLocaleMoney(rechargeValue))}
      </div>

      {isShowRate && (
        <BaseBadge
          className={cx(
            'h-6',
            'bg-[var(--transparente-20)]',
            {
              'bg-linear-1-main text-white': hover || active || isSelected
            }
          )}
          text={t['moneyWithRSign'](rate)}
        />
      )}
    </button>
  )
}

export default WalletDepositBtn;