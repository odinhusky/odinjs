import {
  handleWalletPageRechargeContentWeakTipsModalBindPlayerPhoneBtnClick,
  handleWalletPageRechargeContentWeakTipsModalCloseBtnClick,
  handleWalletPageRechargeContentWeakTipsModalPrimaryBtnClick,
} from '@mode2/action/actionTypes';
import {
  ActionClickPayloadMap,
  HandleWalletPageClickProps,
} from '@/action/walletPageAction/useWalletPageActions';
import { useRechargeStore } from '@/zustand/wallet/rechargeStore';
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

  return (
    <WeakTipsModal
      isShow={isDepositWeakTipsModalShow}
      isShowClose={true}
      title={t('deposit_warning_for_guest_account_title')}
      content={t('deposit_warning_for_guest_account_content')}
      primaryBtnText={t('deposit_warning_recharge_button')}
      secondaryBtnText={t('deposit_warning_binding_button')}
      onClose={() => {
        handleWalletPageClick({
          actionName: handleWalletPageRechargeContentWeakTipsModalCloseBtnClick,
        });
      }}
      onPrimaryBtnClick={() => {
        handleWalletPageClick({
          actionName:
            handleWalletPageRechargeContentWeakTipsModalPrimaryBtnClick,
        });
      }}
      onSecondaryBtnClick={() => {
        handleWalletPageClick({
          actionName:
            handleWalletPageRechargeContentWeakTipsModalBindPlayerPhoneBtnClick,
        });
      }}
    />
  );
};

export default RechargeWeakTipsModal;
