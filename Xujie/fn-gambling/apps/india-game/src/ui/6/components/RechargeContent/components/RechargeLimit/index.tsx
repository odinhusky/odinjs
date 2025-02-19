import { Trans, useTranslation } from 'react-i18next';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import React from 'react';
import { formatNumber } from '@mode2/utils';

export const RechargeLimit = () => {
  const { t } = useTranslation();
  const rechargeLimitStr = useWalletPageRechargeContentStore(
    (state) => state.rechargeLimitStr
  );
  return (
    <div className="text-base font-medium flex bgi-text-[var(--grayscale-100)]">
      <span className="">
        <Trans
          i18nKey={'wallet_deposit_deposit_amount'}
          values={{
            minLimit: rechargeLimitStr[0],
            maxLimit: rechargeLimitStr[1],
          }}
          components={{
            limitTab: <span className="font-bold" />,
          }}
        />

        {/*{t('wallet_deposit_deposit_amount', {*/}
        {/*  minLimit: rechargeLimitStr[0],*/}
        {/*  maxLimit: rechargeLimitStr[1],*/}
        {/*})}*/}
      </span>
      {/*<StarMark className="ml-[4px]" />*/}
    </div>
  );
};

export default RechargeLimit;
