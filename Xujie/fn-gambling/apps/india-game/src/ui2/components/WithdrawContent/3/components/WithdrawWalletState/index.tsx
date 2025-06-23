import React from 'react';
import { useTranslation } from 'react-i18next';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import { useWithdrawStore } from '@/zustand/wallet/useWithdrawStore';
import renderI18N from '@commonUtils/renderI18N';
import cx from '@commonUtils/cx';

/**
 * Evan for [V6] Done
 */
const WithdrawStateCard = (props: {
  i18nKey: string;
  value: string;
  bgPath: string;
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={cx(
        'relative w-full',
        'bgi-text-[var(--grayscale-100)]',
        'text-base font-medium'
      )}
    >
      <img alt={'withdrawal_cash_balance'} src={props.bgPath} />
      <div
        className={cx(
          'absolute top-0 left-0 right-0 bottom-0',
          'flex flex-col justify-center items-center'
        )}
      >
        <p>{renderI18N(props, t)}</p>
        <p className="text-2xl">{props.value}</p>
      </div>
    </div>
  );
};

/**
 * Evan for [V6] Done
 */
export const WithdrawWalletState = () => {
  // const withdrawLockAssets = useWithdrawStore(
  //   (state) => state.withdrawLockAssets
  // );
  const totalAssets = useWithdrawStore((state) => state.totalAssets);
  const withdrawTotalBalance = useWithdrawStore(
    (state) => state.withdrawTotalBalance
  );

  const dashboardItems = [
    {
      i18nKey: 'withdrawal_cash_balance',
      value: formatMoney({ value: totalAssets, includeDecimal: true }),

      bgPath: getImgUrl(EResourceLevel.V, 'withdrawal_cash_balance'),
    },
    {
      i18nKey: 'withdrawal_withdrawable',
      value: formatMoney({ value: withdrawTotalBalance, includeDecimal: true }),
      bgPath: getImgUrl(EResourceLevel.V, 'withdrawal_cash_withdrawable'),
    },
  ];

  return (
    <div
      className={cx('flex justify-between items-center', 'gap-2 min-h-[90px]')}
    >
      {dashboardItems.map((item, index) => (
        <WithdrawStateCard key={index} {...item} />
      ))}
    </div>
  );
};

export default WithdrawWalletState;
