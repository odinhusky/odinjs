import { useUpdateEffect } from '@libs/commonUtils';
import { usePostVisitorLoginCheckMutation } from '@libs/mode2/external/api';
import sdkUtils from '@libs/mode2/utils/sdk';
import { AppLocalStorageKey } from '@libs/mode2/utils/sdk/persistant/storageKey';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { useEffect } from 'react';
import useRegister from '../useRegister';
import generateUniqueNumber from '@libs/commonUtils/generateUniqueNumber';
import { useIsLoginStore } from '@mode2/zustand/loginStore';
import { useAppDeviceEventStore } from '@mode2/zustand/platform/appDeviceEventStore';
import { AppDeviceEvent } from '@mode2API/endpoint/event/PostDeviceEventEndpoint';

interface UsePlayerRegisterProps {
  refreshUserState: VoidFunction; // 重新整理的 function
}

const VISITOR_REGISTER_VALUES = {
  phone: '',
  password: '',
  verifyCode: '',
  captchaId: '',
  referralCode: '',
  pushToken: '',
  isVisitor: true,
};

// FRONTEND-2667 && PM-155
// 邏輯 localStorage 無 token，用device id 請求後端換token，若回應無token 則自動註冊[player] 帳號
export const usePlayerRegister = ({
  refreshUserState,
}: UsePlayerRegisterProps) => {
  const [
    postVisitorLoginCheck,
    { data: visitorLoginCheckData, isSuccess: isVisitorLoginCheckSuccess },
  ] = usePostVisitorLoginCheckMutation();

  const { register } = useRegister({
    successCallback: () => {
      refreshUserState();
    },
    isVisitor: true,
  });

  const setUserRole = useUserProfileStore((state) => state.setUserRole);
  const setIsLogin = useIsLoginStore((state) => state.setIsLogin);
  // App 開啟時只執行一次，包含重新整理
  // 如果沒有 token 就用 deviceId 去確認是否有註冊過，換 token
  useEffect(() => {
    const token = sdkUtils.getStorage(AppLocalStorageKey.TOKEN);
    if (!token) {
      postVisitorLoginCheck();
    }
  }, []);

  // 有拿到成功回給訊息的話就設定 userRole 以及 token，不然就自動幫他註冊
  useUpdateEffect(() => {
    if (isVisitorLoginCheckSuccess) {
      useAppDeviceEventStore.getState().setAppEvents([AppDeviceEvent.LOGIN]);
      // 設定 userRole
      if (visitorLoginCheckData?.userRole)
        setUserRole(visitorLoginCheckData.userRole);

      // 設定 token
      if (visitorLoginCheckData?.token) {
        sdkUtils.setStorage(
          AppLocalStorageKey.TOKEN,
          visitorLoginCheckData.token
        );
        setIsLogin(true);
        refreshUserState();
      } else {
        // 自動註冊
        register(
          {
            ...VISITOR_REGISTER_VALUES,
            referralCode:
              sdkUtils.getAppReferralCode() ||
              sdkUtils.getStorage(AppLocalStorageKey.REFERRAL_CODE) ||
              undefined,
            phone: generateUniqueNumber(),
            password: generateUniqueNumber(),
          },
          true
        );
      }
    }
  }, [isVisitorLoginCheckSuccess]);
};

export default usePlayerRegister;
