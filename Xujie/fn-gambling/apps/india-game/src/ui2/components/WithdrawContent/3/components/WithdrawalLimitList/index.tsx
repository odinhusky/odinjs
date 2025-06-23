import { useTranslation } from 'react-i18next';
import { useWithdrawStore } from '@/zustand/wallet/useWithdrawStore';
import { formatMoney, formatMoneyAbbrev4Digits } from '@mode2/utils';
import renderI18N from '@commonUtils/renderI18N';
import React from 'react';
import cx from '@commonUtils/cx';

/**
 * Evan for [V6] Done
 *   // Remaining Withdrawal Limit: 剩餘提款限額：(RemainingWithdrawLimit)
 *   // VIP Daily Limit: VIP每日限：(MaxWithdraw)
 *   // Wager Requirement: 下注要求：(RequireTurnover - Turnover)
 *   // Free Limit: 免費限制：(WithdrawTimes)
 */
export const WithdrawalLimitList = () => {
  const { t } = useTranslation();
  const withdrawLimit = useWithdrawStore((state) => state.withdrawLimit);
  const withdrawLimits = [
    {
      i18nKey: 'withdrawal_remaining_withdrawal_limit',
      value: formatMoneyAbbrev4Digits({
        value: withdrawLimit.remainingWithdrawLimit,
        startAbbrevNum: 100000,
        includeDecimal: false,
        includeComma: true,
      }),
    },
    {
      i18nKey: 'withdrawal_vip_daily_limit',
      value: formatMoneyAbbrev4Digits({
        value: withdrawLimit.maxWithdraw,
        startAbbrevNum: 100000,
        includeDecimal: false,
        includeComma: true,
      }),
    },
    {
      i18nKey: 'withdrawal_wager_requirement',
      value: formatMoney({
        value: withdrawLimit.remainingBetToWithdraw,  // Lewis QA: 打碼要展示全數，這主要讓用戶明確知道剩下打碼量
        includeDecimal: true
      }),
    },
    {
      i18nKey: 'withdrawal_free_limit',
      value: withdrawLimit.freeDailyWithdrawals,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {withdrawLimits.map((item, index) => {
        return (
          <div
            key={index}
            className="bgi-[var(--base-2-variant6)] rounded-full "
          >
            <div
              key={index}
              className={cx(
                'flex justify-between',
                'px-5 py-1.5',
                'bgi-text-[var(--base-2-variant1)]',
                'text-sm font-medium'
              )}
            >
              <p>{renderI18N(item, t)}</p>
              <p className={'bgi-text-[var(--grayscale-100)]'}>{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WithdrawalLimitList;
