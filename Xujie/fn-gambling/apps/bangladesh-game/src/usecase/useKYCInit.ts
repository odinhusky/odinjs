import { useDeepEffect } from '@libs/commonUtils';
import { useEffect } from 'react';

import { usePostPlayerInformationMutation } from '@libs/mode2/external/api';
import { useIsLoginStore } from '@mode2/zustand/loginStore';
import { useKycDataStore } from '@/zustand/kyc/useKycDataStore';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';

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

  useDeepEffect(() => {
    if (playerInfo) {
      setKycBankAccountInfo(playerInfo.bankAccountInfo);
      setIsBankFirstBind(playerInfo.isBankFirstBind);
      setIsPersonalInfoFirstBind(playerInfo.isPersonalInfoFirstBind);
      setIsFirstDeposit(playerInfo.isFirstDeposit);
    }
  }, [playerInfo]);

  useEffect(() => {
    setIsAPIPlayerInformationLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (isLogin) {
      postPlayerInformation();
    }
  }, [isLogin, refreshKycInitCount]);
};

export default useKYCInit;
