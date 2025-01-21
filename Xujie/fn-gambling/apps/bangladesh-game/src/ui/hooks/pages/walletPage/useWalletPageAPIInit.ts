import { useDeepEffect } from '@commonUtils/hooks';
import {
  usePostPlayerInformationMutation,
  usePostWithdrawConfigMutation,
} from '@mode2/external/api';
import { useWalletPageWithdrawContentStore } from '@/zustand/page/walletPageStore';
import { useEffect } from 'react';
import {
  RechargeFromResult,
  useRechargeStore,
} from '@/zustand/wallet/rechargeStore';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';

export const useWalletPageAPIInit = () => {
  const curSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.curSwitchContentTabId
  );

  const setWithdrawPageDisplayData = useWalletPageWithdrawContentStore(
    (state) => state.setWithdrawPageDisplayData
  );
  const setWithdrawLimitValue = useWalletPageWithdrawContentStore(
    (state) => state.setWithdrawLimitValue
  );

  const setRechargeFrom = useRechargeStore((state) => state.setRechargeFrom);
  const [postPlayerInformation, { data: playerInfoResult }] =
    usePostPlayerInformationMutation();

  const [postWithdrawConfig, { data: withdrawConfigResult }] =
    usePostWithdrawConfigMutation();

  useEffect(() => {
    if (curSwitchContentTabId === WalletPageTabType.WITHDRAW) {
      setRechargeFrom(RechargeFromResult.WALLET_PAGE);
      postPlayerInformation();
      postWithdrawConfig();
    }
  }, [curSwitchContentTabId]);

  useDeepEffect(() => {
    if (playerInfoResult) {
      // 最多100%
      const progress = Math.min(
        (Number(playerInfoResult.turnover) /
          Number(playerInfoResult.requireTurnover)) *
          100,
        100
      );
      setWithdrawPageDisplayData({
        vipLevel: playerInfoResult.vipLevel,
        totalBalance: playerInfoResult.withdrawAmount,
        lockAssets: playerInfoResult.limitAmount,
        dailyWithdrawLimit: playerInfoResult.maxWithdraw,
        withdrawableProgress: progress,
      });
    }
  }, [playerInfoResult]);

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
