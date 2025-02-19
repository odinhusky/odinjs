import React from 'react';
import { useTranslation } from 'react-i18next';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import { useWithdrawStore } from '@/zustand/wallet/useWithdrawStore';
import renderI18N from '@commonUtils/renderI18N';

const WithdrawStateCard = (props: {
  i18nKey: string;
  value: string;
  bgPath: string;
}) => {
  const { t } = useTranslation();
  return (
    <div className="relative w-full bgi-text-[var(--grayscale-100)] text-base font-medium">
      <img alt={'withdrawal_cash_balance'} src={props.bgPath} />
      <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center">
        <p>{renderI18N(props, t)}</p>
        <p className="text-2xl">{props.value}</p>
      </div>
    </div>
  );
};

export const WithdrawWalletState = () => {
  // const { t } = useTranslation();
  const withdrawLockAssets = useWithdrawStore(
    (state) => state.withdrawLockAssets
  );
  const withdrawTotalBalance = useWithdrawStore(
    (state) => state.withdrawTotalBalance
  );

  const dashboardItems = [
    {
      i18nKey: 'Cash Balance',
      value: formatMoney(withdrawLockAssets),
      bgPath: getImgUrl(EResourceLevel.V, 'withdrawal_cash_balance'),
    },
    {
      i18nKey: 'Withdrawable',
      value: formatMoney(withdrawTotalBalance),
      bgPath: getImgUrl(EResourceLevel.V, 'withdrawal_cash_withdrawable'),
    },
  ];

  // TODO i18n
  return (
    <div className="flex justify-between items-center gap-2 min-h-[90px]">
      {dashboardItems.map((item, index) => (
        <WithdrawStateCard key={index} {...item} />
      ))}
    </div>
  );
};

export default WithdrawWalletState;
