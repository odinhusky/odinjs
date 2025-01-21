import { useUpdateEffect } from '@libs/commonUtils';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import { useIsLoginStore } from '@libs/mode2/zustand/loginStore';
import { useMyPageStore } from '@libs/mode2/zustand/page/myPageStore';
import { useKycDataStore } from '@/zustand/kyc/useKycDataStore';

export const useLogoutEffect = () => {
  const { navToHallPage } = useNavPageClick();
  const isLogin = useIsLoginStore((state) => state.isLogin);
  const setOpenMyDrawer = useMyPageStore((state) => state.setOpenMyDrawer);

  useUpdateEffect(() => {
    if (isLogin === false) {
      // kyc
      useKycDataStore.getState().resetKycData();
      navToHallPage();
      setOpenMyDrawer(false);
    }
  }, [isLogin]);
};

export default useLogoutEffect;
