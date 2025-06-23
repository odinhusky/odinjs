import { useEffect, useState } from 'react';
import {
  usePostCaptchaMutation,
  usePostRegisterMutation,
} from '../external/api';
import { RegisterPayload } from '../external/api/endpoint/user/PostRegisterEndpoint';
import { AdjustEventKey } from '../utils/sdk/persistant/adjust/AdjustEventKey';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import sdkUtils from '../utils/sdk';
import { useIsLoginStore } from '../zustand/loginStore';
import { useAppStore } from '@mode2/zustand/appStore';
import { useReminderModalStore } from '../zustand/components/reminderModalStore';
import { useLoadingStore } from '../zustand/components/loadingStore';
import { Form } from 'antd';

import { useDebounceAction } from '../action/common/handleAction';
import { useUserProfileStore } from '../zustand/user/userProfileStore';
import get from 'lodash/get';
import { useOTPCountDownStore } from '../zustand/components/OTPCountDownStore';
import handleGlobalClick from '../action/handleGlobalClick';
import { useAppDeviceEventStore } from '@mode2/zustand/platform/appDeviceEventStore';
import { AppDeviceEvent } from '@mode2API/endpoint/event/PostDeviceEventEndpoint';

interface RegisterProps {
  successCallback?: () => void; // 登入成功的 callback
  failCallback?: () => void; // 登入失敗的 callback
  isVisitor?: boolean;
}

export const useRegister = ({
  successCallback,
  failCallback,
  isVisitor = false,
}: RegisterProps) => {
  const setShowReminderModal = useReminderModalStore(
    (state) => state.setShowReminderModal
  );
  const setRegisterBonus = useReminderModalStore(
    (state) => state.setRegisterBonus
  );
  const setIsLogin = useIsLoginStore((state) => state.setIsLogin);

  const setUserRole = useUserProfileStore((state) => state.setUserRole);

  const otpId = useOTPCountDownStore((state) => state.otpId);

  const [postRegister, { data, isSuccess, status }] = usePostRegisterMutation();

  useEffect(() => {
    // FetchMyIp.doFetchMyIp();
  }, []);

  const register = (values: RegisterPayload, isVisitor: boolean = false) => {
    const referralCode = get(
      values,
      'referralCode',
      sdkUtils.getStorage(AppLocalStorageKey.REFERRAL_CODE) || undefined
    );

    const pushToken = useAppStore.getState().pushToken;

    setShowLoading(true);
    postRegister({
      ...values,
      password: '',
      referralCode,
      pushToken: pushToken,
      isVisitor,
      verifyCode: values.verifyCode || '',
      optCode: values.optCode,
      optId: otpId || '',
    }).finally(() => {
      setShowLoading(false);
    });
  };

  useEffect(() => {
    if (isSuccess && data?.token) {
      useAppDeviceEventStore.getState().setAppEvents([AppDeviceEvent.LOGIN]);
      sdkUtils.sendEvent(AdjustEventKey.REGISTER);
      sdkUtils.setStorage(AppLocalStorageKey.TOKEN, data.token);
      setShowReminderModal(data.isShowPopup);
      setRegisterBonus(data.registerBonus);
      if (data?.userRole) setUserRole(data.userRole);
      setIsLogin(true);
      sdkUtils.setStorage(AppLocalStorageKey.IS_OLD_USER, 'false');

      // 不是自動註冊的話才移除推薦碼
      if (!data.isVisitor) {
        sdkUtils.removeStorage(AppLocalStorageKey.REFERRAL_CODE);
        useAppStore.getState().setTemporaryReferralCode('');
      }
      successCallback?.();
    } else {
      // NOTICE isSuccess = false 可能是未提交状态
      // failCallback?.();
    }
    if (status === 'rejected') {
      refreshCaptcha();
      failCallback?.();
    }
  }, [isSuccess, data, status]);

  const [postCaptcha, { isLoading }] = usePostCaptchaMutation();
  const isShowLoading = useLoadingStore((state) => state.isShowLoading);
  const setShowLoading = useLoadingStore((state) => state.setShowLoading);
  const [captcha, setCaptcha] = useState({
    isEnabled: false,
    captchaId: '',
    base64CaptchaImg: '',
  });
  const refreshCaptcha = useDebounceAction(() => {
    handleGlobalClick({
      target: 'handleRefreshCaptcha',
      callback: () => {
        setShowLoading(true);
        postCaptcha()
          .then((res) => {
            if ('data' in res && res.data) {
              setCaptcha(res.data);
            }
          })
          .finally(() => {
            setShowLoading(false);
          });
      },
    });
  }, 1000);

  useEffect(() => {
    if (isVisitor === false) {
      console.log('!! Captcha');
      refreshCaptcha();
    }
  }, []);

  const [form] = Form.useForm();
  const [submittable, setSubmittable] = useState(false);
  const values = Form.useWatch([], form);
  const [policyCheck, setPolicyCheck] = useState(true);
  const togglePolicyCheck = () => {
    setPolicyCheck((pre) => !pre);
  };

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible((pre) => !pre);
  };

  return {
    form,
    policyCheck,
    setPolicyCheck,
    togglePolicyCheck,
    register,
    captcha: {
      ...captcha,
      isLoading,
      refresh: refreshCaptcha,
    },
    isSubmitDisable: isShowLoading || !submittable,
    isPasswordVisible,
    togglePasswordVisibility,
  };
};

export default useRegister;
