import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import { formatMoney } from '@mode2/utils';
import React from 'react';

export const CurrentlyPayProductInfo = () => {
  const currentOptAmount = useWalletPageRechargeContentStore(
    (state) => state.currentOptAmount
  );
  return (
    <div className="bgi-[var(--base-2-variant11)] rounded-[6px] text-[36px] font-medium bgi-text-[var(--base-1-main)] py-1.5 text-center">
      {formatMoney(currentOptAmount)}
    </div>
  );
};

export default CurrentlyPayProductInfo;
