import {
  LoginFormType,
  useIsShowLoginModalStore,
} from '@mode2/zustand/loginStore';
import { useDeviceStore } from '@mode2/zustand/deviceStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { NavigateFunction } from 'react-router/dist/lib/hooks';

/**
 * 針對登入行為導航
 * @param show
 * @param type
 * @param navigate
 * 先特例這邊解決[V6]
 */
export const useNavToLoginPage = (
  flag: number,
  show: boolean = true,
  type: LoginFormType = LoginFormType.LOGIN,
  navigate: NavigateFunction
) => {
  const isMobile = useDeviceStore.getState().isMobile;
  const version = import.meta.env['VITE_V_VERSION'] || '';
  const setIsShowLoginModal =
    useIsShowLoginModalStore.getState().setIsShowLoginModal;
  const setLoginType = useIsShowLoginModalStore.getState().setLoginType;
  if (isMobile || version === 'v6') {
    setIsShowLoginModal(false, type);
    navigate(`${BasePagePathObj.LoginPage}`, { state: { tab: type } });
  } else {
    setIsShowLoginModal(show, type);
  }
  setLoginType(type);
};

export default useNavToLoginPage;
