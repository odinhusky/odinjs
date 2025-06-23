import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import { formatMoney } from '@mode2/utils';
import React from 'react';
import cx from '@commonUtils/cx';

/**
 * Evan for [V6] Done
 */
export const CurrentlyPayProductInfo = () => {
  const currentOptAmount = useWalletPageRechargeContentStore(
    (state) => state.currentOptAmount
  );
  return (
    <div
      className={cx(
        'bgi-[var(--base-2-variant11)] rounded-[6px]',
        'py-1.5',
        'bgi-text-[var(--base-1-main)]',
        'text-[36px] font-medium text-center'
      )}
    >
      {formatMoney({ value: currentOptAmount })}
    </div>
  );
};

export default CurrentlyPayProductInfo;
