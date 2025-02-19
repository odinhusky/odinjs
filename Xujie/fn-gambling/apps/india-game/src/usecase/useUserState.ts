import { useKycDataStore } from '@/zustand/kyc/useKycDataStore';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';

export const useUserState = () => {
  const refreshUserData = useUserProfileStore((state) => state.refreshUserData);
  const isAPIMainInfoLoading = useUserProfileStore(
    (state) => state.isAPIMainInfoLoading
  );

  const refreshKYCInit = useKycDataStore((state) => state.refreshKYCInit);
  const isAPIPlayerInformationLoading = useKycDataStore(
    (state) => state.isAPIPlayerInformationLoading
  );

  const refreshUserState = () => {
    refreshUserData();
    refreshKYCInit();
  };

  return {
    refreshUserState,
    isRefreshLoading: isAPIMainInfoLoading || isAPIPlayerInformationLoading,
  };
};
