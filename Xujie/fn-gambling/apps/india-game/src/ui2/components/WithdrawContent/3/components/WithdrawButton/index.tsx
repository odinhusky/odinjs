import cx from '@commonUtils/cx';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useWalletPageActions from '@/action/walletPageAction/useWalletPageActions';
import { handleWalletPageWithdrawBtnClick } from '@mode2/action/actionTypes';
import { useWithdrawStore } from '@/zustand/wallet/useWithdrawStore';
import { useWalletPageWithdrawContentStore } from '@/zustand/page/walletPageStore';
import { formatMoney } from '@mode2/utils';
import { useUserVerifyState } from '@/usecase/useUserVerifyState';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';
import WithdrawBottomTips from '../WithdrawBottomTips';

export const WithdrawButton = () => {
  const { t } = useTranslation();
  const { handleWalletPageClick } = useWalletPageActions();

  const setWalletWeakTipsState = useWalletPageStore(
    (state) => state.setWalletWeakTipsState
  );

  const setWithdrawBottomTipsState = useWalletPageStore(
    (state) => state.setWithdrawBottomTipsState
  );

  const withdrawAmountSelected = useWalletPageWithdrawContentStore(
    (state) => state.withdrawAmountSelected
  );

  const withdrawTotalBalance = useWithdrawStore(
    (state) => state.withdrawTotalBalance
  );
  const withdrawLockAssets = useWithdrawStore(
    (state) => state.withdrawLockAssets
  );
  const withdrawLimit = useWithdrawStore((state) => state.withdrawLimit);

  const { checkIsBankFirstBind } = useUserVerifyState();

  const resetWeakTipsState = {
    isShow: false,
    isShowClose: true,
    title: t('withdrawal_no_free_withdrawals_times_reminder_title'),
    content: '',
    primaryBtnText: t(
      'withdrawal_no_free_withdrawals_times_reminder_confirme_button'
    ),
    secondaryBtnText: t(
      'withdrawal_no_free_withdrawals_times_reminder_cancel_button'
    ),
  };

  // const [bottomTips, setBottomTips] =
  //   useState<WithdrawBottomTipsProps>(resetBottomTips);

  const handleWithdrawClick = useCallback(() => {
    if (withdrawAmountSelected.amount > withdrawTotalBalance) {
      // TODO 當前 提領選項 大於可領金額 ，顯示底部tips [withdrawTotalBalance]
      // "withdrawal_withdrawable_cash": "Withdrawable Cash: {{totalBalance}}, Remain wager: {{lockAssets}}",
      // "withdrawal_remaining_bet_to_withdraw": "(Please continue to bet {{remainingBetToWithdraw}} to withdraw)",
      const options = {
        totalBalance: formatMoney({ value: withdrawTotalBalance }),
        lockAssets: formatMoney({ value: withdrawLockAssets }),
        // remainingBetToWithdraw: formatMoney(
        //   withdrawLimit.remainingBetToWithdraw
        // ),
      };
      setWithdrawBottomTipsState({
        isShow: true,
        messages: [
          t('withdrawal_withdrawable_cash', options),
          t('withdrawal_remaining_bet_to_withdraw', options),
        ],
        dismissCallback: () => {
          // setBottomTips(resetBottomTips);
        },
      });
      return;
    } else {
      const options = {
        withdrawAmount: formatMoney({ value: withdrawAmountSelected.amount }),
        additionalFee: formatMoney({ value: withdrawAmountSelected.fee }),
      };
      const content =
        withdrawLimit.freeDailyWithdrawals > 0
          ? 'withdrawal_reconfirm_reminder_content'
          : 'withdrawal_no_free_withdrawals_times_reminder_content';

      setWalletWeakTipsState({
        ...resetWeakTipsState,
        isShow: true,
        content: t(content, options),
        onPrimaryCallback: () => {
          handleWithdrawAction();
        },
        onSecondaryCallback: () => {},
        onCloseCallback: () => {},
      });
    }
  }, [withdrawLimit, withdrawAmountSelected, withdrawTotalBalance]);

  const handleWithdrawAction = () => {
    handleWalletPageClick({
      actionName: handleWalletPageWithdrawBtnClick,
      payload: {
        isPasswordless: true,
      },
    });
  };

  //

  return (
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
        className={cx('font-medium h-[46px]', {
          // 'mb-[64px]': !isRechargeFromGame,
        })}
        classNameText='text-xl font-medium'
        disabled={checkIsBankFirstBind()}
        debounceTimer={500}
        onClick={() => {
          handleWithdrawClick();
        }}
        children={t('withdraw_button')}
      />
      <WithdrawBottomTips />
    </div>
  );
};
