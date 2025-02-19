import { useTranslation } from 'react-i18next';
import { useWithdrawStore } from '@/zustand/wallet/useWithdrawStore';
import cx from '@commonUtils/cx';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import React from 'react';
import { formatMoney } from '@mode2/utils';

export const WithdrawBottomTips = () => {
  const { t } = useTranslation();
  const withdrawLockAssets = useWithdrawStore(
    (state) => state.withdrawLockAssets
  );
  const withdrawTotalBalance = useWithdrawStore(
    (state) => state.withdrawTotalBalance
  );

  return withdrawTotalBalance <= 0 ? (
    <div
      className={cx(
        'w-screen',
        MOBILE_BREAK_POINT_MAX_WIDTH,
        '-mx-4 fixed bottom-0',
        'px-4 py-5',
        'bgi-[var(--state-error-variant1)]',
        'text-sm bgi-text-[var(--grayscale-100)]'
      )}
    >
      <p>
        {t(
          `Withdrawable Cash:${formatMoney(
            0,
            true
          )}, Remain wager: ${formatMoney(withdrawLockAssets, true)}`
        )}
      </p>
      <p>
        {t(
          `(Please continue to bet ${formatMoney(
            withdrawLockAssets,
            true
          )} to withdraw)`
        )}
      </p>
    </div>
  ) : null;
};

export default WithdrawBottomTips;
