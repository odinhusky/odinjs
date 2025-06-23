import { useDeepEffect, useUpdateEffect } from '@libs/commonUtils';
import { useCallback, useEffect } from 'react';
import { usePostPlayerInformationMutation } from '@libs/mode2/external/api';
import { useIsLoginStore } from '@mode2/zustand/loginStore';
import { useKycDataStore } from '@/zustand/kyc/useKycDataStore';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { useWithdrawStore } from '@/zustand/wallet/useWithdrawStore';
import sdkUtils from '@mode2/utils/sdk';

export const useKYCInit = () => {
  const [postPlayerInformation, { data: playerInfo, isLoading }] =
    usePostPlayerInformationMutation();

  const isLogin = useIsLoginStore((state) => state.isLogin);

  const refreshKycInitCount = useKycDataStore(
    (state) => state.refreshKycInitCount
  );

  const setKycBankAccountInfo = useKycDataStore(
    (state) => state.setKycBankAccountInfo
  );
  const setIsBankFirstBind = useUserProfileStore(
    (state) => state.setIsBankFirstBind
  );
  const setIsPersonalInfoFirstBind = useUserProfileStore(
    (state) => state.setIsPersonalInfoFirstBind
  );
  const setIsFirstDeposit = useUserProfileStore(
    (state) => state.setIsFirstDeposit
  );

  const setIsAPIPlayerInformationLoading = useKycDataStore(
    (state) => state.setIsAPIPlayerInformationLoading
  );

  const setWithdrawVipLevel = useWithdrawStore(
    (state) => state.setWithdrawVipLevel
  );
  const setWithdrawTotalBalance = useWithdrawStore(
    (state) => state.setWithdrawTotalBalance
  );
  const setWithdrawLockAssets = useWithdrawStore(
    (state) => state.setWithdrawLockAssets
  );
  const setTotalAssets = useWithdrawStore((state) => state.setTotalAssets);

  const setDailyWithdrawLimit = useWithdrawStore(
    (state) => state.setDailyWithdrawLimit
  );

  const setWithdrawProgress = useWithdrawStore(
    (state) => state.setWithdrawProgress
  );

  const setWithdrawLimit = useWithdrawStore((state) => state.setWithdrawLimit);

  const handleRefreshPlayerInformation = () => {
    if (sdkUtils.isCurrentLogin()) {
      postPlayerInformation();
    }
  };

  useDeepEffect(() => {
    if (playerInfo) {
      console.log('@@@===> playerInfo', JSON.stringify(playerInfo, null, 2));
      setKycBankAccountInfo(playerInfo.bankAccountInfo);
      setIsBankFirstBind(playerInfo.isBankFirstBind);
      setIsPersonalInfoFirstBind(playerInfo.isPersonalInfoFirstBind);

      setIsPersonalInfoFirstBind(playerInfo.isPersonalInfoFirstBind);
      setIsFirstDeposit(playerInfo.isFirstDeposit);

      // Wallet Withdraw;
      setWithdrawVipLevel(playerInfo.vipLevel);
      setWithdrawTotalBalance(playerInfo.withdrawAmount);
      setWithdrawLockAssets(playerInfo.limitAmount);
      setTotalAssets(playerInfo.totalAssets);
      setDailyWithdrawLimit(playerInfo.maxWithdraw);
      const withdrawProgress = Math.min(
        (Number(playerInfo.turnover) / Number(playerInfo.requireTurnover)) *
          100,
        100
      );

      setWithdrawProgress(withdrawProgress);
      setWithdrawLimit({
        remainingWithdrawLimit: playerInfo.remainingWithdrawLimit,
        maxWithdraw: playerInfo.maxWithdraw,
        remainingBetToWithdraw: playerInfo.remainingBetToWithdraw,
        // withdrawTimes: playerInfo.withdrawTimes,
        freeDailyWithdrawals: playerInfo.freeDailyWithdrawals,
      });
    }
  }, [playerInfo]);

  useEffect(() => {
    setIsAPIPlayerInformationLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    console.log('@@@===>refreshKycInitCount');
    handleRefreshPlayerInformation();
  }, [refreshKycInitCount]);
};

export default useKYCInit;
