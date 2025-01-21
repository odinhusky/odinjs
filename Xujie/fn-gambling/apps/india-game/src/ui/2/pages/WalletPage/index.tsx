import './index.scss';
import WalletPageSwitchTabs from './components/WalletPageSwitchTabs';
import RechargeContent from '@components/RechargeContent';
import useWalletPageBase from '@/ui/hooks/pages/walletPage/useWalletPageBase';

import cx from '@commonUtils/cx';
import { InternalPayContent } from '@/components/InternalPayContent';
import {
  RechargeStatusResult,
  useRechargeStore,
} from '@/zustand/wallet/rechargeStore';
import { useEffect } from 'react';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { KYC_BOTH_STATE } from '@constant/KYC';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';
import CustomizeCheckoutPage from '@pages/CustomizeCheckoutPage';
import { useUserVerifyState } from '@/usecase/useUserVerifyState';
import WalletPageDesktopHeader from '@pages/WalletPage/components/WalletPageDesktopHeader';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import RechargeNoticeModal from '@modals/RechargeNoticeModal';
import WithdrawContent from '@components/WithdrawContent';

const WalletPage = () => {
  useWalletPageBase();

  const navigate = useNavigateClick();
  const { checkIsBankFirstBind } = useUserVerifyState();

  const curSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.curSwitchContentTabId
  );

  const rechargeStatus = useRechargeStore((state) => state.rechargeStatus);

  useEffect(() => {
    if (
      curSwitchContentTabId === WalletPageTabType.WITHDRAW &&
      checkIsBankFirstBind()
    ) {
      navigate(BasePagePathObj.BindKYCPage, {
        state: { tab: KYC_BOTH_STATE, from: BasePagePathObj.WalletPage },
      });
    }
  }, [curSwitchContentTabId]);
  return rechargeStatus === RechargeStatusResult.INTERNAL ? (
    <InternalPayContent id={'pay-iframe'} title={'pay iframe'} />
  ) : rechargeStatus === RechargeStatusResult.CUSTOMIZED ? (
    <CustomizeCheckoutPage />
  ) : (
    <div
      className={cx(
        'wallet mt-4 mobile:mt-6',
        'pb-20 mobile:pb-10 tablet:pb-16'
      )}
    >
      <WalletPageDesktopHeader />

      <WalletPageSwitchTabs />

      {curSwitchContentTabId === WalletPageTabType.DEPOSIT ? (
        <RechargeContent />
      ) : (
        <WithdrawContent />
      )}

      <RechargeNoticeModal />
    </div>
  );
};
export default WalletPage;
