import WeakTipsModal from '@modals/WeakTipsModal';
import { useTranslation } from 'react-i18next';
import { useRechargeStore } from '@/zustand/wallet/rechargeStore';
import {
  ActionClickPayloadMap,
  HandleWalletPageClickProps,
} from '@/action/walletPageAction/useWalletPageActions';
import sdkUtils from '@mode2/utils/sdk';
import { handleWalletPageRechargeContentDepositBtnClick } from '@mode2/action/actionTypes';

interface InProgressCountTipsModelProps {
  isRechargeFromGame: boolean;
  handleWalletPageClick: <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleWalletPageClickProps<T>) => void;
}

export const InProgressCountTipsModel = ({
  isRechargeFromGame,
  handleWalletPageClick,
}: InProgressCountTipsModelProps) => {
  const { t } = useTranslation();
  const isInProgressTipsModalShow = useRechargeStore(
    (state) => state.isInProgressTipsModalShow
  );
  const setInProgressTipsModalShow = useRechargeStore(
    (state) => state.setInProgressTipsModalShow
  );
  const inProgressRecharge2h = useRechargeStore(
    (state) => state.inProgressRecharge2h
  );

  return (
    <WeakTipsModal
      isShowClose={true}
      isShowDivider={true}
      buttonsContainerClassName={'flex-col'}
      isShow={isInProgressTipsModalShow}
      title={t('deposit_alert_unpaid_orders_title')}
      content={t('deposit_alert_unpaid_orders_content', {
        inProgressCount: inProgressRecharge2h,
      })}
      secondaryBtnText={t(
        'deposit_alert_unpaid_orders_contact_customer_service_button'
      )}
      onSecondaryBtnClick={() => {
        sdkUtils.openChat(() => {});
        setInProgressTipsModalShow(false);
      }}
      primaryBtnText={t('deposit_alert_unpaid_orders_continue_pay_button')}
      onPrimaryBtnClick={() => {
        handleWalletPageClick({
          actionName: handleWalletPageRechargeContentDepositBtnClick,
          payload: { isRechargeFromGame },
        });
        setInProgressTipsModalShow(false);
      }}
      onClose={() => {
        setInProgressTipsModalShow(false);
      }}
    />
  );
};

export default InProgressCountTipsModel;
