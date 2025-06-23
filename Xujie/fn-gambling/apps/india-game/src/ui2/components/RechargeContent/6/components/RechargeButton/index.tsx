import useWalletPageActions from '@/action/walletPageAction/useWalletPageActions';
import { useTranslation } from 'react-i18next';
import { useRechargeStore } from '@/zustand/wallet/rechargeStore';
import cx from '@commonUtils/cx';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import isEmpty from 'lodash/isEmpty';
import { handleWalletPageRechargeDepositExtraBtnClick } from '@mode2/action/actionTypes';
import React from 'react';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';

/**
 * Evan for [V6] Done
 */
export const RechargeButton = ({
  isRechargeFromGame,
}: {
  isRechargeFromGame: boolean;
}) => {
  const { handleWalletPageClick } = useWalletPageActions();
  const { t } = useTranslation();

  const rechargeAmount = useRechargeStore((state) => state.rechargeAmount);
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
        className={cx('!h-[46px] px-4 py-3 box-border', 'm-auto')}
        classNameText="text-xl font-medium"
        disabled={isEmpty(rechargeAmount)}
        debounceTimer={500}
        onClick={() => {
          handleWalletPageClick({
            actionName: handleWalletPageRechargeDepositExtraBtnClick,
            payload: { isRechargeFromGame },
          });
        }}
        children={t('deposit_pay_button')}
      />
    </div>
  );
};

export default RechargeButton;
