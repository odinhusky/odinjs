import { useDeepEffect } from '@libs/commonUtils';
import { useEffect } from 'react';
import { usePostPlayerInformationMutation } from '@libs/mode2/external/api';
import { useIsLoginStore } from '@mode2/zustand/loginStore';
import { useKycDataStore } from '@/zustand/kyc/useKycDataStore';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { usePostSavedBankListMutation } from '@/external/api';
import { useBindKYCPageDiffStore } from '@/zustand/page/bindKYCPageDiffStore';
import { isNil } from 'lodash';
import { useWithdrawStore } from '@/zustand/wallet/useWithdrawStore';

export const useKYCInit = () => {
  const [postPlayerInformation, { data: playerInfo, isLoading }] =
    usePostPlayerInformationMutation();

  const [
    triggerPostSavedBankList,
    { data: savedBankList, isSuccess: isSavedBankListSuccess },
  ] = usePostSavedBankListMutation();

  const isLogin = useIsLoginStore((state) => state.isLogin);

  const refreshKycInitCount = useKycDataStore(
    (state) => state.refreshKycInitCount
  );

  const setKycBankAccountInfo = useKycDataStore(
    (state) => state.setKycBankAccountInfo
  );
  const setIsPersonalInfoFirstBind = useUserProfileStore(
    (state) => state.setIsPersonalInfoFirstBind
  );

  const setIsAPIPlayerInformationLoading = useKycDataStore(
    (state) => state.setIsAPIPlayerInformationLoading
  );

  const setSavedBankList = useBindKYCPageDiffStore(
    (state) => state.setSavedBankList
  );

  const setIsBankFirstBind = useUserProfileStore(
    (state) => state.setIsBankFirstBind
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
  const setDailyWithdrawLimit = useWithdrawStore(
    (state) => state.setDailyWithdrawLimit
  );
  const setWithdrawProgress = useWithdrawStore(
    (state) => state.setWithdrawProgress
  );
  const setIsFirstDeposit = useUserProfileStore(
    (state) => state.setIsFirstDeposit
  );

  useDeepEffect(() => {
    if (playerInfo) {
      setKycBankAccountInfo(playerInfo.bankAccountInfo);
      setIsPersonalInfoFirstBind(playerInfo.isPersonalInfoFirstBind);
      setIsFirstDeposit(playerInfo.isFirstDeposit);

      // Wallet Withdraw;
      setWithdrawVipLevel(playerInfo.vipLevel);
      setWithdrawTotalBalance(playerInfo.withdrawAmount);
      setWithdrawLockAssets(playerInfo.limitAmount);
      setDailyWithdrawLimit(playerInfo.maxWithdraw);
      const withdrawProgress = Math.min(
        (Number(playerInfo.turnover) / Number(playerInfo.requireTurnover)) *
          100,
        100
      );
      setWithdrawProgress(withdrawProgress);
    }
  }, [playerInfo]);

  useEffect(() => {
    setIsAPIPlayerInformationLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (isLogin) {
      postPlayerInformation();

      // 取得 已經儲存的 Wallet 或是 Other Bank 的物件列表
      triggerPostSavedBankList();
    }
  }, [isLogin, refreshKycInitCount]);

  // 設定已經儲存的銀行列表以及 isBankFirstBind
  useDeepEffect(() => {
    if (isSavedBankListSuccess && savedBankList) {
      setSavedBankList(savedBankList);

      if (savedBankList.length === 0 || isNil(savedBankList)) {
        setIsBankFirstBind(true);
      } else {
        setIsBankFirstBind(false);
      }
    }
  }, [savedBankList, isSavedBankListSuccess]);
};

export default useKYCInit;
