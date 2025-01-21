import useUserInfo from '@mode2/usecase/useUserInfo';
import { useKycDataStore } from '@/zustand/kyc/useKycDataStore';


export const useUserState = () => {
  const { refreshUserData, isRefreshLoading } = useUserInfo();
  const refreshKYCInit = useKycDataStore((state) => state.refreshKYCInit);

  const refreshUserState = () => {
    refreshUserData();
    refreshKYCInit();
  };

  return { refreshUserState, isRefreshLoading };
};
