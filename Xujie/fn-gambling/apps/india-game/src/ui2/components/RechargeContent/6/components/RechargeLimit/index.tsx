import { useTranslation } from 'react-i18next';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import React from 'react';
import cx from '@commonUtils/cx';

/**
 * Evan for [V6] Done
 */
export const RechargeLimit = () => {
  const { t } = useTranslation();
  const rechargeLimitStr = useWalletPageRechargeContentStore(
    (state) => state.rechargeLimitStr
  );
  return (
    <div
      className={cx(
        'flex items-center',
        'text-base font-medium bgi-text-[var(--grayscale-100)]'
      )}
    >
      <p>{t('deposit_deposit_amount')}</p>
      <p className="mr-4 ml-6">
        {t('deposit_min_amount')}: {rechargeLimitStr[0]}
      </p>
      <p>
        {t('deposit_max_amount')}: {rechargeLimitStr[1]}
      </p>
    </div>
  );
};

export default RechargeLimit;
