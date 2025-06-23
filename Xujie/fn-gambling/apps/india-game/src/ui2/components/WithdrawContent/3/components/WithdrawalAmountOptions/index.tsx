import cx from '@commonUtils/cx';
import { formatMoney } from '@mode2/utils';
import { useTranslation } from 'react-i18next';
import React, { useCallback } from 'react';
import {
  useWithdrawStore,
  WithdrawOptItem,
} from '@/zustand/wallet/useWithdrawStore';
import useWalletPageActions from '@/action/walletPageAction/useWalletPageActions';
import { handleWalletPageWithdrawAmountSelected } from '@mode2/action/actionTypes';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';

/**
 * Evan for [V6] Done
 */
const WithdrawalAmountItem = ({ item }: { item: WithdrawOptItem }) => {
  const { handleWalletPageClick } = useWalletPageActions();
  // const withdrawTotalBalance = useWithdrawStore(
  //   (state) => state.withdrawTotalBalance
  // );
  const resetWalletBottomTipsState = useWalletPageStore(
    (state) => state.resetWalletBottomTipsState
  );

  const handleWithdrawalAmountSelected = useCallback(
    (item: WithdrawOptItem) => {
      resetWalletBottomTipsState();
      if (!item.disabled) {
        handleWalletPageClick({
          actionName: handleWalletPageWithdrawAmountSelected,
          payload: {
            item: item,
          },
        });
      }
    },
    []
  );

  return (
    <div
      className={cx(
        'relative w-full',
        'flex justify-center items-center',
        'cursor-pointer',
        'rounded-md',
        'font-medium bgi-text-[var(--grayscale-100)]',
        {
          'bgi-border-[var(--base-1-variant1)] after:rounded-md after:border-[1.5px]':
            item.isActive,
          'bgi-[var(--base-2-variant4)]': item.isActive && !item.disabled,
          'bgi-[var(--base-2-variant6)]': !item.isActive && !item.disabled,
          'cursor-default bgi-[var(--base-2-variant13)]': item.disabled,
        }
      )}
      onClick={() => handleWithdrawalAmountSelected(item)}
    >
      <p
        className={cx(
          'my-2.5 mx-0.5 w-full text-center',
          'text-[clamp(18px,0.5rem,20px)]'
        )}
      >
        {formatMoney({ value: item?.amount })}
      </p>
    </div>
  );
};

/**
 * Evan for [V6] Done
 */
export const WithdrawalAmountOptions = () => {
  const { t } = useTranslation();
  const withdrawOptions = useWithdrawStore((state) => state.withdrawOptions);

  return (
    <div
      className={cx(
        'flex flex-col gap-[6px]',
        'bgi-text-[var(--grayscale-100)] text-base font-medium'
      )}
    >
      <div>{t('withdrawal_withdrawal_amount')}</div>
      <div
        className={cx('select-none', 'grid grid-cols-3 gap-y-3 gap-x-2 py-2')}
      >
        {withdrawOptions.map((item, index) => {
          return <WithdrawalAmountItem key={index} item={item} />;
        })}
      </div>
    </div>
  );
};

export default WithdrawalAmountOptions;
