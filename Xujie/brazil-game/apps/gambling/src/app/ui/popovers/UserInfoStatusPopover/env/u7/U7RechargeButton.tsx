import cx from 'apps/gambling/src/app/ui/utils/cx';
import { ReactNode } from 'react';
import { formatLocaleMoney } from '../../../../utils/format';
import t from 'apps/gambling/src/assets/constant/lang';
import U7OutlinedBtn from '../../../../components-bs/Buttons/env/u7/U7OutlinedBtn';
import { FLEX_CENTER } from "../../../../../../assets/constant/style";

interface U7RechargeButtonProps {
  onClick: () => void;
  className: string;
  totalValue: number;
  titleName: string;
  children: ReactNode;
}

export const U7RechargeButton = ({
  onClick,
  className,
  totalValue,
  titleName,
  children,
}: U7RechargeButtonProps) => {
  return (
    <div className={cx('flex-1 w-full', 'flex justify-between flex-col')}>
      <div
        className={cx(
          'phone:min-w-[164px]',
          'flex justify-between flex-col',
          'text-center'
        )}
      >
        <div
          className={cx(
            'font-bold text-[var(--grayscale-100)]',
            'text-sm leading-[18px]'
          )}
        >
          {t['moneyWithRSign'](formatLocaleMoney(totalValue))}
        </div>

        <div
          className={cx(
            'mt-2',
            'text-[var(--transparent-white-70)] font-medium',
            'text-sm leading-[18px]'
          )}
        >
          {titleName}
        </div>
      </div>

      <button
        disabled={false}
        onClick={onClick}
        className={cx(
          FLEX_CENTER,
          'p-[9px]',
          'w-full',
          'mt-3',
          'linear-2-button',
          'font-bold',
          'text-sm leading-[18px]',
          'rounded-[100px]',
          'active:text-[var(--grayscale-70)]',
          className
        )}
      >
        {children}
      </button>
    </div>
  );
};

export default U7RechargeButton;
