import { useTranslation } from 'react-i18next';
import { useWithdrawStore } from '@/zustand/wallet/useWithdrawStore';
import { formatMoney } from '@mode2/utils';
import renderI18N from '@commonUtils/renderI18N';
import React from 'react';

export const WithdrawalLimitList = () => {
  // Remaining Withdrawal Limit: 剩餘提款限額：(RemainingWithdrawLimit)
  // VIP Daily Limit: VIP每日限：(MaxWithdraw)
  // Wager Requirement: 下注要求：(RequireTurnover - Turnover)
  // Free Limit: 免費限制：(WithdrawTimes)

  const { t } = useTranslation();
  const withdrawLimit = useWithdrawStore((state) => state.withdrawLimit);

  const withdrawLimits = [
    {
      i18nKey: 'Remaining Withdrawal Limit',
      value: formatMoney(withdrawLimit.remainingWithdrawLimit),
    },
    {
      i18nKey: 'VIP Daily Limit:',
      value: formatMoney(withdrawLimit.maxWithdraw),
    },
    {
      i18nKey: 'Wager Requirement:',
      value: formatMoney(withdrawLimit.remainingBetToWithdraw),
    },
    { i18nKey: 'Free Limit:', value: withdrawLimit.withdrawTimes },
  ];

  return (
    <div className="flex flex-col gap-4">
      {withdrawLimits.map((item, index) => {
        return (
          <div className="bgi-[var(--base-2-variant6)] rounded-full ">
            <div
              key={index}
              className="flex justify-between px-5 py-1.5 bgi-text-[var(--base-2-variant1)] text-sm font-medium"
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
