import { useDeepEffect } from '@commonUtils/hooks';
import { usePostWithdrawConfigMutation } from '@mode2/external/api';
import { useWalletPageWithdrawContentStore } from '@/zustand/page/walletPageStore';
import { useEffect } from 'react';
import {
  RechargeFromResult,
  useRechargeStore,
} from '@/zustand/wallet/rechargeStore';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import {
  RechargeCard,
  useWalletPageRechargeCardStore,
} from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';

export const useWalletPageAPIInit = () => {
  const curSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.curSwitchContentTabId
  );

  const setWithdrawLimitValue = useWalletPageWithdrawContentStore(
    (state) => state.setWithdrawLimitValue
  );

  const setRechargeFrom = useRechargeStore((state) => state.setRechargeFrom);

  const [postWithdrawConfig, { data: withdrawConfigResult }] =
    usePostWithdrawConfigMutation();

  const isFirstDeposit = useUserProfileStore((state) => state.isFirstDeposit);
  const setCurrentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.setCurrentRechargeCard
  );

  // 首次充值，才預設 TOP_UP_BONUS 通道
  useDeepEffect(() => {
    if (isFirstDeposit === false) {
      setCurrentRechargeCard(RechargeCard.GENERAL);
    } else if (isFirstDeposit === true) {
      setCurrentRechargeCard(RechargeCard.TOP_UP_BONUS);
    }
  }, [isFirstDeposit]);

  useEffect(() => {
    if (curSwitchContentTabId === WalletPageTabType.WITHDRAW) {
      setRechargeFrom(RechargeFromResult.WALLET_PAGE);
      // postPlayerInformation();
      postWithdrawConfig();
    }
  }, [curSwitchContentTabId]);

  useDeepEffect(() => {
    if (withdrawConfigResult) {
      setWithdrawLimitValue([
        withdrawConfigResult.minLimit,
        withdrawConfigResult.maxLimit,
      ]);
    }
  }, [withdrawConfigResult]);
};

export default useWalletPageAPIInit;
