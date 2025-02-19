import cx from '@commonUtils/cx';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useWalletPageActions from '@/action/walletPageAction/useWalletPageActions';
import { handleWalletPageWithdrawBtnClick } from '@/action/walletPageAction/acitonType';
import { useWithdrawStore } from '@/zustand/wallet/useWithdrawStore';
import WeakTipsModal from '@modals/WeakTipsModal';
import { useWalletPageWithdrawContentStore } from '@/zustand/page/walletPageStore';
import { formatMoney } from '@mode2/utils';
import { extractApiMoneyString } from '@libs/commonUtils';

interface WeakTipsState {
  isShow: boolean;
  title: string;
  content: string;
  primaryBtnText: string;
  secondaryBtnText: string;
}

export const WithdrawButton = () => {
  const { t } = useTranslation();
  const { handleWalletPageClick } = useWalletPageActions();
  const withdrawTotalBalance = useWithdrawStore(
    (state) => state.withdrawTotalBalance
  );

  const resetWeakTipsState = {
    isShow: false,
    title: t('Reminder'),
    content: '',
    primaryBtnText: t('Confirm'),
    secondaryBtnText: t('Cancel'),
  };

  const withdrawLimit = useWithdrawStore((state) => state.withdrawLimit);

  const withdrawAmountInputValue = useWalletPageWithdrawContentStore(
    (state) => state.withdrawAmountInputValue
  );

  const [weakTipsState, setWeakTipsState] =
    useState<WeakTipsState>(resetWeakTipsState);

  const handleClick = useCallback(() => {
    const content =
      withdrawLimit.withdrawTimes > 0
        ? t(
            `Are you sure to withdraw ${formatMoney(
              extractApiMoneyString(withdrawAmountInputValue)
            )}`
          )
        : t(
            'Free withdrawals times has been used up. You need to pay additional ₹{9}'
          );
    setWeakTipsState({ ...resetWeakTipsState, isShow: true, content: content });
  }, [withdrawLimit, withdrawAmountInputValue]);

  const handleWithdrawAction = () => {
    handleWalletPageClick({
      actionName: handleWalletPageWithdrawBtnClick,
      payload: {
        isPasswordless: true,
      },
    });
  };

  return (
    <>
      {withdrawTotalBalance > 0 ? (
        <div
          className={cx(
            'w-screen',
            MOBILE_BREAK_POINT_MAX_WIDTH,
            '-mx-4 fixed bottom-0',
            'px-4 pt-3 pb-5',
            'bgi-[var(--base-2-variant5)]'
          )}
        >
          <BasePrimaryBtn
            className={cx('font-medium ', {
              // 'mb-[64px]': !isRechargeFromGame,
            })}
            // disabled={isEmpty(rechargeAmount)}
            debounceTimer={500}
            onClick={() => {
              handleClick();
            }}
            children={t('Withdraw')}
          />
        </div>
      ) : null}

      <WeakTipsModal
        isShow={weakTipsState.isShow}
        isShowClose={true}
        title={weakTipsState.title}
        content={weakTipsState.content}
        primaryBtnText={weakTipsState.primaryBtnText}
        onPrimaryBtnClick={() => {
          setWeakTipsState(resetWeakTipsState);
          handleWithdrawAction();
        }}
        secondaryBtnText={weakTipsState.secondaryBtnText}
        onSecondaryBtnClick={() => {
          setWeakTipsState(resetWeakTipsState);
        }}
        onClose={() => {
          setWeakTipsState(resetWeakTipsState);
        }}
      />
    </>
  );
};
