import React from 'react';
import { useTranslation } from 'react-i18next';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';
import { useDeepEffect } from '@libs/commonUtils';
import { useToastStore } from '@mode2/zustand/components/toastStore';
import InfoModal from '@modals/InfoModal';
import { useUserState } from '@/usecase/useUserState';

export const WithdrawSuccessModal = () => {
  const { t } = useTranslation();

  const withdrawalsState = useWalletPageStore(
    (state) => state.withdrawalsState
  );

  const { refreshUserState } = useUserState();

  useDeepEffect(() => {
    if (withdrawalsState) {
      useToastStore.getState().showToast('withdrawal_success_toast');
    }
  }, [withdrawalsState]);

  return (
    <InfoModal
      isShow={withdrawalsState}
      content={t('withdrawal_success_expected_time')}
      onConfirmClick={() => {
        refreshUserState();
        useWalletPageStore.getState().setWithdrawalsState(false);
      }}
    />
  );
};

export default WithdrawSuccessModal;
