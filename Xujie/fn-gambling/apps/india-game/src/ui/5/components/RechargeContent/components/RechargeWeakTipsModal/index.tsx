import { handleWalletPageRechargeContentWeakTipsModalPrimaryBtnClick } from '@/action/walletPageAction/acitonType';
import {
  ActionClickPayloadMap,
  HandleWalletPageClickProps,
} from '@/action/walletPageAction/useWalletPageActions';
import { useRechargeStore } from '@/zustand/wallet/rechargeStore';
import useBindPlayerPhoneModalStore from '@libs/mode2/zustand/modal/BindPlayerPhoneModal';
import WeakTipsModal from '@modals/WeakTipsModal';
import { useTranslation } from 'react-i18next';

interface RechargeWeakTipsModalProps {
  handleWalletPageClick: <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleWalletPageClickProps<T>) => void;
}

export const RechargeWeakTipsModal = ({
  handleWalletPageClick,
}: RechargeWeakTipsModalProps) => {
  const { t } = useTranslation();
  const isDepositWeakTipsModalShow = useRechargeStore(
    (state) => state.isDepositWeakTipsModalShow
  );

  const setIsDepositWeakTipsModalShow = useRechargeStore(
    (state) => state.setIsDepositWeakTipsModalShow
  );

  const setShowBindPlayerPhoneModal = useBindPlayerPhoneModalStore(
    (state) => state.setShowBindPlayerPhoneModal
  );

  return (
    <WeakTipsModal
      isShow={isDepositWeakTipsModalShow}
      title={t('deposit_warning_for_guest_account_title')}
      content={t('deposit_warning_for_guest_account_content')}
      primaryBtnText={t('deposit_warning_recharge_button')}
      secondaryBtnText={t('deposit_warning_binding_button')}
      onPrimaryBtnClick={() => {
        // 執行 Deposit 的行為邏輯
        handleWalletPageClick({
          actionName:
            handleWalletPageRechargeContentWeakTipsModalPrimaryBtnClick,
        });
      }}
      onSecondaryBtnClick={() => {
        setShowBindPlayerPhoneModal(true);
        setIsDepositWeakTipsModalShow(false);
      }}
    />
  );
};

export default RechargeWeakTipsModal;
